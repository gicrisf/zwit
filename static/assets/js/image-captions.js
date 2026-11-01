(function () {
  var SKIP_SELECTOR = '.social-embed, .social-thread';

  function isStandaloneImage(paragraph, image) {
    if (paragraph.querySelectorAll('img').length !== 1) return false;
    if (paragraph.textContent.trim() !== '') return false;

    var children = paragraph.children;
    for (var i = 0; i < children.length; i += 1) {
      var child = children[i];
      if (child === image || child.tagName === 'BR') continue;
      if (child.tagName === 'A' && child === image.parentElement) continue;
      return false;
    }

    return true;
  }

  function wrapImage(image) {
    var alt = (image.getAttribute('alt') || '').trim();
    if (!alt) return;
    if (image.closest('figure')) return;
    if (image.closest(SKIP_SELECTOR)) return;

    var paragraph = image.closest('p');
    if (!paragraph || !isStandaloneImage(paragraph, image)) return;

    var media = image.parentElement && image.parentElement.tagName === 'A'
      ? image.parentElement
      : image;

    var figure = document.createElement('figure');
    figure.appendChild(media);

    var caption = document.createElement('figcaption');
    caption.textContent = alt;
    caption.setAttribute('aria-hidden', 'true');
    figure.appendChild(caption);

    paragraph.replaceWith(figure);
  }

  function init() {
    document.querySelectorAll('.prose img[alt]').forEach(wrapImage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
