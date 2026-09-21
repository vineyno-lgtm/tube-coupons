# TUBE Coffee — Privilege Coupons

A standalone web app for managing TUBE Coffee's monthly employee & franchisee
privilege coupons: QR-code redemption, a coupon-campaign approval workflow
(Draft → Pending → Approved → Published), Excel bulk import/export, and an
audit log.

## Status: demo / in-memory only

This app has **no backend**. All data (employees, franchisees, campaigns,
coupons) lives only in the browser tab's memory and resets on every page
refresh. It's meant for testing the workflow, not for real production data
yet — see "Next step" below.

## Running it

Just open `index.html` in a browser, or visit the GitHub Pages URL once
enabled (see below). No build step, no install.

## Bootstrap login

One seed account exists so the app isn't locked out on first load:

```
ID:       TUB-00001
Password: 01011990
```

Sign in with it once, then use Employees → Add account (or Bulk Excel
import) to create your real HR account and everyone else, and disable this
bootstrap account when you're done with it.

## Deploying with GitHub Pages

1. Create a new repository on GitHub (public or private — Pages works on
   both, though private repos need GitHub Pro/Team/Enterprise for Pages).
2. Upload `index.html` to the repo root (drag-and-drop via "Add file →
   Upload files" works fine, no git required).
3. Go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**,
   **Branch: main**, folder **/ (root)**.
5. Save. GitHub will give you a URL like
   `https://<your-username>.github.io/<repo-name>/` — that's live in
   about a minute.

## Next step

This resets on every refresh, which stops being a demo quirk and becomes a
real risk once real employee/coupon data is involved. Moving this onto a
real backend (your own Firebase project, or another option) is the natural
next step whenever you're ready.
