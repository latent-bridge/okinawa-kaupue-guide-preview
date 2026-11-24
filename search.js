
const guides = Array.from(document.querySelectorAll('.result'));
const form = document.querySelector('form');
const query = document.querySelector('#query');
const purpose = document.querySelector('#purpose');
const region = document.querySelector('#region');
const empty = document.querySelector('#empty');
for (const select of [purpose, region]) {
  const values = new Set(guides.map(guide => guide.dataset[select.id]));
  for (const value of values) select.add(new Option(value, value));
}
function normalize(value) {
  return value.normalize('NFKC').toLowerCase().trim();
}
function filterGuides() {
  const words = normalize(query.value).split(/\s+/);
  let visible = 0;
  for (const guide of guides) {
    const terms = normalize([guide.textContent, ...Object.values(guide.dataset)].join(' '));
    guide.hidden = (purpose.value && purpose.value !== guide.dataset.purpose)
      || (region.value && region.value !== guide.dataset.region)
      || !words.every(word => terms.includes(word));
    if (!guide.hidden) visible++;
  }
  document.querySelector('#count').textContent = '旅行指南（' + visible + '）';
  empty.hidden = visible !== 0;
}
form.addEventListener('input', filterGuides);
form.addEventListener('submit', event => event.preventDefault());
empty.querySelector('button').addEventListener('click', () => {
  form.reset();
  filterGuides();
  query.focus();
});
form.hidden = false;
filterGuides();
