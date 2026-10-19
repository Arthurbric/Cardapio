(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  };

  const BASES = [
    { id: 'cachaca', name: 'Cachaça', e: '🥃', note: 'forte e brasileira', word: 'Brasil', color: '#e8c25a' },
    { id: 'vodca', name: 'Vodca', e: '❄️', note: 'neutra e seca', word: 'Frost', color: '#d3ecf7' },
    { id: 'rum', name: 'Rum', e: '🏴‍☠️', note: 'adocicado', word: 'Pirate', color: '#c9772e' }
  ];
  const BASE_NAME = { cachaca: 'cachaça', vodca: 'vodca', rum: 'rum' };

  const MIXERS = [
    { id: 'limao', name: 'Limão', e: '🍋', note: 'cítrico', word: 'Lime', top: '#dcf56f', bot: '#a8d62f', flavor: 'cítrico e refrescante',
      ing: ['4 gomos de limão'], prep: 'Macere o limão com o açúcar no fundo do copo.',
      twin: { name: 'Caipirinha / Caipiroska / Daiquiri', e: '🍋', code: 'root.caipi()', bases: ['cachaca', 'vodca', 'rum'] } },
    { id: 'hortela', name: 'Hortelã', e: '🌿', note: 'fresco', word: 'Mint', top: '#a9eeb3', bot: '#55c879', flavor: 'fresco e herbal',
      ing: ['10 folhas de hortelã', '½ limão em gomos', 'Um fio de água com gás'], prep: 'Amasse de leve a hortelã com o limão no fundo do copo.',
      twin: { name: 'Mojito', e: '🌿', code: 'mint.deploy()', bases: ['rum'] } },
    { id: 'maracuja', name: 'Maracujá', e: '💛', note: 'azedinho', word: 'Passion', top: '#ffe266', bot: '#ffb100', flavor: 'azedinho e tropical',
      ing: ['100 ml de polpa de maracujá'], prep: 'Coloque a polpa de maracujá no copo.',
      twin: { name: 'Batida de Maracujá', e: '💛', code: 'passion.commit()', bases: ['cachaca'] } },
    { id: 'coco', name: 'Coco e abacaxi', e: '🍍', note: 'cremoso', word: 'Tropical', top: '#fff7d9', bot: '#ffe28f', flavor: 'cremoso e tropical',
      ing: ['80 ml de suco de abacaxi', '40 ml de leite de coco'], prep: 'Misture o abacaxi com o leite de coco até ficar cremoso.',
      twin: { name: 'Piña Colada', e: '🍍', code: 'kernel.colada()', bases: ['rum'] } },
    { id: 'laranja', name: 'Laranja', e: '🍊', note: 'suave', word: 'Sunset', top: '#ffc468', bot: '#ff8a1f', flavor: 'suave e frutado',
      ing: ['120 ml de suco de laranja'], prep: 'Coloque o suco de laranja no copo.',
      twin: { name: 'Vodca com Suco de Laranja', e: '🍊', code: 'sunset.compile()', bases: ['vodca'] } },
    { id: 'rosa', name: 'Limonada rosa', e: '🩷', note: 'doce e azedinho', word: 'Pink', top: '#ffb6cd', bot: '#ff6a9a', flavor: 'doce e azedinho',
      ing: ['Suco de 1 limão', 'Um fio de xarope de morango', 'Água com gás'], prep: 'Misture o limão com o xarope de morango no copo.',
      twin: { name: 'Pink Lemon', e: '🩷', code: 'pink.packet()', bases: ['vodca', 'rum'] } }
  ];

  const SWEET = [
    { id: 0, name: 'Seco', e: '🍋', note: 'sem açúcar', v: 0, ing: null },
    { id: 1, name: 'Médio', e: '🍯', note: '1 colher', v: 0.06, ing: '1 colher de açúcar (ou xarope)' },
    { id: 2, name: 'Doce', e: '🍬', note: '2 colheres', v: 0.13, ing: '2 colheres de açúcar (ou xarope)' }
  ];
  const ICE = [
    { id: 1, name: 'Com gelo', e: '🧊' },
    { id: 0, name: 'Sem gelo', e: '🚫' }
  ];
  const GARN = [
    { id: 'lime', name: 'Limão', e: '🍋', ing: 'Rodela de limão para enfeitar' },
    { id: 'orange', name: 'Laranja', e: '🍊', ing: 'Rodela de laranja para enfeitar' },
    { id: 'mint', name: 'Hortelã', e: '🌿', ing: 'Um ramo de hortelã para enfeitar' },
    { id: 'cherry', name: 'Cereja', e: '🍒', ing: 'Uma cereja para enfeitar' },
    { id: 'umbrella', name: 'Guarda-chuva', e: '☂️', ing: 'Um guarda-chuvinha de papel' },
    { id: 'none', name: 'Sem enfeite', e: '✖️', ing: null }
  ];
  const GROUPS = [
    { key: 'base', title: 'Base', hint: 'o coração do drink', list: BASES, cls: '' },
    { key: 'mixer', title: 'Mistura', hint: 'o sabor', list: MIXERS, cls: '' },
    { key: 'sweet', title: 'Doçura', hint: '', list: SWEET, cls: 'three' },
    { key: 'ice', title: 'Gelo', hint: '', list: ICE, cls: 'two' },
    { key: 'garnish', title: 'Enfeite', hint: 'o charme final', list: GARN, cls: '' }
  ];

  const DEFAULT = { base: null, mixer: null, sweet: 1, ice: 1, garnish: 'none' };
  let state = Object.assign({}, DEFAULT);
  const find = (list, id) => list.find((o) => String(o.id) === String(id));

  // ===== Sons =====
  let soundOn = store.get('sound') !== 'off';
  let ac = null;
  function tone(f, d, type, v, at) {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
      const t = ac.currentTime + (at || 0);
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.type = type || 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(v || 0.12, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      o.connect(g).connect(ac.destination);
      o.start(t);
      o.stop(t + d + 0.02);
    } catch (e) { }
  }
  const sfx = {
    pick() { tone(520, 0.09, 'triangle', 0.12); tone(780, 0.12, 'triangle', 0.09, 0.05); },
    dice() { [300, 380, 460, 560].forEach((f, i) => tone(f, 0.08, 'square', 0.04, i * 0.09)); },
    clink() { tone(1568, 0.55, 'sine', 0.1); tone(2093, 0.45, 'sine', 0.07, 0.04); }
  };

  // ===== Passos =====
  const stepsEl = $('#steps');
  GROUPS.forEach((g, i) => {
    const box = document.createElement('div');
    box.className = 'step in';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-labelledby', 'sl-' + g.key);
    box.style.animationDelay = (0.15 + i * 0.07) + 's';
    box.innerHTML =
      '<div class="step-head" id="sl-' + g.key + '"><span class="step-n">' + (i + 1) + '</span>' + g.title +
      (g.hint ? '<span class="step-hint">' + g.hint + '</span>' : '') + '</div>' +
      '<div class="opts ' + g.cls + '">' + g.list.map((o) =>
        '<button class="opt" type="button" aria-pressed="false" data-k="' + g.key + '" data-v="' + o.id + '">' +
        '<span class="e">' + o.e + '</span>' + o.name + (o.note ? '<small>' + o.note + '</small>' : '') + '</button>').join('') + '</div>';
    stepsEl.appendChild(box);
  });

  stepsEl.addEventListener('click', (e) => {
    const b = e.target.closest('.opt');
    if (!b) return;
    const k = b.dataset.k;
    const g = GROUPS.find((x) => x.key === k);
    const o = find(g.list, b.dataset.v);
    state[k] = o.id;
    sfx.pick();
    render();
  });

  // ===== Copo =====
  const el = {
    syrup: $('#rSyrup'), base: $('#rBase'), mix: $('#rMix'), ice: $('#ice'),
    clip: $('#liqClip'), top: $('#mixTop'), bot: $('#mixBot'), svg: $('#glass')
  };
  const Y_B = 320, MAXH = 270;
  const cur = { syrup: 0, base: 0, mix: 0, ice: 0 };
  const tgt = Object.assign({}, cur);

  function draw() {
    let y = Y_B;
    [['syrup', cur.syrup], ['base', cur.base], ['mix', cur.mix]].forEach(([k, v]) => {
      const h = v * MAXH;
      el[k].setAttribute('y', (y - h).toFixed(2));
      el[k].setAttribute('height', (h > 0.5 ? h + 1 : 0).toFixed(2));
      y -= h;
    });
    el.clip.setAttribute('y', y.toFixed(2));
    el.clip.setAttribute('height', (Y_B - y).toFixed(2));
    el.ice.setAttribute('transform', 'translate(0 ' + Math.min(y + 12, Y_B - 6).toFixed(2) + ')');
    el.ice.setAttribute('opacity', cur.ice.toFixed(2));
  }

  let raf = 0, last = 0;
  function tick(now) {
    const k = 1 - Math.exp(-Math.min((now - last) / 1000, 0.05) * 7);
    last = now;
    let moving = false;
    for (const key in cur) {
      const d = tgt[key] - cur[key];
      if (Math.abs(d) > 0.0005) { cur[key] += d * k; moving = true; } else cur[key] = tgt[key];
    }
    draw();
    raf = moving ? requestAnimationFrame(tick) : 0;
  }
  function animate() {
    if (reduced) { Object.assign(cur, tgt); draw(); return; }
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function updateGlass() {
    const b = find(BASES, state.base), m = find(MIXERS, state.mixer);
    const s = find(SWEET, state.sweet).v;
    const fill = state.ice ? 0.8 : 0.86;
    const any = b || m;
    tgt.syrup = any ? s : 0;
    tgt.base = b ? 0.22 : 0;
    tgt.mix = m ? Math.max(0, fill - (b ? 0.22 : 0) - tgt.syrup) : 0;
    tgt.ice = state.ice ? 1 : 0;
    if (b) el.base.style.fill = b.color;
    if (m) { el.top.style.stopColor = m.top; el.bot.style.stopColor = m.bot; }
    GARN.forEach((g) => {
      const n = $('#g-' + g.id);
      if (n) n.classList.toggle('on', state.garnish === g.id);
    });
    animate();
  }

  // ===== Receita =====
  const recipe = $('#recipe');
  let current = null;

  function build() {
    const b = find(BASES, state.base), m = find(MIXERS, state.mixer);
    if (!b || !m) return null;
    const sw = find(SWEET, state.sweet), g = find(GARN, state.garnish);
    const name = b.word + ' ' + m.word;
    const code = b.id + '.' + m.id + '()';
    const exact = m.twin.bases.indexOf(b.id) !== -1;
    const ing = ['50 ml de ' + BASE_NAME[b.id]].concat(m.ing);
    if (sw.ing) ing.push(sw.ing);
    ing.push(state.ice ? 'Gelo a gosto' : 'Sem gelo no copo (sirva bem gelado)');
    if (g.ing) ing.push(g.ing);
    const how = [m.prep];
    if (state.ice) how.push('Encha o copo com gelo.');
    how.push('Adicione 50 ml de ' + BASE_NAME[b.id] + '.');
    how.push('Misture com uma colher' + (g.ing ? ' e finalize com o enfeite' : '') + '. Saúde! 🥂');
    const twinText = exact
      ? 'Esse drink já existe no cardápio!'
      : 'Quase igual! No cardápio a base é ' + m.twin.bases.map((x) => BASE_NAME[x]).join(' ou ') + '.';
    return {
      name, code, b, m, sw, g, ing, how, twinText,
      desc: 'Um drink ' + m.flavor + ', com ' + BASE_NAME[b.id] + ' (' + b.note + '). Perfeito para brindar a formatura do Arthur 🎓'
    };
  }

  function renderRecipe(r) {
    $('#rName').textContent = r.name;
    $('#rDesc').textContent = r.desc;
    $('#rChips').innerHTML = [r.b.name, r.m.name, r.sw.name, state.ice ? 'Com gelo' : 'Sem gelo']
      .concat(r.g.ing ? [r.g.name] : []).map((t) => '<span class="chip">' + t + '</span>').join('');
    $('#twin').innerHTML =
      '<span class="e">' + r.m.twin.e + '</span><div><b>' + r.m.twin.name + '</b><span>' + r.twinText + '</span></div>' +
      '<a href="index.html">Ver cardápio →</a>';
    const fill = (sel, items) => {
      const ul = $(sel);
      ul.textContent = '';
      items.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
    };
    fill('#rIng', r.ing);
    fill('#rSteps', r.how);
  }

  function render() {
    document.querySelectorAll('.opt').forEach((b) => {
      b.setAttribute('aria-pressed', String(String(state[b.dataset.k]) === b.dataset.v));
    });
    updateGlass();

    const b = find(BASES, state.base), m = find(MIXERS, state.mixer);
    $('#codename').textContent = (b ? b.id : '?') + '.' + (m ? m.id : '?') + '()';
    current = build();
    $('#dname').textContent = current ? current.name : (b ? 'Agora escolha a mistura' : m ? 'Agora escolha a base' : 'Escolha a base');

    if (current) {
      renderRecipe(current);
      if (recipe.hidden) {
        recipe.hidden = false;
        recipe.classList.add('in');
        toast('Seu drink ficou pronto! Role para ver a receita 👇');
      }
    } else {
      recipe.hidden = true;
      recipe.classList.remove('in');
    }
    writeHash();
  }

  // ===== Link compartilhável =====
  function writeHash() {
    try {
      const h = state.base || state.mixer
        ? '#' + [state.base || '_', state.mixer || '_', state.sweet, state.ice, state.garnish].join('-')
        : location.pathname + location.search;
      history.replaceState(null, '', h);
    } catch (e) { }
  }
  function readHash() {
    const p = location.hash.slice(1).split('-');
    if (p.length !== 5) return;
    if (find(BASES, p[0])) state.base = p[0];
    if (find(MIXERS, p[1])) state.mixer = p[1];
    if (find(SWEET, p[2])) state.sweet = Number(p[2]);
    if (find(ICE, p[3])) state.ice = Number(p[3]);
    if (find(GARN, p[4])) state.garnish = p[4];
  }

  // ===== Ações =====
  const toastEl = $('#toast');
  let toastTimer = 0;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2600);
  }

  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  let rolling = false;
  $('#rand').addEventListener('click', () => {
    if (rolling) return;
    rolling = true;
    const roll = () => {
      state = { base: pick(BASES).id, mixer: pick(MIXERS).id, sweet: pick(SWEET).id, ice: pick(ICE).id, garnish: pick(GARN).id };
      render();
    };
    sfx.dice();
    if (reduced) { roll(); rolling = false; return; }
    let n = 0;
    const iv = setInterval(() => {
      roll();
      if (++n >= 4) { clearInterval(iv); rolling = false; }
    }, 130);
  });

  $('#reset').addEventListener('click', () => {
    state = Object.assign({}, DEFAULT);
    sfx.pick();
    render();
  });

  $('#serve').addEventListener('click', () => {
    if (!current) return;
    sfx.clink();
    toast('Saúde, ' + current.name + '! 🥂');
    if (reduced) return;
    el.svg.animate(
      [{ transform: 'rotate(0)' }, { transform: 'rotate(-7deg)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(-3deg)' }, { transform: 'rotate(0)' }],
      { duration: 600, easing: 'ease-out' });
    const r = el.svg.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height * 0.3;
    const icons = ['🥂', '✨', '🎓', '🎉', current.m.e, current.b.e];
    for (let i = 0; i < 16; i++) {
      const s = document.createElement('span');
      s.className = 'burst';
      s.textContent = pick(icons);
      s.style.left = cx + 'px';
      s.style.top = cy + 'px';
      document.body.appendChild(s);
      const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 150;
      s.animate([
        { transform: 'translate(-50%,-50%) scale(.4)', opacity: 1 },
        { transform: 'translate(calc(-50% + ' + Math.cos(a) * d + 'px), calc(-50% + ' + (Math.sin(a) * d - 60) + 'px)) scale(1.1) rotate(' + (Math.random() * 90 - 45) + 'deg)', opacity: 0 }
      ], { duration: 900 + Math.random() * 500, easing: 'cubic-bezier(.2,.8,.3,1)' }).onfinish = () => s.remove();
    }
  });

  $('#copy').addEventListener('click', () => {
    if (!current) return;
    const txt = '🍸 ' + current.name + ' (' + current.code + ')\n' + current.desc +
      '\n\nIngredientes:\n' + current.ing.map((t) => '- ' + t).join('\n') +
      '\n\nModo de preparo:\n' + current.how.map((t, i) => (i + 1) + '. ' + t).join('\n') +
      '\n\nMonte o seu: ' + location.href;
    const ok = () => toast('Receita copiada! 📋');
    const fallback = () => {
      const ta = document.createElement('textarea');
      ta.value = txt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); ok(); } catch (e) { toast('Não consegui copiar 😕'); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(ok, fallback);
    else fallback();
  });

  // ===== Tema e som =====
  const themeBtn = $('#themeBtn');
  const soundBtn = $('#soundBtn');
  function themeUI() {
    const dark = root.dataset.theme === 'dark';
    themeBtn.textContent = dark ? '☀️' : '🌙';
    themeBtn.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
    $('#metaTheme').setAttribute('content', dark ? '#07120e' : '#f7fff8');
  }
  function soundUI() {
    soundBtn.textContent = soundOn ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-pressed', String(soundOn));
    soundBtn.setAttribute('aria-label', soundOn ? 'Desligar sons' : 'Ligar sons');
  }
  themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    const apply = () => { root.dataset.theme = next; store.set('theme', next); themeUI(); };
    if (document.startViewTransition && !reduced) document.startViewTransition(apply); else apply();
  });
  soundBtn.addEventListener('click', () => {
    soundOn = !soundOn;
    store.set('sound', soundOn ? 'on' : 'off');
    soundUI();
    if (soundOn) sfx.pick();
  });

  themeUI();
  soundUI();
  readHash();
  render();
})();
