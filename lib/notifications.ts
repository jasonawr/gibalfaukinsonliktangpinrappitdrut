type EmailInput = {
  to: string;
  subject: string;
  html: string;
};

async function sendEmail(input: EmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: input.subject,
      html: input.html,
    }),
  });
}

export async function notifyHrOnApplication(input: {
  jobTitle: string;
  fullName: string;
  email: string;
  submittedAt: Date;
}) {
  const hr = process.env.HR_NOTIFICATION_EMAIL;
  if (!hr) return;

  await sendEmail({
    to: hr,
    subject: `New Job Application: ${input.jobTitle}`,
    html: `
      <h2>New Application Received</h2>
      <p><strong>Name:</strong> ${input.fullName}</p>
      <p><strong>Email:</strong> ${input.email}</p>
      <p><strong>Role:</strong> ${input.jobTitle}</p>
      <p><strong>Submitted:</strong> ${input.submittedAt.toISOString()}</p>
    `,
  });
}

export async function sendApplicantConfirmation(input: {
  to: string;
  fullName: string;
  jobTitle: string;
}) {
  await sendEmail({
    to: input.to,
    subject: "Application Received",
    html: `
      <h2>Thank you for applying</h2>
      <p>Hi ${input.fullName},</p>
      <p>We received your application for <strong>${input.jobTitle}</strong>.</p>
      <p>Our HR team will review it and contact you if your profile matches current needs.</p>
    `,
  });
}

export async function sendInquiryConfirmation(input: {
  to: string;
  fullName: string;
  type: "CONTACT" | "PARTNERSHIP";
}) {
  await sendEmail({
    to: input.to,
    subject: "Inquiry Received",
    html: `
      <h2>Thank you for your inquiry</h2>
      <p>Hi ${input.fullName},</p>
      <p>We received your ${input.type.toLowerCase()} submission and will get back to you shortly.</p>
    `,
  });
}
