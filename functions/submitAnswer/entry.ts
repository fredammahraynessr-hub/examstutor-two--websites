import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { question_id, selected_option, session_id, time_spent_seconds } = body;
    if (!question_id || selected_option === undefined) {
      return Response.json({ error: 'question_id and selected_option are required' }, { status: 400 });
    }

    const question = await base44.asServiceRole.entities.Question.get(question_id);
    if (!question) return Response.json({ error: 'Question not found' }, { status: 404 });

    const is_correct = selected_option === question.correct_option;

    const attempt = await base44.entities.Attempt.create({
      question_id,
      subject: question.subject,
      topic: question.topic || 'General',
      selected_option,
      correct_option: question.correct_option,
      is_correct,
      time_spent_seconds: time_spent_seconds || 0,
      session_id: session_id || null
    });

    // Decrement free-tier questions remaining
    const subs = await base44.entities.Subscription.filter({ status: 'active' }, '-created_date', 1);
    const sub = subs[0];
    if (sub && sub.plan === 'free' && (sub.questions_remaining || 0) > 0) {
      await base44.entities.Subscription.update(sub.id, { questions_remaining: sub.questions_remaining - 1 });
    }

    await base44.asServiceRole.entities.ActivityLog.create({
      user_id: user.id,
      action: 'answer_submitted',
      entity_type: 'Question',
      entity_id: question_id,
      details: is_correct ? 'Correct answer' : 'Incorrect answer',
      severity: 'info'
    });

    return Response.json({
      is_correct,
      correct_option: question.correct_option,
      explanation: question.explanation || null,
      attempt_id: attempt.id
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});