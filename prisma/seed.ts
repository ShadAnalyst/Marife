import { PrismaClient, Prisma } from "@prisma/client";
import { upsertProductFromMock } from "../src/lib/catalog-db";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "../src/lib/mockData";

const prisma = new PrismaClient();

async function seedCategories() {
  for (const c of MOCK_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        imageUrl: c.imageUrl,
        displayOrder: c.id,
        hiddenFromNav: false,
      },
      update: {
        name: c.name,
        imageUrl: c.imageUrl,
        hiddenFromNav: false,
      },
    });
  }
}

async function seedProducts() {
  for (const p of MOCK_PRODUCTS) {
    await upsertProductFromMock(p, p.category);
  }
}

async function seedDemoOrders() {
  const firstVariant = await prisma.productVariant.findFirst({
    orderBy: { sku: "asc" },
  });
  if (!firstVariant) return;

  const existing = await prisma.order.count();
  if (existing > 0) return;

  const addr = await prisma.shippingAddress.create({
    data: {
      firstName: "Demo",
      lastName: "Customer",
      street: "Bahnhofstrasse 1",
      zipCode: "8001",
      city: "Zürich",
      countryCode: "CH",
    },
  });

  const product = await prisma.product.findUniqueOrThrow({ where: { id: firstVariant.productId } });

  const rows = [
    { status: "PROCESSING" as const, grand: "89.95", sub: "83.20", tax: "6.75", items: 2 },
    { status: "SHIPPED" as const, grand: "134.90", sub: "124.80", tax: "10.10", items: 3 },
    { status: "DELIVERED" as const, grand: "49.95", sub: "46.20", tax: "3.75", items: 1 },
  ];

  for (const r of rows) {
    const order = await prisma.order.create({
      data: {
        shippingAddressId: addr.id,
        status: r.status,
        subtotalChf: new Prisma.Decimal(r.sub),
        shippingCostChf: new Prisma.Decimal(5),
        totalTaxChf: new Prisma.Decimal(r.tax),
        totalGrandChf: new Prisma.Decimal(r.grand),
        paymentMethod: "card",
      },
    });
    const unit = new Prisma.Decimal(Number(r.grand) / r.items);
    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        variantId: firstVariant.id,
        productId: product.id,
        quantity: r.items,
        unitPricePaid: unit,
        lineTotalPaid: new Prisma.Decimal(r.grand),
        productName: product.name,
        variantName: firstVariant.variantName,
      },
    });
  }
}

async function main() {
  await seedCategories();
  await seedProducts();
  await seedDemoOrders();
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
