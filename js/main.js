// ===== reveal on scroll (problem section) =====
(() => {
  const section = document.querySelector("#problem");
  if (!section) return;

  const bubbles = section.querySelectorAll(".js-reveal");
  const cat = section.querySelector(".js-cat");

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;

      // ふきだし：順番にフェードイン
      bubbles.forEach((el, i) => {
        setTimeout(() => el.classList.add("is-in"), 220 * i);
      });

      // 猫：少し遅らせて出す
      if (cat) setTimeout(() => cat.classList.add("is-in"), 900);

      io.unobserve(e.target);
    });
  }, { threshold: 0.35 });

  io.observe(section);
})();

const fadeTargets = document.querySelectorAll(".js-fade-down");

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeTargets.forEach((el) => io.observe(el));



//カルーセルセクション

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".js-variation-track");
  if (!track) return;

  // まず複製（継ぎ目なし用）
  const originalItems = Array.from(track.children);
  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  });

  // 画像読み込み後に距離を確定
  const imgs = Array.from(track.querySelectorAll("img"));
  const waitImgs = Promise.all(
    imgs.map(img => img.complete ? Promise.resolve() : new Promise(res => img.addEventListener("load", res, { once:true })))
  );

  waitImgs.then(() => {
    // “元の4枚ぶん”の幅（=継ぎ目までの距離）を計算
    let distance = 0;
    for (let i = 0; i < originalItems.length; i++) {
      distance += originalItems[i].offsetWidth;
      if (i < originalItems.length - 1) distance += 24; // gap と同じ数値
    }

    // CSS変数へ反映
    track.style.setProperty("--loop-distance", `${distance}px`);

    // 速度：距離に応じて一定の速さにする（任意）
    const pxPerSec = 60; // 好み：50〜80
    const duration = distance / pxPerSec;
    track.style.setProperty("--loop-duration", `${duration}s`);
  });

  // リサイズ時も再計算（任意だけど実務だと強い）
  window.addEventListener("resize", () => {
    track.style.removeProperty("--loop-distance");
    track.style.removeProperty("--loop-duration");
    // 手抜きで再読み込みしたくなければ、上の計算部分を関数化して呼び直しでもOK
    location.reload();
  }, { passive: true });
});


//course section

document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".js-slide-up");
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-inview");
        io.unobserve(e.target); // 1回だけでOK
      }
    });
  }, { threshold: 0.25 });

  targets.forEach((el) => io.observe(el));
});


// closing section - stagger slide in (right)

document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll(".js-slide-right");
  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;

      const el = e.target;
      const delay = Number(el.dataset.delay || 0);

      // 1回だけ
      io.unobserve(el);

      // ディレイ付きで表示
      setTimeout(() => {
        el.classList.add("is-inview");
      }, delay);
    });
  }, { threshold: 0.25 });

  targets.forEach((el) => io.observe(el));
});