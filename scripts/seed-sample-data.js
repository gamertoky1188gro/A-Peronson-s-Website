import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const LAST_30_DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (29 - i));
  return d.toISOString();
});

async function seed() {
  console.log("Seeding sample data via Prisma...");

  let admin;
  try {
    admin = await prisma.user.findUnique({ where: { email: "admin@gmail.com" } });
  } catch (e) {
    console.log("No admin user found, using default");
    admin = null;
  }

  const [bhUser, facUser1, facUser2, facUser3, buyUser, agentUser] = await Promise.all([
    prisma.user.upsert({
      where: { email: "textilehub@example.com" },
      update: {},
      create: {
        id: "user-bh-001",
        email: "textilehub@example.com",
        password_hash: "dummy",
        role: "buying_house",
        name: "TextileHub Corp",
        status: "active",
        org_owner_id: "org-bh-001",
      },
    }),
    prisma.user.upsert({
      where: { email: "factory@example.com" },
      update: {},
      create: {
        id: "user-fac-001",
        email: "factory@example.com",
        password_hash: "dummy",
        role: "factory",
        name: "Premium Garments Ltd",
        status: "active",
        org_owner_id: "org-fac-001",
      },
    }),
    prisma.user.upsert({
      where: { email: "factory2@example.com" },
      update: {},
      create: {
        id: "user-fac-002",
        email: "factory2@example.com",
        password_hash: "dummy",
        role: "factory",
        name: "Style Works",
        status: "active",
        org_owner_id: "org-fac-002",
      },
    }),
    prisma.user.upsert({
      where: { email: "factory3@example.com" },
      update: {},
      create: {
        id: "user-fac-003",
        email: "factory3@example.com",
        password_hash: "dummy",
        role: "factory",
        name: "Quality Textiles",
        status: "active",
        org_owner_id: "org-fac-003",
      },
    }),
    prisma.user.upsert({
      where: { email: "buyer@example.com" },
      update: {},
      create: {
        id: "user-buy-001",
        email: "buyer@example.com",
        password_hash: "dummy",
        role: "buyer",
        name: "Retail Buyer",
        status: "active",
        org_owner_id: "org-buy-001",
      },
    }),
    prisma.user.upsert({
      where: { email: "agent@example.com" },
      update: {},
      create: {
        id: "user-agent-001",
        email: "agent@example.com",
        password_hash: "dummy",
        role: "agent",
        name: "John Agent",
        status: "active",
        org_owner_id: "org-bh-001",
      },
    }),
  ]);
  console.log(`- ${6} users created`);

  await Promise.all([
    prisma.requirement.upsert({
      where: { id: "req-001" },
      update: {},
      create: {
        id: "req-001",
        buyer_id: bhUser.id,
        title: "Cotton T-Shirts 5000 pcs",
        description: "Need 5000 plain cotton t-shirts in sizes S-XXL",
        status: "open",
        created_at: new Date(LAST_30_DAYS[5]),
        category: "apparel",
        request_type: "garments",
      },
    }),
    prisma.requirement.upsert({
      where: { id: "req-002" },
      update: {},
      create: {
        id: "req-002",
        buyer_id: bhUser.id,
        title: "Denim Jeans 2000 pcs",
        description: "Basic denim jeans, stretch fabric preferred",
        status: "open",
        created_at: new Date(LAST_30_DAYS[8]),
        category: "apparel",
        request_type: "garments",
      },
    }),
    prisma.requirement.upsert({
      where: { id: "req-003" },
      update: {},
      create: {
        id: "req-003",
        buyer_id: bhUser.id,
        title: "Sports Jerseys Custom",
        description: "Custom Team jerseys with embroidery",
        status: "quoted",
        created_at: new Date(LAST_30_DAYS[12]),
        category: "apparel",
        request_type: "garments",
      },
    }),
    prisma.requirement.upsert({
      where: { id: "req-004" },
      update: {},
      create: {
        id: "req-004",
        buyer_id: bhUser.id,
        title: "Winter Jackets 1000 pcs",
        description: "Puffer jackets, down-filled",
        status: "open",
        created_at: new Date(LAST_30_DAYS[15]),
        category: "outerwear",
        request_type: "garments",
      },
    }),
    prisma.requirement.upsert({
      where: { id: "req-005" },
      update: {},
      create: {
        id: "req-005",
        buyer_id: buyUser.id,
        title: "Yoga Leggings",
        description: "High-waist yoga leggings, bamboo fabric",
        status: "open",
        created_at: new Date(LAST_30_DAYS[20]),
        category: "activewear",
        request_type: "garments",
      },
    }),
  ]);
  console.log(`- ${5} buyer requests created`);

  const messagesData = [
    { senderId: bhUser.id, receiverId: facUser1.id, content: "Hi, interested in your t-shirt production", matchId: "match-001" },
    { senderId: facUser1.id, receiverId: bhUser.id, content: "Hello! We can definitely help. What are your specifications?", matchId: "match-001" },
    { senderId: bhUser.id, receiverId: facUser2.id, content: "Do you have MOQ for denim?", matchId: "match-002" },
    { senderId: bhUser.id, receiverId: facUser3.id, content: "Looking for sports jersey manufacturer", matchId: "match-003" },
    { senderId: buyUser.id, receiverId: facUser1.id, content: "Can you produce yoga leggings?", matchId: "match-004" },
    { senderId: facUser1.id, receiverId: buyUser.id, content: "Yes we have experience with activewear", matchId: "match-004" },
    { senderId: bhUser.id, receiverId: facUser1.id, content: "Need quote for winter jackets", matchId: "match-005" },
    { senderId: agentUser.id, receiverId: facUser2.id, content: "Hi, I represent a buying house", matchId: "match-006" },
  ];

  for (let i = 0; i < messagesData.length; i++) {
    const msg = messagesData[i];
    try {
      await prisma.message.create({
        data: {
          id: `msg-${String(i + 1).padStart(3, "0")}`,
          match_id: msg.matchId,
          sender_id: msg.senderId,
          message: msg.content,
          timestamp: new Date(LAST_30_DAYS[6 + Math.floor(i / 2)]),
        },
      });
    } catch (e) {
      // ignore errors
    }
  }
  console.log(`- ${messagesData.length} messages created`);

  const matchesData = [
    { buyerId: bhUser.id, factoryId: facUser1.id },
    { buyerId: bhUser.id, factoryId: facUser2.id },
    { buyerId: bhUser.id, factoryId: facUser3.id },
    { buyerId: buyUser.id, factoryId: facUser1.id },
    { buyerId: bhUser.id, factoryId: facUser1.id },
    { buyerId: bhUser.id, factoryId: facUser2.id },
  ];

  for (let i = 0; i < matchesData.length; i++) {
    const m = matchesData[i];
    const idx = i + 1;
    try {
      await prisma.match.create({
        data: {
          requirement_id: `req-00${idx}`,
          factory_id: m.factoryId,
          status: "active",
          created_at: new Date(LAST_30_DAYS[6 + i]),
        },
      });
    } catch (e) {
      // ignore duplicate or other errors
    }
  }
  console.log(`- ${matchesData.length} matches (active chats) created`);

  // Seed partner requests for Partner Network
  const partnerRequestsData = [
    { requesterId: bhUser.id, requesterRole: "buying_house", targetId: facUser1.id, targetRole: "factory", status: "connected" },
    { requesterId: bhUser.id, requesterRole: "buying_house", targetId: facUser2.id, targetRole: "factory", status: "connected" },
    { requesterId: bhUser.id, requesterRole: "buying_house", targetId: facUser3.id, targetRole: "factory", status: "pending" },
    { requesterId: buyUser.id, requesterRole: "buyer", targetId: facUser1.id, targetRole: "factory", status: "connected" },
    { requesterId: bhUser.id, requesterRole: "buying_house", targetId: facUser1.id, targetRole: "factory", status: "rejected" },
  ];

  for (let i = 0; i < partnerRequestsData.length; i++) {
    const pr = partnerRequestsData[i];
    try {
      await prisma.partnerRequest.create({
        data: {
          id: `pr-${String(i + 1).padStart(3, "0")}`,
          requester_id: pr.requesterId,
          requester_role: pr.requesterRole,
          target_id: pr.targetId,
          target_role: pr.targetRole,
          status: pr.status,
        },
      });
    } catch (e) {
      // ignore
    }
  }
  console.log(`- ${partnerRequestsData.length} partner requests created`);

  console.log("\nDone! Sample data seeded:");
  console.log("  - Buyer Requests: 5");
  console.log("  - Active Chats: 6");
  console.log("  - Partner Network: 3 connected, 1 pending, 1 rejected");

  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});