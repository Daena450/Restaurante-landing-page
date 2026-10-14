/* ══════════════════════════════════════════════════
   SAKURA KITCHEN · main.js – Dinámico sin recarga
══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── 1. Cursor ─────────────────────────────────
    const cursor = document.getElementById('skCursor');
    if (cursor) {
        let mx = 0, my = 0, cx = 0, cy = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        const animCursor = () => {
            cx += (mx - cx) * 0.1; cy += (my - cy) * 0.1;
            cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
            requestAnimationFrame(animCursor);
        };
        animCursor();
        const hoverEls = () => document.querySelectorAll('a,button,.sk-prod-card,.sk-esp-card,input,select,textarea');
        const addHover = () => hoverEls().forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
        });
        addHover();
    }

    // ── 2. Navbar scroll ──────────────────────────
    const nav = document.getElementById('skNav');
    if (nav) {
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ── 3. Hamburger ──────────────────────────────
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            const open = mobileMenu.classList.toggle('open');
            const [s0,s1,s2] = hamburger.querySelectorAll('span');
            s0.style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
            s1.style.opacity   = open ? '0' : '';
            s2.style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
        });
        mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            hamburger.querySelectorAll('span').forEach(s => { s.style.transform=''; s.style.opacity=''; });
        }));
    }

    // ── 4. Pétalos ────────────────────────────────
    const petalContainer = document.getElementById('petals');
    if (petalContainer) {
        const symbols = ['🌸','🌺','✿','❀'];
        const mkPetal = () => {
            const p = document.createElement('div');
            p.className = 'petal';
            p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            p.style.left = Math.random() * 100 + 'vw';
            p.style.fontSize = (.45 + Math.random() * .55) + 'rem';
            p.style.animationDuration = (8 + Math.random() * 8) + 's';
            p.style.animationDelay = (Math.random() * 4) + 's';
            petalContainer.appendChild(p);
            setTimeout(() => p.remove(), 16000);
        };
        for (let i = 0; i < 5; i++) setTimeout(mkPetal, i * 900);
        setInterval(mkPetal, 3500);
    }

    // ── 5. Parallax sutil ─────────────────────────
    const heroBg = document.querySelector('.sk-hero-bg');
    const kanjiHero = document.querySelector('.sk-hero-kanji-bg');
    window.addEventListener('scroll', () => {
        const sy = window.scrollY;
        if (heroBg) heroBg.style.transform = `translateY(${sy * 0.12}px)`;
        if (kanjiHero) kanjiHero.style.transform = `translateY(${sy * 0.06}px)`;
    }, { passive: true });

    // ── 6. Fade-in al scroll ──────────────────────
    const animEls = document.querySelectorAll('[data-anim]');
    animEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transition = `opacity 0.9s ease ${el.dataset.delay||0}ms, transform 0.9s ease ${el.dataset.delay||0}ms`;
        const map = {'fade-up':'translateY(16px)','fade-left':'translateX(-16px)','fade-right':'translateX(16px)','zoom':'scale(0.96)'};
        el.style.transform = map[el.dataset.anim] || 'translateY(12px)';
    });
    const revObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='none'; revObs.unobserve(e.target); }
        });
    }, { threshold: 0.15 });
    animEls.forEach(el => revObs.observe(el));

    // ── 7. Barra de progreso ──────────────────────
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;width:0%;background:linear-gradient(90deg,#c0392b,#c9963a);z-index:9998;pointer-events:none;transition:width .08s linear;';
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => {
        bar.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    }, { passive: true });

    // ── 8. Contadores ─────────────────────────────
    function animCounter(el, target, dur = 1400) {
        const start = performance.now();
        const tick = now => {
            const p = Math.min((now - start) / dur, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(e * target);
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }
    const cntObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { const v=parseInt(e.target.textContent); if(!isNaN(v)) animCounter(e.target,v); cntObs.unobserve(e.target); }
        });
    }, { threshold: 0.6 });
    document.querySelectorAll('.sk-stat-n').forEach(el => cntObs.observe(el));
    document.querySelectorAll('.nos-n').forEach(el => {
        const raw = el.textContent.replace(/\D/g,''), val = parseInt(raw), suffix = el.textContent.replace(raw,'');
        if (isNaN(val)) return;
        const nObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { animCounter(e.target, val, 1400); setTimeout(()=>{ e.target.textContent = val+suffix; }, 1450); nObs.unobserve(e.target); }
            });
        }, { threshold: 0.6 });
        nObs.observe(el);
    });

    // ── 9. Tilt sutil en cards ────────────────────
    const addTilt = (cards) => cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const dx = (e.clientX - r.left - r.width/2) / (r.width/2);
            const dy = (e.clientY - r.top - r.height/2) / (r.height/2);
            card.style.transform = `translateY(-5px) rotateX(${-dy*3}deg) rotateY(${dx*3}deg)`;
            card.style.transition = 'transform .08s ease, box-shadow .3s, border-color .3s';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform .5s ease, box-shadow .3s, border-color .3s';
        });
    });
    addTilt(document.querySelectorAll('.sk-prod-card'));

    // ── 10. Navlink activo ────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.sk-nl');
    const secObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                const a = document.querySelector(`.sk-nl[href="#${e.target.id}"]`);
                if (a) a.classList.add('active');
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => secObs.observe(s));

    // ══════════════════════════════════════════════
    // 11. MODAL DE PRODUCTOS POR CATEGORÍA
    //     Se abre al clicar las tarjetas de especialidades
    // ══════════════════════════════════════════════

    // Crear modal dinámico
    const catModal = document.createElement('div');
    catModal.id = 'catModal';
    catModal.innerHTML = `
        <div class="cat-modal-box" id="catModalBox">
            <div class="cat-modal-head">
                <div class="cat-modal-title-wrap">
                    <span class="cat-modal-kanji" id="catModalKanji"></span>
                    <div>
                        <h3 class="cat-modal-title" id="catModalTitle"></h3>
                        <p class="cat-modal-desc" id="catModalDesc"></p>
                    </div>
                </div>
                <button class="cat-modal-close" id="catModalClose">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="cat-modal-body" id="catModalBody">
                <div class="cat-modal-loading">
                    <div class="cat-spinner"></div>
                    <span>Cargando productos...</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(catModal);

    // Cerrar modal
    const closeCatModal = () => {
        catModal.classList.remove('show');
        document.body.style.overflow = '';
    };
    document.getElementById('catModalClose').addEventListener('click', closeCatModal);
    catModal.addEventListener('click', e => { if (e.target === catModal) closeCatModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCatModal(); });

    // Datos de kanji por categoría
    const katakana = {
        'Sushi':'寿司', 'Ramen':'ラーメン', 'Rolls':'巻き',
        'Entradas':'前菜', 'Frituras':'揚げ物', 'Postres':'デザート',
        'Sopas':'スープ', 'Bebidas':'飲み物', 'all':'全部'
    };

    // Abrir modal y cargar productos vía API
    async function openCatModal(cat, title, desc) {
        document.getElementById('catModalKanji').textContent = katakana[cat] || '料理';
        document.getElementById('catModalTitle').textContent = title;
        document.getElementById('catModalDesc').textContent  = desc;
        document.getElementById('catModalBody').innerHTML = `
            <div class="cat-modal-loading">
                <div class="cat-spinner"></div>
                <span>Cargando productos...</span>
            </div>`;

        catModal.classList.add('show');
        document.body.style.overflow = 'hidden';

        try {
            const res  = await fetch(`/api/productos/categoria/${encodeURIComponent(cat)}`);
            const data = await res.json();
            renderCatProducts(data, cat);
        } catch(err) {
            document.getElementById('catModalBody').innerHTML =
                '<p class="cat-modal-error">No se pudieron cargar los productos.</p>';
        }
    }

    function renderCatProducts(productos, cat) {
        const body = document.getElementById('catModalBody');
        if (!productos.length) {
            body.innerHTML = `
                <div class="cat-modal-empty">
                    <span>🍜</span>
                    <p>No hay productos en esta categoría aún.</p>
                    <a href="/producto/nuevo" class="sk-btn-gold">+ Agregar producto</a>
                </div>`;
            return;
        }
        body.innerHTML = `
            <div class="cat-modal-count">${productos.length} producto${productos.length !== 1 ? 's' : ''} en ${cat}</div>
            <div class="cat-modal-grid" id="catModalGrid"></div>`;

        const grid = document.getElementById('catModalGrid');
        productos.forEach((p, i) => {
            const card = document.createElement('div');
            card.className = 'cat-prod-card';
            card.style.animationDelay = `${i * 60}ms`;
            card.innerHTML = `
                <div class="cat-prod-img">
                    ${p.imagen_url
                        ? `<img src="${p.imagen_url}" alt="${p.nombre}"
                               onerror="this.parentElement.querySelector('.cat-prod-fallback').style.display='flex';this.style.display='none'">`
                        : ''}
                    <div class="cat-prod-fallback" ${p.imagen_url ? 'style="display:none"' : ''}>
                        <i class="fas fa-bowl-food"></i>
                    </div>
                    ${!p.disponible ? '<div class="cat-prod-unavail">No disponible</div>' : ''}
                </div>
                <div class="cat-prod-body">
                    <span class="cat-prod-id">#${String(p.id).padStart(3,'0')}</span>
                    <h5 class="cat-prod-name">${p.nombre}</h5>
                    <p class="cat-prod-desc">${p.descripcion}</p>
                    <div class="cat-prod-foot">
                        <span class="cat-prod-price">$${p.precio.toFixed(2)}</span>
                        <span class="cat-prod-stock ${p.cantidad < 10 ? 'low' : ''}">
                            ${p.cantidad} uds.
                        </span>
                    </div>
                    <div class="cat-prod-actions">
                        <a href="/producto/${p.id}/editar" class="cat-prod-edit">
                            <i class="fas fa-pencil"></i> Editar
                        </a>
                        <button class="cat-prod-del" onclick="confirmarEliminar(${p.id},'${p.nombre.replace(/'/g,"\\'")}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>`;
            grid.appendChild(card);
        });
    }

    // Conectar tarjetas de especialidades
    document.querySelectorAll('.sk-esp-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const cat   = link.dataset.cat;
            const title = link.dataset.title;
            const desc  = link.dataset.desc;
            openCatModal(cat, title, desc);
        });
    });

    // ══════════════════════════════════════════════
    // 12. TABS DE CATÁLOGO – filtrar SIN recargar
    // ══════════════════════════════════════════════
    const tabs      = document.querySelectorAll('.sk-cat-card');
    const heroEl    = document.getElementById('catHero');
    const heroTitle = document.getElementById('catHeroTitle');
    const heroDesc  = document.getElementById('catHeroDesc');
    const prodGrid  = document.getElementById('prodGrid');

    if (heroTitle) heroTitle.style.transition = 'opacity 0.35s ease';
    if (heroDesc)  heroDesc.style.transition  = 'opacity 0.35s ease';

    // Chip de categoría activa (se inserta encima del grid)
    let chipEl = null;
    function showChip(cat) {
        removeChip();
        if (!prodGrid || cat === 'all') return;
        chipEl = document.createElement('div');
        chipEl.className = 'sk-active-cat-chip';
        chipEl.innerHTML = `
            <i class="fas fa-filter" style="font-size:.7rem"></i>
            ${cat}
            <button title="Ver todo" onclick="clearCatFilter()">✕</button>`;
        prodGrid.parentElement.insertBefore(chipEl, prodGrid);
    }
    function removeChip() {
        if (chipEl) { chipEl.remove(); chipEl = null; }
    }
    window.clearCatFilter = async () => {
        removeChip();
        tabs.forEach(t => t.classList.toggle('active', t.dataset.cat === 'all'));
        expandHero();
        window.history.pushState({}, '', window.location.pathname);
        await loadProducts('all');
    };

    function collapseHero() {
        if (heroEl) heroEl.classList.add('collapsed');
    }
    function expandHero() {
        if (heroEl) heroEl.classList.remove('collapsed');
    }

    // Al cargar: si hay categoría activa en URL, colapsar hero
    const urlParams = new URLSearchParams(window.location.search);
    const initCat = urlParams.get('categoria') || 'all';
    tabs.forEach(tab => {
        if (tab.dataset.cat === initCat || (initCat === 'all' && tab.dataset.cat === 'all')) {
            tab.classList.add('active');
        }
    });
    if (initCat !== 'all') {
        collapseHero();
        showChip(initCat);
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', async () => {
            const cat = tab.dataset.cat;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const url = new URL(window.location.href);
            cat === 'all' ? url.searchParams.delete('categoria') : url.searchParams.set('categoria', cat);
            url.searchParams.delete('busqueda');
            window.history.pushState({}, '', url);

            if (cat === 'all') {
                expandHero();
                removeChip();
            } else {
                collapseHero();
                showChip(cat);
                // Hacer scroll suave hasta el buscador
                setTimeout(() => {
                    document.querySelector('.sk-search-bar')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }

            await loadProducts(cat);
        });
    });

    async function loadProducts(cat) {
        if (!prodGrid) return;

        // Mostrar skeleton loader
        prodGrid.innerHTML = `
            ${[1,2,3,4].map(() => `
            <div class="sk-prod-skeleton">
                <div class="skel-img"></div>
                <div class="skel-body">
                    <div class="skel-line w60"></div>
                    <div class="skel-line w90"></div>
                    <div class="skel-line w75"></div>
                    <div class="skel-line w40"></div>
                </div>
            </div>`).join('')}`;

        try {
            const res  = await fetch(`/api/productos/categoria/${encodeURIComponent(cat)}`);
            const data = await res.json();

            if (!data.length) {
                prodGrid.innerHTML = `
                    <div class="sk-empty" style="grid-column:1/-1">
                        <span style="font-size:3rem">🍜</span>
                        <h4>Sin productos en esta categoría</h4>
                        <a href="/producto/nuevo" class="sk-btn-gold mt-2">+ Agregar</a>
                    </div>`;
                return;
            }

            prodGrid.innerHTML = data.map((p, i) => `
                <div class="sk-prod-card" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease ${(i%4)*70}ms,transform .5s ease ${(i%4)*70}ms,box-shadow .3s,border-color .3s">
                    <div class="sk-prod-img">
                        ${p.imagen_url
                            ? `<img src="${p.imagen_url}" alt="${p.nombre}"
                                   onerror="this.parentElement.querySelector('.sk-prod-fallback').style.display='flex';this.style.display='none'">`
                            : ''}
                        <div class="sk-prod-fallback" ${p.imagen_url ? 'style="display:none"' : ''}>
                            <i class="fas fa-bowl-food"></i>
                        </div>
                        <div class="sk-prod-hover-actions">
                            <a href="/producto/${p.id}/editar" class="sk-pa"><i class="fas fa-pencil"></i></a>
                            <button class="sk-pa danger" onclick="confirmarEliminar(${p.id},'${p.nombre.replace(/'/g,"\\'")}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <span class="sk-prod-cat-badge">${p.categoria}</span>
                        ${!p.disponible ? '<div class="sk-prod-unavail">No disponible</div>' : ''}
                    </div>
                    <div class="sk-prod-body">
                        <span class="sk-prod-id">#${String(p.id).padStart(3,'0')}</span>
                        <h5 class="sk-prod-name">${p.nombre}</h5>
                        <p class="sk-prod-desc">${p.descripcion}</p>
                        <div class="sk-prod-foot">
                            <div class="sk-prod-foot-left">
                                <span class="sk-prod-price">$${p.precio.toFixed(2)}</span>
                                <span class="sk-prod-stock ${p.cantidad===0?'out':p.cantidad<10?'low':''}" id="stock-${p.id}">${p.cantidad} uds.</span>
                            </div>
                            ${p.disponible && p.cantidad > 0 ? `<button class="sk-add-btn" id="addbtn-${p.id}" onclick="cartAdd(${p.id},'${p.nombre.replace(/'/g,"\'")}',${p.precio},'${p.imagen_url||''}')" title="Agregar">+</button>` : ''}
                        </div>
                    </div>
                </div>`).join('');

            // Animar entrada de cards
            requestAnimationFrame(() => {
                prodGrid.querySelectorAll('.sk-prod-card').forEach(c => {
                    c.style.opacity = '1';
                    c.style.transform = 'translateY(0)';
                });
                // Re-aplicar tilt
                addTilt(prodGrid.querySelectorAll('.sk-prod-card'));
            });

        } catch(err) {
            prodGrid.innerHTML = '<p style="color:var(--muted);text-align:center;padding:40px">Error al cargar productos.</p>';
        }
    }

    // ── 13. Búsqueda dinámica ─────────────────────
    const searchInput = document.getElementById('searchInput');
    const searchBtn   = document.getElementById('searchBtn');
    if (searchInput) {

        async function doSearch() {
            const q = searchInput.value.trim();
            if (!q) {
                const cat = new URLSearchParams(window.location.search).get('categoria') || 'all';
                await loadProducts(cat);
                return;
            }
            if (!prodGrid) return;
            prodGrid.innerHTML = `<div class="cat-modal-loading" style="grid-column:1/-1"><div class="cat-spinner"></div></div>`;
            const res  = await fetch('/api/productos');
            const data = await res.json();
            const ql   = q.toLowerCase();
            const filtered = data.filter(p =>
                p.nombre.toLowerCase().includes(ql) ||
                p.descripcion.toLowerCase().includes(ql) ||
                p.categoria.toLowerCase().includes(ql)
            );
            if (!filtered.length) {
                prodGrid.innerHTML = `<div class="sk-empty" style="grid-column:1/-1"><span>🍜</span><h4>Sin resultados para "${q}"</h4></div>`;
                return;
            }
            prodGrid.innerHTML = filtered.map((p, i) => `
                <div class="sk-prod-card" style="opacity:0;transform:translateY(16px);transition:opacity .5s ease ${(i%4)*70}ms,transform .5s ease ${(i%4)*70}ms,box-shadow .3s,border-color .3s">
                    <div class="sk-prod-img">
                        ${p.imagen_url ? `<img src="${p.imagen_url}" alt="${p.nombre}" onerror="this.parentElement.querySelector('.sk-prod-fallback').style.display='flex';this.style.display='none'">` : ''}
                        <div class="sk-prod-fallback" ${p.imagen_url ? 'style="display:none"' : ''}><i class="fas fa-bowl-food"></i></div>
                        <div class="sk-prod-hover-actions">
                            <a href="/producto/${p.id}/editar" class="sk-pa"><i class="fas fa-pencil"></i></a>
                            <button class="sk-pa danger" onclick="confirmarEliminar(${p.id},'${p.nombre.replace(/'/g,"\\'")}')"><i class="fas fa-trash"></i></button>
                        </div>
                        <span class="sk-prod-cat-badge">${p.categoria}</span>
                    </div>
                    <div class="sk-prod-body">
                        <span class="sk-prod-id">#${String(p.id).padStart(3,'0')}</span>
                        <h5 class="sk-prod-name">${p.nombre}</h5>
                        <p class="sk-prod-desc">${p.descripcion}</p>
                        <div class="sk-prod-foot">
                            <div class="sk-prod-foot-left">
                                <span class="sk-prod-price">$${p.precio.toFixed(2)}</span>
                                <span class="sk-prod-stock ${p.cantidad===0?'out':p.cantidad<10?'low':''}" id="stock-${p.id}">${p.cantidad} uds.</span>
                            </div>
                            ${p.disponible && p.cantidad > 0 ? `<button class="sk-add-btn" id="addbtn-${p.id}" onclick="cartAdd(${p.id},'${p.nombre.replace(/'/g,"\'")}',${p.precio},'${p.imagen_url||''}')" title="Agregar">+</button>` : ''}
                        </div>
                    </div>
                </div>`).join('');
            requestAnimationFrame(() => {
                prodGrid.querySelectorAll('.sk-prod-card').forEach(c => { c.style.opacity='1'; c.style.transform='translateY(0)'; });
                addTilt(prodGrid.querySelectorAll('.sk-prod-card'));
            });
        }

        // Buscar solo con Enter o clic en botón
        searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
        searchBtn?.addEventListener('click', doSearch);
        document.getElementById('searchClearBtn')?.addEventListener('click', async () => {
            searchInput.value = '';
            const cat = new URLSearchParams(window.location.search).get('categoria') || 'all';
            await loadProducts(cat);
        });
        // Al borrar todo: restaurar productos
        searchInput.addEventListener('input', async () => {
            if (searchInput.value === '') {
                const cat = new URLSearchParams(window.location.search).get('categoria') || 'all';
                await loadProducts(cat);
            }
        });
    }

    // ── 14. Modal eliminar ────────────────────────
    window.confirmarEliminar = (id, nombre) => {
        document.getElementById('productName').textContent = nombre;
        document.getElementById('deleteForm').action = `/producto/${id}/eliminar`;
        document.getElementById('deleteModalBg').classList.add('show');
    };
    document.getElementById('deleteModalBg')?.addEventListener('click', function(e) {
        if (e.target === this) this.classList.remove('show');
    });

    // ── 15. Formulario contacto ───────────────────
    document.getElementById('contactoForm')?.addEventListener('submit', function(e) {
        e.preventDefault();
        const n = document.getElementById('c-nombre')?.value.trim();
        const em = document.getElementById('c-email')?.value.trim();
        const a = document.getElementById('c-asunto')?.value;
        const m = document.getElementById('c-mensaje')?.value.trim();
        if (!n || !em || !a || !m) {
            const wrap = document.querySelector('.sk-form-wrap');
            if (wrap) { wrap.style.animation='shake .4s ease'; setTimeout(()=>wrap.style.animation='',400); }
            return;
        }
        this.reset();
        const ok = document.getElementById('form-ok');
        if (ok) { ok.classList.remove('d-none'); setTimeout(()=>ok.classList.add('d-none'),5000); }
    });

    // ── 16. Alertas flash ─────────────────────────
    document.querySelectorAll('.sk-alert-msg').forEach(el => {
        setTimeout(() => { el.style.transition='opacity .5s'; el.style.opacity='0'; setTimeout(()=>el.remove(),500); }, 4000);
    });

    // ── 17. Preview imagen form ───────────────────
    document.getElementById('imgUrl')?.addEventListener('input', function() {
        const prev = document.getElementById('imgPreview');
        if (!prev) return;
        prev.src = this.value.trim();
        prev.classList.toggle('d-none', !this.value.trim());
        prev.onerror = () => prev.classList.add('d-none');
    });

    // ── 18. Validación form producto ──────────────
    document.getElementById('productForm')?.addEventListener('submit', function(e) {
        const nombre   = this.querySelector('[name="nombre"]')?.value.trim();
        const cat      = this.querySelector('[name="categoria"]')?.value.trim();
        const precio   = parseFloat(this.querySelector('[name="precio"]')?.value);
        const cantidad = parseInt(this.querySelector('[name="cantidad"]')?.value);
        if (!nombre||!cat) { e.preventDefault(); alert('Completa nombre y categoría.'); return; }
        if (isNaN(precio)||precio<0) { e.preventDefault(); alert('Precio inválido.'); return; }
        if (isNaN(cantidad)||cantidad<0) { e.preventDefault(); alert('Cantidad inválida.'); return; }
    });

    // ── 19. Animación entrada cards iniciales ─────
    document.querySelectorAll('.sk-prod-card').forEach((c, i) => {
        c.style.opacity = '0';
        c.style.transform = 'translateY(18px)';
        const d = (i%4)*70;
        c.style.transition = `opacity .7s ease ${d}ms,transform .7s ease ${d}ms,box-shadow .3s,border-color .3s`;
    });
    const cardObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; cardObs.unobserve(e.target); }
        });
    }, { threshold: 0.06 });
    document.querySelectorAll('.sk-prod-card').forEach(c => cardObs.observe(c));

    document.querySelectorAll('.sk-esp-card').forEach((c,i) => {
        c.style.opacity='0'; c.style.transform='translateY(14px)';
        c.style.transition=`opacity .8s ease ${i*90}ms,transform .8s ease ${i*90}ms,box-shadow .35s,border-color .35s`;
    });
    const espObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; espObs.unobserve(e.target); }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.sk-esp-card').forEach(c => espObs.observe(c));

    // ══════════════════════════════════════════════
    // SLIDER AUTOMÁTICO DEL HERO
    // ══════════════════════════════════════════════
    const SLIDE_INTERVAL = 4000;
    const sliderSlides = [
        'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200',
        'https://images.unsplash.com/photo-1553621042-f6e147245754?w=1200',
        'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=1200',
        'https://www.cocinadelirante.com/688x459/filters:format(webp):quality(75)/sites/default/files/styles/gallerie/public/calpis-refresco-japones-receta.jpg',
        'https://images.unsplash.com/photo-1562802378-063ec186a863?w=1200',
        'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=1200',
        'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=1200',
        'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=1200',
        'https://www.onesupermarket.es/cdn/shop/files/sake.jpg?v=1668113747&width=3000',
    ];

    const layerA      = document.getElementById('sliderLayerA');
    const layerB      = document.getElementById('sliderLayerB');
    const dotsWrap    = document.getElementById('sliderDots');
    const progressBar = document.getElementById('sliderProgressBar');
    const btnPrev     = document.getElementById('sliderPrev');
    const btnNext     = document.getElementById('sliderNext');

    if (layerA && layerB && dotsWrap) {
        let current = 0, useA = true, sliderTimer = null;

        // Precargar
        sliderSlides.forEach(url => { const i = new Image(); i.src = url; });

        // Crear dots
        sliderSlides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'sk-slider-dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', () => { stopSlider(); goTo(i); startSlider(); });
            dotsWrap.appendChild(dot);
        });

        function updateDots(idx) {
            dotsWrap.querySelectorAll('.sk-slider-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
        }

        function startProgress() {
            if (!progressBar) return;
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            requestAnimationFrame(() => requestAnimationFrame(() => {
                progressBar.style.transition = `width ${SLIDE_INTERVAL}ms linear`;
                progressBar.style.width = '100%';
            }));
        }

        function goTo(idx) {
            const next = (idx + sliderSlides.length) % sliderSlides.length;
            if (next === current) return;
            const url = sliderSlides[next];
            const incoming = useA ? layerA : layerB;
            const outgoing = useA ? layerB : layerA;
            incoming.style.backgroundImage = `url('${url}')`;
            incoming.style.zIndex = '2';
            incoming.style.opacity = '0';
            incoming.style.transform = 'scale(1.05)';
            outgoing.style.zIndex = '1';
            requestAnimationFrame(() => {
                incoming.style.opacity = '1';
                incoming.style.transform = 'scale(1)';
                setTimeout(() => { outgoing.style.opacity = '0'; }, 200);
            });
            useA = !useA;
            current = next;
            updateDots(current);
            startProgress();
        }

        function startSlider() {
            sliderTimer = setInterval(() => goTo((current + 1) % sliderSlides.length), SLIDE_INTERVAL);
            startProgress();
        }
        function stopSlider() {
            clearInterval(sliderTimer);
            if (progressBar) { progressBar.style.transition = 'none'; progressBar.style.width = '0%'; }
        }

        // Iniciar
        layerA.style.cssText += ';transition:opacity 1.1s ease,transform 5s ease;opacity:1;transform:scale(1);z-index:2';
        layerB.style.cssText += ';transition:opacity 1.1s ease,transform 5s ease;opacity:0;transform:scale(1.05);z-index:1';
        startSlider();

        // Controles
        btnPrev?.addEventListener('click', () => { stopSlider(); goTo((current - 1 + sliderSlides.length) % sliderSlides.length); startSlider(); });
        btnNext?.addEventListener('click', () => { stopSlider(); goTo((current + 1) % sliderSlides.length); startSlider(); });

        // Pausa al hover
        const hero = document.getElementById('catHero');
        hero?.addEventListener('mouseenter', stopSlider);
        hero?.addEventListener('mouseleave', startSlider);

        // Swipe en móvil
        let tX = 0;
        hero?.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
        hero?.addEventListener('touchend', e => {
            const diff = tX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) {
                stopSlider();
                goTo(diff > 0 ? (current + 1) % sliderSlides.length : (current - 1 + sliderSlides.length) % sliderSlides.length);
                startSlider();
            }
        }, { passive: true });
    }

});

// Keyframes globales
const dynStyle = document.createElement('style');
dynStyle.textContent = `
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}

/* Modal de categoría */
#catModal{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(10px);z-index:3000;display:flex;align-items:flex-end;justify-content:center;opacity:0;pointer-events:none;transition:opacity .35s ease}
#catModal.show{opacity:1;pointer-events:all}
.cat-modal-box{background:var(--ink-2);border:1px solid var(--border);border-radius:20px 20px 0 0;width:100%;max-width:1100px;max-height:88vh;display:flex;flex-direction:column;transform:translateY(40px);transition:transform .4s cubic-bezier(.25,1,.5,1)}
#catModal.show .cat-modal-box{transform:translateY(0)}
.cat-modal-head{display:flex;align-items:center;justify-content:space-between;padding:24px 32px;border-bottom:1px solid var(--border-2);flex-shrink:0}
.cat-modal-title-wrap{display:flex;align-items:center;gap:20px}
.cat-modal-kanji{font-family:var(--f-jp);font-size:2.8rem;color:var(--gold);line-height:1;text-shadow:0 0 20px rgba(201,150,58,.4)}
.cat-modal-title{font-family:var(--f-display);font-size:1.8rem;font-weight:600;color:var(--paper);margin:0}
.cat-modal-desc{font-size:.82rem;color:var(--muted);margin:4px 0 0;font-weight:300}
.cat-modal-close{width:38px;height:38px;border-radius:50%;background:var(--ink-3);border:1px solid var(--border-2);color:var(--muted);font-size:.9rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
.cat-modal-close:hover{background:var(--sakura);border-color:var(--sakura);color:#fff}
.cat-modal-body{padding:28px 32px;overflow-y:auto;flex:1}
.cat-modal-count{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:20px}
.cat-modal-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:20px}
.cat-prod-card{background:var(--ink-3);border:1px solid var(--border-2);border-radius:14px;overflow:hidden;animation:fadeSlideUp .45s ease both;transition:transform .3s,box-shadow .3s,border-color .3s}
.cat-prod-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.4);border-color:rgba(201,150,58,.25)}
@keyframes fadeSlideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.cat-prod-img{height:160px;background:var(--ink-4);overflow:hidden;position:relative}
.cat-prod-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.cat-prod-card:hover .cat-prod-img img{transform:scale(1.06)}
.cat-prod-fallback{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;color:rgba(201,150,58,.2)}
.cat-prod-unavail{position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(255,255,255,.5)}
.cat-prod-body{padding:14px}
.cat-prod-id{font-size:.65rem;color:var(--muted);font-family:monospace}
.cat-prod-name{font-family:var(--f-display);font-size:1.05rem;font-weight:600;color:var(--paper);margin:4px 0 6px;line-height:1.2}
.cat-prod-desc{font-size:.74rem;color:var(--muted);line-height:1.5;margin-bottom:10px;font-weight:300;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.cat-prod-foot{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.cat-prod-price{font-family:var(--f-display);font-size:1.3rem;font-weight:700;color:var(--gold)}
.cat-prod-stock{font-size:.68rem;font-weight:600;background:rgba(46,125,50,.15);color:#81c784;border:1px solid rgba(46,125,50,.25);padding:2px 8px;border-radius:50px}
.cat-prod-stock.low{background:rgba(230,81,0,.15);color:#ffb74d;border-color:rgba(230,81,0,.25)}
.cat-prod-actions{display:flex;gap:8px}
.cat-prod-edit{flex:1;background:rgba(21,101,192,.12);color:#64b5f6;border:1px solid rgba(21,101,192,.25);border-radius:8px;padding:7px;font-size:.75rem;font-weight:600;text-align:center;transition:all .2s}
.cat-prod-edit:hover{background:#1565c0;border-color:#1565c0;color:#fff}
.cat-prod-del{width:34px;background:rgba(192,57,43,.12);color:var(--sakura);border:1px solid rgba(192,57,43,.25);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.8rem;cursor:pointer;transition:all .2s}
.cat-prod-del:hover{background:var(--sakura);border-color:var(--sakura);color:#fff}
.cat-modal-loading{display:flex;flex-direction:column;align-items:center;gap:16px;padding:60px 20px;color:var(--muted);font-size:.85rem}
.cat-spinner{width:32px;height:32px;border:2px solid var(--border-2);border-top-color:var(--gold);border-radius:50%;animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.cat-modal-empty{text-align:center;padding:60px 20px;display:flex;flex-direction:column;align-items:center;gap:12px;color:var(--muted)}
.cat-modal-empty span{font-size:3rem}
.cat-modal-error{text-align:center;padding:40px;color:var(--sakura)}

/* Skeleton loader */
.sk-prod-skeleton{background:var(--ink-2);border:1px solid var(--border-2);border-radius:14px;overflow:hidden;animation:pulse 1.5s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.skel-img{height:185px;background:var(--ink-3)}
.skel-body{padding:18px;display:flex;flex-direction:column;gap:10px}
.skel-line{height:10px;background:var(--ink-3);border-radius:4px}
.skel-line.w40{width:40%}.skel-line.w60{width:60%}.skel-line.w75{width:75%}.skel-line.w90{width:90%}

@media(max-width:576px){.cat-modal-head{padding:16px 20px}.cat-modal-body{padding:20px}.cat-modal-kanji{font-size:2rem}.cat-modal-title{font-size:1.3rem}}
`;
document.head.appendChild(dynStyle);

/* ══════════════════════════════════════════════════
   CARRITO ESTILO RAPPI
══════════════════════════════════════════════════ */
const cart = {}; // { id: { nombre, precio, imagen, qty, stock } }

function cartToggle() {
    document.getElementById('cartPanel').classList.toggle('open');
}

function cartClose() {
    document.getElementById('cartPanel').classList.remove('open');
}

// Agregar producto al carrito
window.cartAdd = function(id, nombre, precio, imagen) {
    if (!cart[id]) {
        cart[id] = { id, nombre, precio, imagen, qty: 0 };
    }
    const stockEl = document.getElementById(`stock-${id}`);
    const stockActual = stockEl ? parseInt(stockEl.textContent) : 999;
    if (cart[id].qty >= stockActual) {
        showCartToast(`Sin más stock de ${nombre}`);
        return;
    }
    cart[id].qty++;
    cartUpdateCard(id);
    cartRender();
    // Animación en el botón del carrito
    const btn = document.getElementById('cartBtn');
    btn.classList.remove('cart-bounce');
    void btn.offsetWidth;
    btn.classList.add('cart-bounce');
    setTimeout(() => btn.classList.remove('cart-bounce'), 400);
    // Abrir panel si es el primero
    const total = Object.values(cart).reduce((s, i) => s + i.qty, 0);
    if (total === 1) document.getElementById('cartPanel').classList.add('open');
};

// Cambiar cantidad desde el panel
window.cartChange = function(id, delta) {
    if (!cart[id]) return;
    const stockEl = document.getElementById(`stock-${id}`);
    const stockActual = stockEl ? parseInt(stockEl.textContent) : 999;
    cart[id].qty += delta;
    if (cart[id].qty <= 0) {
        delete cart[id];
    } else if (cart[id].qty > stockActual) {
        cart[id].qty = stockActual;
        showCartToast('Sin más stock disponible');
    }
    cartUpdateCard(id);
    cartRender();
};

// Actualizar el botón + / contador en la card de producto
function cartUpdateCard(id) {
    const addBtn = document.getElementById(`addbtn-${id}`);
    const qty = cart[id]?.qty || 0;
    // El botón puede estar en el footer del card
    const foot = addBtn ? addBtn.closest('.sk-prod-foot') : document.getElementById(`qty-ctrl-${id}`)?.closest('.sk-prod-foot');
    if (!foot) return;

    if (qty > 0) {
        if (addBtn) addBtn.style.display = 'none';
        let ctrl = document.getElementById(`qty-ctrl-${id}`);
        if (!ctrl) {
            ctrl = document.createElement('div');
            ctrl.className = 'sk-qty-ctrl';
            ctrl.id = `qty-ctrl-${id}`;
            ctrl.innerHTML = `
                <button class="sk-qty-btn minus" onclick="cartChange(${id},-1)">−</button>
                <span class="sk-qty-num" id="qty-num-${id}">${qty}</span>
                <button class="sk-qty-btn plus" onclick="cartChange(${id},+1)">+</button>`;
            foot.appendChild(ctrl);
        } else {
            document.getElementById(`qty-num-${id}`).textContent = qty;
        }
    } else {
        if (addBtn) addBtn.style.display = 'flex';
        document.getElementById(`qty-ctrl-${id}`)?.remove();
    }
}

// Renderizar lista del carrito
function cartRender() {
    const items    = Object.values(cart);
    const itemsEl  = document.getElementById('cartItems');
    const footerEl = document.getElementById('cartFooter');
    const countEl  = document.getElementById('cartCount');
    const totalEl  = document.getElementById('cartTotal');

    const totalQty = items.reduce((s, i) => s + i.qty, 0);
    const totalAmt = items.reduce((s, i) => s + i.qty * i.precio, 0);

    // Badge
    countEl.textContent = totalQty > 99 ? '99+' : totalQty;
    countEl.classList.toggle('visible', totalQty > 0);

    if (!items.length) {
        itemsEl.innerHTML = `<div class="cart-empty-msg"><span>🍱</span><p>Tu carrito está vacío</p></div>`;
        footerEl.style.display = 'none';
        return;
    }

    footerEl.style.display = '';
    totalEl.textContent = `$${totalAmt.toFixed(2)}`;

    itemsEl.innerHTML = items.map(item => `
        <div class="cart-item">
            <img class="cart-item-img"
                 src="${item.imagen || ''}"
                 onerror="this.style.display='none'"
                 alt="${item.nombre}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.nombre}</div>
                <div class="cart-item-price">$${(item.precio * item.qty).toFixed(2)}</div>
            </div>
            <div class="cart-item-ctrl">
                <button class="ci-btn minus" onclick="cartChange(${item.id},-1)">−</button>
                <span class="ci-qty">${item.qty}</span>
                <button class="ci-btn plus"  onclick="cartChange(${item.id},+1)">+</button>
            </div>
        </div>`).join('');
}

// Vaciar carrito
window.cartClear = function() {
    Object.keys(cart).forEach(id => {
        delete cart[id];
        cartUpdateCard(id);
    });
    cartRender();
};

// Actualizar barra de stats desde la API
async function refreshStats() {
    try {
        const res  = await fetch('/api/stats');
        const data = await res.json();
        const totalEl = document.getElementById('stat-total');
        const stockEl = document.getElementById('stat-stock');
        const catsEl  = document.getElementById('stat-cats');

        // Animar el cambio con un flash dorado
        [totalEl, stockEl, catsEl].forEach(el => {
            if (!el) return;
            el.style.transition = 'color .3s ease';
            el.style.color = 'var(--gold)';
            setTimeout(() => el.style.color = '', 800);
        });

        if (totalEl) totalEl.textContent = data.total;
        if (stockEl) stockEl.textContent = data.stock;
        if (catsEl)  catsEl.textContent  = data.categorias;
    } catch(e) {
        console.warn('No se pudieron actualizar las stats');
    }
}

// Confirmar pedido → descuenta stock
window.cartConfirm = async function() {
    const items = Object.values(cart).map(i => ({ id: i.id, cantidad: i.qty }));
    if (!items.length) return;
    const btn = document.getElementById('cartConfirmBtn');
    btn.disabled = true;
    btn.textContent = 'Procesando...';
    try {
        const res  = await fetch('/api/carrito/confirmar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items })
        });
        const data = await res.json();
        if (data.ok) {
            // Actualizar stock visible en las cards
            for (const item of Object.values(cart)) {
                const stockEl = document.getElementById(`stock-${item.id}`);
                if (stockEl) {
                    const actual = parseInt(stockEl.textContent) - item.qty;
                    stockEl.textContent = `${actual} uds.`;
                    stockEl.className = `sk-prod-stock ${actual === 0 ? 'out' : actual < 10 ? 'low' : ''}`;
                    if (actual === 0) {
                        document.getElementById(`addbtn-${item.id}`)?.remove();
                        document.getElementById(`qty-ctrl-${item.id}`)?.remove();
                    }
                }
            }
            showCartToast('✅ ¡Pedido confirmado!', 'success');
            await refreshStats();
            cartClear();
            cartClose();
        } else {
            showCartToast('⚠️ ' + data.errores.join(' '), 'error');
        }
    } catch(e) {
        showCartToast('Error al procesar el pedido', 'error');
    }
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Confirmar Pedido';
};

// Toast de notificación
function showCartToast(msg, type = 'info') {
    let toast = document.getElementById('cartToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'cartToast';
        toast.style.cssText = `
            position:fixed;bottom:100px;right:28px;z-index:5000;
            background:var(--ink-3);border:1px solid var(--border);
            color:var(--paper);border-radius:12px;padding:12px 18px;
            font-size:.82rem;font-weight:600;
            box-shadow:0 8px 24px rgba(0,0,0,.4);
            transform:translateY(10px);opacity:0;
            transition:all .3s ease;pointer-events:none;max-width:260px;`;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.borderColor = type === 'success' ? 'rgba(46,125,50,.5)' : type === 'error' ? 'rgba(192,57,43,.5)' : 'var(--border)';
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, 2800);
}

// También actualizar botones en cards cargadas dinámicamente
const _origLoadProducts = window._loadProducts;
