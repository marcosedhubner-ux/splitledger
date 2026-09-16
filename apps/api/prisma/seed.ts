import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!123", 12);

  const [alex, blair, casey, dana] = await Promise.all([
    prisma.user.upsert({
      where: { email: "alex@splitledger.dev" },
      update: {},
      create: { fullName: "Alex Rivera", email: "alex@splitledger.dev", passwordHash },
    }),
    prisma.user.upsert({
      where: { email: "blair@splitledger.dev" },
      update: {},
      create: { fullName: "Blair Nakamura", email: "blair@splitledger.dev", passwordHash },
    }),
    prisma.user.upsert({
      where: { email: "casey@splitledger.dev" },
      update: {},
      create: { fullName: "Casey Odom", email: "casey@splitledger.dev", passwordHash },
    }),
    prisma.user.upsert({
      where: { email: "dana@splitledger.dev" },
      update: {},
      create: { fullName: "Dana Petrov", email: "dana@splitledger.dev", passwordHash },
    }),
  ]);

  let group = await prisma.group.findFirst({ where: { name: "Lisbon Trip", createdById: alex.id } });
  if (!group) {
    group = await prisma.group.create({
      data: {
        name: "Lisbon Trip",
        currency: "USD",
        createdById: alex.id,
        members: {
          create: [{ userId: alex.id }, { userId: blair.id }, { userId: casey.id }, { userId: dana.id }],
        },
      },
    });

    await prisma.expense.create({
      data: {
        groupId: group.id,
        description: "Airbnb (4 nights)",
        amount: 400,
        paidById: alex.id,
        splits: {
          create: [alex, blair, casey, dana].map((u) => ({ userId: u.id, shareAmount: 100 })),
        },
      },
    });

    await prisma.expense.create({
      data: {
        groupId: group.id,
        description: "Dinner night 1",
        amount: 120,
        paidById: blair.id,
        splits: {
          create: [alex, blair, casey, dana].map((u) => ({ userId: u.id, shareAmount: 30 })),
        },
      },
    });

    await prisma.expense.create({
      data: {
        groupId: group.id,
        description: "Taxi to Sintra",
        amount: 40,
        paidById: casey.id,
        splits: {
          create: [
            { userId: casey.id, shareAmount: 20 },
            { userId: dana.id, shareAmount: 20 },
          ],
        },
      },
    });

    await prisma.expense.create({
      data: {
        groupId: group.id,
        description: "Groceries",
        amount: 60,
        paidById: dana.id,
        splits: {
          create: [alex, blair, casey, dana].map((u) => ({ userId: u.id, shareAmount: 15 })),
        },
      },
    });

    await prisma.payment.create({
      data: { groupId: group.id, fromUserId: blair.id, toUserId: alex.id, amount: 25 },
    });
  }

  console.log("Seed complete. Accounts (password: Passw0rd!123):");
  console.log(`  ${alex.email}, ${blair.email}, ${casey.email}, ${dana.email}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
