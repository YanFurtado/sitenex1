# Pacote "Parceiros NEX" para levar a outro site

Este pacote leva para outro site da NEX tudo o que foi feito no site de vendas (nex-vendas):

- **Diretório de parceiros** no formato do Kommo: hero, filtros por Regiões, Países e Idiomas, e grade de logos.
- **Página de perfil** de cada parceiro.
- **Formulário "Contratar um parceiro"** em 2 etapas, que envia o pedido pelo WhatsApp.
- **Seção "Rede de parceiros"** para a Home.
- **Link "Parceiros"** no menu, com menu para celular.

As páginas são HTML, CSS e JavaScript puros, sem dependências nem build. Funcionam em qualquer hospedagem.

---

## O que tem no ZIP

```
parceiros-nex/
├── LEIA-ME.md                      este guia
├── 1-arquivos-do-site/             copie TUDO para a raiz pública do site
│   ├── parceiros.html              diretório (/parceiros)
│   ├── parceiro.html               modelo único do perfil (/parceiros/<nome>)
│   ├── parceiros-data.js           ★ dados dos parceiros (o único arquivo que se edita no dia a dia)
│   ├── parceiros.css               visual da seção, do diretório, do perfil e do menu mobile
│   ├── nex-nav.js                  menu do celular
│   ├── nex-pixel.js                Meta Pixel 4820743728147875 (só carrega com aceite de cookies)
│   ├── nex-cookies.js / .css       aviso de cookies (LGPD)
│   ├── equipe-especializada.webp   foto do hero do diretório
│   └── favicon.ico, favicon.png, apple-touch-icon.png
├── 2-trechos-para-colar/
│   ├── home-secao-parceiros.html   seção "Rede de parceiros" para a Home
│   ├── menu-link-parceiros.html    link "Parceiros" para o menu e o rodapé
│   └── parceiros-home-base.css     visual base da seção (só se o site não usar o design da NEX)
└── 3-servidor/                     regra para os endereços /parceiros (escolha a da sua hospedagem)
    ├── nginx.conf
    ├── apache.htaccess
    ├── netlify_redirects
    └── vercel.json
```

---

## Passo a passo

### 1. Copiar os arquivos
Copie o conteúdo de `1-arquivos-do-site/` para a **raiz pública** do outro site: a mesma pasta onde fica o `index.html` dele.

- Se o site já tiver os ícones `favicon.ico`, `favicon.png` e `apple-touch-icon.png`, mantenha os dele e não sobrescreva.
- **Atenção:** o perfil (`parceiro.html`) usa caminhos que começam com `/` (`/parceiros.css`, `/nex-pixel.js`…). Por isso os arquivos precisam ficar na raiz, e não numa subpasta.

### 2. Configurar os endereços `/parceiros`
Escolha **uma** das opções.

**A) Endereços limpos (recomendado).** O diretório fica em `/parceiros` e cada perfil em `/parceiros/<nome>`.
1. Use o arquivo de `3-servidor/` que corresponde à hospedagem:

| Hospedagem | O que fazer |
|---|---|
| **nginx** (Docker, VPS) | Copie os 2 blocos de `nginx.conf` para dentro do `server { }`, **antes** do `location /`. Reinicie o nginx. |
| **Apache** (Hostinger, HostGator, Locaweb, cPanel) | Copie as linhas de `apache.htaccess` para o `.htaccess` da raiz. Se ele não existir, renomeie o arquivo para `.htaccess`. |
| **Netlify** | Copie as linhas de `netlify_redirects` para o arquivo `_redirects` da raiz. |
| **Vercel** | Junte o conteúdo de `vercel.json` ao `vercel.json` do projeto. |

2. Deixe `CLEAN_URLS = true` no topo de `parceiros-data.js`. Já vem assim.

**B) Sem mexer no servidor.** Use esta opção se não tiver acesso à configuração do servidor.
1. Em `parceiros-data.js`, troque `var CLEAN_URLS = true;` por `var CLEAN_URLS = false;`.
2. Nos links para o diretório, use `/parceiros.html`. O perfil passa a ser `/parceiro.html?p=<nome>`.

### 3. Colocar a seção na Home
Abra `2-trechos-para-colar/home-secao-parceiros.html`. Ele tem 3 blocos:

1. **`<head>`:** as linhas que vão no `<head>` da Home (fonte e CSS).
2. **Seção:** cole onde quiser na Home. O recomendado é antes do CTA final ou do rodapé.
3. **Scripts:** cole antes do `</body>`.

Se o outro site **não** usa o design da NEX (classes `.btn`, `.purple-card`, `.sec-head`, `.eyebrow`):
1. Copie `2-trechos-para-colar/parceiros-home-base.css` para a raiz do site.
2. Tire do comentário a linha dele no bloco `<head>` do trecho.

- Esse arquivo só afeta o que está dentro da seção `#parceiros` e não muda o resto do site.

### 4. Adicionar o link no menu
Use `2-trechos-para-colar/menu-link-parceiros.html`. Ele mostra como colocar o link no menu do topo, no rodapé e, se quiser, o botão do menu do celular.

### 5. Ajustar o topo e o rodapé das páginas novas
`parceiros.html` e `parceiro.html` trazem **o topo e o rodapé do site de vendas**, com links para `/#sistema`, `/#ia`, `/#planos`, `/#quem-somos` e `/#faq`.

- Se o outro site não tiver essas seções, troque esses links pelos do menu dele, ou cole o `<header>` e o `<footer>` do outro site no lugar.
- O resto da página não depende disso.

### 6. Conferir Pixel, cookies e WhatsApp
- **Meta Pixel:** `nex-pixel.js` já tem o ID `4820743728147875`. Os botões disparam os eventos:
  - `Contact` em "Falar/Contatar parceiro" e "Quero ser parceiro";
  - `Lead` no envio do formulário.

  Se o outro site **já instala o Pixel de outro jeito**, não carregue o pixel duas vezes. Remova a parte de carregamento do `nex-pixel.js` e mantenha só a função `trackMetaEvent`, ou peça ajuda.
- **Cookies:** se o outro site **já tem** aviso de cookies, remova `nex-cookies.js` e `nex-cookies.css` das páginas para não aparecerem dois avisos.
  - Nesse caso, o aviso existente precisa chamar `nexPixel.setConsent(true)` quando a pessoa aceitar.
- **WhatsApp:** os contatos vão para **5587988578910**.
  - Para trocar, altere `NEX_WA` em `parceiros-data.js`.
  - Faça também um "localizar e substituir" de `5587988578910` em `parceiros.html` e `parceiro.html`.

---

## Como adicionar, editar ou remover um parceiro

Tudo fica em **`parceiros-data.js`**, na lista `PARTNERS`. Para adicionar um parceiro, copie um bloco `{ ... }` existente e altere os campos:

| Campo | O que é |
|---|---|
| `name` / `slug` | Nome e endereço (`slug: 'minha-empresa'` vira `/parceiros/minha-empresa`). Use só letras minúsculas, números e hífen. |
| `logo` | `'/logos/parceiros/minha-empresa.png'`. Se ficar vazio (`''`), aparecem as iniciais. |
| `featured` | `true` só para o parceiro em destaque (a Assessoria Conexão). Ele aparece sempre primeiro. |
| `badge` | Selo: "Parceiro Oficial" ou "Parceiro Certificado". |
| `tagline`, `shortDescription`, `fullDescription` | Frase curta, resumo e texto completo do perfil. |
| `regions`, `countries`, `languages` | Alimentam os filtros. As opções dos menus aparecem sozinhas a partir daqui. |
| `services`, `segments`, `specialties` | Listas do perfil e tags da Home. |
| `location`, `contactUrl`, `website` | Cidade, link do WhatsApp do parceiro e site (opcional). |

Para remover um parceiro, apague o bloco dele.

### ⚠ Antes de publicar
Os 5 parceiros marcados com `placeholder: true` são **fictícios**:
- Vértice Automação Comercial
- Pulso Consultoria para Clínicas
- Chave Digital Imóveis
- Rota B2B Vendas
- Carrinho Cheio E-commerce

Eles servem só para mostrar o layout e testar os filtros. **Troque pelos parceiros reais ou apague** antes de colocar o site no ar.

---

## Como testar
1. Abra `/parceiros`:
   - a Assessoria Conexão aparece primeiro;
   - os filtros mudam o contador "N resultados encontrados";
   - "Redefinir" volta para todos.
2. Clique num parceiro. O perfil abre em `/parceiros/<nome>` e "Voltar para parceiros" funciona.
3. Clique em "Contratar um parceiro", preencha as 2 etapas e confira se o botão do WhatsApp abre com a mensagem preenchida.
4. Teste no celular, com largura menor que 820px: o botão ☰ abre o menu.
5. Aceite os cookies e confira os eventos no Gerenciador de Eventos da Meta → "Testar eventos" (ou com a extensão Meta Pixel Helper).
