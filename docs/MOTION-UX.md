# Motion e conversão — HP Engenharia

Implementado em 16/10/2026, preservando identidade, fotografias e estrutura aprovada.

## Implementação

- Header compacto no desktop após 120 px; retorna abaixo de 80 px. Transição de 360 ms. A topbar sai com a rolagem natural; a navbar não ocupa novo espaço no fluxo. Mobile preservado, com nomes e sem números no topo.
- Hero: título, descrição e ações entram com deslocamento de 16 px, duração de 1000 ms e atraso máximo de 180 ms. Foto estável.
- Serviços, processo, sobre e CTA final: IntersectionObserver com threshold 0,1, entrada única de 20 px/900 ms e stagger de 120 ms. Cada elemento deixa de ser observado após entrar. O estado base permanece visível; foco cancela animações que possam ocultar controles.
- Cartões: elevação de 3 px, zoom de 1,03 e setas deslocando 3 px, apenas com mouse. Estados de foco e toque preservados.
- Galeria: rolagem nativa com scroll-snap, controles e teclado; sem autoplay. Âncoras mantêm histórico e URL, compensando 112 px no desktop e 20 px no mobile.

CSS, IntersectionObserver e Web Animations API nativas; nenhuma dependência adicionada. Respeita prefers-reduced-motion, inclusive alterações durante a sessão. Dispositivos que reportam até dois processadores lógicos também dispensam as entradas. Sem will-change permanente ou animação contínua.

Arquivos: index.html, styles.css, src/main.ts e script.js compilado.

## CTAs

- Header: Falar com a equipe.
- Hero: Conversar sobre minha propriedade.
- Crédito: Consultar crédito rural.
- Georreferenciamento: Solicitar orientação.
- Ambiental: Falar sobre minha demanda.
- Regularização: Orientar minha regularização.
- Contato final: Conversar com a equipe.

Mensagens por contexto e números oficiais preservados. URLs de WhatsApp incluídas no HTML para funcionamento sem JavaScript. Nesse modo, a navegação mobile permanece visível e o formulário dependente de script fica oculto.

## Verificação

- npm run check, npm run build e os três testes de npm test aprovados. Não há lint configurado.
- tests/responsive-top.cjs: oito resoluções, menu, Escape, foco, contatos e overflow.
- tests/motion.cjs: 320×568, 360×800, 390×844, 430×932, 768×1024, 1440×900 e 1920×1080. Verifica animação do hero, compactação do header sem deslocar a página, revelação única, âncoras, galeria por teclado, URLs/mensagens de WhatsApp, movimento reduzido, erros JavaScript e navegação/conversão sem JavaScript.
- Capturas reais em docs/motion-capturas: inicial, serviços, processo, contato e sem JavaScript. Métricas locais em resultados.json; não representam auditoria de produção.

Testes de navegador usam Playwright do runtime, sem instalação no projeto. Requerem servidor em http://127.0.0.1:8000. HP_PLAYWRIGHT_PATH indica o módulo do runtime; HP_CHROMIUM_PATH indica o Chromium.

Nenhuma pendência de implementação identificada. Destinos e mensagens de WhatsApp são conferidos sem enviar conversas.
