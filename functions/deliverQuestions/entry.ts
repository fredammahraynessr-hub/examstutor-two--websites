import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const subject = body.subject || null;
    const count = Math.min(Math.max(parseInt(body.count) || 10, 1), 50);

    // Guardrail: ensure subscription exists, enforce free-tier limit
    const subs = await base44.entities.Subscription.filter({ status: 'active' }, '-created_date', 1);
    let sub = subs[0];
    if (!sub) {
      sub = await base44.entities.Subscription.create({
        plan: 'free',
        status: 'active',
        questions_remaining: 25,
        started_date: new Date().toISOString()
      });
    }
    if (sub.plan === 'free' && (sub.questions_remaining || 0) < count) {
      return Response.json({
        error: 'Free question limit reached. Upgrade to premium for unlimited practice.',
        questions_remaining: sub.questions_remaining || 0
      }, { status: 403 });
    }

    // Deliver questions
    const query = { is_active: true };
    if (subject) query.subject = subject;
    const questions = await base44.asServiceRole.entities.Question.filter(query, '-created_date', count);

    await base44.asServiceRole.entities.ActivityLog.create({
      user_id: user.id,
      action: 'questions_delivered',
      entity_type: 'Question',
      details: `${questions.length} question(s) delivered${subject ? ' for ' + subject : ''}`,
      severity: 'info'
    });

    return Response.json({ questions, count: questions.length, questions_remaining: sub.questions_remaining });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});