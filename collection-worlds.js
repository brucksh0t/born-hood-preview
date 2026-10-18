import * as THREE from './vendor/three.module.js?v=mvdrpcy7';

const clamp = value => Math.min(1, Math.max(0, value));
const smooth = value => value * value * (3 - 2 * value);

function makeCardTexture(item, index) {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 800;
  const context = canvas.getContext('2d');
  context.fillStyle = '#101011';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = '#cf2635';
  context.fillRect(40, 38, 70, 5);
  context.fillStyle = '#b8b2b2';
  context.font = '500 22px Archivo, sans-serif';
  context.fillText('COLLECTION / ' + String(index + 1).padStart(2, '0'), 40, 82);

  const image = new Image();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 2;
  image.onload = () => {
    const box = { x: 34, y: 112, width: 572, height: 510 };
    const scale = Math.min(box.width / image.naturalWidth, box.height / image.naturalHeight);
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(image, box.x + (box.width - width) / 2, box.y + (box.height - height) / 2, width, height);
    context.fillStyle = '#ece9e8';
    context.font = '700 34px Archivo, sans-serif';
    const words = item.name.toUpperCase().split(/\s+/);
    let line = '';
    let y = 696;
    for (const word of words) {
      const candidate = line ? line + ' ' + word : word;
      if (context.measureText(candidate).width > 560 && line) {
        context.fillText(line, 40, y);
        line = word;
        y += 40;
      } else line = candidate;
    }
    if (line) context.fillText(line, 40, y);
    context.fillStyle = '#d12a39';
    context.fillRect(40, 752, 560, 2);
    texture.needsUpdate = true;
  };
  image.onerror = () => { texture.needsUpdate = true; };
  image.src = item.image;
  return texture;
}

export function initCollectionWorlds(root, items) {
  const canvas = root.querySelector('canvas');
  if (!canvas || !items.length) return null;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    root.dataset.worldState = 'fallback';
    return null;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 80);
  const panelGroup = new THREE.Group();
  scene.add(panelGroup);
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const interactivePanels = [];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 1;
  let height = 1;
  let visible = false;
  let progress = 0;
  let destroyed = false;
  let down = null;
  let scrollPending = false;

  function arrange() {
    const mobile = width <= 700;
    const columns = mobile ? 2 : Math.min(4, items.length);
    const cameraDistance = mobile ? 10.4 : 11.4;
    camera.position.set(0, 0, cameraDistance);
    const gapX = mobile ? 1.45 : 2.38;
    const gapY = mobile ? 1.23 : 2.38;
    const panelWidth = mobile ? 1.16 : 1.76;
    const panelHeight = mobile ? 1.45 : 2.18;
    const rows = Math.ceil(items.length / columns);
    const gridHeight = (rows - 1) * gapY;
    for (const panel of interactivePanels) {
      const { index } = panel.userData;
      const row = Math.floor(index / columns);
      const column = index % columns;
      const remaining = Math.min(columns, items.length - row * columns);
      const targetX = (column - (remaining - 1) / 2) * gapX;
      const targetY = gridHeight / 2 - row * gapY - (mobile ? 0.35 : 0.12);
      const targetZ = -Math.abs(column - (columns - 1) / 2) * 0.18;
      panel.userData.target = { x: targetX, y: targetY, z: targetZ, rotationY: -targetX * 0.025 };
      panel.userData.from = {
        x: targetX + Math.sin(index * 1.73 + 0.5) * (mobile ? 3.3 : 5.7),
        y: targetY + (index % 2 ? 2.7 : -2.4) + Math.cos(index * 1.2) * 0.65,
        z: targetZ - 4.5 - (index % 3) * 1.4,
        rotationY: (index % 2 ? -1 : 1) * 0.62,
      };
      panel.scale.set(panelWidth / 1.76, panelHeight / 2.18, 1);
    }
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1 : 1.35));
  }

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const panel = new THREE.Group();
    panel.userData = { index, href: item.href, from: null, target: null };
    const frame = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 2.32),
      new THREE.MeshBasicMaterial({ color: 0x76232c, side: THREE.DoubleSide })
    );
    frame.position.z = -0.025;
    panel.add(frame);
    const face = new THREE.Mesh(
      new THREE.PlaneGeometry(1.76, 2.18),
      new THREE.MeshBasicMaterial({ map: makeCardTexture(item, index), side: THREE.DoubleSide })
    );
    face.userData.panel = panel;
    panel.add(face);
    panelGroup.add(panel);
    interactivePanels.push(panel);
  }

  function updateProgress() {
    scrollPending = false;
    if (reduced.matches) progress = 1;
    else {
      const rect = root.getBoundingClientRect();
      const travel = Math.max(1, root.offsetHeight - innerHeight);
      progress = clamp(-rect.top / travel);
    }
    render();
  }

  function queueProgress() {
    if (scrollPending || destroyed) return;
    scrollPending = true;
    requestAnimationFrame(updateProgress);
  }

  function render() {
    if (destroyed || !visible) return;
    const t = reduced.matches ? 1 : smooth(progress);
    for (const panel of interactivePanels) {
      const { from, target } = panel.userData;
      if (!from || !target) continue;
      panel.position.set(
        THREE.MathUtils.lerp(from.x, target.x, t),
        THREE.MathUtils.lerp(from.y, target.y, t),
        THREE.MathUtils.lerp(from.z, target.z, t)
      );
      panel.rotation.y = THREE.MathUtils.lerp(from.rotationY, target.rotationY, t);
      panel.rotation.x = (1 - t) * 0.24;
      panel.rotation.z = (1 - t) * Math.sin(panel.userData.index * 1.1) * 0.12;
    }
    renderer.render(scene, camera);
    root.style.setProperty('--world-progress', String(progress));
  }

  const resizeObserver = new ResizeObserver(() => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    arrange();
    render();
  });
  resizeObserver.observe(root);
  const intersectionObserver = new IntersectionObserver(entries => {
    visible = entries[0]?.isIntersecting ?? false;
    if (visible) { arrange(); queueProgress(); }
  }, { rootMargin: '120px 0px' });
  intersectionObserver.observe(root);

  canvas.addEventListener('pointerdown', event => {
    down = { x: event.clientX, y: event.clientY, id: event.pointerId };
  });
  canvas.addEventListener('pointerup', event => {
    if (!down || down.id !== event.pointerId || Math.hypot(event.clientX - down.x, event.clientY - down.y) > 12) {
      down = null;
      return;
    }
    down = null;
    const rect = canvas.getBoundingClientRect();
    pointer.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -((event.clientY - rect.top) / rect.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const hit = raycaster.intersectObjects(interactivePanels.flatMap(panel => panel.children), false).find(entry => entry.object.userData.panel);
    const href = hit?.object.userData.panel?.userData.href;
    if (href) window.location.assign(href);
  });
  canvas.addEventListener('pointercancel', () => { down = null; });
  window.addEventListener('scroll', queueProgress, { passive: true });
  window.addEventListener('resize', queueProgress, { passive: true });
  reduced.addEventListener('change', queueProgress);
  document.addEventListener('visibilitychange', queueProgress);

  root.dataset.worldState = 'ready';
  arrange();
  queueProgress();
  return () => {
    destroyed = true;
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener('scroll', queueProgress);
    window.removeEventListener('resize', queueProgress);
    reduced.removeEventListener('change', queueProgress);
    document.removeEventListener('visibilitychange', queueProgress);
    scene.traverse(object => {
      object.geometry?.dispose();
      if (object.material) {
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          material.map?.dispose();
          material.dispose();
        }
      }
    });
    renderer.dispose();
  };
}
