// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Users — valid UUIDs instead of "user1"/"user2"
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
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
      },
    });
  }

  // 2. Products — match creatorID with UUIDs above
  const products = [
    {
      name: "EcoTower Pro",
      price: 199.99,
      productType: "towers",
      creatorID: "11111111-1111-1111-1111-111111111111",
      imageURL: "https://via.placeholder.com/600x400",
      public: true,
      description: "Vertical hydroponic grow system",
    },
    {
      name: "Herb Module",
      price: 49.99,
      productType: "modules",
      creatorID: "22222222-2222-2222-2222-222222222222",
      imageURL: "https://via.placeholder.com/600x400",
      public: true,
      description: "Great for leafy greens and herbs",
    },
    {
      name: "SunShield Add‑on",
      price: 29.0,
      productType: "addons",
      creatorID: "11111111-1111-1111-1111-111111111111",
      imageURL: "https://via.placeholder.com/600x400",
      public: true,
      description: "Protects from harsh light",
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: {
        name: p.name,
        productType: p.productType,
        price: p.price,
        public: p.public,
        description: p.description,
        imageURL: p.imageURL,
        creatorID: p.creatorID,
      },
    });
  }

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
