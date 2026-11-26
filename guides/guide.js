for (const button of document.querySelectorAll('[data-map]')) {
  button.hidden = false;
  button.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = button.dataset.map;
    frame.title = button.closest('section').querySelector('h3').textContent;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    button.replaceWith(frame);
    frame.focus();
  });
}

for (const link of document.querySelectorAll('[data-zoom]')) {
  link.addEventListener('click', event => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const dialog = document.createElement('dialog');
    if (!dialog.showModal) return;
    event.preventDefault();
    const japanese = document.documentElement.lang === 'ja';
    dialog.setAttribute('aria-label', japanese ? '拡大画像' : '放大圖片');
    const close = document.createElement('button');
    close.textContent = japanese ? '画像を閉じる' : '關閉圖片';
    close.addEventListener('click', () => dialog.close());
    const scroller = document.createElement('div');
    scroller.className = 'zoom-scroll';
    scroller.tabIndex = 0;
    const image = link.querySelector('img').cloneNode();
    image.removeAttribute('loading');
    scroller.append(image);
    dialog.append(close, scroller);
    document.body.append(dialog);
    dialog.addEventListener('close', () => {
      dialog.remove();
      link.focus();
    }, {once: true});
    dialog.showModal();
  });
}

for (const form of document.querySelectorAll('[data-rail-fares]')) {
  const ja = document.documentElement.lang === 'ja';
  const showFare = () => {
    const n = Number(form.querySelector('[data-trips]').value);
    const single = Number(form.querySelector('[data-stop]').value);
    const airport = Number(form.dataset.airport), pass = Number(form.dataset.pass);
    const total = airport + single * 2 * n;
    const unit = ja ? '円' : ' 日圓';
    const choice = total < pass ? (ja ? '普通券' : '單程票') : (ja ? '1日券' : '一日券');
    const result = total === pass ? (ja ? '同額' : '兩者同價') : (ja ? choice+'が'+Math.abs(total-pass)+'円安い' : choice+'省 '+Math.abs(total-pass)+unit);
    form.querySelector('output').textContent = (ja ? '普通券：' : '單程票：') +
      (n ? single+' × 2 × '+n+' + ' : '') + airport + (n ? ' = '+total : '') +
      unit + (ja ? ' ／ 1日券：' : ' ／ 一日券：') + pass + unit + '。'+ result+'。';
  };
  form.addEventListener('change', showFare);
  showFare();
  form.hidden = false;
}
