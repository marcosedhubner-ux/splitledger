# Tab

Divida despesas em grupo com amigos e acerte as contas com o menor número possível de pagamentos. Adicione uma despesa, escolha entre quem ela é dividida, e o saldo de cada membro atualiza na hora — incluindo um plano de acerto sugerido, calculado por um algoritmo de simplificação de dívidas, não apenas uma lista bruta de "quem deve pra quem" por despesa.

[Read in English](./README.md)

## Por que esse projeto existe

Registre despesas num grupo de quatro pessoas durante uma semana e você acaba com uma dezena de pequenas dívidas se cruzando — Alex deve pro Bob, Bob deve pra Carla, Carla deve pro Alex. Ingenuamente, acertar as contas exigiria uma transação por dívida. O Tab líquida essas dívidas até o número mínimo de transferências que zera todo mundo, que é a parte realmente difícil de um app de divisão de contas — o CRUD ao redor disso é os 80% fáceis.

## Arquitetura

```
apps/
  web/   Next.js 16 (App Router, TypeScript, Tailwind) — grupos, despesas, saldos, acertos
  api/   Node/Express (TypeScript) — API REST + Socket.IO, Prisma ORM, PostgreSQL
```

```
src/
  domain/            debtSimplification.ts — algoritmo puro de acerto de contas, sem framework, testado
                      money.ts — conversão dólares/centavos pra matemática de saldo nunca tocar em ponto flutuante
                      errors.ts — erros de domínio tipados, mapeados para códigos HTTP
  modules/<nome>/     <nome>.schema.ts   validação de entrada com Zod
                      <nome>.service.ts   regra de negócio
                      <nome>.routes.ts    router do Express, controllers finos
  middlewares/        autenticação, rate limiting, tratamento central de erro
  realtime/           Socket.IO, uma sala por grupo
```

## A parte interessante: acertar dívidas no menor número de transações

Toda despesa e todo pagamento atualiza um saldo por membro (em centavos inteiros — dinheiro nunca é representado como float do JavaScript em nenhum lugar deste código, veja `domain/money.ts`). Passar essa lista de saldos pro `simplifyDebts` (`domain/debtSimplification.ts`) separa os membros em credores e devedores e casa gulosamente o maior credor com o maior devedor, repetidamente, até os dois lados zerarem:

```ts
while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
  const amount = Math.min(creditor.amountCents, debtor.amountCents);
  settlements.push({ fromUserId: debtor.userId, toUserId: creditor.userId, amountCents: amount });
  // ...avança o lado que zerou
}
```

Essa é uma escolha deliberada, não um acidente: a solução matematicamente ótima de mínimo de transações é uma busca por subset-sum (mais difícil que polinomial no caso geral), enquanto a estratégia gulosa "maior primeiro" usada aqui roda em `O(n log n)`, sempre acerta o grupo por completo, e na prática produz o mesmo número de transações ou muito próximo disso — a mesma troca que apps reais de divisão de despesas fazem. `tests/debtSimplification.test.ts` verifica a propriedade de corretude que realmente importa: aplicar os acertos sugeridos sempre leva cada saldo a exatamente zero.

## Segurança

- Senhas com hash via bcrypt (fator de custo 12); sessões são JWTs em cookies `httpOnly` e `sameSite=lax`.
- Toda rota de grupo verifica a associação (membership) no servidor antes de retornar qualquer dado — um usuário que não está no grupo recebe `403`, não um 404 que vazaria a existência do grupo.
- Só quem pagou uma despesa pode deletá-la; só quem deve uma dívida pode registrar que já pagou (autoatestado, como em todo fluxo de acerto entre pares).
- Toda entrada é validada com Zod na borda da aplicação, incluindo uma união discriminada para os tipos de divisão (igual vs. personalizada), então as duas formas não podem ser confundidas nem no nível de tipos.
- O Prisma parametriza todas as queries; rate limiting nos endpoints de autenticação; cabeçalhos de segurança via `helmet`; CORS restrito à origem configurada do frontend.
- Nenhum segredo fica versionado no repositório — veja [Como rodar](#como-rodar).

## Como rodar

### Pré-requisitos

- Node.js 20+
- Uma instância de PostgreSQL 14+ (local ou hospedada)

### 1. Configurar a API

```bash
cd apps/api
cp .env.example .env
```

| Variável | Descrição |
| --- | --- |
| `DATABASE_URL` | String de conexão do PostgreSQL |
| `JWT_SECRET` | String aleatória, 32+ caracteres (`openssl rand -hex 32`) |
| `WEB_ORIGIN` | URL do frontend, para o CORS (`http://localhost:3003` em dev) |

```bash
npm install
npm run prisma:migrate   # cria o schema
npm run prisma:seed      # grupo de amigos de demonstração, com despesas e um pagamento já acertado
npm run dev              # http://localhost:4003
```

Contas de demonstração criadas pelo seed, todas no mesmo grupo "Lisbon Trip" (senha `Passw0rd!123`):

`alex@splitledger.dev` · `blair@splitledger.dev` · `casey@splitledger.dev` · `dana@splitledger.dev`

### 2. Configurar o frontend

```bash
cd apps/web
cp .env.local.example .env.local   # NEXT_PUBLIC_API_URL
npm install
npm run dev -- -p 3003             # http://localhost:3003
```

## Testes

```bash
cd apps/api
npm test        # testes unitários da simplificação de dívidas e da matemática monetária (Vitest)
```

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS · TanStack Query · Node.js · Express · Socket.IO · Prisma · PostgreSQL · Zod · Vitest
