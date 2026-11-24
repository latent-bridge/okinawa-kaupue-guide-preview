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
