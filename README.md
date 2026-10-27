# Body of Works Fitness — GitHub upload folder

This folder contains the complete website with Refresh 1 and Refresh 2 updates.

## Upload

Copy the contents of this folder into the root of your existing GitHub repository. Keep the assets, css, integrations, and js folders intact. Include CNAME to preserve the custom-domain setting. Do not upload an additional enclosing folder.

Use a review branch first. Updating the Pages publishing branch may make the website live. No build or package installation is needed.

## Pages

- index.html — homepage, services, prices, and booking selection
- about.html — About page
- resources.html — guides and resources
- thank-you.html — preserved legacy acknowledgment page

## Booking

The website passes the exact service/duration to Acuity, which provides appointment availability and confirmation. js/booking-model.js is required alongside js/main.js.

The private pilot uses nine approved appointment choices and Google Calendar sync. Its trial showed an expiration of November 3, 2026. Verify continued account access before relying on it publicly. Phone number is required in this pilot to avoid an observed vendor submission error.

Hands-on appointments are at 9209 Winfield Lane, Moore, OK 73160. Scheduling retains 48-hour notice, a 60-day horizon, and 15 minutes of cleanup after hands-on sessions. Cancellations require 24 hours' notice; later cancellations are subject to 25% of the scheduled session price. Online changes stop 8 hours before the appointment. Automatic fee collection, payments, and deposits are not enabled.

Manage appointments and urgent calendar blocks in Acuity; external Google sync can lag. Keep Acuity prices/hours and website descriptions consistent when updating them.

Reminder testing and intake integration are deferred to later refreshes. The supplied intake PDF is not included in this public website folder. integrations/massage-intake-forwarder.gs is an existing historical template; this pilot does not install or use it.

## Development record

Website source checkpoint: 1d0935395091168adbf5317932e0ee31bf3d4783.
Review reports, automated tests, screenshots, and Git recovery backups are kept separately from this upload folder. This README is tailored for uploading; the HTML, CSS, JavaScript, and assets match the saved checkpoint.
