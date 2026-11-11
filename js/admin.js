/* ============================================================
   ADMIN.JS — dashboard logic.
   DEMO MODE: edits persist in localStorage so you can manage
   content with zero setup. When the backend is live, replace
   the save/load functions with fetch('/api/...') calls using
   the JWT returned by POST /api/auth/login.
   ============================================================ */

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const STORAGE_KEY = "kosh_site_data";
const AUTH_KEY = "kosh_admin_token";

/* ---- DEMO credentials — CHANGE before deployment ---- */
const ADMIN_USER = "admin";
const ADMIN_PASS = "kosh2026";

function showToast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(t._timer);t._timer=setTimeout(()=>t.classList.remove("show"),2400)}

let data;
function loadData(){
  try{const s=localStorage.getItem(STORAGE_KEY);if(s)return JSON.parse(s);}catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}

/* ---------- auth ---------- */
function showApp(){
  data = loadData();
  $("#loginView").hidden = true;
  $("#appView").hidden = false;
  fillAll();
}
if (sessionStorage.getItem(AUTH_KEY)) showApp();

$("#loginForm").addEventListener("submit", e => {
  e.preventDefault();
  const u = $("#loginUser").value.trim(), p = $("#loginPass").value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, "demo-token");
    showApp();
    showToast("Welcome back 👋");
  } else {
    $("#loginHint").textContent = "Invalid username or password.";
  }
});
$("#logoutBtn").addEventListener("click", () => {
  sessionStorage.removeItem(AUTH_KEY);
  location.reload();
});

/* ---------- tabs ---------- */
$$(".an-link").forEach(b => b.addEventListener("click", () => {
  $$(".an-link").forEach(x => x.classList.remove("active"));
  $$(".tab-panel").forEach(x => x.classList.remove("active"));
  b.classList.add("active");
  $("#tab-" + b.dataset.tab).classList.add("active");
}));

/* ---------- profile tab ---------- */
function fillProfile(){
  const p = data.profile;
  $("#pf-name").value = p.name;
  $("#pf-tagline").value = p.tagline;
  $("#pf-bio").value = p.bio;
  $("#pf-photo").value = p.photo;
  $("#pf-photo-preview").src = p.photo;
  $("#pf-skills").value = p.skills.join(", ");
}
function saveProfile(){
  data.profile.name = $("#pf-name").value.trim() || "Kosh";
  data.profile.tagline = $("#pf-tagline").value.trim();
  data.profile.bio = $("#pf-bio").value.trim();
  data.profile.photo = $("#pf-photo").value.trim();
  data.profile.skills = $("#pf-skills").value.split(",").map(s => s.trim()).filter(Boolean);
}
$("#pf-photo").addEventListener("input", e => $("#pf-photo-preview").src = e.target.value);

/* ---------- projects tab ---------- */
function fillProjects(){
  $("#projectsEditor").innerHTML = data.projects.map((p,i) => `
    <div class="editor-item" data-i="${i}">
      <div class="editor-item-head">
        <h4>💻 ${esc(p.title)}</h4>
        <button class="btn-danger" onclick="delProject(${i})">Delete</button>
      </div>
      <div class="editor-row">
        <label>Title<input type="text" class="pj-title" value="${esc(p.title)}"></label>
        <label>Image URL<input type="text" class="pj-image" value="${esc(p.image)}"></label>
        <label class="full">Description<textarea class="pj-desc" rows="2">${esc(p.description)}</textarea></label>
        <label>Technologies (comma separated)<input type="text" class="pj-tech" value="${esc(p.tech.join(", "))}"></label>
        <label>Live website link<input type="text" class="pj-live" value="${esc(p.live)}"></label>
        <label class="full">GitHub repository link<input type="text" class="pj-github" value="${esc(p.github)}"></label>
      </div>
    </div>`).join("");
}
window.delProject = i => { if(confirm("Delete this project?")){ data.projects.splice(i,1); persist(); fillProjects(); showToast("Project deleted"); } };
$("#addProjectBtn").addEventListener("click", () => {
  data.projects.push({ id: Date.now(), title: "New Project", description: "", image: "assets/project-1.svg", tech: [], live: "#", github: "#" });
  persist(); fillProjects(); showToast("Project added — fill in its details");
});
function saveProjects(){
  $$("#projectsEditor .editor-item").forEach((el,i) => {
    const p = data.projects[i]; if(!p) return;
    p.title = $(".pj-title",el).value.trim();
    p.description = $(".pj-desc",el).value.trim();
    p.image = $(".pj-image",el).value.trim();
    p.tech = $(".pj-tech",el).value.split(",").map(s=>s.trim()).filter(Boolean);
    p.live = $(".pj-live",el).value.trim();
    p.github = $(".pj-github",el).value.trim();
  });
}

/* ---------- services tab ---------- */
function fillServices(){
  $("#servicesEditor").innerHTML = data.services.map((s,i) => `
    <div class="editor-item" data-i="${i}">
      <div class="editor-item-head">
        <h4>${esc(s.icon)} ${esc(s.title)}</h4>
        <button class="btn-danger" onclick="delService(${i})">Delete</button>
      </div>
      <div class="editor-row">
        <label>Icon (emoji)<input type="text" class="sv-icon" value="${esc(s.icon)}"></label>
        <label>Title<input type="text" class="sv-title" value="${esc(s.title)}"></label>
        <label class="full">Description<textarea class="sv-desc" rows="2">${esc(s.description)}</textarea></label>
      </div>
    </div>`).join("");
}
window.delService = i => { if(confirm("Delete this service?")){ data.services.splice(i,1); persist(); fillServices(); showToast("Service deleted"); } };
$("#addServiceBtn").addEventListener("click", () => {
  data.services.push({ id: Date.now(), icon: "🛡️", title: "New Service", description: "" });
  persist(); fillServices(); showToast("Service added");
});
function saveServices(){
  $$("#servicesEditor .editor-item").forEach((el,i) => {
    const s = data.services[i]; if(!s) return;
    s.icon = $(".sv-icon",el).value.trim();
    s.title = $(".sv-title",el).value.trim();
    s.description = $(".sv-desc",el).value.trim();
  });
}

/* ---------- gallery tab ---------- */
const CATS = [["cctv","CCTV Installation"],["solar","Solar Cameras"],["alarm","Alarm Systems"],["school","School Bells"],["software","Software Projects"]];
function fillGallery(){
  $("#galleryEditor").innerHTML = data.gallery.map((g,i) => `
    <div class="editor-item" data-i="${i}">
      <div class="editor-item-head">
        <h4><img class="thumb-mini" src="${esc(g.image)}" alt=""> ${esc(g.title)}</h4>
        <button class="btn-danger" onclick="delGallery(${i})">Delete</button>
      </div>
      <div class="editor-row">
        <label>Image URL<input type="text" class="gl-image" value="${esc(g.image)}"></label>
        <label>Replace image<input type="file" accept="image/*" class="gl-file"></label>
        <div class="img-preview"><img class="gl-preview" src="${esc(g.image)}" alt="gallery preview"></div>
        <label>Category<select class="gl-cat">${CATS.map(([v,l])=>`<option value="${v}" ${g.category===v?"selected":""}>${l}</option>`).join("")}</select></label>
        <label>Title<input type="text" class="gl-title" value="${esc(g.title)}"></label>
        <label>Short description<input type="text" class="gl-desc" value="${esc(g.desc||"")}"></label>
      </div>
    </div>`).join("");

  $$("#galleryEditor .gl-file").forEach(fileInput => {
    fileInput.addEventListener("change", e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const item = e.target.closest(".editor-item");
        const urlInput = $(".gl-image", item);
        const preview = $(".gl-preview", item);
        const result = String(reader.result || "");
        urlInput.value = result;
        preview.src = result;
        $(".thumb-mini", item)?.setAttribute("src", result);
      };
      reader.readAsDataURL(file);
    });
  });

  $$("#galleryEditor .gl-image").forEach(input => {
    input.addEventListener("input", e => {
      const item = e.target.closest(".editor-item");
      const preview = $(".gl-preview", item);
      const mini = $(".thumb-mini", item);
      preview.src = e.target.value || "";
      if (mini) mini.src = e.target.value || "";
    });
  });
}
window.delGallery = i => { if(confirm("Delete this image?")){ data.gallery.splice(i,1); persist(); fillGallery(); showToast("Image removed"); } };
$("#addGalleryBtn").addEventListener("click", () => {
  data.gallery.push({ id: Date.now(), image: "assets/gallery-1.svg", title: "New Work", category: "cctv", desc: "" });
  persist(); fillGallery(); showToast("Image added — set its URL & category");
});
function saveGallery(){
  $$("#galleryEditor .editor-item").forEach((el,i) => {
    const g = data.gallery[i]; if(!g) return;
    g.image = $(".gl-image",el).value.trim();
    g.category = $(".gl-cat",el).value;
    g.title = $(".gl-title",el).value.trim();
    g.desc = $(".gl-desc",el).value.trim();
  });
}

/* ---------- contact tab ---------- */
function fillContact(){
  $("#ct-phone").value = data.contact.phone;
  $("#ct-whatsapp").value = data.contact.whatsapp;
  $("#ct-email").value = data.contact.email;
  $("#ct-location").value = data.contact.location;
  fillSocials();
}
function fillSocials(){
  $("#socialsEditor").innerHTML = (data.contact.socials||[]).map((s,i) => `
    <div class="editor-row" style="margin-bottom:.7rem">
      <label>Platform<input type="text" class="sc-name" value="${esc(s.name)}"></label>
      <label>URL<input type="text" class="sc-url" value="${esc(s.url)}"></label>
      <label>Icon key<input type="text" class="sc-icon" value="${esc(s.icon)}" placeholder="github / linkedin / x / instagram"></label>
      <div style="display:flex;align-items:end"><button class="btn-danger" onclick="delSocial(${i})">Remove</button></div>
    </div>`).join("");
}
window.delSocial = i => { data.contact.socials.splice(i,1); persist(); fillSocials(); };
$("#addSocialBtn").addEventListener("click", () => { data.contact.socials.push({name:"New",url:"#",icon:"github"}); persist(); fillSocials(); });
function saveContact(){
  data.contact.phone = $("#ct-phone").value.trim();
  data.contact.whatsapp = $("#ct-whatsapp").value.trim();
  data.contact.email = $("#ct-email").value.trim();
  data.contact.location = $("#ct-location").value.trim();
  $$("#socialsEditor .editor-row").forEach((el,i) => {
    const s = data.contact.socials[i]; if(!s) return;
    s.name = $(".sc-name",el).value.trim();
    s.url = $(".sc-url",el).value.trim();
    s.icon = $(".sc-icon",el).value.trim();
  });
}

/* ---------- save all ---------- */
function fillAll(){ fillProfile(); fillProjects(); fillServices(); fillGallery(); fillContact(); }
$("#saveAllBtn").addEventListener("click", () => {
  saveProfile(); saveProjects(); saveServices(); saveGallery(); saveContact();
  persist();
  showToast("All changes saved ✓ — visible on the website now");
});
