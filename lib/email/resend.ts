import type React from "react";
import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  // eslint-disable-next-line no-console
  console.warn("RESEND_API_KEY is not set. Emails will not be sent.");
}

export const resend = new Resend(resendApiKey);

const FROM = process.env.EMAIL_FROM ?? "admin@digitalbuilders757.com";
const REPLY_TO = process.env.EMAIL_REPLY_TO ?? FROM;

type SendEmailOptions = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement<unknown>;
};

type BasePayload = {
  from: string;
  to: string | string[];
  subject: string;
  replyTo?: string;
};

type ResendPayload =
  | (BasePayload & { react: React.ReactElement<unknown>; html?: string; text?: string })
  | (BasePayload & { react?: React.ReactElement<unknown>; html: string; text?: string })
  | (BasePayload & { react?: React.ReactElement<unknown>; html?: string; text: string });

export async function sendEmail(opts: SendEmailOptions) {
  if (!resendApiKey) {
    // eslint-disable-next-line no-console
    console.error("RESEND_API_KEY missing. Skipping email send.");
    return { data: null, error: "Missing API key" as const };
  }

  const { to, subject, html, text, react } = opts;

  const base: BasePayload = {
    from: `Digital Builders 757 <${FROM}>`,
    to,
    subject,
    replyTo: REPLY_TO,
  };

  const hasReact = Boolean(react);
  const hasHtml = Boolean(html);
  const hasText = Boolean(text);

  if (!hasReact && !hasHtml && !hasText) {
    return { data: null, error: "Missing email content (react/html/text)" as const };
  }

  let payload: ResendPayload;

  if (hasReact && react) {
    payload = { ...base, react, ...(hasHtml ? { html } : {}), ...(hasText ? { text } : {}) };
  } else if (hasHtml && html) {
    payload = { ...base, html, ...(hasText ? { text } : {}) };
  } else {
    // hasText is guaranteed true here
    payload = { ...base, text: text as string };
  }

  const { data, error } = await resend.emails.send(payload);

  if (error) {
    // eslint-disable-next-line no-console
    console.error("Error sending email via Resend:", error);
  }

  return { data, error };
}

