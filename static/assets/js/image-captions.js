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
    var title = (image.getAttribute('title') || '').trim();
    var captionText = title || alt;
    if (!captionText) return;
    if (image.closest('figure')) return;
    if (image.closest(SKIP_SELECTOR)) return;

    var paragraph = image.closest('p');
    if (!paragraph || !isStandaloneImage(paragraph, image)) return;

    image.removeAttribute('title');

    var media = image.parentElement && image.parentElement.tagName === 'A'
      ? image.parentElement
      : image;

    var figure = document.createElement('figure');
    figure.appendChild(media);

    var caption = document.createElement('figcaption');
    caption.textContent = captionText;
    if (captionText === alt) caption.setAttribute('aria-hidden', 'true');
    figure.appendChild(caption);

    paragraph.replaceWith(figure);
  }

  function linkImage(image) {
    if (image.closest('a')) return;
    if (image.closest(SKIP_SELECTOR)) return;

    var figure = image.closest('figure');
    if (!figure) return;
    if (!image.getAttribute('src')) return;

    var alt = (image.getAttribute('alt') || '').trim();
    var caption = figure.querySelector('figcaption');
    var captionText = caption ? caption.textContent.trim() : '';
    var label = alt || captionText;
    if (!label) return;

    var link = document.createElement('a');
    link.className = 'figure-link';
    link.href = image.src;
    link.target = '_blank';
    link.rel = 'noopener';
    if (!alt) link.setAttribute('aria-label', label);

    image.parentNode.insertBefore(link, image);
    link.appendChild(image);
  }

  function init() {
    document.querySelectorAll('.prose img[alt]').forEach(wrapImage);
    document.querySelectorAll('.prose figure:not(.social-embed__media) img').forEach(linkImage);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
