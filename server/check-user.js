import prisma from "./utils/prisma.js";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "admin@gmail.com" },
    select: { id: true, name: true, email: true, role: true, status: true },
  });

  if (user) {
    console.log("User found:", user);
  } else {
    console.log("User not found");
  }

  await prisma.$disconnect();
}

main().catch(console.error);
