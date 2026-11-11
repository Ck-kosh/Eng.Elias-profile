/* ============================================================
   MAIN.JS — renders dynamic content + all interactivity.
   Data source: localStorage (admin edits) → DEFAULT_DATA fallback.
   When the backend is live, swap loadData() for fetch('/api/...').
   ============================================================ */

const STORAGE_KEY = "kosh_site_data";

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      if (data?.profile && (!data.profile.photo || data.profile.photo === "assets/profile.jpg" || data.profile.photo === "assets/profile.svg")) {
        data.profile.photo = "assets/profile.png";
      }
      return data;
    }
  } catch (e) { /* corrupted storage — fall back */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
const DATA = loadData();

/* ---------- tiny helpers ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

const CATEGORY_LABELS = { cctv:"CCTV Installation", solar:"Solar Cameras", alarm:"Alarm Systems", school:"School Bells", software:"Software Projects" };

function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove("show"), 2400);
}

/* ---------- profile / about ---------- */
function renderProfile() {
  const p = DATA.profile;
  const profilePhoto = p.photo && p.photo !== "assets/profile.jpg" && p.photo !== "assets/profile.svg" ? p.photo : "assets/profile.png";
  document.title = `${p.name} — Software Engineer & Security Systems Specialist`;
  $("#heroName").textContent = p.name;
  if (p.tagline) $("#heroTagline").textContent = p.tagline;
  $("#profilePhoto").src = profilePhoto;
  $("#profilePhoto").onerror = () => { $("#profilePhoto").src = "assets/profile.png"; };
  $("#aboutPhoto").src = profilePhoto;
  $("#aboutPhoto").onerror = () => { $("#aboutPhoto").src = "assets/profile.png"; };
  $("#bioText").textContent = p.bio;
  $("#skillsList").innerHTML = p.skills.map(s => `<span class="skill">${esc(s)}</span>`).join("");
}

/* ---------- projects ---------- */
function renderProjects() {
  $("#projectsGrid").innerHTML = DATA.projects.map(p => `
    <article class="project-card reveal">
      <div class="project-thumb"><img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy"></div>
      <div class="project-body">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        <div class="tech-tags">${p.tech.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="project-links">
          <a class="plink plink-live" href="${esc(p.live)}" target="_blank" rel="noopener">Live Demo ↗</a>
          <a class="plink plink-git" href="${esc(p.github)}" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </article>`).join("");
}

/* ---------- services ---------- */
function renderServices() {
  $("#servicesGrid").innerHTML = DATA.services.map(s => `
    <article class="service-card reveal">
      <div class="service-icon">${esc(s.icon)}</div>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.description)}</p>
      <a class="service-enquire" href="#contact" data-service="${esc(s.title)}">Enquire Now →</a>
    </article>`).join("");
}

/* ---------- gallery + filter + search ---------- */
let activeFilter = "all", searchTerm = "";

function renderGallery() {
  const items = DATA.gallery.filter(g =>
    (activeFilter === "all" || g.category === activeFilter) &&
    (!searchTerm || (g.title + " " + (g.desc || "")).toLowerCase().includes(searchTerm))
  );
  $("#galleryEmpty").hidden = items.length > 0;
  $("#galleryGrid").innerHTML = items.map((g, i) => `
    <figure class="gallery-item" data-index="${i}">
      <img src="${esc(g.image)}" alt="${esc(g.title)}" loading="lazy">
      <figcaption class="g-overlay">
        <span>${CATEGORY_LABELS[g.category] || esc(g.category)}</span>
        <h4>${esc(g.title)}</h4>
      </figcaption>
    </figure>`).join("");
  // rebuild lightbox list based on what's visible
  lightboxList = items;
  $$(".gallery-item").forEach(el => el.addEventListener("click", () => openLightbox(+el.dataset.index)));
}

/* ---------- lightbox ---------- */
let lightboxList = [], lightboxIdx = 0;
function openLightbox(i) {
  lightboxIdx = i;
  updateLightbox();
  $("#lightbox").classList.add("open");
  document.body.style.overflow = "hidden";
}
function updateLightbox() {
  const item = lightboxList[lightboxIdx];
  if (!item) return;
  $("#lightboxImg").src = item.image;
  $("#lightboxImg").alt = item.title;
  $("#lightboxCaption").textContent = `${item.title} — ${CATEGORY_LABELS[item.category] || item.category}`;
}
function closeLightbox() {
  $("#lightbox").classList.remove("open");
  document.body.style.overflow = "";
}
function stepLightbox(d) {
  lightboxIdx = (lightboxIdx + d + lightboxList.length) % lightboxList.length;
  updateLightbox();
}
$("#lightboxClose").addEventListener("click", closeLightbox);
$("#lightboxPrev").addEventListener("click", () => stepLightbox(-1));
$("#lightboxNext").addEventListener("click", () => stepLightbox(1));
$("#lightbox").addEventListener("click", e => { if (e.target === e.currentTarget) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (!$("#lightbox").classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

/* ---------- contact ---------- */
const SOCIAL_ICONS = {
  github:   '<svg viewBox="0 0 24 24"><path d="M12 .5C5.6.5.5 5.7.5 12.1c0 5.1 3.3 9.5 7.9 11 .6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.4-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.9 18.3 5.2 18.3 5.2c.6 1.6.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.2c0 .4.2.7.8.6 4.6-1.5 7.9-5.9 7.9-11C23.5 5.7 18.4.5 12 .5z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9z"/></svg>',
  x:        '<svg viewBox="0 0 24 24"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-6.4L6.4 22H3.2l7.3-8.3L1.6 2H8l4.4 5.9zm-1.1 18h1.7L7.1 3.9H5.3z"/></svg>',
  instagram:'<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2a3.8 3.8 0 0 1-.9 1.4c-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.8 3.8 0 0 1-1.4-.9c-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.3-.1-1.7-.1-4.9s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 2c-3.1 0-3.5 0-4.8.1-1.1 0-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.4 1-.4 2.1-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c0 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .4 2.1.4 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.4-1 .4-2.1.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c0-1.1-.2-1.7-.4-2.1a2.9 2.9 0 0 0-.8-1.2 2.9 2.9 0 0 0-1.2-.8c-.4-.2-1-.4-2.1-.4-1.3-.1-1.7-.1-4.8-.1zm0 3.4a5.1 5.1 0 1 1 0 10.3 5.1 5.1 0 0 1 0-10.3zm0 8.5a3.4 3.4 0 1 0 0-6.7 3.4 3.4 0 0 0 0 6.7zm6.5-8.8a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z"/></svg>'
};

function renderContact() {
  const c = DATA.contact;
  $("#contactPhone").textContent = c.phone.replace(/(\d{3})(\d{3})(\d{3})(\d+)/, "+$1 $2 $3 $4");
  $("#contactEmail").textContent = c.email;
  $("#contactLocation").textContent = c.location;
  $("#socialRow").innerHTML = (c.socials || []).map(s =>
    `<a href="${esc(s.url)}" target="_blank" rel="noopener" aria-label="${esc(s.name)}" title="${esc(s.name)}">${SOCIAL_ICONS[s.icon] || ""}</a>`).join("");
}

/* contact form → WhatsApp */
$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const msg = `Hello Kosh! My name is ${f.get("name")}.
📌 Service needed: ${f.get("service")}
📝 ${f.get("message")}
📧 Email: ${f.get("email")}${f.get("phone") ? `\n📞 Phone: ${f.get("phone")}` : ""}`;
  window.open(`https://wa.me/${DATA.contact.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  showToast("Opening WhatsApp with your message…");
});

/* pre-select service when clicking "Enquire Now" */
document.addEventListener("click", e => {
  const link = e.target.closest("[data-service]");
  if (!link) return;
  const sel = $("#contactForm select");
  [...sel.options].forEach(o => { if (link.dataset.service.toLowerCase().includes(o.text.split(" ")[0].toLowerCase())) sel.value = o.value || o.text; });
});

/* ---------- click-to-copy ---------- */
$$(".copy-btn").forEach(btn => btn.addEventListener("click", e => {
  e.preventDefault(); e.stopPropagation();
  navigator.clipboard.writeText(btn.dataset.copy)
    .then(() => showToast("Copied to clipboard ✓"))
    .catch(() => showToast("Copy failed — long-press to copy"));
}));

/* ---------- navbar ---------- */
const navbar = $("#navbar"), navLinks = $("#navLinks"), hamburger = $("#hamburger");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
  // active link highlight
  const fromTop = window.scrollY + 120;
  $$(".nav-link").forEach(l => {
    const sec = $(l.getAttribute("href"));
    if (sec && sec.offsetTop <= fromTop && sec.offsetTop + sec.offsetHeight > fromTop) {
      $$(".nav-link").forEach(x => x.classList.remove("active"));
      l.classList.add("active");
    }
  });
}, { passive: true });

hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
$$(".nav-link").forEach(l => l.addEventListener("click", () => navLinks.classList.remove("open")));

/* ---------- filters & search ---------- */
$("#filterPills").addEventListener("click", e => {
  const pill = e.target.closest(".pill");
  if (!pill) return;
  $$(".pill").forEach(p => p.classList.remove("active"));
  pill.classList.add("active");
  activeFilter = pill.dataset.filter;
  renderGallery();
});
$("#gallerySearch").addEventListener("input", e => {
  searchTerm = e.target.value.trim().toLowerCase();
  renderGallery();
});

/* ---------- scroll reveal + counters ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); io.unobserve(en.target); } });
}, { threshold: 0.12 });
function observeReveals() { $$(".reveal:not(.visible)").forEach(el => io.observe(el)); }

const counterIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, target = +el.dataset.count, dur = 1400, t0 = performance.now();
    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
    counterIO.unobserve(el);
  });
}, { threshold: 0.6 });
$$(".stat-num").forEach(el => counterIO.observe(el));

/* ---------- boot ---------- */
$("#year").textContent = new Date().getFullYear();
renderProfile();
renderProjects();
renderServices();
renderGallery();
renderContact();
observeReveals();
