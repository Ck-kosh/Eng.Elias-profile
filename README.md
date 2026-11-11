# Kosh — Portfolio & Security Services Website

A complete personal portfolio + business profile website.
**Software Engineer & Security Systems Specialist** — showcase software projects,
advertise CCTV / alarm / school bell installations, and manage everything from an
admin dashboard without touching code.

---

## 📁 Project Structure

```
portfolio-website/
├── index.html          # Main website (all 7 sections)
├── admin.html          # Admin dashboard (protected)
├── css/
│   ├── style.css       # Main design system
│   └── admin.css       # Dashboard styles
├── js/
│   ├── data.js         # DEFAULT_DATA — seed content
│   ├── main.js         # Renders content + interactivity
│   └── admin.js        # Dashboard logic
└── assets/             # Placeholder images (replace with real photos)
```

## ▶️ Run Locally (no install needed)

1. Open `index.html` in a browser — full website works.
2. Open `admin.html` — login with **admin / kosh2026** (demo).
3. Make edits → click **Save All Changes** → refresh `index.html`.
   Changes persist in the browser (localStorage).

> The demo uses placeholder SVG images and localStorage so everything works
> instantly. The sections below explain going fully live.

## 🔑 Change Admin Credentials

In `js/admin.js`, edit:
```js
const ADMIN_USER = "admin";
const ADMIN_PASS = "kosh2026";   // ← change before deployment
```

## ☁️ Step 1 — Cloud Storage for Images (Cloudinary)

1. Create a free account at https://cloudinary.com
2. Note your **Cloud Name**, **API Key**, **API Secret**.
3. Replace image URLs in the admin dashboard with Cloudinary URLs, or use the
   upload endpoint in the backend below (`POST /api/upload`) which uploads
   straight to Cloudinary — images survive redeployments.

## 🗄️ Step 2 — Backend + Database

Recommended stack: **Node.js + Express + MongoDB Atlas** (free tiers).

1. MongoDB Atlas → create a free cluster → get your connection string.
2. Build an Express API with these endpoints (mirror of `DEFAULT_DATA`):

| Method | Endpoint              | Purpose              | Auth |
|--------|-----------------------|----------------------|------|
| GET    | /api/profile          | profile/bio/skills   | no   |
| PUT    | /api/profile          | update profile       | JWT  |
| GET    | /api/projects         | list projects        | no   |
| POST   | /api/projects         | add project          | JWT  |
| PUT    | /api/projects/:id     | edit project         | JWT  |
| DELETE | /api/projects/:id     | delete project       | JWT  |
| GET    | /api/services         | list services        | no   |
| POST   | /api/services         | add service          | JWT  |
| PUT    | /api/services/:id     | edit service         | JWT  |
| DELETE | /api/services/:id     | delete service       | JWT  |
| GET    | /api/gallery          | list gallery         | no   |
| POST   | /api/gallery          | add image            | JWT  |
| DELETE | /api/gallery/:id      | remove image         | JWT  |
| GET    | /api/contact          | contact info         | no   |
| PUT    | /api/contact          | update contact       | JWT  |
| POST   | /api/upload           | image → Cloudinary   | JWT  |
| POST   | /api/auth/login       | login → JWT          | no   |

3. Auth: hash passwords with **bcrypt**, sign JWTs with a secret env variable.
4. In `js/main.js` replace `loadData()` with:
   ```js
   const DATA = await (await fetch('/api/all')).json();
   ```
   and in `js/admin.js` make every save call `fetch('/api/...', {headers:{Authorization:'Bearer '+token}})`.

## 🚀 Step 3 — Deploy (Render — recommended)

1. Push this folder to a GitHub repository.
2. Render.com → **New → Web Service** → connect the repo.
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_*`.
4. Deploy. Render gives you a permanent URL — images and data persist because
   they live in MongoDB + Cloudinary, **not** on the server disk.
5. (Optional) Point a custom domain in Render → Settings → Custom Domains.

## ✅ Pre-Launch Checklist

- [ ] Replace all placeholder images with real project/installation photos
- [ ] Change admin username/password
- [ ] Update social links (GitHub, LinkedIn, X, Instagram) in admin
- [ ] Test every button on mobile + desktop
- [ ] Test admin add/edit/delete on the live site
- [ ] Verify uploaded images persist after a redeploy
- [ ] Update project live/GitHub links

## 📞 Contact Points (already wired in)

- Phone: +254 769 021 360 (click-to-call + click-to-copy)
- Email: thekosh12@gmail.com (mailto + click-to-copy)
- WhatsApp: wa.me/254769021360 (chat button + enquiry form opens WhatsApp)
