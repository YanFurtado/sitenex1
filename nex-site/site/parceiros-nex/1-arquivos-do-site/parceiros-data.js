/* Rede de parceiros NEX: fonte única dos dados usados na Home (seção #parceiros),
   no diretório (parceiros.html) e no perfil de cada parceiro (parceiro.html → /parceiros/<slug>).
   Para trocar a logo: coloque o arquivo em logos/parceiros/ e preencha `logo` (ex.: '/logos/parceiros/conexao.png').
   Sem logo, o card mostra as iniciais do parceiro.
   As opções dos filtros (Regiões, Países, Idiomas) são montadas a partir destes dados.

   ⚠ Os parceiros com `placeholder: true` são FICTÍCIOS, só para demonstrar o layout e os filtros.
     Substitua ou remova antes de publicar. */

/**
 * @typedef {Object} NexPartner
 * @property {string}   id
 * @property {string}   name
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
 * @property {string[]} regions           Filtro "Regiões" (valores de NEX_PARTNER_REGIONS)
 * @property {string[]} countries         Filtro "Países"
 * @property {string[]} languages         Filtro "Idiomas"
 * @property {string}   location
 * @property {string}   contactUrl        Link de contato (WhatsApp)
 * @property {string}   [website]
 * @property {boolean}  [placeholder]     true = dado fictício de demonstração
 */

(function () {
  /** true  = endereços limpos (/parceiros e /parceiros/<slug>); exige a regra de reescrita no servidor (nginx, Apache etc.).
      false = /parceiros.html e /parceiro.html?p=<slug>; funciona em qualquer hospedagem, sem configurar nada. */
  var CLEAN_URLS = true;
  var NEX_WA = '5587988578910';
  var wa = function (text) { return 'https://wa.me/' + NEX_WA + '?text=' + encodeURIComponent(text); };
  var viaNex = function (name) { return wa('Olá! Vim pela página de parceiros da NEX e quero falar com o parceiro ' + name + '.'); };

  /** Ordem oficial das regiões (mesma nomenclatura do mercado). */
  var REGIONS = ['América Central e do Sul', 'América do Norte e Canadá', 'Europa, Oriente Médio e África', 'Ásia-Pacífico'];
  /** Opções do campo "Segmento" do formulário "Contratar um parceiro". */
  var SEGMENTS = ['Saúde', 'Imobiliário', 'E-commerce', 'B2B', 'Serviços', 'Educação', 'Outro'];

  /** @type {NexPartner[]} */
  var PARTNERS = [
    {
      id: 'conexao',
      name: 'Assessoria Conexão',
      slug: 'assessoria-conexao',
      logo: '',
      featured: true,
      badge: 'Parceiro Oficial',
      tagline: 'Implantação completa da NEX, do anúncio ao fechamento',
      shortDescription: 'A assessoria onde a NEX nasceu. Implanta o CRM, configura o Agente de IA, treina o seu time e liga o tráfego pago ao atendimento.',
      fullDescription: 'A Conexão Marketing e Tecnologia gera clientes para empresas há anos com tráfego pago e estratégia, e foi dentro dela que a NEX foi criada. Como parceira oficial, ela cuida da implantação completa: configura funis e o Agente de IA com as informações do seu negócio, monta as automações, integra seus anúncios da Meta para marcar a origem de cada lead, treina a equipe e acompanha os resultados depois da virada.',
      specialties: ['Implementação', 'Automação', 'Integrações API', 'Treinamento', 'Tráfego pago'],
      segments: ['Saúde', 'Imobiliário', 'Serviços', 'B2B', 'E-commerce'],
      services: ['Implantação completa da NEX', 'Configuração do Agente de IA', 'Automações e fluxos de atendimento', 'Integração com Meta Ads (Lead Ads)', 'Migração de outro CRM', 'Treinamento da equipe comercial', 'Gestão de tráfego pago'],
      regions: ['América Central e do Sul'], countries: ['Brasil'], languages: ['Português'],
      location: 'Petrolina (PE), Brasil · Presencial e remoto',
      contactUrl: wa('Olá! Vim pela página de parceiros da NEX e quero falar com a Assessoria Conexão sobre a implantação da NEX.')
    },
    {
      id: 'vertice', name: 'Vértice Automação Comercial', slug: 'vertice-automacao', logo: '', featured: false, placeholder: true,
      badge: 'Parceiro Certificado', tagline: 'Automação de pré-venda para empresas B2B',
      shortDescription: 'Desenha fluxos de atendimento e automações para equipes comerciais que vendem para outras empresas.',
      fullDescription: 'Especialista em automação de pré-venda: qualificação por perguntas, distribuição de leads entre vendedores, follow-up automático e integrações com ERPs e planilhas via API.',
      specialties: ['Automação', 'Integrações API'], segments: ['B2B', 'Serviços'],
      services: ['Automações de qualificação', 'Distribuição de leads', 'Integrações via API', 'Follow-up automático'],
      regions: ['América Central e do Sul'], countries: ['Brasil', 'Argentina'], languages: ['Português', 'Espanhol'],
      location: 'Curitiba (PR), Brasil · Remoto', contactUrl: viaNex('Vértice Automação Comercial')
    },
    {
      id: 'pulso', name: 'Pulso Consultoria para Clínicas', slug: 'pulso-clinicas', logo: '', featured: false, placeholder: true,
      badge: 'Parceiro Certificado', tagline: 'CRM e atendimento para clínicas e consultórios',
      shortDescription: 'Implanta a NEX em clínicas e consultórios, com agenda, confirmação de consulta e recepção treinada.',
      fullDescription: 'Foco em saúde: configura o Agente de IA para tirar dúvidas e marcar horários, conecta a agenda da clínica e treina a recepção para usar o funil e as conversas no dia a dia.',
      specialties: ['Implementação', 'Treinamento'], segments: ['Saúde'],
      services: ['Implantação para clínicas', 'Agente de IA para agendamento', 'Integração com agenda', 'Treinamento da recepção'],
      regions: ['América Central e do Sul'], countries: ['Brasil'], languages: ['Português'],
      location: 'Recife (PE), Brasil · Presencial e remoto', contactUrl: viaNex('Pulso Consultoria para Clínicas')
    },
    {
      id: 'chave', name: 'Chave Digital Imóveis', slug: 'chave-digital', logo: '', featured: false, placeholder: true,
      badge: 'Parceiro Certificado', tagline: 'Comercial organizado para imobiliárias e corretores',
      shortDescription: 'Estrutura o comercial de imobiliárias e corretores: captação, visitas e acompanhamento de cada proposta.',
      fullDescription: 'Monta funis por tipo de imóvel, automatiza o retorno a leads de portais e anúncios e organiza a agenda de visitas dos corretores dentro da NEX.',
      specialties: ['Implementação', 'Automação'], segments: ['Imobiliário'],
      services: ['Funis por tipo de imóvel', 'Retorno automático a leads de portais', 'Agenda de visitas', 'Treinamento de corretores'],
      regions: ['América Central e do Sul'], countries: ['Brasil'], languages: ['Português'],
      location: 'São Paulo (SP), Brasil · Remoto', contactUrl: viaNex('Chave Digital Imóveis')
    },
    {
      id: 'rota', name: 'Rota B2B Vendas', slug: 'rota-b2b', logo: '', featured: false, placeholder: true,
      badge: 'Parceiro Certificado', tagline: 'Processo comercial e treinamento de vendas',
      shortDescription: 'Treina times de vendas para usar o CRM com método: cadência, registro e previsibilidade.',
      fullDescription: 'Consultoria de processo comercial. Define etapas do funil, rotina de follow-up e indicadores, e treina vendedores e gestores para tirar relatórios confiáveis da NEX.',
      specialties: ['Treinamento', 'Implementação'], segments: ['B2B', 'Serviços'],
      services: ['Desenho do processo comercial', 'Cadência de follow-up', 'Indicadores e relatórios', 'Treinamento de vendedores e gestores'],
      regions: ['Europa, Oriente Médio e África', 'América Central e do Sul'], countries: ['Portugal', 'Brasil'], languages: ['Português', 'Inglês'],
      location: 'Lisboa, Portugal · Remoto', contactUrl: viaNex('Rota B2B Vendas')
    },
    {
      id: 'carrinho', name: 'Carrinho Cheio E-commerce', slug: 'carrinho-cheio', logo: '', featured: false, placeholder: true,
      badge: 'Parceiro Certificado', tagline: 'NEX integrada à sua loja virtual',
      shortDescription: 'Conecta loja virtual, WhatsApp e NEX para recuperar carrinhos e responder clientes na hora.',
      fullDescription: 'Integra plataformas de e-commerce à NEX via API, cria automações de carrinho abandonado e pós-venda e configura o atendimento por IA para dúvidas de pedido e entrega.',
      specialties: ['Integrações API', 'Automação'], segments: ['E-commerce'],
      services: ['Integração com plataformas de e-commerce', 'Recuperação de carrinho abandonado', 'Automação de pós-venda', 'Agente de IA para pedidos e entregas'],
      regions: ['América Central e do Sul'], countries: ['Brasil', 'Chile'], languages: ['Português', 'Espanhol'],
      location: 'Florianópolis (SC), Brasil · Remoto', contactUrl: viaNex('Carrinho Cheio E-commerce')
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
  /** Valores únicos de um campo, na ordem preferida (se houver) e depois em ordem alfabética. */
  function options(field, preferred) {
    var seen = {};
    PARTNERS.forEach(function (p) { (p[field] || []).forEach(function (v) { seen[v] = 1; }); });
    var vals = Object.keys(seen);
    var rank = function (v) { var i = (preferred || []).indexOf(v); return i < 0 ? 999 : i; };
    return vals.sort(function (a, b) { return rank(a) - rank(b) || a.localeCompare(b, 'pt-BR'); });
  }
  /** Parceiros com o destaque sempre primeiro. */
  function ordered() {
    return PARTNERS.slice().sort(function (a, b) { return (b.featured === true) - (a.featured === true); });
  }

  window.NEX_PARTNERS = PARTNERS;
  window.NEX_PARTNER_REGIONS = REGIONS;
  window.NEX_PARTNER_SEGMENTS = SEGMENTS;
  window.NEX_WA = NEX_WA;
  window.nexPartners = {
    initials: initials, esc: esc, logoHTML: logoHTML, ordered: ordered,
    regions: function () { return options('regions', REGIONS); },
    countries: function () { return options('countries', ['Brasil']); },
    languages: function () { return options('languages', ['Português']); },
    bySlug: function (slug) { return PARTNERS.filter(function (p) { return p.slug === slug; })[0] || null; },
    profileUrl: function (p) { return CLEAN_URLS ? '/parceiros/' + encodeURIComponent(p.slug) : '/parceiro.html?p=' + encodeURIComponent(p.slug); },
    dirUrl: function () { return CLEAN_URLS ? '/parceiros' : '/parceiros.html'; }
  };
})();
