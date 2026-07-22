import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Re-checks all active questions for compliance (PII, profanity, completeness).
// Run after every content update. Admin-only.
const PII_EMAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const PII_CARD = /\b(?:\d[ -]*?){13,16}\b/g;
const PII_NIN = /^\d{11}$/;
const PROFANITY = /\b(fuck|shit|bitch|asshole|nigger|cunt|dick|piss)\b/gi;

function scanText(text) {
  const issues = [];
  if (!text) return issues;
  const str = String(text);
  if (PII_EMAIL.test(str)) issues.push("email");
  PII_EMAIL.lastIndex = 0;
  if (PII_CARD.test(str)) issues.push("credit_card");
  PII_CARD.lastIndex = 0;
  if (PII_NIN.test(str.replace(/\D/g, ""))) issues.push("national_id");
  if (PROFANITY.test(str)) issues.push("profanity");
  PROFANITY.lastIndex = 0;
  return issues;
}

function scanQuestion(q) {
  const issues = [];
  const t = scanText(q.question_text);
  if (t.length) issues.push({ field: "question_text", issues: t });
  (q.options || []).forEach((opt, i) => {
    const oi = scanText(opt);
    if (oi.length) issues.push({ field: `option_${i + 1}`, issues: oi });
  });
  const ei = scanText(q.explanation);
  if (ei.length) issues.push({ field: "explanation", issues: ei });
  if (!q.options || q.options.length < 2) issues.push({ field: "options", issues: ["insufficient_options"] });
  if (q.correct_option === undefined || q.correct_option === null) issues.push({ field: "correct_option", issues: ["missing"] });
  return issues;
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const questions = await base44.asServiceRole.entities.Question.filter({});

    let flagged = 0;
    const flaggedQuestions = [];
    const byIssueType = {};

    for (const q of questions) {
      const issues = scanQuestion(q);
      if (issues.length) {
        flagged++;
        flaggedQuestions.push({ id: q.id, subject: q.subject, topic: q.topic, issues });
        for (const grp of issues) {
          for (const iss of grp.issues) {
            byIssueType[iss] = (byIssueType[iss] || 0) + 1;
          }
        }
      }
    }

    const cleanCount = questions.length - flagged;
    const status = flagged === 0 ? "compliant" : "issues_found";

    await base44.asServiceRole.entities.ActivityLog.create({
      user_id: user.id,
      action: 'compliance_recheck',
      entity_type: 'Question',
      details: `Re-checked ${questions.length} questions: ${flagged} flagged. Status: ${status}`,
      severity: flagged > 0 ? 'warning' : 'info'
    });

    return Response.json({
      status,
      total_questions: questions.length,
      clean_questions: cleanCount,
      flagged_questions: flagged,
      issues_by_type: byIssueType,
      flagged: flaggedQuestions.slice(0, 50)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});