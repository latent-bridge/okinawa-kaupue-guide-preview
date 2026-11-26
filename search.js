const form = document.querySelector('form');
const query = document.querySelector('#query');
const purpose = document.querySelector('#purpose');
const region = document.querySelector('#region');
const guideGroup = document.querySelector('#guide-results');
const productGroup = document.querySelector('#product-results');
const guides = [...guideGroup.querySelectorAll('.result')];
const products = [...productGroup.querySelectorAll('.result')];
const empty = document.querySelector('#empty');
const suggestion = document.querySelector('#suggestion');

for (const [select, records] of [[purpose, guides], [region, [...guides, ...products]]]) {
  for (const value of new Set(records.map(item => item.dataset[select.id]))) {
    select.add(new Option(value, value));
  }
}
function normalize(value) {
  return value.normalize('NFKC').toLowerCase().trim();
}
function refresh() {
  const shopping = form.elements.mode.value === 'products';
  const keyword = normalize(query.value);
  const hasCriteria = Boolean(keyword || region.value || (!shopping && purpose.value));
  const words = keyword.split(/\s+/);
  const matching = item => {
    const text = normalize(item.textContent + ' ' + item.dataset.alias);
    return (!region.value || item.dataset.region === region.value) && words.every(word => text.includes(word));
  };
  const matchedProducts = products.filter(matching);
  const matchedGuides = guides.filter(item => matching(item) && (!purpose.value || purpose.value === item.dataset.purpose));
  for (const item of guides) item.hidden = !matchedGuides.includes(item);
  for (const item of products) item.hidden = !matchedProducts.includes(item);
  guideGroup.hidden = shopping;
  productGroup.hidden = !hasCriteria || !shopping;
  document.querySelector('#purpose-field').hidden = shopping;
  document.querySelector('#query-label').textContent = shopping ? '想找什麼商品？' : '你想做什麼？';
  query.placeholder = shopping ? '例如：起司蛋糕、ガトーショコラ、cocolo' : '例如：蛋糕、海鮮、船班';
  const count = shopping ? matchedProducts.length : matchedGuides.length;
  document.querySelector('#count').hidden = shopping && !hasCriteria;
  document.querySelector('#count').textContent = shopping ? '商品與販售店（' + count + '）' : (hasCriteria ? '符合條件的指南' : '全部旅行指南') + '（' + count + '）';
  empty.hidden = !hasCriteria || count > 0;
  empty.querySelector('p').textContent = shopping ? '目前沒有符合條件的商品紀錄。可以換個品名或地區。' : '這組條件還沒有指南。可以換個地區或關鍵字。';
  empty.querySelector('button').textContent = shopping ? '清除商品搜尋條件' : '清除條件，看全部指南';
  suggestion.hidden = shopping || !query.value.trim() || !matchedProducts.length;
  suggestion.firstElementChild.textContent = '查看符合的商品與販售店（' + matchedProducts.length + '）';
}
function showProductSearch() {
  form.elements.mode.value = 'products';
  refresh();
  query.focus();
}
suggestion.firstElementChild.addEventListener('click', showProductSearch);
form.addEventListener('input', refresh);
form.addEventListener('submit', event => event.preventDefault());
empty.querySelector('button').addEventListener('click', () => {
  query.value = purpose.value = region.value = '';
  refresh();
  query.focus();
});
const params = new URLSearchParams(location.search);
if (params.get('mode') === 'products') form.elements.mode.value = 'products';
query.value = params.get('q') || '';
form.hidden = false;
refresh();
