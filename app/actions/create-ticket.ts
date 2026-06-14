"use server";

import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { cookies } from "next/headers";

interface CreateTicketProps {
  userName: string;
  userEmail: string;
  userPhone: string;
  eventId: string;
}

export async function createTicket({
  eventId,
  userEmail,
  userName,
  userPhone,
}: CreateTicketProps) {
  try {
    if (!eventId || !userEmail || !userName || !userPhone) {
      return {
        success: false,
        message: "Preencha todos os campos obrigatórios",
        data: null,
      };
    }

    const event = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      return {
        success: false,
        message: "Evento não encontrado",
        data: null,
      };
    }

    const ticketsCount = await prisma.ticket.count({
      where: {
        eventId,
      },
    });

    if (ticketsCount >= event.ticketsLimit) {
      return {
        success: false,
        message: "Limite de ingressos atingido para este evento",
        data: null,
      };
    }

    const ticket = await prisma.ticket.create({
      data: {
        userName,
        userEmail,
        userPhone,
        eventId,
      },
      include: {
        event: true,
      },
    });

    const cookieStore = await cookies();

    cookieStore.set("ticketId", ticket.id, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    const ticketUrl = `${process.env.NEXT_PUBLIC_APP_URL}/ticket/${ticket.id}`;

    const { error: emailError } = await resend.emails.send({
      from: "Dev Events <onboarding@resend.dev>",
      to: ticket.userEmail,
      subject: `Seu ingresso para ${ticket.event.title} foi confirmado`,
      html: getTicketEmailHtml({
        userName: ticket.userName,
        ticketId: ticket.id,
        ticketUrl,
        event: {
          title: ticket.event.title,
          date: ticket.event.date,
          horario: ticket.event.horario,
          local: ticket.event.local,
          endereco: ticket.event.endereco,
        },
      }),
    });

    if (emailError) {
      console.error("Erro ao enviar e-mail:", emailError);
    }

    return {
      success: true,
      message: "Ticket criado com sucesso",
      data: ticket,
    };
  } catch (error) {
    console.error("Erro ao criar ticket:", error);

    return {
      success: false,
      message: "Erro interno ao criar ticket",
      data: null,
    };
  }
}

function getTicketEmailHtml({
  userName,
  ticketId,
  ticketUrl,
  event,
}: {
  userName: string;
  ticketId: string;
  ticketUrl: string;
  event: {
    title: string;
    date?: string | null;
    horario?: string | null;
    local?: string | null;
    endereco?: string | null;
  };
}) {
  const safeUserName = escapeHtml(userName);
  const safeTicketId = escapeHtml(ticketId);
  const safeTicketUrl = escapeHtml(ticketUrl);
  const safeEventTitle = escapeHtml(event.title);
  const safeEventDate = escapeHtml(event.date || "Data não informada");
  const safeEventHorario = escapeHtml(event.horario || "horário não informado");
  const safeEventLocal = escapeHtml(event.local || "Local não informado");
  const safeEventEndereco = escapeHtml(
    event.endereco || "Endereço não informado",
  );

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Ingresso confirmado</title>
      </head>

      <body style="margin:0; padding:0; background-color:#09090b; font-family:Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b; padding:32px 12px;">
          <tr>
            <td align="center">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; background-color:#18181b; border:1px solid #3f3f46; border-radius:22px; overflow:hidden;">
                
                <tr>
                  <td style="padding:36px 24px; text-align:center; background:linear-gradient(135deg, #450a0a, #18181b 55%, #1a2e05); border-bottom:1px solid #3f3f46;">
                    <p style="margin:0 0 12px; color:#fca5a5; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:3px;">
                      Rock • Metal • Festival
                    </p>

                    <h1 style="margin:0; color:#ffffff; font-size:32px; line-height:1.2; font-weight:900;">
                      Dev<span style="color:#ef4444;">Events</span>
                    </h1>

                    <p style="margin:14px 0 0; color:#d4d4d8; font-size:16px;">
                      Seu ingresso foi confirmado com sucesso
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="display:inline-block; margin:0 0 16px; padding:8px 14px; border-radius:999px; background-color:rgba(132,204,22,0.12); border:1px solid rgba(132,204,22,0.35); color:#bef264; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:2px;">
                            Ingresso confirmado
                          </p>

                          <h2 style="margin:0 0 14px; color:#ffffff; font-size:26px; line-height:1.3; font-weight:900;">
                            Olá, ${safeUserName}
                          </h2>

                          <p style="margin:0 0 26px; color:#d4d4d8; font-size:16px; line-height:1.7;">
                            Seu ingresso para o evento 
                            <strong style="color:#ffffff;">${safeEventTitle}</strong> 
                            foi gerado com sucesso. Guarde este e-mail e apresente seu ingresso na entrada do evento.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#09090b; border:1px solid #3f3f46; border-radius:18px; overflow:hidden;">
                      <tr>
                        <td style="padding:22px; background:linear-gradient(135deg, rgba(239,68,68,0.22), rgba(249,115,22,0.08)); border-bottom:1px solid #3f3f46;">
                          <p style="margin:0; color:#fca5a5; font-size:12px; font-weight:bold; text-transform:uppercase; letter-spacing:2px;">
                            Ticket digital
                          </p>

                          <h3 style="margin:8px 0 0; color:#ffffff; font-size:22px; font-weight:900;">
                            ${safeEventTitle}
                          </h3>
                        </td>
                      </tr>

                      <tr>
                        <td style="padding:22px;">
                          <table width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="padding-bottom:18px;">
                                <p style="margin:0; color:#71717a; font-size:13px;">Código do ingresso</p>
                                <p style="margin:6px 0 0; color:#ffffff; font-size:16px; font-weight:bold; word-break:break-all;">
                                  ${safeTicketId}
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td style="padding-bottom:18px;">
                                <p style="margin:0; color:#71717a; font-size:13px;">Data e horário</p>
                                <p style="margin:6px 0 0; color:#ffffff; font-size:16px;">
                                  ${safeEventDate} às ${safeEventHorario}
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td style="padding-bottom:18px;">
                                <p style="margin:0; color:#71717a; font-size:13px;">Local</p>
                                <p style="margin:6px 0 0; color:#ffffff; font-size:16px;">
                                  ${safeEventLocal}
                                </p>
                              </td>
                            </tr>

                            <tr>
                              <td>
                                <p style="margin:0; color:#71717a; font-size:13px;">Endereço</p>
                                <p style="margin:6px 0 0; color:#ffffff; font-size:16px;">
                                  ${safeEventEndereco}
                                </p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <div style="text-align:center; margin-top:32px;">
                      <a 
                        href="${safeTicketUrl}" 
                        style="display:inline-block; background:linear-gradient(135deg, #dc2626, #f97316); color:#ffffff; text-decoration:none; font-weight:bold; padding:15px 26px; border-radius:12px; font-size:15px;"
                      >
                        Ver meu ingresso
                      </a>
                    </div>

                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:30px; background-color:rgba(132,204,22,0.10); border:1px solid rgba(132,204,22,0.30); border-radius:14px;">
                      <tr>
                        <td style="padding:18px;">
                          <p style="margin:0; color:#ffffff; font-size:15px; font-weight:bold;">
                            Apresente este ingresso na entrada
                          </p>

                          <p style="margin:8px 0 0; color:#d4d4d8; font-size:14px; line-height:1.6;">
                            Você pode abrir o ingresso pelo botão acima ou pelo link abaixo no dia do evento.
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:26px 0 0; color:#a1a1aa; font-size:14px; line-height:1.6;">
                      Caso o botão não funcione, copie e cole este link no navegador:
                    </p>

                    <p style="margin:8px 0 0; color:#fb923c; font-size:13px; word-break:break-all;">
                      ${safeTicketUrl}
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding:22px 24px; background-color:#09090b; border-top:1px solid #3f3f46; text-align:center;">
                    <p style="margin:0; color:#71717a; font-size:13px;">
                      © 2026 Dev Events. Todos os direitos reservados.
                    </p>

                    <p style="margin:8px 0 0; color:#52525b; font-size:12px;">
                      Iron Thunder Fest 2026
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
