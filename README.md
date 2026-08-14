# CanBook

CanBook is a school canteen pre-ordering system built around a React + Vite student experience and a Flask + MySQL canteen backend.

## Current architecture

- **Frontend:** React 19 + Vite + React Router + Motion
- **Backend:** Python Flask + Flask-CORS
- **Database:** MySQL / MySQL Connector
- **Authentication:** Flask session cookies with student/canteen roles
- **PWA:** Web app manifest + service worker for installable mobile/desktop app behavior
- **Hosted API proxy:** Cloudflare Pages Function forwards `/api/*` to the Flask service, keeping browser auth same-origin

The existing Flask routes and order payload contract are preserved. Checkout continues to send `pickup_slot` plus `items`.

## Student experience

- Exact CanBook menu in AED
- Interactive menu cards and cart feedback
- Full pickup calendar with school-day validation
- 20-minute pickup time slots
- Animated order confirmation and visual order history
- Responsive mobile bottom navigation
- Installable PWA shell

## Staff experience

- Dedicated canteen dashboard, never the student ordering dashboard
- Interactive live order queue
- Order status controls
- Visual order detail ticket
- Database analytics for orders, students, items, revenue, and demand
- Menu management with add/hide/restore controls

## Local development

### Backend

Create `backend/.env` from `backend/.env.example`, then from `backend/` run:

```powershell
python init_db.py
python app.py
```

Flask listens on port 5000.

### Frontend

From `frontend/`:

```powershell
npm install
npm run dev
```

Vite listens on port 5173 and proxies `/api` to Flask during local development.

## Free deployment

The recommended no-cost stack for this MySQL-based architecture is:

1. **Cloudflare Pages** for the Vite frontend and same-origin `/api/*` proxy.
2. **Render Free Web Service** for Flask/Gunicorn.
3. **Aiven Free MySQL** for the persistent MySQL database.

Cloudflare Pages uses `npm run build` with `dist` as the output directory. Render uses `backend/` as the service root, `pip install -r requirements.txt` as the build command, and `gunicorn app:app` as the start command.

On Cloudflare Pages, set the Functions environment variable:

```text
CANBOOK_API_ORIGIN=https://YOUR-CANBOOK-API.onrender.com
```

Leave `VITE_API_BASE_URL` unset for the hosted build so the browser calls the same-origin `/api` proxy. For Render, set `APP_ENV=production`, `FRONTEND_ORIGIN` to the exact Cloudflare Pages origin, and the five MySQL/session variables shown in `backend/.env.example`.

Create the Aiven MySQL service first, then run `init_db.py` once locally against that hosted database to create the tables, staff account, and canonical nine-item menu.

> Free hosting is excellent for a school project/demo but has provider limits. Render free web services can sleep after inactivity, and Aiven's free MySQL tier is intentionally small.
