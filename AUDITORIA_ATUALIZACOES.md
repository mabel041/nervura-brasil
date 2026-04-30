# Auditoria de Atualizacoes

Este arquivo registra, por lote, o que foi alterado e enviado para deploy.

## 2026-04-30

### Lote
- Correcoes pendentes do admin
- Melhorias de confiabilidade no fluxo de avaliacoes

### Arquivos incluidos
- `app/(admin)/admin/layout.tsx`
- `app/(admin)/admin/login/page.tsx`
- `components/admin/LoginForm.tsx`
- `middleware.ts`
- `app/(admin)/admin/reviews/page.tsx`
- `app/api/admin/reviews/route.ts`
- `app/api/reviews/[produtoId]/route.ts`

### O que foi alterado
- Protecao do admin movida para validacao server-side no layout, com redirecionamento seguro para login.
- Pagina de login do admin separada em componente client dedicado, com redirecionamento de usuario autenticado.
- Middleware simplificado para controle de acesso por cookie de sessao, reduzindo fragilidade no runtime.
- Endpoint do admin de avaliacoes ajustado para autenticacao e resposta sem cache.
- Endpoint publico de reviews ajustado para resposta sem cache.
- Tela de moderacao de avaliacoes com atualizacao manual, refresh automatico ao retomar foco da aba e polling leve.
- Indicacao visual de ultima atualizacao na pagina de reviews do admin.

### Validacao executada
- `npx tsc --noEmit`
- `npm run build`

### Observacoes
- `.claude/settings.local.json` ficou fora do deploy por ser configuracao local da maquina e nao codigo do site.
