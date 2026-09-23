# MBBS Orientation Registration — Requirements
Source: discovery session, 2026-09-23 / Status: COMPLETE

## Event
- R1: MBBS Orientation 2026 — 25 Sep 2026, 9:00 PM, Google Meet. Speakers: Dr. Thanveer V T (Internal Medicine PG Resident, GMC Kozhikode), Salahudheen K P (Final Year MBBS, GMC Thiruvananthapuram). By ProfSummit (Oct 23–25, Kuttiady).

## Form
- R2: Fields: Full name, Phone, Gender (Boy / Girl), Joined a college? (Yes / No).
- R2.1: If "Yes", show a required "College name" field.
- R3: Phone must be a 10-digit Indian mobile starting 6–9; strip +91 / leading 0. Error: "Enter a valid 10-digit mobile number".
- R4: No separate WhatsApp button — the group link is only reached by registering.

## Submission
- R5: Register saves a row to Google Sheet via Apps Script (Timestamp, Name, Phone, Gender, Joined College, College Name).
- R6: On success, auto-redirect: Boys → https://chat.whatsapp.com/Epnr1xTECeA6HqDRQ3IYP1, Girls → https://chat.whatsapp.com/GUmjY1jHVMmBuiGjT0h0uC. Show a fallback button in case the redirect is blocked.
- R7: Duplicate phone: no new row; show "You have already registered with this number." plus a button to their WhatsApp group.
- R8: Prevent double submit; show loading state; show retryable error on network failure/timeout.

## Design / Delivery
- R9: Light medical theme matching the poster (teal #1E9DAF), event details header. Mobile-first.
- R10: Plain HTML/CSS/JS, hosted on Vercel (mbbs.profsummit.in). Public repo `mbbs-orientation-2026`.
- R11: Apps Script code + setup guide provided; organiser deploys it and pastes the /exec URL.

## Open Questions
- [OPEN] Apps Script /exec URL — pending organiser deployment.

## Next Step
→ implementation
