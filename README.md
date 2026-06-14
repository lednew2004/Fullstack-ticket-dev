# Ticket

Aplicação de exemplo para gerenciamento de eventos e venda de ingressos.

## Stack

- Next.js (App Router)
- React
- TypeScript
- Prisma (PostgreSQL)
- Tailwind CSS
- Resend (envio de e-mails)
- Docker / Docker Compose (opcional)

Versões principais (consultar `package.json`): Next 16, React 19, Prisma 7.

## Variáveis de ambiente

Crie um arquivo `.env` copiando o `env.example` e preencha os valores:

- `DATABASE_URL` — string de conexão para o banco PostgreSQL.
- `RESEND_API_KEY` — chave da API Resend para envio de e-mails.
- `NEXT_PUBLIC_APP_URL` — URL pública do app (ex.: `http://localhost:3000`).

Exemplo rápido:

```
cp env.example .env
```

No Windows PowerShell:

```
Copy-Item env.example .env
```

## Como rodar (desenvolvimento)

1. Instale as dependências:

```bash
npm install
```

2. Inicie um banco PostgreSQL local (opcional — o projeto inclui `docker-compose.yml`):

```bash
docker compose up -d
# ou: docker-compose up -d
```

3. Gere o cliente Prisma e rode migrações (com o banco ativo):

```bash
npx prisma generate
npx prisma migrate dev --name init
# ou, se preferir apenas sincronizar o schema: npx prisma db push
```

4. Rode a aplicação em modo de desenvolvimento:

```bash
npm run dev
```

## Scripts úteis

- `npm run dev` — roda o Next.js em desenvolvimento
- `npm run build` — build para produção
- `npm start` — inicia o servidor em modo de produção

## Seed

O projeto inclui um arquivo de seed em `prisma/seed.ts`. Se você rodar `npx prisma migrate dev` e a configuração de seed estiver definida, o seed será executado conforme a configuração do Prisma.

## Observações

- O `DATABASE_URL` atual no repositório aponta para um banco Supabase; para desenvolvimento local, ajuste `DATABASE_URL` conforme necessário.
- Verifique `lib/resend.ts` para uso da variável `RESEND_API_KEY`.

## Contribuição

Pull requests são bem-vindos. Abra uma issue antes de mudanças maiores.

## License

Este projeto está aberto para uso — adicione uma licença conforme necessário.
