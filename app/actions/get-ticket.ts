"use server";

import { prisma } from "@/lib/prisma";

interface GetTicketProps {
  id: string;
}

export async function getTicket({ id }: GetTicketProps) {
  try {
    if (!id) {
      return {
        success: false,
        message: "Preencha todos os campos obrigatórios",
        data: null,
      };
    }

    const ticket = await prisma.ticket.findUnique({
      where: {
        id,
      },
      include: {
        event: true,
      },
    });

    return {
      success: true,
      message: "Ticket encontrado com sucesso",
      data: ticket,
    };
  } catch (error) {
    console.error("Erro ao encontrar ticket:", error);

    return {
      success: false,
      message: "Erro interno ao encontrar ticket",
      data: null,
    };
  }
}
