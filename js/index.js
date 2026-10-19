const drinks = [
  {
    emoji: '🍋', bases: ['cachaça', 'vodca', 'rum'],
    codename: 'root.caipi()',
    realName: 'Caipirinha / Caipiroska / Daiquiri',
    shortText: 'Limão ou maracujá · gelo · versão clássica',
    ingredients: ['Limão ou maracujá', 'Açúcar', 'Cachaça, vodca ou rum branco', 'Gelo'],
    description: 'Um clássico refrescante, perfeito para abrir a comemoração com leveza e energia.',
    image: 'img/caipirinha.webp'
  },
  {
    emoji: '🌿', bases: ['rum'],
    codename: 'mint.deploy()',
    realName: 'Mojito',
    shortText: 'Rum branco · hortelã · limão',
    ingredients: ['Rum branco', 'Limão', 'Açúcar', 'Hortelã', 'Sprite ou água com gás', 'Gelo'],
    description: 'Refrescante e vibrante, com um perfil leve que combina muito bem com festa de dia.',
    image: 'img/mojito.jpg'
  },
  {
    emoji: '💛', bases: ['cachaça'],
    codename: 'passion.commit()',
    realName: 'Batida de Maracujá',
    shortText: 'Maracujá · cachaça · toque doce',
    ingredients: ['Cachaça', 'Maracujá', 'Leite condensado ou açúcar', 'Gelo'],
    description: 'Cremosa, tropical e marcante, ótima para quem gosta de sabores mais intensos.',
    image: 'img/batida-maracuja.jpg'
  },
  {
    emoji: '🍍', bases: ['rum'],
    codename: 'kernel.colada()',
    realName: 'Piña Colada',
    shortText: 'Abacaxi · coco · rum branco',
    ingredients: ['Rum branco', 'Suco de abacaxi', 'Leite de coco', 'Leite condensado opcional', 'Gelo'],
    description: 'Um drink tropical, suave e elegante, com clima de verão e celebração.',
    image: 'img/pina-colada.jpg'
  },
  {
    emoji: '🩷', bases: ['vodca', 'rum'],
    codename: 'pink.packet()',
    realName: 'Pink Lemon',
    shortText: 'Limão · grenadine · toque gaseificado',
    ingredients: ['Vodca ou rum', 'Suco de limão', 'Grenadine', 'Sprite ou água com gás', 'Gelo'],
    description: 'Colorido, delicado e divertido, com um visual lindo para o clima da festa.',
    image: 'img/pink-lemon.jpg',
    imagePos: '68% 30%'
  },
  {
    emoji: '🍊', bases: ['vodca'],
    codename: 'sunset.compile()',
    realName: 'Vodca com Suco de Laranja',
    shortText: 'Laranja · vodca · efeito sunset',
    ingredients: ['Vodca', 'Suco de laranja', 'Grenadine', 'Suco de limão', 'Gelo'],
    description: 'Leve, cítrico e vibrante, com um visual bonito que combina com a energia da formatura.',
    image: 'img/vodca-laranja.png'
  }
];
const $ = (sel) => document.querySelector(sel);
const root = document.documentElement;
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
};

const cardsEl = $('#cards');
const modal = $('#modal');
const modalTitle = $('#modalTitle');
const modalReal = $('#modalReal');
const modalBase = $('#modalBase');
const modalImage = $('#modalImage');
const modalIngredients = $('#modalIngredients');
const modalDescription = $('#modalDescription');
const closeBtn = $('#closeBtn');
const filtersEl = $('#filters');
const countEl = $('#count');
const themeBtn = $('#themeBtn');
const soundBtn = $('#soundBtn');
const sceneBtn = $('#sceneBtn');
const metaTheme = $('#metaTheme');

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = matchMedia('(hover: hover)').matches;
const motion = Boolean(window.gsap && window.ScrollTrigger) && !reduced;
if (motion) {
  gsap.registerPlugin(ScrollTrigger);
  root.classList.add('gsap-on');
}

let soundOn = store.get('sound') !== 'off';
let scene3d = null;
let sceneOn = store.get('scene3d') !== 'off';
root.classList.toggle('no-3d', !sceneOn);
let lastCard = null;

// ===== Tema claro / escuro =====
function updateThemeUI() {
  const dark = root.dataset.theme === 'dark';
  themeBtn.textContent = dark ? '☀️' : '🌙';
  themeBtn.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
  metaTheme.content = dark ? '#07120e' : '#f7fff8';
}

function setTheme(theme) {
  root.dataset.theme = theme;
  store.set('theme', theme);
  updateThemeUI();
  if (scene3d) scene3d.setTheme(theme);
}

function updateSoundUI() {
  soundBtn.textContent = soundOn ? '🔊' : '🔇';
  soundBtn.setAttribute('aria-pressed', String(soundOn));
  soundBtn.setAttribute('aria-label', soundOn ? 'Desligar sons' : 'Ligar sons');
}

themeBtn.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  sfx.theme(next);
  if (!document.startViewTransition || reduced) {
    setTheme(next);
    return;
  }
  const r = themeBtn.getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const transition = document.startViewTransition(() => setTheme(next));
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 600, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
    );
  }).catch(() => { });
  if (motion) gsap.fromTo(themeBtn, { rotation: -180 }, { rotation: 0, duration: 0.6, ease: 'back.out(1.7)' });
});

function updateSceneUI() {
  sceneBtn.textContent = sceneOn ? '🧊' : '🚫';
  sceneBtn.setAttribute('aria-pressed', String(sceneOn));
  sceneBtn.setAttribute('aria-label', sceneOn ? 'Esconder objetos 3D' : 'Mostrar objetos 3D');
}

updateThemeUI();
updateSoundUI();
updateSceneUI();

// ===== Modal =====
function openModal(drink, card) {
  lastCard = card || null;
  modalTitle.textContent = drink.codename;
  modalReal.textContent = drink.realName;
  modalBase.textContent = 'base: ' + drink.bases.join(' / ');
  modalImage.src = drink.image;
  modalImage.style.objectPosition = drink.imagePos || '50% 50%';
  modalImage.alt = `Imagem do drink ${drink.realName}`;
  modalIngredients.innerHTML = drink.ingredients.map(item => `<li>${item}</li>`).join('');
  modalDescription.textContent = drink.description;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  closeBtn.focus({ preventScroll: true });
  sfx.open();

  if (motion) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo(modalImage, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7 })
      .from([modalTitle, modalReal, modalBase], { y: 16, opacity: 0, stagger: 0.07, duration: 0.45 }, 0.1)
      .from(modalIngredients.children, { x: -18, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.25)
      .from(modalDescription, { y: 12, opacity: 0, duration: 0.4 }, '-=0.2');
  }
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  sfx.close();
  if (lastCard) lastCard.focus({ preventScroll: true });
}

closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => {
  if (event.target === modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// ===== Cards =====
drinks.forEach((drink, index) => {
  const card = document.createElement('article');
  card.className = 'drink-card';
  card.tabIndex = 0;
  card.dataset.bases = drink.bases.join(',');
  card.innerHTML = `
    <div class="emoji">${drink.emoji}</div>
    <div class="card-main">
      <span class="badge">#drink_${String(index + 1).padStart(2, '0')} · online</span>
      <h2 class="theme-name">${drink.codename}</h2>
      <p class="real-name">${drink.realName}</p>
      <p class="mini-ingredients">${drink.shortText}</p>
      <div class="card-hint">Clique para abrir os detalhes</div>
    </div>
  `;
  card.addEventListener('click', () => openModal(drink, card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(drink, card);
    }
  });
  if (canHover) card.addEventListener('mouseenter', () => sfx.hover());
  cardsEl.appendChild(card);
});

const cardEls = [...cardsEl.children];
countEl.textContent = `${cardEls.length} drinks`;

// ===== Filtro =====
function applyFilter(base) {
  const match = card => base === 'todos' || card.dataset.bases.split(',').includes(base);
  const show = cardEls.filter(match);
  countEl.textContent = `${show.length} ${show.length === 1 ? 'drink' : 'drinks'}`;

  if (!motion) {
    cardEls.forEach(card => { card.hidden = !match(card); });
    return;
  }

  gsap.killTweensOf(cardEls);
  gsap.to(cardEls.filter(card => !card.hidden), {
    opacity: 0, y: -10, duration: 0.18, ease: 'power1.in',
    onComplete: () => {
      cardEls.forEach(card => { card.hidden = !match(card); });
      gsap.fromTo(show, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.5, stagger: 0.07, ease: 'power3.out',
        clearProps: 'transform,opacity',
        onComplete: () => ScrollTrigger.refresh()
      });
    }
  });
}

filtersEl.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip || chip.classList.contains('active')) return;
  filtersEl.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c === chip));
  sfx.tick();
  applyFilter(chip.dataset.base);
  if (motion) gsap.fromTo(chip, { scale: 0.92 }, { scale: 1, duration: 0.5, ease: 'back.out(3)' });
});

// ===== Animações GSAP =====
if (motion) {
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .from('#topbar', { y: -30, opacity: 0, duration: 0.7 })
    .from('#topbar .label, #topbar h1, #topbar .subtitle', { y: 18, opacity: 0, stagger: 0.12, duration: 0.5 }, 0.2)
    .from('#topbar .steps li', { y: 14, opacity: 0, scale: 0.9, stagger: 0.1, duration: 0.45, ease: 'back.out(2)' }, 0.65)
    .from('#filters > *', { y: 14, opacity: 0, stagger: 0.06, duration: 0.4 }, 0.9);

  gsap.set(cardEls, { opacity: 0, y: 40 });
  ScrollTrigger.batch(cardEls, {
    start: 'top 92%',
    once: true,
    onEnter: batch => gsap.to(batch, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      clearProps: 'transform,opacity'
    })
  });

  gsap.to('#progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 }
  });

  cardEls.forEach(card => {
    const emoji = card.querySelector('.emoji');
    card.addEventListener('mouseenter', () => {
      gsap.fromTo(emoji, { rotation: -12, scale: 1 }, { rotation: 0, scale: 1.12, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    });
    card.addEventListener('mouseleave', () => gsap.to(emoji, { scale: 1, duration: 0.25 }));

    if (canHover) {
      card.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, {
          rotationY: px * 7, rotationX: -py * 7, y: -5,
          transformPerspective: 900, duration: 0.4, ease: 'power2.out', overwrite: 'auto'
        });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, {
          rotationX: 0, rotationY: 0, y: 0, duration: 0.5, ease: 'power3.out',
          overwrite: 'auto', clearProps: 'transform'
        });
      });
    }
  });
}
// ===== Quiz: qual drink pra mim? =====
const quizEl = $('#quiz');
const quizBody = $('#quizBody');
const quizBar = $('#quizBar');
const quizBtn = $('#quizBtn');
const quizClose = $('#quizClose');

const quizTags = {
  'root.caipi()': { vibe: ['fresh', 'strong'], flavor: ['citrus', 'tropical'], sweet: 2, why: 'Clássico, cítrico e refrescante. Dá para pedir com cachaça, vodca ou rum.' },
  'mint.deploy()': { vibe: ['fresh'], flavor: ['mint', 'citrus'], sweet: 2, why: 'Leve e vibrante, com hortelã e limão. Perfeito para quem quer algo refrescante.' },
  'passion.commit()': { vibe: ['creamy', 'strong'], flavor: ['tropical'], sweet: 3, why: 'Cremosa e marcante, com o sabor intenso do maracujá.' },
  'kernel.colada()': { vibe: ['creamy'], flavor: ['tropical'], sweet: 3, why: 'Suave e tropical, com abacaxi e coco. Clima de verão no copo.' },
  'pink.packet()': { vibe: ['fun'], flavor: ['sweetfruit', 'citrus'], sweet: 2, why: 'Colorido e divertido, com limão, grenadine e um toque gaseificado.' },
  'sunset.compile()': { vibe: ['fun', 'strong'], flavor: ['citrus', 'sweetfruit'], sweet: 2, why: 'Cítrico e vibrante, com um visual de pôr do sol que rouba a cena.' }
};

const questions = [
  { q: 'Qual vibe você quer agora?', key: 'vibe', opts: [['🧊', 'Refrescante e leve', 'fresh'], ['🥥', 'Doce e cremoso', 'creamy'], ['🔥', 'Forte e marcante', 'strong'], ['🎉', 'Colorido e divertido', 'fun']] },
  { q: 'Que sabor te atrai mais?', key: 'flavor', opts: [['🍋', 'Cítrico (limão, laranja)', 'citrus'], ['🍍', 'Tropical (abacaxi, maracujá, coco)', 'tropical'], ['🌿', 'Menta e ervas', 'mint'], ['🍒', 'Frutado e doce (grenadine)', 'sweetfruit']] },
  { q: 'Tem preferência de bebida base?', key: 'base', opts: [['🥃', 'Cachaça', 'cachaça'], ['🍸', 'Vodca', 'vodca'], ['🏝️', 'Rum', 'rum'], ['🤷', 'Tanto faz', 'any']] },
  { q: 'Quão doce você curte?', key: 'sweet', opts: [['🍃', 'Pouco doce', 1], ['⚖️', 'Equilibrado', 2], ['🍯', 'Bem doce', 3]] }
];

let qi = 0;
let answers = {};
let fabPulse = null;

function rankDrinks() {
  return drinks.map(d => {
    const t = quizTags[d.codename];
    let s = 0;
    if (t.vibe.includes(answers.vibe)) s += 3;
    if (t.flavor.includes(answers.flavor)) s += 3;
    if (answers.base !== 'any' && d.bases.includes(answers.base)) s += 2;
    s += 2 - Math.abs(t.sweet - answers.sweet);
    return { d, t, s };
  }).sort((a, b) => b.s - a.s);
}

function setQuizBar(pct) {
  if (motion) gsap.to(quizBar, { width: pct + '%', duration: 0.4, ease: 'power2.out' });
  else quizBar.style.width = pct + '%';
}

function renderQuestion() {
  const item = questions[qi];
  setQuizBar((qi / questions.length) * 100);
  quizBody.innerHTML = `
    <p class="quiz-step">pergunta ${qi + 1}/${questions.length}</p>
    <h3 class="quiz-q">${item.q}</h3>
    <div class="quiz-opts">
      ${item.opts.map((o, i) => `<button class="quiz-opt" type="button" data-i="${i}"><span aria-hidden="true">${o[0]}</span>${o[1]}</button>`).join('')}
    </div>`;
  if (motion) {
    gsap.from(quizBody.querySelectorAll('.quiz-step, .quiz-q'), { y: 12, opacity: 0, stagger: 0.08, duration: 0.35, ease: 'power3.out' });
    gsap.from(quizBody.querySelectorAll('.quiz-opt'), { x: 24, opacity: 0, stagger: 0.07, duration: 0.4, delay: 0.1, ease: 'power3.out', clearProps: 'transform,opacity' });
  }
}

function renderResult() {
  setQuizBar(100);
  const [top, alt] = rankDrinks();
  const d = top.d;
  quizBody.innerHTML = `
    <div class="quiz-result">
      <p class="quiz-step">seu drink ideal</p>
      <div class="quiz-emoji" id="quizEmoji">${d.emoji}</div>
      <h3>${d.realName}</h3>
      <p class="quiz-code">${d.codename}</p>
      <p>${top.t.why}</p>
      <p><b>Base:</b> ${d.bases.join(' / ')}</p>
      <p class="quiz-alt">Também combina com você: <b>${alt.d.emoji} ${alt.d.realName}</b></p>
      <div class="quiz-actions">
        <button class="quiz-btn primary" type="button" data-act="details">Ver ingredientes</button>
        <button class="quiz-btn" type="button" data-act="again">Refazer</button>
      </div>
    </div>`;
  sfx.clink();
  quizBody.querySelector('[data-act="details"]').addEventListener('click', () => {
    closeQuiz(true);
    openModal(d, cardEls[drinks.indexOf(d)]);
  });
  quizBody.querySelector('[data-act="again"]').addEventListener('click', () => {
    sfx.pop();
    qi = 0;
    answers = {};
    renderQuestion();
  });
  if (motion) {
    gsap.from('#quizEmoji', { scale: 0, rotation: -25, duration: 0.9, ease: 'elastic.out(1, 0.5)' });
    gsap.from(quizBody.querySelectorAll('.quiz-result > :not(.quiz-emoji)'), { y: 14, opacity: 0, stagger: 0.07, duration: 0.4, delay: 0.15, ease: 'power3.out' });
  }
}

function openQuiz() {
  qi = 0;
  answers = {};
  quizEl.classList.add('open');
  quizEl.setAttribute('aria-hidden', 'false');
  sfx.pop();
  renderQuestion();
  if (fabPulse) { fabPulse.kill(); fabPulse = null; gsap.set(quizBtn, { scale: 1 }); }
  quizBody.querySelector('.quiz-opt').focus({ preventScroll: true });
}

function closeQuiz(silent) {
  quizEl.classList.remove('open');
  quizEl.setAttribute('aria-hidden', 'true');
  if (!silent) { sfx.close(); quizBtn.focus({ preventScroll: true }); }
}

quizBtn.addEventListener('click', openQuiz);
quizClose.addEventListener('click', () => closeQuiz());
quizEl.addEventListener('click', (e) => { if (e.target === quizEl) closeQuiz(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && quizEl.classList.contains('open')) closeQuiz();
});
quizBody.addEventListener('click', (e) => {
  const btn = e.target.closest('.quiz-opt');
  if (!btn) return;
  const item = questions[qi];
  answers[item.key] = item.opts[Number(btn.dataset.i)][2];
  sfx.tick();
  qi++;
  if (qi < questions.length) renderQuestion();
  else renderResult();
});

if (motion) {
  gsap.from(quizBtn, { scale: 0, duration: 0.8, delay: 1.4, ease: 'back.out(2.5)' });
  fabPulse = gsap.to(quizBtn, { scale: 1.06, duration: 0.9, delay: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
}

// ===== Sons (Web Audio, sem arquivos) =====
let actx = null, master = null, lastHover = 0;

function audio() {
  if (!soundOn) return null;
  if (!actx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    actx = new AC();
    master = actx.createGain();
    master.gain.value = 0.22;
    master.connect(actx.destination);
  }
  if (actx.state === 'suspended') actx.resume();
  return actx;
}

function tone({ f = 440, to, d = 0.12, type = 'sine', v = 0.5, at = 0 }) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + d);
  o.connect(g);
  g.connect(master);
  o.start(t);
  o.stop(t + d + 0.03);
}

const sfx = {
  clink() {
    tone({ f: 2093, d: 0.45, v: 0.35 });
    tone({ f: 3136, d: 0.35, v: 0.2, at: 0.02 });
    tone({ f: 4186, d: 0.25, v: 0.1, at: 0.03 });
  },
  open() {
    tone({ f: 300, to: 700, d: 0.12, v: 0.3 });
    tone({ f: 2093, d: 0.4, v: 0.25, at: 0.08 });
    tone({ f: 3136, d: 0.3, v: 0.15, at: 0.1 });
  },
  close() { tone({ f: 520, to: 260, d: 0.16, v: 0.3 }); },
  pop() { tone({ f: 520, to: 160, d: 0.14, v: 0.5 }); },
  bubble() { tone({ f: 300, to: 900, d: 0.1, v: 0.4 }); },
  tick() { tone({ f: 760, to: 520, d: 0.06, type: 'triangle', v: 0.35 }); },
  hover() {
    const now = performance.now();
    if (now - lastHover < 90) return;
    lastHover = now;
    tone({ f: 1200, d: 0.04, v: 0.07 });
  },
  theme(next) {
    const notes = next === 'light' ? [523, 659, 784] : [784, 659, 523];
    notes.forEach((f, i) => tone({ f, d: 0.18, type: 'triangle', v: 0.3, at: i * 0.07 }));
  }
};

soundBtn.addEventListener('click', () => {
  soundOn = !soundOn;
  store.set('sound', soundOn ? 'on' : 'off');
  updateSoundUI();
  if (soundOn) sfx.pop();
});
sceneBtn.addEventListener('click', () => {
  sceneOn = !sceneOn;
  store.set('scene3d', sceneOn ? 'on' : 'off');
  root.classList.toggle('no-3d', !sceneOn);
  document.body.classList.remove('over-3d');
  updateSceneUI();
  if (scene3d) scene3d.setEnabled(sceneOn);
  else if (sceneOn) boot3D();
  if (sceneOn) sfx.pop();
});

// ===== Cena 3D (Three.js, carregado depois do site) =====
function createScene() {
  const canvas = $('#scene');
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch (e) {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.z = 14;

  const amb = new THREE.AmbientLight(0xffffff, 0.85);
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(4, 6, 8);
  const greenLight = new THREE.PointLight(0x11d66b, 0.35, 40);
  greenLight.position.set(-8, 2, 6);
  const redLight = new THREE.PointLight(0xff6178, 0.35, 40);
  redLight.position.set(8, -2, 6);
  scene.add(amb, key, greenLight, redLight);

  const M = THREE;
  const glassMat = new M.MeshPhysicalMaterial({
    color: 0xffffff, transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0.1,
    clearcoat: 1, clearcoatRoughness: 0.05, side: M.DoubleSide, depthWrite: false
  });
  const liquidMat = new M.MeshStandardMaterial({ color: 0x3af08a, transparent: true, opacity: 0.85, roughness: 0.25 });
  const iceMat = new M.MeshPhysicalMaterial({ color: 0xcdeeff, transparent: true, opacity: 0.55, roughness: 0.1, clearcoat: 1 });
  const limeMat = new M.MeshStandardMaterial({ color: 0x6bd13a, roughness: 0.5 });
  const limeInMat = new M.MeshStandardMaterial({ color: 0xd7f58a, roughness: 0.6 });
  const cherryMat = new M.MeshStandardMaterial({ color: 0xe0263f, roughness: 0.25, metalness: 0.1 });
  const stemMat = new M.MeshStandardMaterial({ color: 0x5b3b1f, roughness: 0.8 });
  const bubbleMat = new M.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.25, roughness: 0, clearcoat: 1 });
  const strawMat = new M.MeshStandardMaterial({ color: 0xff6178, roughness: 0.4 });
  const orangeMat = new M.MeshStandardMaterial({ color: 0xff9a1f, roughness: 0.5 });
  const orangeInMat = new M.MeshStandardMaterial({ color: 0xffd27a, roughness: 0.6 });
  const mintMat = new M.MeshStandardMaterial({ color: 0x2fbf5a, roughness: 0.55, side: M.DoubleSide });
  const umbrellaMat = new M.MeshStandardMaterial({ color: 0xff6178, roughness: 0.5, side: M.DoubleSide });
  const sparkleMat = new M.MeshStandardMaterial({ color: 0xffd84c, emissive: 0xffa600, emissiveIntensity: 0.5, roughness: 0.3 });
  const edgeMat = new M.LineBasicMaterial({ color: 0x2c6a50, transparent: true, opacity: 0.55 });

  // Taça de martini
  const glass = new M.Group();
  const profile = [[0, 0], [1.0, 0], [1.0, 0.08], [0.14, 0.16], [0.1, 0.3], [0.1, 2.3], [0.16, 2.4], [1.7, 4.0], [1.74, 4.05]]
    .map(([x, y]) => new M.Vector2(x, y));
  glass.add(new M.Mesh(new M.LatheGeometry(profile, 40), glassMat));
  const liquidProfile = [[0.01, 2.55], [1.4, 3.8], [0.01, 3.8]].map(([x, y]) => new M.Vector2(x, y));
  glass.add(new M.Mesh(new M.LatheGeometry(liquidProfile, 40), liquidMat));
  const wheel = new M.Group();
  wheel.add(new M.Mesh(new M.CylinderGeometry(0.7, 0.7, 0.1, 32), limeMat));
  wheel.add(new M.Mesh(new M.CylinderGeometry(0.58, 0.58, 0.12, 32), limeInMat));
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(1.5, 4.1, 0);
  glass.add(wheel);
  const straw = new M.Mesh(new M.CylinderGeometry(0.06, 0.06, 2.4, 10), strawMat);
  straw.position.set(0.4, 4.0, 0);
  straw.rotation.z = -0.3;
  glass.add(straw);
  glass.children.forEach(c => { c.position.y -= 2.6; });
  glass.userData = { kind: 'glass', spin: 0 };
  scene.add(glass);

  // Objetos flutuantes (geometrias compartilhadas = leve)
  const boxGeo = new M.BoxGeometry(1, 1, 1);
  const discGeo = new M.CylinderGeometry(0.55, 0.55, 0.08, 24);
  const discInGeo = new M.CylinderGeometry(0.45, 0.45, 0.1, 24);
  const ballGeo = new M.SphereGeometry(1, 20, 14);
  const stemGeo = new M.CylinderGeometry(0.02, 0.02, 0.6, 6);

  const edgesGeo = new M.EdgesGeometry(boxGeo);
  const umbrellaGeo = new M.ConeGeometry(0.7, 0.45, 14, 1, true);
  const stickGeo = new M.CylinderGeometry(0.03, 0.03, 1.1, 6);
  const sparkleGeo = new M.OctahedronGeometry(1, 0);

  const makers = {
    ice() {
      const m = new M.Mesh(boxGeo, iceMat);
      m.add(new M.LineSegments(edgesGeo, edgeMat));
      return m;
    },
    orange() {
      const g = new M.Group();
      g.add(new M.Mesh(discGeo, orangeMat), new M.Mesh(discInGeo, orangeInMat));
      return g;
    },
    mint() {
      const g = new M.Group();
      [[0, 0.5, 0], [0.45, -0.2, 0.9], [-0.45, -0.2, -0.9]].forEach(([x, y, r]) => {
        const leaf = new M.Mesh(ballGeo, mintMat);
        leaf.scale.set(0.55, 0.1, 0.32);
        leaf.position.set(x * 0.6, y * 0.4, 0);
        leaf.rotation.z = r;
        g.add(leaf);
      });
      return g;
    },
    umbrella() {
      const g = new M.Group();
      g.add(new M.Mesh(umbrellaGeo, umbrellaMat));
      const st = new M.Mesh(stickGeo, stemMat);
      st.position.y = -0.4;
      g.add(st);
      return g;
    },
    sparkle() {
      const g = new M.Group();
      const m = new M.Mesh(sparkleGeo, sparkleMat);
      m.scale.set(0.55, 0.85, 0.55);
      g.add(m);
      return g;
    },
    lime() {
      const g = new M.Group();
      g.add(new M.Mesh(discGeo, limeMat), new M.Mesh(discInGeo, limeInMat));
      return g;
    },
    cherry() {
      const g = new M.Group();
      const b = new M.Mesh(ballGeo, cherryMat);
      b.scale.setScalar(0.38);
      const s = new M.Mesh(stemGeo, stemMat);
      s.position.set(0.1, 0.55, 0);
      s.rotation.z = -0.35;
      g.add(b, s);
      return g;
    },
    bubble() { return new M.Mesh(ballGeo, bubbleMat); }
  };

  const group = new M.Group();
  scene.add(group);
  const kinds = ['ice', 'lime', 'cherry', 'bubble', 'orange', 'mint', 'umbrella', 'sparkle'];
  const count = innerWidth < 640 ? 12 : 22;
  const floaters = [];
  for (let i = 0; i < count; i++) {
    const kind = kinds[i % kinds.length];
    const mesh = makers[kind]();
    const mid = Math.random() < 0.4;
    const base = (kind === 'bubble' ? 0.25 + Math.random() * 0.3 : 0.55 + Math.random() * 0.45) * (mid ? 0.75 : 1);
    mesh.userData.kind = kind;
    mesh.userData.base = base;
    mesh.scale.setScalar(base);
    mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
    group.add(mesh);
    floaters.push({
      mesh, kind, base, mid,
      u: Math.random(), z: -4 + Math.random() * 5, jitter: Math.random() - 0.5,
      rx: (Math.random() - 0.5) * 0.8, ry: (Math.random() - 0.5) * 0.8,
      sp: 0.5 + Math.random() * 0.8, ph: Math.random() * 6.28,
      x: 0, y: 0
    });
  }

  let visW = 1, visH = 1, travel = 0, glassY = 0;
  let scrollTarget = 0, scrollSmooth = 0;
  let px = 0, py = 0, tx = 0, ty = 0;

  function layout() {
    const w = innerWidth, h = innerHeight, aspect = w / h;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    visH = 2 * Math.tan(M.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    visW = visH * aspect;

    const appHalf = Math.min(490, w * 0.46);
    const marginStart = Math.min(0.92, appHalf / (w / 2));
    const lo = Math.min(0.78, marginStart);
    const pages = Math.max(1, document.documentElement.scrollHeight / h);
    travel = (pages - 1) * visH * 0.55;
    const small = aspect < 0.8;

    floaters.forEach((f, i) => {
      const side = i % 2 ? 1 : -1;
      const from = f.mid ? 0.12 : lo;
      const to = f.mid ? Math.max(0.55, lo - 0.1) : 1.08;
      f.x = side * (visW / 2) * (from + f.u * (to - from));
      f.y = visH * 0.5 - (i / floaters.length) * (visH + travel) - f.jitter * visH * 0.1;
      f.mesh.position.set(f.x, f.y, f.z);
      f.mesh.scale.setScalar(f.base * (small ? 0.8 : 1));
    });

    glass.scale.setScalar(small ? 0.5 : 0.75);
    glass.position.x = marginStart < 0.8 ? (visW / 2) * ((marginStart + 1) / 2) : (visW / 2) * 0.78;
    glassY = visH * 0.1;
    glass.position.y = glassY;
    scrollMetrics();
  }

  function scrollMetrics() {
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollTarget = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  }

  function update(dt, t) {
    scrollSmooth += (scrollTarget - scrollSmooth) * Math.min(1, dt * 4);
    group.position.y = scrollSmooth * travel;
    px += (tx - px) * Math.min(1, dt * 3);
    py += (ty - py) * Math.min(1, dt * 3);
    camera.position.x = px * 0.7;
    camera.position.y = -py * 0.5;
    camera.lookAt(0, 0, 0);
    for (const f of floaters) {
      f.mesh.rotation.x += f.rx * dt;
      f.mesh.rotation.y += f.ry * dt;
      f.mesh.position.y = f.y + Math.sin(t * f.sp + f.ph) * 0.18;
    }
    glass.rotation.y = t * 0.45 + px * 0.6 + glass.userData.spin;
    glass.rotation.x = py * 0.12;
    glass.position.y = glassY + Math.sin(t * 0.9) * 0.12;
  }

  let raf = 0, running = false, last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    update(dt, now / 1000);
    renderer.render(scene, camera);
  }
  let enabled = true;
  function start() {
    if (running || reduced || !enabled) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  function renderOnce() {
    update(0.016, 0);
    renderer.render(scene, camera);
  }

  function setTheme(theme) {
    const dark = theme === 'dark';
    amb.color.set(dark ? 0x8fa3c8 : 0xffffff);
    amb.intensity = dark ? 0.55 : 0.85;
    key.color.set(dark ? 0xbfd8ff : 0xffffff);
    key.intensity = dark ? 1.0 : 0.9;
    greenLight.intensity = dark ? 1.3 : 0.35;
    redLight.intensity = dark ? 1.3 : 0.35;
    iceMat.color.set(dark ? 0x9fdcff : 0x7cc4ee);
    iceMat.opacity = dark ? 0.5 : 0.8;
    glassMat.color.set(dark ? 0xffffff : 0x9fd8c0);
    glassMat.opacity = dark ? 0.22 : 0.5;
    bubbleMat.color.set(dark ? 0xffffff : 0x8fc9ee);
    bubbleMat.opacity = dark ? 0.2 : 0.55;
    edgeMat.color.set(dark ? 0xbfe6ff : 0x2c6a50);
    edgeMat.opacity = dark ? 0.35 : 0.7;
    liquidMat.opacity = dark ? 0.85 : 1;
    liquidMat.color.set(dark ? 0x3af08a : 0x1fbf6a);
    liquidMat.emissive.set(dark ? 0x0d5a30 : 0x000000);
    limeMat.color.set(dark ? 0x6bd13a : 0x3fae1f);
    cherryMat.color.set(dark ? 0xe0263f : 0xc4162e);
    orangeMat.color.set(dark ? 0xff9a1f : 0xf07a00);
    mintMat.color.set(dark ? 0x2fbf5a : 0x1f9a44);
    if (reduced || !running) renderOnce();
  }

  let resizeTimer = 0;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { layout(); if (reduced) renderOnce(); }, 120);
  });
  addEventListener('scroll', scrollMetrics, { passive: true });
  addEventListener('pointermove', (e) => {
    tx = (e.clientX / innerWidth) * 2 - 1;
    ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  // Clique nos objetos 3D: acerto por proximidade na tela (área generosa, funciona por cima dos cards)
  const hitRadius = { glass: 2.4, ice: 0.9, lime: 0.7, cherry: 0.6, bubble: 1, orange: 0.7, mint: 0.7, umbrella: 0.8, sparkle: 0.9 };
  const wp = new M.Vector3();
  const blocked = '.controls, .fab, .quiz, .modal, button, a';
  function pickObject(cx, cy) {
    if (!enabled) return null;
    const pad = matchMedia('(pointer: coarse)').matches ? 26 : 14;
    let best = null, bestGap = Infinity;
    for (const o of [glass, ...floaters.map(f => f.mesh)]) {
      o.getWorldPosition(wp);
      const dist = wp.distanceTo(camera.position);
      const pxPerUnit = innerHeight / (2 * Math.tan(M.MathUtils.degToRad(camera.fov / 2)) * dist);
      wp.project(camera);
      if (wp.z > 1) continue;
      const sx = (wp.x + 1) / 2 * innerWidth;
      const sy = (1 - wp.y) / 2 * innerHeight;
      const r = hitRadius[o.userData.kind] * o.scale.x * pxPerUnit + pad;
      const gap = Math.hypot(cx - sx, cy - sy) - r;
      if (gap < 0 && gap < bestGap) { best = o; bestGap = gap; }
    }
    return best;
  }

  const overlayOpen = () => $('#modal').classList.contains('open') || $('#quiz').classList.contains('open');
  let hoverQueued = false;
  addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch' || hoverQueued) return;
    hoverQueued = true;
    const { clientX, clientY, target } = e;
    requestAnimationFrame(() => {
      hoverQueued = false;
      const over = !overlayOpen() && !(target.closest && target.closest(blocked)) && !!pickObject(clientX, clientY);
      document.body.classList.toggle('over-3d', over);
    });
  }, { passive: true });

  addEventListener('click', (e) => {
    if (e.detail === 0 || overlayOpen() || (e.target.closest && e.target.closest(blocked))) return;
    const o = pickObject(e.clientX, e.clientY);
    if (!o) return;
    e.stopPropagation();
    e.preventDefault();
    const kind = o.userData.kind;

    if (kind === 'glass') sfx.clink();
    else if (kind === 'bubble') sfx.bubble();
    else sfx.pop();
    if (reduced || !window.gsap) return;

    if (kind === 'glass') {
      gsap.to(glass.userData, { spin: '+=6.283', duration: 1.2, ease: 'power3.out' });
    } else if (kind === 'bubble') {
      const s = o.userData.base;
      gsap.timeline()
        .to(o.scale, { x: 0, y: 0, z: 0, duration: 0.15, ease: 'power2.in' })
        .to(o.scale, { x: s, y: s, z: s, duration: 0.9, ease: 'elastic.out(1, 0.5)' }, '+=1');
    } else {
      const s = o.scale.x;
      gsap.fromTo(o.scale, { x: s * 1.6, y: s * 1.6, z: s * 1.6 }, { x: s, y: s, z: s, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      gsap.to(o.rotation, { y: '+=6.283', duration: 1, ease: 'power3.out' });
    }
  }, true);

  layout();
  setTheme(root.dataset.theme);
  canvas.classList.add('ready');
  if (motion) {
    gsap.from(glass.scale, { x: 0, y: 0, z: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)', delay: 0.3 });
    floaters.forEach((f, i) => {
      gsap.from(f.mesh.scale, { x: 0, y: 0, z: 0, duration: 0.9, ease: 'back.out(2)', delay: 0.5 + i * 0.05 });
    });
  }
  if (reduced) renderOnce(); else start();

  function setEnabled(v) {
    enabled = v;
    if (!v) { stop(); return; }
    layout();
    if (reduced) renderOnce(); else start();
  }

  return { setTheme, setEnabled };
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

let booting = false;
function boot3D() {
  if (booting || scene3d || !sceneOn) return;
  booting = true;
  loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
    .then(() => { scene3d = createScene(); })
    .catch(() => { })
    .finally(() => { booting = false; });
}

const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 400));
addEventListener('load', () => idle(() => drinks.forEach((d) => { new Image().src = d.image; })));
if (document.readyState === 'complete') idle(boot3D);
else addEventListener('load', () => idle(boot3D));
