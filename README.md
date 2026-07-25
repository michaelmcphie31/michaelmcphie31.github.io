# Body of Works Fitness Website

A fast static website for holistic coaching, pretzeling, massage, and recovery services.

## Pages

- `index.html`: homepage, services, pricing, testimonials, and booking calendar
- `about.html`: coach story and booking CTA
- `resources.html`: downloadable guides and research links
- `thank-you.html`: post-submission handoff page

## Structure

- `css/styles.css`: shared responsive styling
- `js/main.js`: mobile navigation, booking calendar, time selection, review dialog, and Google Calendar handoff
- `assets/images/`: optimized local images and logo assets
- `assets/guides/`: downloadable Body of Works Fitness PDF guides
- `assets/videos/workout-background.mp4`: optional homepage hero background video
- `integrations/massage-intake-forwarder.gs`: Google Apps Script template for massage intake emails

The booking form sends 1:1 coaching, Pretzeling, and massage request details to `imagin8it.home@gmail.com` through FormSubmit and opens a Google Calendar event template with the client and owner email included. Coaching call requests also point clients to the 1:1 coaching application at `https://form.typeform.com/to/nYSQBHoF`.

Reviews can be submitted from the floating "Leave a Review" button on the Home and About pages. New reviews display immediately for that visitor and are also submitted by email through FormSubmit. A shared/live review wall requires a backend such as Google Apps Script + Google Sheets or another review platform endpoint.

## Hero Video

Add a workout video at `assets/videos/workout-background.mp4` to make the homepage hero play video in the background. Until that file exists, the homepage uses `assets/images/brand-hero.webp` as the fallback background.

## Booking Availability

All services must be requested at least 48 hours in advance.

Free coaching calls are 30 minutes. Availability is Monday through Friday, 7:00 AM to 7:00 PM CT, and Saturdays, 1:00 PM to 5:00 PM CT. Coaching is unavailable Sundays.

Pretzeling and massage availability is Monday through Friday, 3:00 PM to 6:00 PM CT; Saturdays, 8:00 AM to 12:00 PM CT; and Sundays, 1:00 PM to 5:00 PM CT.

Pretzeling is priced at `$2/min`.

## Massage Intake Automation

Use `integrations/massage-intake-forwarder.gs` in Google Apps Script if you want Gmail to watch for website massage request emails and send client intake forms automatically. Replace `PASTE_CLIENT_INTAKE_FORM_URL_HERE`, then run `installMassageIntakeTrigger()` once inside Apps Script.

## Social Links

- Instagram: `https://www.instagram.com/mike.mcphie.fit/`
- TikTok: `https://www.tiktok.com/@mike.mcphie`
- YouTube: `https://www.youtube.com/@BodyofWorksFitness`
