import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const attempts = await base44.entities.Attempt.filter({}, '-created_date', 1000);

    const bySubject = {};
    const byTopic = {};
    let totalCorrect = 0;

    for (const a of attempts) {
      if (!bySubject[a.subject]) bySubject[a.subject] = { subject: a.subject, total: 0, correct: 0 };
      bySubject[a.subject].total++;
      if (a.is_correct) { bySubject[a.subject].correct++; totalCorrect++; }

      const tkey = `${a.subject}::${a.topic || 'General'}`;
      if (!byTopic[tkey]) byTopic[tkey] = { subject: a.subject, topic: a.topic || 'General', total: 0, correct: 0 };
      byTopic[tkey].total++;
      if (a.is_correct) byTopic[tkey].correct++;
    }

    const subjectStats = Object.values(bySubject).map(s => ({
      subject: s.subject, total: s.total, correct: s.correct,
      accuracy: s.total ? Math.round((s.correct / s.total) * 100) : 0
    }));

    const topicStats = Object.values(byTopic).map(t => ({
      subject: t.subject, topic: t.topic, total: t.total, correct: t.correct,
      accuracy: t.total ? Math.round((t.correct / t.total) * 100) : 0
    }));

    const weakAreas = topicStats
      .filter(t => t.accuracy < 50 && t.total >= 3)
      .sort((a, b) => a.accuracy - b.accuracy);

    const subs = await base44.entities.Subscription.filter({ status: 'active' }, '-created_date', 1);

    return Response.json({
      total_attempts: attempts.length,
      total_correct: totalCorrect,
      overall_accuracy: attempts.length ? Math.round((totalCorrect / attempts.length) * 100) : 0,
      subject_stats: subjectStats,
      weak_areas: weakAreas,
      subscription: subs[0] || null
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});