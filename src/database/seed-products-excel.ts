import { Sequelize } from 'sequelize-typescript';
import { Category } from './models/Category';
import { Product } from './models/Product';
import { ProductImage } from './models/ProductImages';
import { User } from './models/User';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as xlsx from 'xlsx';
import * as https from 'https';
import * as http from 'http';

dotenv.config();

function scrapeOgImage(urlStr: string): Promise<string | null> {
  return new Promise((resolve) => {
    if (!urlStr || !urlStr.startsWith('http')) {
      return resolve(null);
    }
    
    const client = urlStr.startsWith('https') ? https : http;
    const req = client.get(
      urlStr,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        },
        timeout: 4000,
      },
      (res) => {
        let html = '';
        let resolved = false;

        res.on('data', (chunk) => {
          if (resolved) return;
          html += chunk;

          const ogImageMatch =
            html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
            html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);

          if (ogImageMatch) {
            let imgUrl = ogImageMatch[1];
            if (imgUrl.startsWith('//')) {
              imgUrl = 'https:' + imgUrl;
            }
            resolved = true;
            req.destroy();
            resolve(imgUrl);
          }

          if (html.length > 300000) {
            resolved = true;
            req.destroy();
            resolve(null);
          }
        });

        res.on('end', () => {
          if (!resolved) {
            resolve(null);
          }
        });
      },
    );
    
    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });
  });
}

function translateNameToEn(name: string): string {
  let translated = name.trim();
  const replacements: Record<string, string> = {
    // Categories
    "Персональні комп'ютери": "Personal Computers",
    "Додаткове обладнання до ПК": "Additional PC Equipment",
    "Ноутбуки": "Laptops",
    "Багатофункціональні пристрої та принтери": "Multifunction Printers & Printers",
    "Інтерактивні панелі": "Interactive Panels",
    "Дидактика (під замовлення)": "Didactics (on request)",
    "БФП Струменеві": "Inkjet MFP",
    "БФП Лазерні ч/б": "Laser MFP B/W",
    "БФП Лазерні кольорові": "Laser MFP Color",
    "Принтери ч/б": "Printers B/W",
    "Принтери кольорові": "Printers Color",

    // Products / General
    "Міні ПК": "Mini PC",
    "Робоча станція": "Workstation",
    "Еліт Міні ПК": "Elite Mini PC"
  };

  for (const [uk, en] of Object.entries(replacements)) {
    const regex = new RegExp(uk, 'gi');
    translated = translated.replace(regex, en);
  }
  return translated;
}

async function run() {
  console.log('Initializing database connection...');
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    models: [Category, Product, ProductImage, User],
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // 1. Clear existing products and categories to ensure a clean slate
    console.log('Clearing existing products, images, and categories...');
    await ProductImage.destroy({ where: {} });
    await Product.destroy({ where: {} });
    await Category.destroy({ where: {} });
    console.log('Cleanup complete.');

    // 2. Read products.xlsx
    const filePath = path.join(process.cwd(), 'products.xlsx');
    console.log('Reading Excel file from:', filePath);
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets['ДОДАТОК 3'];
    if (!sheet) {
      throw new Error("Sheet 'ДОДАТОК 3' not found in products.xlsx");
    }

    const rows: any[] = xlsx.utils.sheet_to_json(sheet);
    console.log(`Found ${rows.length} rows in sheet.`);

    let currentParentCategory: Category | null = null;
    let currentSubCategory: Category | null = null;

    let categoryCount = 0;
    let subCategoryCount = 0;
    let productCount = 0;

    // Helper list of standard demo images from the Oregon template to assign dynamically
    const demoImages = [
      '/assets/img/product/product-or-1.jpg',
      '/assets/img/product/product-or-2.jpg',
      '/assets/img/product/product-or-3.jpg',
      '/assets/img/product/product-or-4.jpg',
      '/assets/img/product/product-or-5.jpg',
      '/assets/img/product/product-or-6.jpg',
      '/assets/img/product/product-or-7.jpg',
      '/assets/img/product/product-or-8.jpg',
      '/assets/img/product/product-or-9.jpg',
      '/assets/img/product/product-or-10.jpg',
      '/assets/img/product/product-or-11.jpg',
      '/assets/img/product/product-or-12.jpg',
      '/assets/img/product/product-or-13.jpg',
    ];

    for (const row of rows) {
      const num = row['#'];
      const name = row['Назва'] ? String(row['Назва']).trim() : '';
      const price = row['Ціна'];
      const link = row['Посилання на сайт'] ? String(row['Посилання на сайт']).trim() : '';

      if (!name) continue;

      // Check if it's a main category (has "#" like "1.", "2.", "5.")
      if (num && String(num).trim().match(/^\d+\.$/)) {
        const nameEn = translateNameToEn(name);
        currentParentCategory = await Category.create({
          name_uk: name,
          name_en: nameEn,
          parent_id: null,
        } as any);
        categoryCount++;
        currentSubCategory = null;
        console.log(`Created Main Category: "${name}" (${nameEn})`);
        continue;
      }

      // Check if it's a product
      const hasPrice = price !== undefined && price !== null;
      const hasLink = link && link !== '';
      const isProduct = hasPrice || (hasLink && !link.includes('вручну заносити') && !link.includes('Взяти АРІ'));

      // If the link explicitly says "Не додавати" (Do not add), skip it
      if (link && link.includes('Не додавати')) {
        console.log(`Skipping product (marked as 'Не додавати'): "${name}"`);
        continue;
      }

      if (isProduct) {
        // Determine category_id (use subcategory if exists, otherwise parent category, fallback to a general category if none)
        let activeCategoryId = 1;
        if (currentSubCategory) {
          activeCategoryId = currentSubCategory.id;
        } else if (currentParentCategory) {
          activeCategoryId = currentParentCategory.id;
        } else {
          // If no category has been set yet, create a default "Інше" category
          let defaultCat = await Category.findOne({ where: { name_uk: 'Інше' } });
          if (!defaultCat) {
            defaultCat = await Category.create({ name_uk: 'Інше', name_en: 'Other', parent_id: null } as any);
          }
          activeCategoryId = defaultCat.id;
        }

        // Parse attributes from product name
        const attributes: Record<string, any> = {};
        if (link) {
          attributes.external_link = link;
        }

        // Try to parse brand (first word or common brands)
        const brandMatch = name.match(/^(MinisForum|GEEKOM|Dell|HP|Lenovo|Acer|ASUS|Canon|Könner&Söhnen|Matari|APRO|Trotec|Karcher)/i);
        if (brandMatch) {
          attributes.brand = brandMatch[1];
        }

        // Try to parse RAM (e.g. 16Gb or 32GB)
        const ramMatch = name.match(/(\d+)\s*GB\b/i);
        if (ramMatch) {
          attributes.ram = `${ramMatch[1]} GB`;
        }

        // Try to parse storage (e.g. 512Gb or 1Tb)
        const storageMatch = name.match(/(\d+)\s*(GB|TB)\s*(SSD|HDD)?/i);
        if (storageMatch && (!ramMatch || storageMatch[1] !== ramMatch[1])) {
          attributes.storage = `${storageMatch[1]} ${storageMatch[2]}`;
        }

        // Select a round-robin image from template demo images as fallback
        let assignedImage = demoImages[productCount % demoImages.length];

        if (link && link.startsWith('http')) {
          console.log(`Scraping actual image for "${name}" from ${link}...`);
          try {
            const scraped = await scrapeOgImage(link);
            if (scraped) {
              assignedImage = scraped;
              console.log(`  -> Found actual image: ${scraped}`);
            } else {
              console.log(`  -> No OG image. Using placeholder.`);
            }
          } catch (e) {
            console.log(`  -> Error scraping. Using placeholder.`);
          }
        }

        const nameEn = translateNameToEn(name);
        const product = await Product.create({
          name_uk: name,
          name_en: nameEn,
          price: hasPrice ? Number(price) : 0,
          image_url: assignedImage,
          attributes,
          category_id: activeCategoryId,
        } as any);

        // Add additional images to ProductImages table
        await ProductImage.create({
          product_id: product.id,
          image_url: assignedImage,
        } as any);

        productCount++;
      } else {
        // Otherwise, it is a sub-category / brand under the active main category
        if (currentParentCategory) {
          const nameEn = translateNameToEn(name);
          currentSubCategory = await Category.create({
            name_uk: name,
            name_en: nameEn,
            parent_id: currentParentCategory.id,
          } as any);
          subCategoryCount++;
          console.log(`  Created Sub-Category: "${name}" (${nameEn}) under "${currentParentCategory.name_uk}"`);
        }
      }
    }

    console.log('\n--- SEEDING COMPLETED ---');
    console.log(`Imported Main Categories: ${categoryCount}`);
    console.log(`Imported Sub-Categories:  ${subCategoryCount}`);
    console.log(`Imported Products:        ${productCount}`);
  } catch (error) {
    console.error('Seeding failed with error:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

run();
