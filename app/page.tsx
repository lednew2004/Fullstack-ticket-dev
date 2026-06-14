"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollButton } from "@/components/ui/scroll-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Mail, MapPin, Menu, Music, Phone, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createTicket } from "./actions/create-ticket";
import { getTicketCookie } from "./actions/get-ticket-cookies";

export default function Home() {
  const slides = [
    {
      title: "Iron Thunder Fest 2026",
      description:
        "O Iron Thunder Fest retorna em sua edição mais ambiciosa, reunindo fãs de rock e metal para uma noite marcada por performances intensas, produção de alto nível e uma atmosfera única. O festival foi criado para celebrar a energia que une diferentes gerações de headbangers em uma experiência inesquecível.",
    },
    {
      title: "Line-up Exclusivo",
      description:
        "O palco será dominado pelas bandas fictícias Steel Requiem, Black Horizon, Crimson Wrath e Valkyria's Call. Cada grupo traz sua própria identidade sonora, transitando entre Heavy Metal, Power Metal e Metal Melódico, garantindo uma programação diversificada para os fãs do gênero.",
    },
    {
      title: "Muito Além da Música",
      description:
        "Além dos shows, os participantes poderão aproveitar uma área temática com estandes de merchandising, praça de alimentação, espaços para fotos e ativações especiais inspiradas no universo do rock e do metal. Toda a estrutura foi planejada para proporcionar conforto sem perder a essência dos grandes festivais.",
    },
    {
      title: "Um Espetáculo Visual",
      description:
        "O evento contará com um sistema profissional de som e iluminação, painéis de LED, efeitos especiais e uma produção cenográfica inspirada em castelos medievais e elementos do metal clássico. Cada apresentação foi projetada para criar uma experiência visual tão impactante quanto a musical.",
    },
    {
      title: "Prepare-se para a Tempestade",
      description:
        "Vista sua camiseta favorita, reúna seus amigos e faça parte de uma noite que promete ficar marcada na memória dos fãs. O Iron Thunder Fest 2026 não é apenas um festival; é uma celebração da cultura rock e metal, onde milhares de pessoas se encontram para compartilhar a mesma paixão ao som de guitarras poderosas e refrões inesquecíveis.",
    },
  ];

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  function scrollToTicketForm() {
    document.getElementById("Retirar Ingresso")?.scrollIntoView({
      behavior: "smooth",
    });
  }

  function handleMobileNavigation(target: string) {
    document.getElementById(target)?.scrollIntoView({
      behavior: "smooth",
    });

    setIsMenuOpen(false);
  }

  async function handleCreateTicket(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);

    try {
      const response = await createTicket({
        eventId: "0e04cf32-270e-42e1-9baf-60cde6f650b1",
        userEmail: email,
        userName: name,
        userPhone: phone,
      });

      if (!response.success) {
        console.log(response.message);
        alert(response.message);
        return;
      }

      console.log("Ticket criado:", response.data);

      router.push(`/ticket/${response.data?.id}`);
    } catch (error) {
      console.error("Erro ao criar ticket:", error);
      alert("Erro inesperado ao criar ingresso");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    async function loadTicketCookie() {
      const response = await getTicketCookie();

      if (response.success && response.data?.ticketId) {
        setTicketId(response.data.ticketId);
      }
    }

    loadTicketCookie();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.25),transparent_35%),radial-gradient(circle_at_top_right,rgba(132,204,22,0.14),transparent_30%),radial-gradient(circle_at_bottom,rgba(120,53,15,0.22),transparent_35%)]" />

      <div className="relative z-10 flex w-full flex-col gap-16 px-4 py-6 sm:px-6 md:px-10 lg:gap-24 lg:px-16 xl:px-24 xl:py-10">
        <header className="sticky top-4 z-50 flex w-full flex-col rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl shadow-red-950/30 backdrop-blur-xl">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-1 font-['Space_Grotesk']">
              <span className="text-2xl font-bold text-white sm:text-3xl">
                Dev
              </span>

              <span className="text-2xl font-bold text-red-500 underline decoration-lime-500 sm:text-3xl">
                Events
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/40 bg-zinc-900 text-white transition hover:bg-red-600 md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="hidden items-center gap-6 md:flex">
              <ScrollButton target="Home" />
              <ScrollButton target="Sobre" />
              <ScrollButton target="Perguntas" />
              <ScrollButton target="Retirar Ingresso" />

              <Button
                onClick={() => {
                  if (!ticketId) {
                    alert("Nenhum ingresso encontrado");
                    return;
                  }

                  router.push(`/ticket/${ticketId}`);
                }}
                variant="secondary"
                className="cursor-pointer border border-red-500/60 bg-zinc-900 text-white shadow-lg shadow-red-950/30 transition hover:scale-105 hover:bg-red-600 hover:text-white"
              >
                Ver meu Ingresso
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="fixed inset-0 z-[999] md:hidden">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                aria-label="Fechar menu"
              />

              <aside className="absolute right-0 top-0 flex h-screen w-[85%] max-w-sm flex-col gap-6 border-l border-red-500/30 bg-zinc-950 p-6 shadow-2xl shadow-red-950/50 animate-in slide-in-from-right duration-300">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-5">
                  <div className="flex items-center gap-1 font-['Space_Grotesk']">
                    <span className="text-2xl font-bold text-white">Dev</span>
                    <span className="text-2xl font-bold text-red-500 underline decoration-lime-500">
                      Events
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-white transition hover:border-red-500 hover:bg-red-600"
                    aria-label="Fechar menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => handleMobileNavigation("Home")}
                    className="rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Home
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNavigation("Sobre")}
                    className="rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Sobre
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNavigation("Perguntas")}
                    className="rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Perguntas
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileNavigation("Retirar Ingresso")}
                    className="rounded-xl border border-zinc-800 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-red-500 hover:bg-red-500/10 hover:text-red-300"
                  >
                    Retirar Ingresso
                  </button>
                </nav>

                <button
                  type="button"
                  onClick={() => {
                    if (!ticketId) {
                      alert("Nenhum ingresso encontrado");
                      return;
                    }

                    setIsMenuOpen(false);
                    router.push(`/ticket/${ticketId}`);
                  }}
                  className="mt-auto rounded-xl bg-gradient-to-r from-red-600 to-orange-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-red-950/30 transition hover:scale-[1.02] hover:from-red-500 hover:to-orange-400"
                >
                  Ver meu Ingresso
                </button>
              </aside>
            </div>
          )}
        </header>

        <div className="flex w-full flex-col gap-20 lg:gap-28">
          <section
            id="Home"
            className="flex flex-col items-center justify-between gap-10 lg:flex-row lg:items-start xl:gap-20"
          >
            <div className="flex w-full max-w-3xl flex-col gap-6">
              <div className="inline-flex w-fit rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-300 shadow-lg shadow-red-950/30">
                Rock • Metal • Festival
              </div>

              <h2 className="text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Iron Thunder Fest{" "}
                <span className="bg-gradient-to-r from-red-500 via-orange-400 to-lime-400 bg-clip-text text-transparent">
                  2026
                </span>
              </h2>

              <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg md:text-xl">
                O Iron Thunder Fest 2026 chega para reunir os amantes do rock e
                do metal em uma noite de riffs pesados, solos eletrizantes e uma
                atmosfera inesquecível. O festival contará com apresentações das
                bandas fictícias Steel Requiem, Black Horizon, Crimson Wrath e
                Valkyria&apos;s Call.
              </p>

              <Tabs
                defaultValue="informacoes"
                className="mt-2 flex w-full flex-col gap-4"
              >
                <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0">
                  <TabsTrigger
                    value="informacoes"
                    className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-white transition data-[state=active]:border-red-500 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    Informações
                  </TabsTrigger>

                  <TabsTrigger
                    value="descricao"
                    className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-white transition data-[state=active]:border-red-500 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    Descrição
                  </TabsTrigger>

                  <TabsTrigger
                    value="lineup"
                    className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-white transition data-[state=active]:border-red-500 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    Line-up
                  </TabsTrigger>

                  <TabsTrigger
                    value="local"
                    className="cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-white transition data-[state=active]:border-red-500 data-[state=active]:bg-red-600 data-[state=active]:text-white"
                  >
                    Local
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="informacoes" className="mt-2 w-full">
                  <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoCard
                      icon={<Clock className="h-5 w-5 text-red-400" />}
                      label="Horário"
                      value="20:00"
                    />

                    <InfoCard
                      icon={<MapPin className="h-5 w-5 text-red-400" />}
                      label="Local"
                      value="Arena Ragnarok"
                    />

                    <InfoCard
                      icon={<Music className="h-5 w-5 text-red-400" />}
                      label="Gêneros"
                      value="Heavy Metal, Power Metal"
                    />
                  </section>
                </TabsContent>

                <TabsContent value="descricao" className="mt-2 w-full">
                  <TabBox
                    title="Sobre o evento"
                    text="Uma noite de rock e metal com palco temático, energia intensa e grandes atrações."
                  />
                </TabsContent>

                <TabsContent value="lineup" className="mt-2 w-full">
                  <TabBox
                    title="Line-up"
                    text="Steel Requiem, Black Horizon, Crimson Wrath e Valkyria's Call."
                  />
                </TabsContent>

                <TabsContent value="local" className="mt-2 w-full">
                  <TabBox
                    title="Arena Ragnarok"
                    text="Local do evento com estrutura completa para shows."
                  />
                </TabsContent>
              </Tabs>

              <Button
                onClick={scrollToTicketForm}
                className="w-full cursor-pointer bg-gradient-to-r from-red-600 to-orange-500 text-base font-bold text-white shadow-xl shadow-red-950/40 transition hover:scale-105 hover:from-red-500 hover:to-orange-400 sm:w-fit"
              >
                Adquirir Ingresso
              </Button>
            </div>

            <div className="group w-full max-w-md shrink-0 rounded-3xl border border-red-500/40 bg-zinc-900/70 p-3 shadow-2xl shadow-red-950/40 transition duration-300 hover:scale-[1.02] hover:border-lime-400/70 sm:p-5 lg:max-w-lg">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/iron-thunder.png"
                  alt="show"
                  className="h-80 w-full object-cover transition duration-500 group-hover:scale-110 sm:h-96 lg:h-[480px]"
                />
              </div>
            </div>
          </section>

          <section id="Sobre" className="flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-3 text-center">
              <h3 className="text-4xl font-black text-white sm:text-5xl">
                <span className="text-red-500">Sobre</span> O Evento
              </h3>

              <span className="max-w-2xl text-base text-zinc-400 sm:text-xl">
                Abaixo saiba tudo sobre o evento
              </span>
            </div>

            <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-stretch">
              <div className="flex w-full justify-center lg:w-1/2 lg:justify-start">
                <Carousel
                  autoplay
                  autoplayDelay={7000}
                  opts={{
                    loop: true,
                  }}
                  className="w-full max-w-xl"
                >
                  <CarouselContent>
                    {slides.map((slide, index) => (
                      <CarouselItem key={index}>
                        <div className="flex min-h-[420px] flex-col justify-between gap-8 rounded-3xl border border-zinc-800 bg-zinc-900/80 p-6 shadow-xl shadow-red-950/20 transition hover:border-red-500/60 sm:p-8">
                          <div className="flex flex-col gap-3">
                            <span className="w-fit rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-300">
                              #{index + 1}
                            </span>

                            <h3 className="text-3xl font-black text-white sm:text-4xl">
                              {slide.title}
                            </h3>

                            <p className="text-base leading-relaxed text-zinc-400">
                              {slide.description}
                            </p>
                          </div>

                          <Button
                            onClick={scrollToTicketForm}
                            className="w-full cursor-pointer bg-red-600 text-white transition hover:scale-105 hover:bg-red-500 sm:w-fit"
                          >
                            Adquirir Ingresso
                          </Button>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  <CarouselPrevious className="border-zinc-700 bg-zinc-900 text-white hover:bg-red-600 hover:text-white" />
                  <CarouselNext className="border-zinc-700 bg-zinc-900 text-white hover:bg-red-600 hover:text-white" />
                </Carousel>
              </div>

              <div className="flex w-full flex-col justify-center gap-4 rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 shadow-xl shadow-red-950/20 lg:w-1/2 lg:p-10">
                <h4 className="text-3xl font-black text-white">
                  Garanta seu <span className="text-red-500">Ingresso</span> em
                  poucos cliques
                </h4>

                <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
                  Após adquirir seu ingresso, você receberá um e-mail com todas
                  as informações necessárias para o acesso ao evento. O processo
                  é simples e rápido: basta preencher seus dados básicos e
                  confirmar a retirada.
                </p>

                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniBadge text="E-mail automático" />
                  <MiniBadge text="Ingresso digital" />
                  <MiniBadge text="Entrada rápida" />
                </div>
              </div>
            </div>
          </section>

          <section
            id="Perguntas"
            className="flex flex-col gap-10 py-8 lg:py-16"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <h3 className="text-4xl font-black text-white sm:text-5xl">
                <span className="text-red-500">Perguntas</span> Frequentes
              </h3>

              <span className="max-w-2xl text-base text-zinc-400 sm:text-xl">
                Abaixo segue perguntas populares respondidas
              </span>
            </div>

            <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
              <div className="w-full lg:w-1/2">
                <div className="overflow-hidden rounded-3xl border border-red-500/30 shadow-2xl shadow-red-950/30">
                  <img
                    src="/instrumentos.png"
                    alt="instrumentos"
                    className="h-72 w-full object-cover transition duration-500 hover:scale-105 sm:h-96 lg:h-[430px]"
                  />
                </div>
              </div>

              <div className="w-full lg:w-1/2">
                <Accordion className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/70 px-4 py-2 shadow-xl shadow-red-950/20 sm:px-6">
                  <AccordionItem value="item-1" className="border-zinc-800">
                    <AccordionTrigger className="text-left text-base text-white hover:text-red-400 hover:no-underline sm:text-lg">
                      Qual o horário do evento?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                      O Iron Thunder Fest 2026 começa às 20:00. Recomendamos que
                      o público chegue com antecedência para evitar filas e
                      aproveitar melhor a experiência.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-zinc-800">
                    <AccordionTrigger className="text-left text-base text-white hover:text-red-400 hover:no-underline sm:text-lg">
                      Onde será o show?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                      O show será realizado na Arena Ragnarok, um espaço
                      preparado para receber grandes apresentações musicais.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-zinc-800">
                    <AccordionTrigger className="text-left text-base text-white hover:text-red-400 hover:no-underline sm:text-lg">
                      Quais estilos musicais terão?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                      O evento será voltado principalmente para os fãs de rock e
                      metal, com destaque para Heavy Metal, Power Metal e Metal
                      Melódico.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-zinc-800">
                    <AccordionTrigger className="text-left text-base text-white hover:text-red-400 hover:no-underline sm:text-lg">
                      Quais bandas vão se apresentar?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                      O line-up contará com Steel Requiem, Black Horizon,
                      Crimson Wrath e Valkyria&apos;s Call.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-zinc-800">
                    <AccordionTrigger className="text-left text-base text-white hover:text-red-400 hover:no-underline sm:text-lg">
                      O evento terá estrutura para o público?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                      Sim. A estrutura foi pensada para oferecer palco temático,
                      iluminação especial, som de qualidade e ambientação
                      inspirada no universo do rock e do metal.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="border-zinc-800">
                    <AccordionTrigger className="text-left text-base text-white hover:text-red-400 hover:no-underline sm:text-lg">
                      Como posso comprar meu ingresso?
                    </AccordionTrigger>

                    <AccordionContent className="text-sm leading-relaxed text-zinc-400 sm:text-base">
                      Basta preencher seus dados na seção de retirada de
                      ingresso e finalizar o processo pelo site.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
          </section>

          <footer
            id="Retirar Ingresso"
            className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-4 shadow-2xl shadow-red-950/20 sm:p-6 lg:p-10"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-10 lg:flex-row lg:gap-16">
              <div className="flex w-full flex-col gap-6 lg:w-1/2">
                <div>
                  <h3 className="text-3xl font-black text-white sm:text-4xl">
                    Entre em <span className="text-red-500">Contato</span>
                  </h3>

                  <p className="mt-3 max-w-md text-zinc-400">
                    Tire suas dúvidas sobre o Iron Thunder Fest 2026 pelos
                    canais abaixo.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <ContactItem
                    icon={<Mail className="h-5 w-5 text-red-400" />}
                    label="E-mail"
                    value="wendellkauan870@gmail.com"
                  />

                  <ContactItem
                    icon={<Phone className="h-5 w-5 text-red-400" />}
                    label="Telefone"
                    value="+55 86 99441-095"
                  />

                  <ContactItem
                    icon={<MapPin className="h-5 w-5 text-red-400" />}
                    label="Localização"
                    value="Arena Ragnarok"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col gap-6 rounded-3xl border border-red-500/30 bg-zinc-900/80 p-5 shadow-xl shadow-red-950/30 sm:p-8 lg:w-1/2">
                <div>
                  <h4 className="text-2xl font-black text-white sm:text-3xl">
                    Retire seu <span className="text-red-500">ingresso</span>
                  </h4>

                  <p className="mt-2 text-zinc-400">
                    Preencha seus dados abaixo para adquirir seu ingresso para o
                    Iron Thunder Fest 2026.
                  </p>
                </div>

                <form
                  onSubmit={handleCreateTicket}
                  className="flex flex-col gap-4"
                >
                  <InputField
                    id="nome"
                    label="Nome completo"
                    type="text"
                    placeholder="Digite seu nome"
                    value={name}
                    onChange={setName}
                  />

                  <InputField
                    id="email"
                    label="E-mail"
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={setEmail}
                  />

                  <InputField
                    id="celular"
                    label="Número de celular"
                    type="tel"
                    placeholder="Digite seu número"
                    value={phone}
                    onChange={setPhone}
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 h-12 rounded-xl bg-gradient-to-r from-red-600 to-orange-500 font-bold text-white shadow-lg shadow-red-950/30 transition hover:scale-[1.02] hover:from-red-500 hover:to-orange-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? "Gerando ingresso..." : "Adquirir ingresso"}
                  </button>
                </form>
              </div>
            </div>

            <div className="mx-auto mt-10 flex w-full max-w-7xl flex-col gap-3 border-t border-zinc-800 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="text-sm text-zinc-500">
                © 2026 Dev Events. Todos os direitos reservados.
              </p>

              <p className="text-sm text-zinc-500">Iron Thunder Fest 2026</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-lg shadow-red-950/10 transition hover:-translate-y-1 hover:border-red-500/60">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10">
        {icon}
      </div>

      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

function TabBox({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-lg shadow-red-950/10">
      <h3 className="font-bold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{text}</p>
    </div>
  );
}

function MiniBadge({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-center text-sm font-medium text-red-200">
      {text}
    </span>
  );
}

function ContactItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-4 transition hover:border-red-500/50 hover:bg-zinc-900">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-500/10">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-sm text-zinc-500">{label}</p>
        <p className="break-words text-white">{value}</p>
      </div>
    </div>
  );
}

function InputField({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-zinc-300">
        {label}
      </label>

      <input
        id={id}
        type={type}
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-xl border border-zinc-700 bg-zinc-950 px-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      />
    </div>
  );
}
