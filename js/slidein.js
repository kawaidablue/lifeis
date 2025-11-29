// video.js

// ===== 動画の自動再生 =====
document.addEventListener('DOMContentLoaded', () => {
  const videoWrappers = document.querySelectorAll('.js-video');
  if (!videoWrappers.length) return;

  // ---- スマホ判定（iPhone / iPad / Android） ----
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);

  // ★ スマホでは「自動再生しない」＝ユーザーのタップでだけ再生させる
  if (isMobile) {
    videoWrappers.forEach(wrapper => {
      const video = wrapper.querySelector('video');
      if (!video) return;

      // 念のため自動再生を止めておく
      video.pause();
      video.removeAttribute('autoplay');
      // iOS 用のインライン再生指定がある前提
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
    });
    // ここで return するので、IntersectionObserver は使わない
    return;
  }

  // ---- ここから PC 用：IntersectionObserver で自動再生 ----

  // IntersectionObserver が使えない古いブラウザ用フォールバック
  if (!('IntersectionObserver' in window)) {
    videoWrappers.forEach(wrapper => {
      const video = wrapper.querySelector('video');
      if (!video) return;
      video.play().catch(() => {});
    });
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (!video) return;

      if (entry.isIntersecting) {
        // 画面に入ったら再生（PC）
        const p = video.play();
        if (p !== undefined) {
          p.catch(() => {
            // 自動再生ブロックされた場合は無視
          });
        }
      } else {
        // 画面外に出たら一時停止
        video.pause();
      }
    });
  }, {
    threshold: 0.8 // 要素の8割くらい見えたら「見えた」と判断
  });

  videoWrappers.forEach(wrapper => io.observe(wrapper));
});


// ===== スライドイン処理 =====
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
