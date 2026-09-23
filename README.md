# MBBS Orientation 2026 — Registration

Registration page for **MBBS Orientation 2026** (ProfSummit), 25 Sep 2026 · 9:00 PM · Google Meet.

- Saves each registration to a Google Sheet via Apps Script
- Redirects **boys** and **girls** to their separate WhatsApp groups after registering
- Detects repeat phone numbers and shows "You have already registered" with a button to their group
- Plain HTML/CSS/JS with no build step, hosted on Vercel at `mbbs.profsummit.in`

## Files

| File | Purpose |
|---|---|
| `index.html`, `style.css`, `script.js` | The registration page |
| `apps-script/Code.gs` | Google Apps Script backend (paste into the Sheet) |
| `assets/poster.jpg` | Link-preview image for WhatsApp / social shares |

## Setup

### 1. Google Sheet + Apps Script

1. Create a new Google Sheet (e.g. "MBBS Orientation 2026 Registrations").
2. **Extensions → Apps Script**. Delete the sample code and paste all of `apps-script/Code.gs`. Save.
3. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** and authorize (Advanced → Go to project → Allow).
5. Copy the **Web app URL** (ends in `/exec`).

A `Registrations` tab with headers is created automatically on the first submission.

> If you edit `Code.gs` later: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. That keeps the same URL.

### 2. Connect the page

In `script.js`, replace:

```js
const SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE';
```

with your `/exec` URL, then commit and push.

### 3. Deploy on Vercel

1. vercel.com → **Add New → Project** → import this repo → Framework: **Other** → Deploy.
2. **Settings → Domains** → add `mbbs.profsummit.in`, then add the CNAME record Vercel shows at your DNS provider (`mbbs` → `cname.vercel-dns.com`).

## WhatsApp groups

Set in `script.js` → `GROUP_LINKS`:

- Boys: https://chat.whatsapp.com/Epnr1xTECeA6HqDRQ3IYP1
- Girls: https://chat.whatsapp.com/GUmjY1jHVMmBuiGjT0h0uC

## Test before sharing

1. Register as a Boy → a row appears in the Sheet → you're taken to the boys' group.
2. Register again with the same number → you see "You have already registered".
3. Register as a Girl with a different number → you're taken to the girls' group.
4. Delete the test rows from the Sheet.
