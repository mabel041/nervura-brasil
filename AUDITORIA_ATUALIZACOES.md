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

## 2026-04-30

### Lote
- Redesign visual da home inspirado no Stitch
- Atualizacao da moldura visual da vitrine da loja
- Export local dos assets de referencia do Stitch para implementacao

### Arquivos incluidos
- `app/(store)/page.tsx`
- `app/globals.css`
- `components/loja/BannerPromocao.tsx`
- `components/loja/BarraPagamentos.tsx`
- `components/loja/CardProduto.tsx`
- `components/loja/ContadorCopa.tsx`
- `components/loja/Header.tsx`
- `components/loja/RodapeSociais.tsx`
- `stich-project/exports/17366138114382484145/828f3a1798c741ef9cc916240eb61040/screen.html`
- `stich-project/exports/17366138114382484145/828f3a1798c741ef9cc916240eb61040/screen.png`
- `stich-project/exports/17366138114382484145/828f3a1798c741ef9cc916240eb61040/metadata.json`
- `stich-project/exports/17366138114382484145/b0a389cdcaa345b4a31ccd99ba3dec25/screen.png`
- `stich-project/exports/17366138114382484145/b0a389cdcaa345b4a31ccd99ba3dec25/metadata.json`
- `stich-project/exports/17366138114382484145/b0a389cdcaa345b4a31ccd99ba3dec25/list-screens-response.txt`
- `stich-project/stitch-main.js`
- `stich-project/stitch-aux.js`

### O que foi alterado
- Home reestruturada com hero editorial, hierarquia tipografica mais forte e composicao inspirada no material do Stitch.
- Secoes de colecao, destaque, contagem da Copa e historia reorganizadas para uma leitura mais premium e menos cara de template.
- Header, banner promocional, cards de produto, contador, barra de pagamentos e rodape receberam novo tratamento visual para alinhar a vitrine inteira.
- Estrutura de negocio foi preservada: catalogo, links, dados vindos do banco e logica de compra nao foram alterados neste lote.
- Assets e metadados do Stitch foram exportados localmente para servir de referencia rastreavel na implementacao.

### Validacao executada
- `npx tsc --noEmit`
- `npm run build`

### Observacoes
- A pagina de produto, carrinho, checkout e order bump continuam com a estrutura atual; este lote altera apenas a home e os componentes compartilhados de moldura visual.
- O screen Stitch solicitado por ID nao expunha `htmlUrl`; por isso foi mantido tambem um screen alternativo do mesmo projeto que disponibiliza HTML para referencia de implementacao.

## 2026-04-30

### Lote
- Ajuste de fidelidade da home em relacao ao Stitch
- Correcao do banner superior e refinamento de densidade visual

### Arquivos incluidos
- `app/(store)/layout.tsx`
- `app/(store)/page.tsx`
- `components/loja/BarraPagamentos.tsx`
- `components/loja/CardProduto.tsx`
- `components/loja/ContadorCopa.tsx`
- `components/loja/Header.tsx`
- `components/loja/RodapeSociais.tsx`

### O que foi alterado
- Home recompactada para ficar mais proxima do mock do Stitch, com hero mais baixo, miolo centralizado e hierarquia mais comercial.
- Secao da Copa 2026 aproximada do layout de referencia, com contagem em caixas menores e texto central.
- Grade de destaques reduzida e adensada para reproduzir melhor a leitura visual do mock.
- Bloco de historia reorganizado para composicao lateral mais fiel ao Stitch.
- Header, barra de pagamentos e rodape ajustados para recuperar a proporcao e o contraste vistos no layout de referencia.
- Texto corrompido do banner superior corrigido em producao.

### Validacao executada
- `npm run build`
- `npx tsc --noEmit`

### Observacoes
- `.claude/settings.local.json` continua fora do deploy por ser configuracao local da maquina.
