# HP Engenharia — home aprovada

Site estático em HTML/CSS com interações em TypeScript. A composição segue a referência Homepage HP Engenharia_ Soluções Rurais.png fornecida pelo usuário.

## Desenvolvimento

- npm ci (Node.js 22 ou superior).
- npm run check — verificação estrita de TypeScript.
- npm run build — compila src/content.ts e src/main.ts em script.js.
- npm test — verifica âncoras, recursos HTTP e contatos; requer servidor local em 127.0.0.1:8000.

Para prévia: python -m http.server 8000. Publique index.html, styles.css, script.js e os arquivos utilizados de assets/ em hospedagem estática. Não é necessário publicar node_modules/, src/, tests/ ou .impeccable/.

## Conteúdo e componentes

- index.html: estrutura semântica das seções e conteúdo indexável.
- styles.css: tokens, componentes e cinco tamanhos responsivos.
- src/content.ts: contatos e canais opcionais.
- src/main.ts: configuração de conteúdo, menu, formulário, galeria e âncoras.
- script.js: saída compilada; editar o TypeScript e compilar.
- assets/SOURCES.md: origem das imagens fornecidas e seus tratamentos técnicos.
- CONTEUDO-PENDENTE.md: diferenças de conteúdo em relação à referência.

O formulário monta uma mensagem no WhatsApp; não armazena dados. A galeria usa diálogo nativo, navegação por teclado e controle manual. Fotografias foram redimensionadas/comprimidas, sem editar pessoas. A logo original permanece inalterada.

O acabamento de movimento usa CSS, IntersectionObserver e Web Animations API, sem dependências adicionais. Detalhes, CTAs e validações em docs/MOTION-UX.md. As entradas respeitam movimento reduzido; navegação e contato também funcionam sem JavaScript.

## GitHub

O repositório inclui fontes TypeScript, JavaScript compilado, assets utilizados, documentação e testes. Dependências, configurações locais de ferramentas, capturas de testes e imagens legadas ficam fora do Git; permanecem no computador.

Após criar um repositório vazio no GitHub, configure a URL real e envie a branch principal:

```sh
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Se origin já existir, confira com `git remote -v` antes de alterar sua configuração. Não envie senhas, tokens ou arquivos .env.

O workflow `.github/workflows/validate.yml` executa instalação reproduzível, verificação de tipos, build, conferência do JavaScript compilado e os testes existentes a cada push e pull request. Não publica o site automaticamente. Os testes visuais locais são documentados em docs/MOTION-UX.md e usam o navegador disponível no ambiente de desenvolvimento.

## Publicação estática

O site não precisa de servidor Node em produção. Execute `npm run build`: o TypeScript é compilado e a pasta `dist/` é recriada com apenas os nove arquivos públicos necessários. Publique o conteúdo de `dist/`. Fontes, dependências, documentação e imagens legadas ficam fora dessa pasta. Inclua o `script.js` atualizado no commit; `dist/` é gerada no build e ignorada pelo Git.

### Cloudflare Workers

O arquivo `wrangler.jsonc` configura o Worker `hpengenaria2` e publica somente `./dist`. O Wrangler executa `npm run build` antes do deploy, mesmo quando o painel não define um comando de build separado.

- Diretório raiz do projeto: raiz do repositório.
- Comando de build (se solicitado no painel): `npm run build`.
- Comando de deploy: `npx wrangler deploy`.
- Diretório de saída/assets: `dist` (nunca `.`).

Para deploy local autenticado: `npm run deploy`. Para prévia do Worker: `npm run preview`. O npx fornece o Wrangler, sem incluir uma nova dependência na aplicação. Em Cloudflare Pages, use `npm run build` e saída `dist`, sem comando de deploy do Wrangler.
