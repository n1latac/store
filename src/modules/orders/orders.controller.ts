import { Body, Controller, Post, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { OrdersService, PlaceOrderDto } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async placeOrder(@Body() dto: PlaceOrderDto) {
    if (!dto.phone || !dto.items || dto.items.length === 0) {
      throw new BadRequestException('Заповніть обов’язкове поле телефону та додайте товари до кошика.');
    }
    
    const result = await this.ordersService.placeOrder(dto);
    if (!result.success) {
      // We still return 200 OK or 400 depending on requirements, but let's throw an exception or return error message so frontend knows.
      // Since it's an admin notification failure, it's safer to still succeed the order placement but warning the client (or throw internal error).
      // Let's return the status.
    }
    return result;
  }
}
