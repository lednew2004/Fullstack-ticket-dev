import { getTicket } from "@/app/actions/get-ticket";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Hash,
  Mail,
  MapPin,
  Music,
  Phone,
  ShieldCheck,
  TicketCheck,
  User,
} from "lucide-react";
import Link from "next/link";

interface TicketPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Ticket({ params }: TicketPageProps) {
  const { id } = await params;

  const response = await getTicket({ id });

  if (!response.success || !response.data) {
    return (
      <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-zinc-950 px-4 py-10 text-white sm:px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_35%)]" />

        <section className="relative z-10 w-full max-w-xl rounded-3xl border border-red-500/30 bg-zinc-900/80 p-8 text-center shadow-2xl shadow-red-950/40 backdrop-blur">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-500/40 bg-red-500/10">
            <TicketCheck className="h-8 w-8 text-red-400" />
          </div>

          <h1 className="text-3xl font-black text-white sm:text-4xl">
            Ingresso <span className="text-red-500">não encontrado</span>
          </h1>

          <p className="mt-3 text-zinc-400">
            Não foi possível encontrar os dados deste ingresso
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:border-red-500 hover:bg-red-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o evento
          </Link>
        </section>
      </main>
    );
  }

  const ticket = response.data;

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-zinc-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.28),transparent_34%),radial-gradient(circle_at_top_right,rgba(132,204,22,0.12),transparent_28%),radial-gradient(circle_at_bottom,rgba(249,115,22,0.18),transparent_36%)]" />

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-2xl shadow-red-950/30 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-red-400"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o evento
            </Link>

            <div className="flex flex-col gap-2">
              <span className="w-fit rounded-full border border-lime-500/30 bg-lime-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-lime-300">
                Ingresso confirmado
              </span>

              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                Seu{" "}
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-lime-400 bg-clip-text text-transparent">
                  Ingresso
                </span>
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                Confira abaixo as informações do evento e os dados vinculados ao
                seu ingresso.
              </p>
            </div>
          </div>

          <div className="flex w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-4 sm:w-fit">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                <ShieldCheck className="h-6 w-6 text-red-300" />
              </div>

              <div>
                <p className="text-xs text-zinc-400">Status</p>
                <p className="font-bold text-white">Entrada autorizada</p>
              </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="overflow-hidden rounded-3xl border border-red-500/30 bg-zinc-900/80 shadow-2xl shadow-red-950/30 backdrop-blur">
            <div className="border-b border-zinc-800 bg-gradient-to-r from-red-600/20 via-orange-500/10 to-lime-500/10 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">
                    Iron Thunder Fest
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                    {ticket.event?.title || "Evento"}
                  </h2>
                </div>

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/40 bg-zinc-950/70">
                  <Music className="h-8 w-8 text-red-400" />
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
              <InfoCard
                icon={<Calendar className="h-5 w-5 text-red-400" />}
                label="Data"
                value={ticket.event?.date}
              />

              <InfoCard
                icon={<Clock className="h-5 w-5 text-orange-400" />}
                label="Horário"
                value={ticket.event?.horario}
              />

              <InfoCard
                icon={<MapPin className="h-5 w-5 text-lime-400" />}
                label="Local"
                value={ticket.event?.local}
              />

              <InfoCard
                icon={<MapPin className="h-5 w-5 text-red-400" />}
                label="Endereço"
                value={ticket.event?.endereco}
              />
            </div>

            <div className="border-t border-zinc-800 p-5 sm:p-8">
              <p className="text-sm text-zinc-500">Descrição do evento</p>

              <p className="mt-2 text-base leading-relaxed text-zinc-300">
                {ticket.event?.description || "—"}
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl shadow-red-950/20 backdrop-blur sm:p-8">
            <div className="mb-6 flex items-center justify-between gap-4 border-b border-zinc-800 pb-5">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-300">
                  Ticket digital
                </p>

                <h2 className="mt-2 text-3xl font-black text-white">
                  Dados do ingresso
                </h2>
              </div>

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                <TicketCheck className="h-7 w-7 text-red-400" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <InfoItem
                icon={<Hash className="h-4 w-4 text-red-400" />}
                label="Código do ingresso"
                value={ticket.id}
              />

              <InfoItem
                icon={<User className="h-4 w-4 text-red-400" />}
                label="Nome"
                value={ticket.userName}
              />

              <InfoItem
                icon={<Mail className="h-4 w-4 text-red-400" />}
                label="E-mail"
                value={ticket.userEmail}
              />

              <InfoItem
                icon={<Phone className="h-4 w-4 text-red-400" />}
                label="Celular"
                value={ticket.userPhone}
              />

              <InfoItem
                icon={<Clock className="h-4 w-4 text-red-400" />}
                label="Criado em"
                value={
                  ticket.createdAt
                    ? new Date(ticket.createdAt).toLocaleString("pt-BR")
                    : ""
                }
              />
            </div>

            <div className="my-8 border-t border-dashed border-zinc-700" />

            <div className="rounded-2xl border border-lime-500/30 bg-lime-500/10 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-lime-400" />

                <div>
                  <p className="font-bold text-white">
                    Apresente este ingresso na entrada
                  </p>

                  <p className="mt-1 text-sm leading-relaxed text-zinc-300">
                    Mantenha este ingresso salvo no celular ou apresente o link
                    recebido por e-mail no dia do evento.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-800 bg-zinc-950/70 p-5 transition hover:-translate-y-1 hover:border-red-500/60 hover:shadow-lg hover:shadow-red-950/30">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10 transition group-hover:bg-red-500/20">
        {icon}
      </div>

      <p className="text-sm text-zinc-500">{label}</p>

      <strong className="mt-1 block min-h-6 break-words text-base font-bold text-white">
        {value || "—"}
      </strong>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 transition hover:border-red-500/50 hover:bg-zinc-950">
      <div className="mb-2 flex items-center gap-2">
        {icon}

        <span className="text-sm text-zinc-500">{label}</span>
      </div>

      <strong className="block min-h-6 break-words text-base font-bold text-white">
        {value || "—"}
      </strong>
    </div>
  );
}
