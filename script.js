(() => {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d', { alpha: false });
  const section = document.querySelector('.hero-scroll');
  const frameLabel = document.getElementById('frame-current');
  const heroCopy = document.querySelector('.hero-copy');
  const heroWash = document.querySelector('.hero-wash');
  const total = 124;
  const frames = new Array(total);
  let frameW = 2688, frameH = 1512, current = -1, raf = 0;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw(current < 0 ? 0 : current);
  }
  function draw(index) {
    if (!frames[index]?.complete || !frames[index].naturalWidth) return;
    const box = canvas.getBoundingClientRect();
    const desktop = matchMedia('(min-width: 761px)').matches;
    const widthScale = box.width / frameW, heightScale = box.height / frameH;
    const scale = desktop ? Math.min(widthScale, heightScale) : Math.max(widthScale, heightScale);
    const w = frameW * scale, h = frameH * scale;
    const x = (box.width - w) / 2;
    // Keep the top of the portrait in frame on wide desktop screens.
    const y = (box.height - h) / 2;
    ctx.fillStyle = '#d1d0ce';
    ctx.fillRect(0, 0, box.width, box.height);
    ctx.drawImage(frames[index], x, y, w, h);
    current = index;
    frameLabel.textContent = String(index + 1).padStart(2, '0');
  }
  function scrollProgress() {
    if (reducedMotion) return 1;
    const travel = section.offsetHeight - innerHeight;
    if (travel <= 0) return 0;
    const rect = section.getBoundingClientRect();
    return Math.max(0, Math.min(1, -rect.top / travel));
  }
  function targetFrame(progress) {
    return Math.min(total - 1, Math.floor(progress * total));
  }
  function update() {
    raf = 0;
    const progress = scrollProgress();
    const target = targetFrame(progress);
    if (frames[target]?.complete) draw(target);
    // The supplied later frames include their own name and role typography.
    const overlayOpacity = Math.max(0, 1 - progress / 0.24);
    heroCopy.style.opacity = overlayOpacity;
    heroWash.style.opacity = overlayOpacity;
  }
  function requestUpdate() { if (!raf) raf = requestAnimationFrame(update); }
  for (let i = 0; i < total; i++) {
    const img = new Image();
    img.decoding = 'async';
    img.src = `ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`;
    img.onload = () => {
      if (i === 0) { frameW = img.naturalWidth; frameH = img.naturalHeight; resize(); }
      if (i === targetFrame(scrollProgress())) requestUpdate();
    };
    frames[i] = img;
  }
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', resize, { passive: true });
  document.getElementById('year').textContent = new Date().getFullYear();
  resize();
  requestUpdate();
})();



