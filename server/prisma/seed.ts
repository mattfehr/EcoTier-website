// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Users — valid UUIDs
  const users = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      username: "matthew",
      email: "matthew@example.com",
      profileImage: "https://via.placeholder.com/100",
      bio: "Engineer & indoor farming enthusiast.",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      username: "grace",
      email: "grace@example.com",
      profileImage: "https://via.placeholder.com/100",
      bio: "Designer and hydroponics innovator.",
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }

  // 2. Products — tower, module, addon
  const products = [
    {
      name: "EcoTower Pro",
      price: 199.99,
      productType: "towers",
      creatorID: users[0].id,
      imageURL: "https://via.placeholder.com/600x400",
      public: true,
      description: "Vertical hydroponic grow system",
    },
    {
      name: "Herb Module",
      price: 49.99,
      productType: "modules",
      creatorID: users[1].id,
      imageURL: "https://via.placeholder.com/600x400",
      public: true,
      description: "Great for leafy greens and herbs",
    },
    {
      name: "SunShield Add-on",
      price: 29.0,
      productType: "addons",
      creatorID: users[0].id,
      imageURL: "https://via.placeholder.com/600x400",
      public: true,
      description: "Protects from harsh light",
    },
  ];

  const createdProducts: Record<string, number> = {};

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    createdProducts[p.name] = product.productID;
  }

  // 3. TowerComponents — link modules/addons to tower
  const towerID = createdProducts["EcoTower Pro"];
  const herbModuleID = createdProducts["Herb Module"];
  const sunShieldID = createdProducts["SunShield Add-on"];

  // Clean up existing relations first (to avoid duplicates on re-seed)
  await prisma.towerComponent.deleteMany({ where: { towerID } });

  await prisma.towerComponent.createMany({
    data: [
      {
        towerID,
        partID: herbModuleID,
        position: 1,
        quantity: 2,
      },
      {
        towerID,
        partID: sunShieldID,
        position: 2,
        quantity: 1,
      },
    ],
  });

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
