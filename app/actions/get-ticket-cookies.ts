"use server";

import { cookies } from "next/headers";

export async function getTicketCookie() {
  try {
    const cookieStore = await cookies();

    const ticketId = cookieStore.get("ticketId")?.value;

    if (!ticketId) {
      return {
        success: false,
        message: "Nenhum ingresso encontrado",
        data: null,
      };
    }

    return {
      success: true,
      message: "Ingresso encontrado",
      data: {
        ticketId,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar cookie do ticket:", error);

    return {
      success: false,
      message: "Erro ao buscar ingresso",
      data: null,
    };
  }
}
