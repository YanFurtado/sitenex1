/* Confere as traduções do site (nex-site/site).
   Junta toda chave usada: textos do HTML (com as mesmas regras de i18n.js, rodando no jsdom) e chamadas
   t("…"), tx("…") e NEX_I18N.t("…") nos scripts, lidas pela árvore do TypeScript (comentários não contam).
   Falha quando: falta tradução, tradução vazia, {{variáveis}} ou <0>marcações</0> diferentes do original,
   número diferente (valores ficam no formato pt-BR), marca que sumiu, chave repetida, tradução que o código
   não usa mais, chave montada em tempo de execução ou erro de sintaxe.
   Uso (na raiz do repositório):  node tools/i18n/check.mjs            confere
                                  node tools/i18n/check.mjs --listar   lista as chaves e onde aparecem */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const SITE = fileURLToPath(new URL('../../nex-site/site/', import.meta.url));
const I18N = 'i18n/i18n.js';
const BRANDS = ['NEX', 'Conexão | Marketing e Tecnologia', 'Conexão', 'Cnx Marketing e Tecnologia', 'M. Leite Empreendimento em Marketing Ltda',
  'WhatsApp', 'Instagram', 'Facebook', 'Meta Pixel', 'Meta', 'Google', 'Depel', 'A&A Dental Institute', 'RA Cursos', 'Sirify'];

const errors = [];
const uses = new Map();     // chave → ['arquivo:linha', …]
const dynamic = [];         // t(variável): o texto vem de tx() ou de um valor do HTML
const use = (key, where) => { if (!uses.has(key)) uses.set(key, []); uses.get(key).push(where); };
const rel = f => path.relative(SITE, f).split(path.sep).join('/');

/* ---------- chaves nos scripts ---------- */
function scanJs(code, file, lineOffset = 0) {
  try { new vm.Script(code, { filename: file }); }
  catch (e) { errors.push(`${file}: erro de sintaxe: ${e.message}`); return; }
  const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const at = node => `${file}:${lineOffset + sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`;
  const visit = node => {
    if (ts.isCallExpression(node) && node.arguments.length) {
      const c = node.expression;
      const name = ts.isIdentifier(c) ? c.text : ts.isPropertyAccessExpression(c) ? c.name.text : null;
      if (name === 't' || name === 'tx') {
        const a = node.arguments[0];
        if (ts.isStringLiteral(a) || ts.isNoSubstitutionTemplateLiteral(a)) use(a.text, at(a));
        else if (ts.isTemplateExpression(a) || ts.isBinaryExpression(a))
          errors.push(`${at(a)}: chave montada em tempo de execução (${a.getText(sf)}). Use ${name}("… {{x}} …", { x }).`);
        else dynamic.push(`${at(a)}: ${name}(${a.getText(sf)})`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
}

/* ---------- chaves no HTML ---------- */
const i18nSrc = readFileSync(path.join(SITE, I18N), 'utf8');
let langs = null, original = null;
for (const page of readdirSync(SITE).filter(f => f.endsWith('.html'))) {
  const dom = new JSDOM(readFileSync(path.join(SITE, page), 'utf8'),
    { url: `http://localhost/${page}`, runScripts: 'outside-only', includeNodeLocations: true });
  dom.window.eval(i18nSrc);
  const api = dom.window.NEX_I18N;
  langs ??= api.langs.map(l => l.code); original ??= api.original;
  const line = node => (dom.nodeLocation(node) || dom.nodeLocation(node.parentNode) || {}).startLine;
  for (const { key, kind, node } of api.collect()) {
    use(key, `${page}:${line(node)}`);
    if (kind === 'html' && [...node.children].some(c => c.children.length))
      errors.push(`${page}:${line(node)}: [data-i18n] com elemento dentro de elemento; a tradução só refaz um nível: "${key}"`);
  }
  for (const s of dom.window.document.querySelectorAll('script:not([src])'))
    scanJs(s.textContent, page, dom.nodeLocation(s).startTag.endLine - 1);
}
scanJs(i18nSrc, I18N);

/* ---------- traduções ---------- */
function readLocale(code) {
  const file = path.join(SITE, 'i18n/locales', `${code}.js`), name = rel(file);
  if (!existsSync(file)) { errors.push(`${name}: arquivo não encontrado`); return {}; }
  const code_ = readFileSync(file, 'utf8');
  try { new vm.Script(code_, { filename: name }); } catch (e) { errors.push(`${name}: erro de sintaxe: ${e.message}`); return {}; }
  const sf = ts.createSourceFile(name, code_, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const out = {};
  let found = false;
  const visit = node => {
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'add') {
      const [lang, obj] = node.arguments;
      if (!lang || !ts.isStringLiteral(lang) || lang.text !== code) errors.push(`${name}: NEX_I18N.add deve receber '${code}'`);
      if (!obj || !ts.isObjectLiteralExpression(obj)) { errors.push(`${name}: NEX_I18N.add deve receber um objeto { "original": "tradução" }`); return; }
      found = true;
      for (const p of obj.properties) {
        const ln = sf.getLineAndCharacterOfPosition(p.getStart(sf)).line + 1;
        if (!ts.isPropertyAssignment(p) || !ts.isStringLiteral(p.name) || !(ts.isStringLiteral(p.initializer) || ts.isNoSubstitutionTemplateLiteral(p.initializer))) {
          errors.push(`${name}:${ln}: use "texto": "tradução" (só textos literais)`); continue;
        }
        if (p.name.text in out) errors.push(`${name}:${ln}: chave repetida "${p.name.text}"`);
        out[p.name.text] = p.initializer.text;
      }
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!found) errors.push(`${name}: não encontrei NEX_I18N.add('${code}', { … })`);
  return out;
}

const sig = (s, re) => (s.match(re) || []).map(x => x.replace(/\s/g, '')).sort().join(' ');
const vars = s => sig(s, /\{\{\s*\w+\s*\}\}/g);
const tags = s => sig(s, /<\/?\d+>/g);
const nums = s => sig(s.replace(/<\/?\d+>|\{\{\s*\w+\s*\}\}/g, ''), /\d+(?:[.,:]\d+)*/g);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const hasBrand = (s, b) => new RegExp(`(?<![\\p{L}\\p{N}])${esc(b)}(?![\\p{L}\\p{N}])`, 'u').test(s);

const targets = langs.filter(l => l !== original);
const tr = Object.fromEntries(targets.map(l => [l, readLocale(l)]));
for (const l of targets) {
  const name = `i18n/locales/${l}.js`;
  for (const key of uses.keys()) {
    const v = tr[l][key];
    if (v === undefined) { errors.push(`${name}: falta tradução de "${key}" (${uses.get(key)[0]})`); continue; }
    if (!v.trim()) { errors.push(`${name}: tradução vazia de "${key}"`); continue; }
    if (vars(v) !== vars(key)) errors.push(`${name}: variáveis {{…}} diferentes em "${key}" → "${v}"`);
    if (tags(v) !== tags(key)) errors.push(`${name}: marcações <n>…</n> diferentes em "${key}" → "${v}"`);
    if (nums(v) !== nums(key)) errors.push(`${name}: números diferentes (valores ficam em pt-BR) em "${key}" → "${v}"`);
    for (const b of BRANDS) if (hasBrand(key, b) && !hasBrand(v, b)) errors.push(`${name}: a marca "${b}" sumiu em "${key}" → "${v}"`);
  }
  for (const key of Object.keys(tr[l])) if (!uses.has(key)) errors.push(`${name}: tradução que o código não usa mais: "${key}"`);
}

/* ---------- saída ---------- */
if (process.argv.includes('--listar')) {
  const keys = [...uses.keys()].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  for (const key of keys) {
    const st = targets.map(l => `${l} ${tr[l][key] ? '✓' : '✗'}`).join('  ');
    console.log(`${JSON.stringify(key)}\n    ${uses.get(key).join(', ')}\n    ${st}`);
  }
  console.log(`\n${keys.length} chaves.`);
  if (dynamic.length) console.log(`\nChamadas com variável (o texto vem de tx() ou de um valor de resposta do HTML):\n  ${dynamic.join('\n  ')}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  console.error(`\n✗ ${errors.length} problema(s) nas traduções.`);
  process.exit(1);
}
console.log(`✓ ${uses.size} chaves traduzidas em ${targets.join(', ')}; nada sobrando, nada faltando.`);
