import { prisma } from "@/lib/prisma";

async function main() {
  await prisma.event.create({
    data: {
      title: "Evento de Exemplo",
      description: "Descrição de exemplo para o evento.",
      ticketsLimit: 100,
      date: "11/01/2016",
      endereco: "rua tiradentes",
      horario: "15:00",
      local: "praça",
    },
  });

  console.log("Seed finalizada: 1 Event criado.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
