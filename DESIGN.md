---
name: "HP Engenharia"
description: "Sistema visual da referência aprovada: engenharia ambiental e soluções rurais."
colors:
  green: "#073D2E"
  green-secondary: "#176443"
  yellow: "#F5CB27"
  paper: "#F7F7F2"
  ink: "#17362B"
  white: "#fff"
  muted: "#59645f"
  line: "#d9dfd8"
  button-ink: "#102f24"
  yellow-hover: "#ffda49"
  focus: "#bd8a00"
typography:
  display:
    fontFamily: '"Manrope", Arial, sans-serif'
    fontSize: "clamp(40px, 3.65vw, 58px)"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Manrope", Arial, sans-serif'
    fontSize: "clamp(28px, 2.55vw, 38px)"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.035em"
  title:
    fontFamily: '"Manrope", Arial, sans-serif'
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1.18
    letterSpacing: "-0.03em"
  body:
    fontFamily: '"Inter", Arial, sans-serif'
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: '"Inter", Arial, sans-serif'
    fontSize: "14px"
    fontWeight: 600
    lineHeight: 1.35
rounded:
  brand: "2px"
  field: "3px"
  button: "5px"
  panel: "6px"
  gallery: "7px"
  dialog: "8px"
  card: "9px"
  circle: "50%"
spacing:
  xs: "12px"
  sm: "16px"
  md: "20px"
  lg: "24px"
  section: "48px"
  section-mobile: "36px"
components:
  button-yellow:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.button-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
  button-yellow-hover:
    backgroundColor: "{colors.yellow-hover}"
  button-outline-light:
    backgroundColor: "rgba(4,26,19,.1)"
    textColor: "{colors.white}"
    rounded: "{rounded.button}"
    padding: "13px 22px"
  solution-card:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
  field:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "9px 12px"
---

# Design System: HP Engenharia

## Overview

**Creative North Star: "Referência aprovada — HP Engenharia"**

Sistema extraído da implementação final de `index.html`, `styles.css`, `src/content.ts` e `src/main.ts`. A composição aprovada privilegia verde profundo, amarelo de ação, superfícies claras e fotografias fornecidas. O caráter é técnico, direto e próximo, sem substituir a identidade aprovada por uma direção nova.

Manrope dá presença aos títulos; Inter mantém clareza nos textos e controles. Fotografias e contatos aproximam a empresa do campo, sem criar alegações sobre clientes, projetos ou resultados. A composição específica da home permanece em `.impeccable/surfaces/index-html.md`.

**Key Characteristics:**

- Títulos fortes em Manrope e conteúdo funcional em Inter.
- Cabeçalho em duas barras, hero fotográfico e ações amarelas.
- Cards claros, processo verde e galeria manual com ampliação.
- Movimento discreto de interação, sem conteúdo oculto na entrada.
- Marca original preservada e procedência das imagens documentada.

## Colors

### Primary

- **Verde institucional** (`green`): barra superior, processo, rodapé e fundo do hero empilhado.
- **Verde de ação textual** (`green-secondary`): links de serviço e respostas da navegação.

### Secondary

- **Amarelo de ação** (`yellow`): CTAs, ênfase no hero, números das etapas e traços dos pequenos títulos.
- **Amarelo de resposta** (`yellow-hover`): hover do CTA.
- **Ouro de foco** (`focus`): contorno de teclado, separado do preenchimento amarelo.

### Neutral

- **Papel claro** (`paper`): fundo geral.
- **Tinta vegetal** (`ink`): texto em superfícies claras; `button-ink` dá contraste ao CTA amarelo.
- **Branco** (`white`): navegação principal, cartões, campos e texto sobre verde.
- **Cinza vegetal** (`muted`): descrições; **Linha clara** (`line`): separadores e controles.

**The Approved Palette Rule.** Preservar os cinco valores centrais da referência; não recuperar os verdes e amarelos do sistema anterior.

## Typography

Display e títulos: Manrope, Arial, sans-serif. Corpo e controles: Inter, Arial, sans-serif. Fontes carregadas pelo Google Fonts; fallbacks continuam funcionais.

A hierarquia normativa está no frontmatter. Títulos balanceados, sem condensação artificial. O h1 passa a (46px) até (1190px), (40px) até (1000px), e `clamp(32px,8.7vw,40px)` com entrelinha (1.2) até (700px). Lead (16px/1.65), (15px) no tablet e (14px) no celular. Descrições de serviço (14px/1.55). Pequenos títulos em Manrope (700, 11px/1.5), caixa alta e espaçamento (.1em). Notas de processo, disclosures e texto do rodapé usam (12px) após os overrides finais.

## Layout

Contêiner de até (1220px), largura `calc(100% - 64px)`; até (1190px), margens de (24px); até (700px), (18px). Seções regulares: (48px) verticais e (36px) no celular; demais faixas têm ajustes próprios.

Cabeçalho sticky: barra verde (48px mínimos) e principal branca (88px mínimos). Até (1000px), menu vira painel fixo sob o cabeçalho, localização/e-mail superiores saem e a principal mede (80px mínimos). Até (700px), principal (76px), CTA superior oculto, contatos individuais/redes preservados. Âncoras usam offsets (133px), (126px), (124px), respectivamente.

Hero desktop: foto à direita com (82%) da largura, gradiente escuro local e texto sobreposto à esquerda; altura mínima (610px), ou (660px) a partir de (1600px). Até (1000px), foto inteira acima do texto em fundo verde, sem overlay, preservando rostos. Cards: quatro colunas, duas até (1000px), uma até (700px). Processo: introdução + três etapas horizontais; introdução empilha no tablet e etapas ficam verticais no celular. Sobre usa duas colunas e empilha até (700px).

Galeria: quatro imagens visíveis no desktop, três no tablet e cartões de (85%) da largura no celular, com scroll-snap horizontal. CTA rural usa três colunas, duas no tablet e uma no celular. Rodapé: cinco colunas, três no tablet e duas no celular, com blocos largos nas linhas próprias. Cinco larguras foram validadas na revisão de entrega, sem overflow horizontal ou imagens quebradas; isso não comprova cobertura de qualquer dispositivo.

## Elevation & Depth

Superfícies planas em repouso. Fotografias ganham legibilidade por gradientes locais, não por blur decorativo. Card em hover sobe (4px) e recebe sombra `0 12px 26px #073d2e12`. Diálogo com fundo verde profundo e backdrop `#00170fe8`; sem sombras globais no cabeçalho/formulário.

## Shapes

Botões, cards, fotos, campos e diálogo usam os raios do frontmatter. Círculos delimitam ícones de serviço (54px), etapas (52px; 46px no celular) e controles da galeria (42px).

A marca usa exclusivamente `assets/hp-engenharia-logo.png`, inalterada e com proporções originais. A moldura CSS recorta somente a área vazia de fundo; não esticar, recolorir, redesenhar ou remover fundo por IA. A versão oficial transparente ainda está pendente.

## Components

### Buttons

Ação principal amarela, altura mínima (50px), borda `#e9bc1b`, padding/tipografia do frontmatter. Hover clareia e sobe (1px) em (220ms). Secundário do hero tem borda clara e fundo translúcido. CTA do cabeçalho compacto (45px mínimos); ações do hero móvel (48px mínimos). Foco global: contorno (3px) em ouro, offset (5px).

### Cards / Containers

Quatro serviços com mídia, ícone circular sobre a junção e conteúdo flexível, link contextual ao fim. Mídia desktop (190px); corpo (28px 22px 22px), com ajustes tablet. Crédito/regularização usam imagens fornecidas. Georreferenciamento/ambiental usam alternativas gráficas discretas, não fotografias substitutas. Escopo adicional em `details/summary` nativo.

Processo em lista ordenada com números/conectores, não promessa de resultado. Nota de fluxo provisório visível. Sobre reúne imagem fornecida, texto e contatos profissionais em `details`.

### Inputs / Fields

Formulário branco dentro de `details` no CTA rural. Labels permanentes, borda `#a8b9ac`, fonte (15px), textarea redimensionável com mínimo (44px). Nome, telefone e mensagem obrigatórios; validação nativa `reportValidity()`. Máscara limita telefone a onze dígitos, sem comprovar existência. Abre mensagem no WhatsApp de Henrik para revisão e envio pelo usuário; não armazena dados nem confirma envio.

### Navigation

Menu responsivo com `aria-expanded`, foco no primeiro link ao abrir, Escape com retorno ao botão, fechamento por âncora/retorno ao desktop e bloqueio da rolagem do corpo. Blog “Em breve”, sem link vazio. Link de salto aparece ao foco; hash inicial realinha após fontes carregarem.

### Gallery and contact imagery

Galeria manual, sem autoplay. Setas/teclado rolam a faixa; controles desabilitados nas extremidades. Botões abrem `dialog` nativo com imagem, legenda/contador, setas esquerda/direita, Escape, fechamento por botão/backdrop e retorno do foco à foto de origem. Hover amplia foto em (1.025); legenda visível também ao foco e no celular. CTA usa `paisagem-contexto.jpg`, recorte de vegetação sem pessoas, não um pôr do sol inventado.

### Motion and implementation

Transições: links (180ms), botões/cards/menu (220ms), escala de foto (250ms). Sem reveal de entrada, autoplay ou parallax. `prefers-reduced-motion` remove animações/transições e troca rolagem suave por imediata. HTML/CSS com TypeScript compilado por `tsc` para `script.js`, sem framework. Reutilização por classes, atributos `data-*`, configuração tipada em `src/content.ts` e inicializadores em `src/main.ts`; não alegar biblioteca de componentes independente.

### Provenance and pending content

Quatro arquivos tratados fornecidos pelo usuário: curral, campo, escritório e visita. `assets/SOURCES.md` registra originais com nomes `Gemini_Generated_Image`, otimização JPEG e recorte do CTA. Autenticidade independente e autorização de publicação não confirmadas; não chamá-los de registros oficiais verificados. Não foram geradas novas pessoas/cenas nesta implementação.

`CONTEUDO-PENDENTE.md`: fotos específicas de geo/ambiental, panorama de pôr do sol, marca transparente, confirmação do fluxo, autorização das imagens e Blog. Dados do mockup não confirmados não substituem Henrik/Kadja, telefones (91) e e-mail existentes. Preservar qualificações/registros existentes; não atribuí-los às pessoas nas fotos. Legados `hero-rural.png` e logo com fundo removido por IA não integram a página.

## Do's and Don'ts

### Do:

- **Do** preservar a referência aprovada, as fontes Manrope/Inter e a paleta implementada.
- **Do** manter o logo original e registrar a origem de cada imagem publicada.
- **Do** preservar foco visível, labels, navegação por teclado e movimento reduzido.
- **Do** manter pendências explícitas e explicar a revisão da mensagem no WhatsApp.

### Don't:

- **Don't** inventar clientes, depoimentos, números, credenciais, projetos ou resultados.
- **Don't** certificar autenticidade ou autorização das imagens recebidas sem confirmação.
- **Don't** cobrir rostos com texto no hero móvel, automatizar a galeria ou ocultar conteúdo em reveals.
- **Don't** trocar contatos confirmados pelos dados do mockup, criar links vazios ou alegar envio/armazenamento pelo formulário.
