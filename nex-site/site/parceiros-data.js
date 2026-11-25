/* Rede de parceiros NEX: fonte única dos dados usados na Home (seção #parceiros),
   no diretório (parceiros.html → /parceiros) e no perfil de cada parceiro (parceiro.html → /parceiros/<slug>).
   Carregar depois de i18n/i18n.js.
   - Textos em pt-BR marcados com tx(); a tradução acontece na hora de mostrar, com t(). Texto novo aqui precisa
     de tradução em i18n/locales/*.js (confira com: node tools/i18n/check.mjs).
   - Para trocar a logo: coloque o arquivo em logos/parceiros/ e preencha `logo` (ex.: '/logos/parceiros/conexao.png').
     Sem logo, o card mostra as iniciais do parceiro.
   - As opções dos filtros (Regiões, Países, Idiomas) são montadas a partir destes dados.
   - contactUrl: link do WhatsApp do parceiro (https://wa.me/<número>). A mensagem pronta entra no idioma do visitante
     (contactMsg, ou a mensagem padrão com o nome do parceiro).

   ⚠ Os parceiros com `placeholder: true` são FICTÍCIOS, só para demonstrar o layout e os filtros.
     Substitua ou remova antes de publicar. */

/**
 * @typedef {Object} NexPartner
 * @property {string}   id
 * @property {string}   name              Nome (não é traduzido)
 * @property {string}   slug              Usado no endereço /parceiros/<slug>
 * @property {string}   logo              Caminho da imagem ('' = usa as iniciais)
 * @property {boolean}  featured          Destaque fixo (sempre o primeiro da lista)
 * @property {string}   badge             Selo de certificação
 * @property {string}   tagline           Frase curta do perfil
 * @property {string}   shortDescription
 * @property {string}   fullDescription
 * @property {string[]} specialties       Tags exibidas nos cards (Home)
 * @property {string[]} segments          Segmentos atendidos
 * @property {string[]} services          "Serviços que oferecemos" (perfil)
 * @property {string[]} regions           Filtro "Regiões" (valores de REGIONS)
 * @property {string[]} countries         Filtro "Países"
 * @property {string[]} languages         Filtro "Idiomas"
 * @property {string}   location
 * @property {string}   contactUrl        Link de contato (WhatsApp, sem ?text=)
 * @property {string}   [contactMsg]      Mensagem pronta do WhatsApp (padrão: "…quero falar com o parceiro <nome>.")
 * @property {string}   [website]
 * @property {boolean}  [placeholder]     true = dado fictício de demonstração
 */

(function () {
  var t = NEX_I18N.t, tx = NEX_I18N.tx;
  /** true  = endereços limpos (/parceiros e /parceiros/<slug>); exige a regra de reescrita no servidor (nex-site/nginx.conf).
      false = /parceiros.html e /parceiro.html?p=<slug>; funciona em qualquer hospedagem, sem configurar nada. */
  var CLEAN_URLS = true;
  var NEX_WA = '5587988578910';
  var NEX_WA_URL = 'https://wa.me/' + NEX_WA;

  /** Ordem oficial das regiões (mesma nomenclatura do mercado). */
  var REGIONS = [tx('América Central e do Sul'), tx('América do Norte e Canadá'), tx('Europa, Oriente Médio e África'), tx('Ásia-Pacífico')];
  /** Opções do campo "Segmento" do formulário "Contratar um parceiro". */
  var SEGMENTS = [tx('Saúde'), tx('Imobiliário'), tx('E-commerce'), tx('B2B'), tx('Serviços'), tx('Educação'), tx('Outro')];

  /** @type {NexPartner[]} */
  var PARTNERS = [
    {
      id: 'conexao',
      name: 'Assessoria Conexão',
      slug: 'assessoria-conexao',
      logo: '',
      featured: true,
      badge: tx('Parceiro Oficial'),
      tagline: tx('Implantação completa da NEX, do anúncio ao fechamento'),
      shortDescription: tx('A assessoria onde a NEX nasceu. Implanta o CRM, configura o Agente de IA, treina o seu time e liga o tráfego pago ao atendimento.'),
      fullDescription: tx('A Conexão Marketing e Tecnologia gera clientes para empresas há anos com tráfego pago e estratégia, e foi dentro dela que a NEX foi criada. Como parceira oficial, ela cuida da implantação completa: configura funis e o Agente de IA com as informações do seu negócio, monta as automações, integra seus anúncios da Meta para marcar a origem de cada lead, treina a equipe e acompanha os resultados depois da virada.'),
      specialties: [tx('Implementação'), tx('Automação'), tx('Integrações API'), tx('Treinamento'), tx('Tráfego pago')],
      segments: [tx('Saúde'), tx('Imobiliário'), tx('Serviços'), tx('B2B'), tx('E-commerce')],
      services: [tx('Implantação completa da NEX'), tx('Configuração do Agente de IA'), tx('Automações e fluxos de atendimento'), tx('Integração com Meta Ads (Lead Ads)'), tx('Migração de outro CRM'), tx('Treinamento da equipe comercial'), tx('Gestão de tráfego pago')],
      regions: [tx('América Central e do Sul')], countries: [tx('Brasil')], languages: [tx('Português')],
      location: tx('Petrolina (PE), Brasil · Presencial e remoto'),
      contactUrl: NEX_WA_URL,
      contactMsg: tx('Olá! Vim pela página de parceiros da NEX e quero falar com a Assessoria Conexão sobre a implantação da NEX.')
    },
    {
      id: 'vertice', name: 'Vértice Automação Comercial', slug: 'vertice-automacao', logo: '', featured: false, placeholder: true,
      badge: tx('Parceiro Certificado'), tagline: tx('Automação de pré-venda para empresas B2B'),
      shortDescription: tx('Desenha fluxos de atendimento e automações para equipes comerciais que vendem para outras empresas.'),
      fullDescription: tx('Especialista em automação de pré-venda: qualificação por perguntas, distribuição de leads entre vendedores, follow-up automático e integrações com ERPs e planilhas via API.'),
      specialties: [tx('Automação'), tx('Integrações API')], segments: [tx('B2B'), tx('Serviços')],
      services: [tx('Automações de qualificação'), tx('Distribuição de leads'), tx('Integrações via API'), tx('Follow-up automático')],
      regions: [tx('América Central e do Sul')], countries: [tx('Brasil'), tx('Argentina')], languages: [tx('Português'), tx('Espanhol')],
      location: tx('Curitiba (PR), Brasil · Remoto'), contactUrl: NEX_WA_URL
    },
    {
      id: 'pulso', name: 'Pulso Consultoria para Clínicas', slug: 'pulso-clinicas', logo: '', featured: false, placeholder: true,
      badge: tx('Parceiro Certificado'), tagline: tx('CRM e atendimento para clínicas e consultórios'),
      shortDescription: tx('Implanta a NEX em clínicas e consultórios, com agenda, confirmação de consulta e recepção treinada.'),
      fullDescription: tx('Foco em saúde: configura o Agente de IA para tirar dúvidas e marcar horários, conecta a agenda da clínica e treina a recepção para usar o funil e as conversas no dia a dia.'),
      specialties: [tx('Implementação'), tx('Treinamento')], segments: [tx('Saúde')],
      services: [tx('Implantação para clínicas'), tx('Agente de IA para agendamento'), tx('Integração com agenda'), tx('Treinamento da recepção')],
      regions: [tx('América Central e do Sul')], countries: [tx('Brasil')], languages: [tx('Português')],
      location: tx('Recife (PE), Brasil · Presencial e remoto'), contactUrl: NEX_WA_URL
    },
    {
      id: 'chave', name: 'Chave Digital Imóveis', slug: 'chave-digital', logo: '', featured: false, placeholder: true,
      badge: tx('Parceiro Certificado'), tagline: tx('Comercial organizado para imobiliárias e corretores'),
      shortDescription: tx('Estrutura o comercial de imobiliárias e corretores: captação, visitas e acompanhamento de cada proposta.'),
      fullDescription: tx('Monta funis por tipo de imóvel, automatiza o retorno a leads de portais e anúncios e organiza a agenda de visitas dos corretores dentro da NEX.'),
      specialties: [tx('Implementação'), tx('Automação')], segments: [tx('Imobiliário')],
      services: [tx('Funis por tipo de imóvel'), tx('Retorno automático a leads de portais'), tx('Agenda de visitas'), tx('Treinamento de corretores')],
      regions: [tx('América Central e do Sul')], countries: [tx('Brasil')], languages: [tx('Português')],
      location: tx('São Paulo (SP), Brasil · Remoto'), contactUrl: NEX_WA_URL
    },
    {
      id: 'rota', name: 'Rota B2B Vendas', slug: 'rota-b2b', logo: '', featured: false, placeholder: true,
      badge: tx('Parceiro Certificado'), tagline: tx('Processo comercial e treinamento de vendas'),
      shortDescription: tx('Treina times de vendas para usar o CRM com método: cadência, registro e previsibilidade.'),
      fullDescription: tx('Consultoria de processo comercial. Define etapas do funil, rotina de follow-up e indicadores, e treina vendedores e gestores para tirar relatórios confiáveis da NEX.'),
      specialties: [tx('Treinamento'), tx('Implementação')], segments: [tx('B2B'), tx('Serviços')],
      services: [tx('Desenho do processo comercial'), tx('Cadência de follow-up'), tx('Indicadores e relatórios'), tx('Treinamento de vendedores e gestores')],
      regions: [tx('Europa, Oriente Médio e África'), tx('América Central e do Sul')], countries: [tx('Portugal'), tx('Brasil')], languages: [tx('Português'), tx('Inglês')],
      location: tx('Lisboa, Portugal · Remoto'), contactUrl: NEX_WA_URL
    },
    {
      id: 'carrinho', name: 'Carrinho Cheio E-commerce', slug: 'carrinho-cheio', logo: '', featured: false, placeholder: true,
      badge: tx('Parceiro Certificado'), tagline: tx('NEX integrada à sua loja virtual'),
      shortDescription: tx('Conecta loja virtual, WhatsApp e NEX para recuperar carrinhos e responder clientes na hora.'),
      fullDescription: tx('Integra plataformas de e-commerce à NEX via API, cria automações de carrinho abandonado e pós-venda e configura o atendimento por IA para dúvidas de pedido e entrega.'),
      specialties: [tx('Integrações API'), tx('Automação')], segments: [tx('E-commerce')],
      services: [tx('Integração com plataformas de e-commerce'), tx('Recuperação de carrinho abandonado'), tx('Automação de pós-venda'), tx('Agente de IA para pedidos e entregas')],
      regions: [tx('América Central e do Sul')], countries: [tx('Brasil'), tx('Chile')], languages: [tx('Português'), tx('Espanhol')],
      location: tx('Florianópolis (SC), Brasil · Remoto'), contactUrl: NEX_WA_URL
    }
  ];

  /** Iniciais para o avatar quando não há logo. */
  function initials(name) {
    return name.replace(/^(Assessoria|Consultoria)\s+/i, '').split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join('').toUpperCase();
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  /** HTML do logo (imagem ou iniciais). */
  function logoHTML(p, cls) {
    cls = cls || 'pt-logo';
    return p.logo
      ? '<span class="' + cls + '"><img src="' + esc(p.logo) + '" alt="" loading="lazy"></span>'
      : '<span class="' + cls + '" aria-hidden="true">' + esc(initials(p.name)) + '</span>';
  }
  /** Valores únicos de um campo, na ordem preferida (se houver) e depois em ordem alfabética (no idioma da página). */
  function options(field, preferred) {
    var seen = {};
    PARTNERS.forEach(function (p) { (p[field] || []).forEach(function (v) { seen[v] = 1; }); });
    var vals = Object.keys(seen);
    var rank = function (v) { var i = (preferred || []).indexOf(v); return i < 0 ? 999 : i; };
    return vals.sort(function (a, b) { return rank(a) - rank(b) || t(a).localeCompare(t(b), NEX_I18N.lang); });
  }
  /** Parceiros com o destaque sempre primeiro. */
  function ordered() {
    return PARTNERS.slice().sort(function (a, b) { return (b.featured === true) - (a.featured === true); });
  }
  /** Veio com ?lang= no endereço: os links internos levam o idioma junto (os montados depois do NEX_I18N.apply() também). */
  function withLang(url) {
    if (!new URLSearchParams(location.search).has('lang')) return url;
    return url + (url.indexOf('?') < 0 ? '?' : '&') + 'lang=' + encodeURIComponent(NEX_I18N.lang);
  }
  /** Link do WhatsApp com a mensagem pronta no idioma do visitante. */
  function wa(text) { return NEX_WA_URL + '?text=' + encodeURIComponent(text); }
  function contactHref(p) {
    var msg = p.contactMsg ? t(p.contactMsg) : t('Olá! Vim pela página de parceiros da NEX e quero falar com o parceiro {{nome}}.', { nome: p.name });
    return p.contactUrl + (p.contactUrl.indexOf('?') < 0 ? '?' : '&') + 'text=' + encodeURIComponent(msg);
  }

  /* Sem endereços limpos: os links fixos para /parceiros (menu, rodapé, Home) passam a apontar para /parceiros.html. */
  if (!CLEAN_URLS) document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var u = new URL(a.href, location.href);
      if (u.origin === location.origin && u.pathname === '/parceiros') { u.pathname = '/parceiros.html'; a.href = u.href; }
    });
  });

  window.NEX_PARTNERS = PARTNERS;
  window.NEX_PARTNER_REGIONS = REGIONS;
  window.NEX_PARTNER_SEGMENTS = SEGMENTS;
  window.NEX_WA = NEX_WA;
  window.nexPartners = {
    initials: initials, esc: esc, logoHTML: logoHTML, ordered: ordered, wa: wa, contactHref: contactHref,
    regions: function () { return options('regions', REGIONS); },
    countries: function () { return options('countries', ['Brasil']); },
    languages: function () { return options('languages', ['Português']); },
    bySlug: function (slug) { return PARTNERS.filter(function (p) { return p.slug === slug; })[0] || null; },
    profileUrl: function (p) { return withLang(CLEAN_URLS ? '/parceiros/' + encodeURIComponent(p.slug) : '/parceiro.html?p=' + encodeURIComponent(p.slug)); },
    dirUrl: function () { return withLang(CLEAN_URLS ? '/parceiros' : '/parceiros.html'); }
  };
})();
