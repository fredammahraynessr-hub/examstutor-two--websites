// Master security & validation utility for Examstutor2
// Centralized regex patterns, input sanitization, and privacy guardrails.

// --- Master Regex Patterns ---
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[\d\s()-]{7,20}$/,
  URL: /^https?:\/\/[^\s]+$/i,
  SAFE_TEXT: /^[^<>{}\\^|`$]+$/,
  NIGERIAN_NIN: /^\d{11}$/,
  CREDIT_CARD: /\b(?:\d[ -]*?){13,16}\b/,
  SSN: /\b\d{3}-\d{2}-\d{4}\b/,
  // Detects common PII leaks in free text
  PII_EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  PII_PHONE: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/g,
  PII_CARD: /\b(?:\d[ -]*?){13,16}\b/g
};

// Basic profanity blocklist (extend as needed)
const PROFANITY = ["fuck", "shit", "bitch", "asshole", "nigger", "cunt", "dick", "piss"];
const PROFANITY_REGEX = new RegExp(`\\b(${PROFANITY.join("|")})\\b`, "gi");

// --- Validation Functions ---
export const isValidEmail = (email) => REGEX.EMAIL.test(String(email || "").trim());

export const sanitizeText = (input) => {
  if (typeof input !== "string") return "";
  return input
    .replace(/<[^>]*>/g, "")        // strip HTML tags
    .replace(/[<>{}\\^|`$]/g, "")   // remove dangerous chars
    .trim()
    .slice(0, 5000);                // cap length
};

// --- Privacy Guardrails ---
// Returns array of PII types detected in free text
export const detectPII = (text) => {
  const findings = [];
  if (!text) return findings;
  const str = String(text);
  if (REGEX.PII_EMAIL.test(str)) findings.push("email");
  REGEX.PII_EMAIL.lastIndex = 0;
  if (REGEX.PII_CARD.test(str)) findings.push("credit_card");
  REGEX.PII_CARD.lastIndex = 0;
  if (REGEX.NIGERIAN_NIN.test(str.replace(/\D/g, ""))) findings.push("national_id");
  return findings;
};

export const containsPII = (text) => detectPII(text).length > 0;

export const containsProfanity = (text) => PROFANITY_REGEX.test(String(text || ""));

// Redact PII from text before storage/display
export const redactPII = (text) => {
  if (!text) return text;
  let out = String(text)
    .replace(REGEX.PII_EMAIL, "[email redacted]")
    .replace(REGEX.PII_CARD, "[card redacted]");
  REGEX.PII_EMAIL.lastIndex = 0;
  REGEX.PII_CARD.lastIndex = 0;
  return out;
};

// Validate a question payload for compliance before delivery
export const validateQuestionPayload = (q) => {
  const errors = [];
  if (!q || !q.question_text) { errors.push("Missing question text"); return errors; }
  if (containsPII(q.question_text)) errors.push("Question text contains PII");
  if (containsProfanity(q.question_text)) errors.push("Question text contains profanity");
  (q.options || []).forEach((opt, i) => {
    if (containsPII(opt)) errors.push(`Option ${i + 1} contains PII`);
    if (containsProfanity(opt)) errors.push(`Option ${i + 1} contains profanity`);
  });
  if (q.explanation && containsPII(q.explanation)) errors.push("Explanation contains PII");
  return errors;
};