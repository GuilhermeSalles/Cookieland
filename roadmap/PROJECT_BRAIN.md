# 🧠 PROJECT_BRAIN — Cookieland 2.0

> **Este arquivo é o cérebro vivo do projeto.** Qualquer IA ou dev deve ler este arquivo
> ANTES de qualquer tarefa, e atualizá-lo DEPOIS de qualquer feature/decisão.
> Copie este template para a raiz do projeto novo (`cookieland-app/PROJECT_BRAIN.md`).

---

## O que é este projeto

Loja online da **Cookieland** (cookies artesanais em Craigavon, Irlanda do Norte — UK).
Recriação do site estático original (preservado em `/legacy`) como app Next.js com:

- Front **idêntico** ao site original (`/legacy` é a fonte da verdade visual)
- Login de clientes via **Clerk** (pedido exige login; navegar não)
- Pagamento via **Stripe Checkout** (+ opção cash na retirada)
- Dashboard do dono em `/admin` (produtos, pedidos, loja aberta/fechada)
- Banco **Postgres + Prisma**, hospedado na **Vercel**, domínio `cookieland.uk`

## Estado atual

> ⚠️ Atualizar esta seção a cada feature concluída.

- **Fase atual:** Fase 0 — Fundação (não iniciada)
- **Último update:** (data) — (o que foi feito)
- **Em produção:** site legado estático
- **Próximo passo:** criar repo + Next.js + copiar legacy

### Checklist macro
- [ ] Fase 0 — Fundação
- [ ] Fase 1 — Porte do front (pixel-perfect)
- [ ] Fase 2 — Banco + produtos dinâmicos
- [ ] Fase 3 — Clerk
- [ ] Fase 4 — Área do cliente (endereços/pedidos)
- [ ] Fase 5 — Checkout em etapas + Stripe
- [ ] Fase 6 — Dashboard do dono
- [ ] Fase 7 — Go-live (DNS Hostinger → Vercel)

## Regras de negócio (fonte da verdade)

> Vieram do site legado (`/legacy/assets/js/main.js`). Não alterar sem registrar decisão.

1. Cookie avulso £2.70 · **box 4 = £10** · **box 6 = £15** — desconto automático quando há
   exatamente 4 ou 6 cookies avulsos na sacola (pots/sandwiches/donuts não contam).
2. Hints na sacola incentivando completar o box (faltam X / economia aplicada).
3. Add-ons: Coke £1.10 · Fanta £1.10 · Catupiry £2.00 · Nutella Border £2.00 (com observação).
4. Delivery por cidade: Portadown £3 · Lurgan £5 · Craigavon £4 · Dungannon £30 · Belfast £30 ·
   Other a combinar. Raio 25 milhas; além disso £2/milha.
5. Pick-up/delivery: **somente sextas, 18:30–22:00**, slots de 20 min.
6. **Cookie Sandwiches só até quinta-feira** (bloquear no checkout).
7. Loja aberta/fechada: toggle no dashboard desabilita pedidos no site.
8. Status de pedido: RECEIVED → CONFIRMED → IN_PRODUCTION → READY → OUT_FOR_DELIVERY →
   COMPLETED | CANCELLED.
9. Endereço de pick-up: 107 Baltylum Meadows, BT62 4BW, Craigavon.
10. WhatsApp do negócio: +44 7850 988160 (notificação/contato, não mais o canal do pedido).

## Decisões de arquitetura

> Formato: `AAAA-MM-DD — Decisão — Motivo`. Nunca apagar; marcar `[REVOGADA]` se mudar.

- 2026-06-12 — Next.js App Router + TS, CSS global portado do legacy (sem Tailwind) — fidelidade visual total.
- 2026-06-12 — Vercel (free) para hosting; Hostinger só DNS — Next.js precisa de serverless.
- 2026-06-12 — Clerk para auth (roles via publicMetadata: `admin`) — rápido e com UI pronta.
- 2026-06-12 — Stripe Checkout (não Elements) — menos PCI, mais rápido de lançar.
- 2026-06-12 — `/legacy` mantido dentro do repo como referência visual e de lógica.

## Mapa do projeto

| Caminho | O que é |
|---|---|
| `/legacy` | Site original completo — NUNCA editar, só consultar |
| `src/app/page.tsx` | Home (todas as seções do site original) |
| `src/app/admin` | Dashboard do dono (role admin) |
| `src/app/account` | Endereços + pedidos do cliente |
| `src/app/checkout` | Fluxo em etapas → Stripe |
| `src/app/api/webhooks/stripe` | Confirma pagamento e grava pedido |
| `src/lib/pricing.ts` | Regra do box 4/6 + taxas de entrega (PORTAR DO LEGACY) |
| `prisma/schema.prisma` | Product, Order, OrderItem, Address, StoreSetting |

## Como trabalhar neste projeto (para IAs)

1. **Leia este arquivo inteiro antes de qualquer tarefa.**
2. Visual: compare sempre com `/legacy` — classes, espaçamentos e textos devem bater.
3. Lógica: antes de reescrever qualquer cálculo, leia `/legacy/assets/js/main.js`.
4. Ao terminar: atualize *Estado atual*, marque o checklist e registre decisões novas.
5. Não introduza dependências novas sem registrar em *Decisões*.

## Aprendizados & pegadinhas

> Registrar bugs não-óbvios e suas causas para não repetir.

- (vazio por enquanto)
