# 🍪 Cookieland 2.0 — Roadmap

> Recriação do site atual como aplicação full-stack: mesmo visual, mesmas regras de negócio,
> agora com dashboard do dono, login de clientes (Clerk), pedidos no site e pagamento (Stripe).
>
> **Regra de ouro:** o front-end novo deve ficar **idêntico** ao site atual. O site antigo
> inteiro ficará dentro do projeto novo (pasta `/legacy`) como referência viva para copiar
> HTML, CSS e lógicas.

---

## 1. Visão geral

| Item | Decisão |
|---|---|
| Framework | **Next.js 15+ (App Router) + TypeScript** |
| Estilo | Portar o `styles.css` atual como CSS global (sem Tailwind — fidelidade total ao visual) |
| Autenticação | **Clerk** (login obrigatório para fazer pedido) |
| Pagamento | **Stripe Checkout** (+ webhooks) |
| Banco de dados | **Postgres** (Neon ou Vercel Postgres — free tier) via **Prisma** |
| Hospedagem | **Vercel** (plano Hobby, grátis) — domínio `cookieland.uk` já existe (DNS na Hostinger aponta para a Vercel) |
| Imagens | `/public/assets/img` (mesma estrutura de pastas atual) — futuro: Vercel Blob/Cloudinary para upload pelo dashboard |
| Documento vivo | `PROJECT_BRAIN.md` na raiz do projeto novo — atualizado a cada feature (ver seção 8) |

### Por que Vercel e não Hostinger?
O Next.js precisa de servidor Node/serverless (webhooks do Stripe, API routes). A Vercel faz
isso de graça e com deploy automático via GitHub. A Hostinger continua sendo só o registrador
do domínio: basta apontar o DNS (registro `A` / `CNAME`) para a Vercel.

---

## 2. Skills necessárias

### Fundamentais (usadas o tempo todo)
- **React** — componentes, props, estado (`useState`), efeitos (`useEffect`), context (carrinho global)
- **Next.js App Router** — páginas, layouts, Server/Client Components, Server Actions, Route Handlers (`/api`)
- **TypeScript** — tipos para produtos, pedidos, carrinho
- **CSS** — o site já tem todo o CSS pronto; skill aqui é *portar sem quebrar* (classes idênticas)

### Backend & dados
- **Prisma ORM** — schema, migrations, queries
- **Postgres** — modelagem básica (produtos, pedidos, endereços)
- **Webhooks** — receber eventos do Stripe com verificação de assinatura

### Serviços
- **Clerk** — `<SignInButton>`, `<UserButton>`, middleware de proteção de rotas, `auth()` no servidor, roles (admin vs cliente)
- **Stripe** — Checkout Sessions, line items dinâmicos, webhook `checkout.session.completed`, modo teste vs produção

### DevOps
- **Git/GitHub** — branches, PRs (deploy automático da Vercel por branch)
- **Vercel** — variáveis de ambiente, domínio custom, logs
- **DNS** — apontar domínio da Hostinger para a Vercel

---

## 3. Estrutura do projeto novo

```
cookieland-app/
├── PROJECT_BRAIN.md          ← cérebro vivo do projeto (ver seção 8)
├── legacy/                   ← SITE ATUAL INTEIRO, intocado (referência p/ copiar tudo)
│   ├── index.html
│   ├── assets/...
│   └── ...
├── prisma/
│   └── schema.prisma
├── public/
│   └── assets/img/           ← mesmas imagens, mesma estrutura de pastas
├── src/
│   ├── app/
│   │   ├── layout.tsx        ← header/footer globais (portados do legacy)
│   │   ├── page.tsx          ← home (hero, cookies, sandwiches, pots, donuts, gallery, contact)
│   │   ├── terms/page.tsx
│   │   ├── privacy/page.tsx
│   │   ├── account/          ← área do cliente (endereços, pedidos)
│   │   ├── checkout/         ← fluxo de finalização (progresso em etapas)
│   │   ├── admin/            ← dashboard do dono (protegido por role)
│   │   │   ├── products/
│   │   │   └── orders/
│   │   └── api/
│   │       ├── webhooks/stripe/route.ts
│   │       └── ...
│   ├── components/           ← Card de produto, modal de info, sacola (drawer), etc.
│   ├── lib/                  ← prisma client, stripe client, regras de preço (box 4/6!)
│   └── styles/globals.css    ← styles.css portado
└── .env.local
```

---

## 4. Regras de negócio do site atual (PRESERVAR TODAS)

Copiadas de `legacy/assets/js/main.js` — o projeto novo deve reimplementar exatamente:

1. **Preços**: cookie individual £2.70 · box de 4 = £10 · box de 6 = £15 (desconto aplicado
   automaticamente quando o nº de cookies *avulsos* é exatamente 4 ou 6; produtos especiais
   como pots não contam para o box).
2. **Hints da sacola**: "Add X more cookies to unlock the 4-pack box for £10!" (1–3 cookies)
   e "Add 1 more cookie to unlock the 6-pack box for £15!" (5 cookies); mostrar economia
   quando o box é aplicado.
3. **Add-ons**: Coke £1.10 · Fanta £1.10 · Catupiry £2.00 · Nutella Border £2.00 (+ observação).
4. **Entrega**: taxas por cidade — Portadown £3, Lurgan £5, Craigavon £4, Dungannon £30,
   Belfast £30, Other (a combinar). Limite 25 milhas; acima, £2/milha extra.
5. **Janelas**: pick-up & delivery só às **sextas, 18:30–22:00**, slots de 20 min.
6. **Cookie Sandwiches**: pedido só até **quinta-feira** (bloquear no checkout, não só avisar).
7. **Loja aberta/fechada**: hoje é `get_status.php` + `FORCE_STORE_OPEN`; no novo, vira um
   **toggle no dashboard** ("Loja aberta") que desabilita o botão de pedido no site.
8. **Pagamento**: Stripe substitui a transferência bancária; manter opção "Cash" (pagar na
   retirada) como método sem Stripe se o dono quiser.
9. **WhatsApp**: o pedido hoje vira mensagem de WhatsApp. Manter como **notificação ao dono**
   (link "abrir conversa" no dashboard), não mais como canal único do pedido.

---

## 5. Modelo de dados (Prisma — rascunho)

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String
  price       Decimal
  category    Category          // COOKIE | SANDWICH | POT | DONUT
  images      String[]          // caminhos em /assets/img/...
  isNew       Boolean  @default(false)   // ← botão slide "novo" no dashboard
  isActive    Boolean  @default(true)    // esconder sem deletar
  sortOrder   Int      @default(0)
  createdAt   DateTime @default(now())
}

model Order {
  id            String      @id @default(cuid())
  userId        String                       // Clerk user id
  status        OrderStatus @default(RECEIVED)
  // RECEIVED → CONFIRMED → IN_PRODUCTION → READY → OUT_FOR_DELIVERY → COMPLETED | CANCELLED
  items         OrderItem[]
  serviceType   ServiceType                  // PICKUP | DELIVERY
  addressId     String?
  slot          DateTime                     // dia/hora escolhidos
  deliveryFee   Decimal     @default(0)
  discount      Decimal     @default(0)      // box 4/6
  total         Decimal
  paymentMethod String                       // stripe | cash
  stripeSession String?
  observation   String?
  createdAt     DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  productId String
  name      String           // snapshot do nome na hora da compra
  unitPrice Decimal          // snapshot do preço
  quantity  Int
}

model Address {
  id        String  @id @default(cuid())
  userId    String           // Clerk user id
  label     String           // "Casa", "Trabalho"
  line1     String
  city      String
  postcode  String
  isDefault Boolean @default(false)
}

model StoreSetting {
  id        Int     @id @default(1)
  isOpen    Boolean @default(true)
}
```

---

## 6. Fases do roadmap

### Fase 0 — Fundação (1 dia)
- [ ] Criar repo `cookieland-app` no GitHub
- [ ] `npx create-next-app@latest` (TypeScript, App Router, sem Tailwind)
- [ ] Copiar o site atual inteiro para `/legacy` (commit inicial separado)
- [ ] Copiar `/legacy/assets/img` → `/public/assets/img`
- [ ] Criar `PROJECT_BRAIN.md` (usar o template desta pasta)
- [ ] Conectar na Vercel (deploy automático do `main`)

### Fase 1 — Porte do front (pixel-perfect) (3–5 dias)
- [ ] Portar `styles.css` → `globals.css` (sem alterar nada)
- [ ] Header/nav + menu mobile → componentes React (mesmas classes)
- [ ] Home completa: hero, highlights, cards de produtos (ainda com dados hardcoded vindos do
      `itemInfo` do legacy), modal de info com mosaico, gallery, delivery, contact, footer
- [ ] Sacola drawer + checkout modal portados com a MESMA lógica do `main.js`
      (box discount, hints, add-ons, taxas por cidade, slots de horário)
- [ ] Páginas `/terms` e `/privacy`
- [ ] ✅ Critério de aceite: lado a lado com o site legacy, não dá pra notar diferença

### Fase 2 — Banco + produtos dinâmicos (2–3 dias)
- [ ] Prisma + Postgres (Neon free)
- [ ] Seed: migrar todos os produtos do `itemInfo`/HTML para a tabela `Product`
- [ ] Home passa a renderizar produtos do banco (Server Component)
- [ ] Badge "NEW" no card quando `isNew = true`

### Fase 3 — Clerk (1–2 dias)
- [ ] Instalar Clerk, configurar no layout (`<ClerkProvider>`)
- [ ] Botão **Login** no header (visível para visitantes) + `<UserButton>` logado
- [ ] Middleware: `/account`, `/checkout` e `/admin` exigem login
- [ ] Role `admin` (via `publicMetadata` do Clerk) → só o dono acessa `/admin`
- [ ] Sacola continua livre; **"Checkout" exige login** (redireciona para sign-in e volta)

### Fase 4 — Área do cliente (2 dias)
- [ ] `/account/addresses` — CRUD de endereços (com endereço padrão)
- [ ] `/account/orders` — lista de pedidos com status atual

### Fase 5 — Checkout com progresso + Stripe (3–4 dias)
- [ ] Fluxo em etapas com barra de progresso:
      `Sacola → Endereço/Retirada → Dia & horário → Add-ons → Pagamento`
- [ ] Validar regras: sandwiches até quinta, loja aberta, slots de sexta
- [ ] Criar Stripe Checkout Session no servidor (line items + delivery fee − box discount)
- [ ] Webhook `checkout.session.completed` → grava `Order` como pago
- [ ] Página de sucesso/cancelamento; opção "Cash on pick-up" cria pedido sem Stripe
- [ ] Modo teste do Stripe até o fim; trocar chaves só no go-live

### Fase 6 — Dashboard do dono (3–4 dias)
- [ ] `/admin/products` — tabela com busca; criar/editar/excluir produto
      (nome, descrição, preço, categoria, fotos, **toggle slide "isNew"**, toggle "ativo")
- [ ] `/admin/orders` — lista com filtro por status; mudar andamento do pedido
      (dropdown/kanban: Recebido → Confirmado → Em produção → Pronto → Saiu p/ entrega → Concluído)
- [ ] Toggle global **"Loja aberta/fechada"** (substitui o `get_status.php`)
- [ ] Link WhatsApp do cliente em cada pedido

### Fase 7 — Go-live (1 dia)
- [ ] Domínio: DNS da Hostinger → Vercel (`A 76.76.21.21` + `CNAME www`)
- [ ] Variáveis de produção (Clerk live, Stripe live, DATABASE_URL)
- [ ] Testar um pedido real de ponta a ponta
- [ ] Lighthouse + teste no celular (o público é mobile!)
- [ ] Desativar o site antigo / redirecionar

### Fase 8 — Futuro (backlog)
- [ ] Upload de imagens pelo dashboard (Vercel Blob)
- [ ] E-mail de confirmação de pedido (Resend)
- [ ] Notificação push/WhatsApp automática para o dono a cada pedido
- [ ] Cupons de desconto
- [ ] Relatório de vendas no dashboard

---

## 7. Variáveis de ambiente

```env
DATABASE_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=https://cookieland.uk
```

---

## 8. Protocolo do "cérebro" (`PROJECT_BRAIN.md`)

O projeto novo nasce com o arquivo `PROJECT_BRAIN.md` na raiz (template nesta pasta).
Ele é o contexto permanente para qualquer IA/dev que trabalhar no projeto.

**Regras:**
1. Toda feature concluída → atualizar a seção *Estado atual* e marcar no checklist.
2. Toda decisão de arquitetura → registrar em *Decisões* (o quê, por quê, quando).
3. Toda regra de negócio nova ou alterada → atualizar *Regras de negócio*.
4. Nunca apagar histórico de decisões; marcar como `[REVOGADA]` se mudar.
5. Ao iniciar qualquer sessão de trabalho com IA: "leia o PROJECT_BRAIN.md antes de tudo".
