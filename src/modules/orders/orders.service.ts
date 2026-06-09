import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}

export class PlaceOrderDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsNotEmpty({ message: 'Телефон є обов’язковим полем' })
  phone: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  warehouse?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsNumber()
  total: number;
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly configService: ConfigService) {}

  async placeOrder(dto: PlaceOrderDto): Promise<{ success: boolean; message: string }> {
    this.logger.log(`Received new order from ${dto.firstName || ''} ${dto.lastName || ''} (${dto.phone})`);

    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    const chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');

    // Build markdown message
    const dateStr = new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' });
    
    let itemsBlock = '';
    dto.items.forEach((item, index) => {
      itemsBlock += `${index + 1}. *${item.name}* (ID: ${item.id})\n`;
      itemsBlock += `   Кількість: ${item.quantity} × ${item.price} ₴ = *${item.quantity * item.price} ₴*\n`;
    });

    const buyerName = (dto.firstName || dto.lastName) 
      ? `${dto.firstName || ''} ${dto.lastName || ''}`.trim()
      : 'Не вказано';

    const deliveryCity = dto.city || 'Не вказано';
    const deliveryWarehouse = dto.warehouse || 'Не вказано';
    const buyerEmail = dto.email || 'Не вказано';

    const telegramMessage = 
`📦 *Нове замовлення на сайті Aivix tech*
📅 Дата: ${dateStr}

👤 *Покупець:*
- Ім'я: ${buyerName}
- Телефон: ${dto.phone}
- Email: ${buyerEmail}

🚚 *Доставка (Нова Пошта):*
- Місто: ${deliveryCity}
- Відділення: ${deliveryWarehouse}

📝 *Примітки:*
${dto.notes || '—'}

🛒 *Товари:*
${itemsBlock}
💰 *Загальна сума:* *${dto.total} ₴*`;

    if (!botToken || !chatId) {
      this.logger.warn(
        'Telegram Bot credentials are not configured in environment variables. ' +
        'Order printed to logs instead.'
      );
      console.log('\n--- TELEGRAM NOTIFICATION DUMMY ---\n' + telegramMessage + '\n-----------------------------------\n');
      return {
        success: true,
        message: 'Order processed successfully (logged in console).',
      };
    }

    try {
      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        this.logger.error(`Telegram API error: ${response.status} - ${errText}`);
        return {
          success: false,
          message: `Failed to send Telegram notification: ${response.statusText}`,
        };
      }

      this.logger.log('Order notification sent to Telegram successfully.');
      return {
        success: true,
        message: 'Order placed and Telegram notification sent successfully.',
      };
    } catch (error: any) {
      this.logger.error(`Failed to dispatch request to Telegram: ${error.message}`);
      return {
        success: false,
        message: `Failed to send Telegram notification: ${error.message}`,
      };
    }
  }
}
