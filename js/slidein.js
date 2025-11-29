// ===== スライドイン処理 =====
// video.js

document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.js-video video');
  if (!video) return;

  // スマホでもインライン再生できるように
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  // 自動再生はさせない（タップで再生）
  video.removeAttribute('autoplay');
  video.muted = true; // ミュートはつけたままでOK
});
// slidein.js
document.addEventListener('DOMContentLoaded', () => {
  const slideTargets = document.querySelectorAll('.js-slide-left');
  if (!slideTargets.length) return;

  // IntersectionObserver が使えない環境向けフォールバック
  if (!('IntersectionObserver' in window)) {
    slideTargets.forEach(el => el.classList.add('is-show'));
    return;
  }

  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-show');
      // 一度アニメーションしたら監視解除
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.5 // 要素の半分くらい見えたら発火
  });

  slideTargets.forEach(el => io.observe(el));
});
