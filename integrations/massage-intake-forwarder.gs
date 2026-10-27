/**
 * Body of Works Fitness massage intake automation.
 *
 * Install in Google Apps Script with Gmail + Mail scopes, then run
 * installMassageIntakeTrigger() once. Fill in CLIENT_INTAKE_FORM_URL before use.
 */

const MASSAGE_INTAKE_CONFIG = {
  ownerEmail: "imagin8it.home@gmail.com",
  clientIntakeFormUrl: "PASTE_CLIENT_INTAKE_FORM_URL_HERE",
  processedLabelName: "BOWF/Massage Intake Sent",
  searchQueries: [
    'newer_than:14d "New Body of Works Fitness Massage Request"',
    'newer_than:14d "Body of Works Fitness Massage Session"',
  ],
};

function installMassageIntakeTrigger() {
  ScriptApp.newTrigger("sendMassageIntakeFormsFromGmail")
    .timeBased()
    .everyMinutes(10)
    .create();
}

function sendMassageIntakeFormsFromGmail() {
  const processedLabel = getOrCreateLabel_(MASSAGE_INTAKE_CONFIG.processedLabelName);
  const processedThreadIds = new Set(
    GmailApp.search(`label:"${MASSAGE_INTAKE_CONFIG.processedLabelName}"`)
      .map((thread) => thread.getId())
  );

  MASSAGE_INTAKE_CONFIG.searchQueries.forEach((query) => {
    GmailApp.search(`${query} -label:"${MASSAGE_INTAKE_CONFIG.processedLabelName}"`, 0, 50)
      .forEach((thread) => {
        if (processedThreadIds.has(thread.getId())) return;

        const message = newestMessage_(thread);
        const body = message.getPlainBody();
        const clientEmail = extractEmail_(body);

        if (!clientEmail) {
          thread.addLabel(processedLabel);
          notifyOwnerMissingEmail_(message);
          return;
        }

        const clientName = extractField_(body, ["Name", "name"]) || "there";
        const selectedDate = extractField_(body, ["Selected Date"]) || "your requested date";
        const selectedTime = extractField_(body, ["Selected Time"]) || "your requested time";
        const sessionOption = extractField_(body, ["session_option", "Session Option"]) || "massage session";

        MailApp.sendEmail({
          to: clientEmail,
          cc: MASSAGE_INTAKE_CONFIG.ownerEmail,
          subject: "Body of Works Fitness massage intake form",
          htmlBody: massageIntakeEmailHtml_(clientName, selectedDate, selectedTime, sessionOption),
        });

        thread.addLabel(processedLabel);
      });
  });
}

function massageIntakeEmailHtml_(clientName, selectedDate, selectedTime, sessionOption) {
  const escapedName = escapeHtml_(clientName);
  const escapedDate = escapeHtml_(selectedDate);
  const escapedTime = escapeHtml_(selectedTime);
  const escapedSession = escapeHtml_(sessionOption);
  const intakeUrl = MASSAGE_INTAKE_CONFIG.clientIntakeFormUrl;

  return `
    <p>Hi ${escapedName},</p>
    <p>Thank you for requesting ${escapedSession} with Body of Works Fitness.</p>
    <p><strong>Requested time:</strong> ${escapedDate} at ${escapedTime}</p>
    <p>Please complete the massage intake form before your appointment:</p>
    <p><a href="${intakeUrl}">${intakeUrl}</a></p>
    <p>Body of Works Fitness</p>
  `;
}

function notifyOwnerMissingEmail_(message) {
  MailApp.sendEmail({
    to: MASSAGE_INTAKE_CONFIG.ownerEmail,
    subject: "Massage intake automation needs review",
    body:
      "A massage request email matched the automation search, but no client email could be parsed.\n\n" +
      `Subject: ${message.getSubject()}\nDate: ${message.getDate()}`,
  });
}

function newestMessage_(thread) {
  const messages = thread.getMessages();
  return messages[messages.length - 1];
}

function getOrCreateLabel_(name) {
  return GmailApp.getUserLabelByName(name) || GmailApp.createLabel(name);
}

function extractEmail_(body) {
  const explicitEmail = extractField_(body, ["Email", "email"]);
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
  const explicitMatch = explicitEmail && explicitEmail.match(emailPattern);
  if (explicitMatch) return explicitMatch[0];

  const fallbackMatch = body.match(emailPattern);
  return fallbackMatch ? fallbackMatch[0] : "";
}

function extractField_(body, labels) {
  const lines = body.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  for (const label of labels) {
    const normalizedLabel = label.toLowerCase();
    for (const line of lines) {
      const normalizedLine = line.toLowerCase();
      if (normalizedLine.startsWith(`${normalizedLabel}:`)) {
        return line.slice(line.indexOf(":") + 1).trim();
      }
      if (normalizedLine.startsWith(normalizedLabel)) {
        return line.slice(label.length).replace(/^[:\s-]+/, "").trim();
      }
    }
  }
  return "";
}

function escapeHtml_(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
