import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const users = await base44.asServiceRole.entities.User.list();
    const questions = await base44.asServiceRole.entities.Question.filter({ is_active: true });
    const attempts = await base44.asServiceRole.entities.Attempt.filter({}, '-created_date', 5000);
    const subs = await base44.asServiceRole.entities.Subscription.filter({ status: 'active' });
    const advertisers = await base44.asServiceRole.entities.Advertiser.filter({});
    const logs = await base44.asServiceRole.entities.ActivityLog.filter({}, '-created_date', 20);

    const totalCorrect = attempts.filter(a => a.is_correct).length;
    const planRevenue = subs.reduce((s, x) => s + (x.plan === 'premium' ? 50 : x.plan === 'basic' ? 20 : 0), 0);
    const adRevenue = advertisers.reduce((s, a) => s + (a.amount_paid || 0), 0);

    // Per-student practice aggregation
    const userName = {};
    users.forEach(u => { userName[u.id] = u.full_name || u.email || "Unknown"; });
    const agg = {};
    attempts.forEach(a => {
      const uid = a.created_by_id || "anonymous";
      if (!agg[uid]) agg[uid] = { user_id: uid, name: userName[uid] || "Unknown", total: 0, correct: 0, subjects: new Set() };
      agg[uid].total++;
      if (a.is_correct) agg[uid].correct++;
      if (a.subject) agg[uid].subjects.add(a.subject);
    });
    const students = Object.values(agg).map(s => ({
      user_id: s.user_id, name: s.name, total_attempts: s.total, correct: s.correct,
      accuracy: s.total ? Math.round((s.correct / s.total) * 100) : 0,
      subjects: Array.from(s.subjects)
    })).sort((a, b) => b.total_attempts - a.total_attempts).slice(0, 50);

    const recent_attempts = attempts.slice(0, 20).map(a => ({
      subject: a.subject, topic: a.topic, is_correct: a.is_correct,
      time_spent_seconds: a.time_spent_seconds || 0, created_date: a.created_date,
      user: userName[a.created_by_id] || "Anonymous"
    }));

    return Response.json({
      kpis: {
        total_users: users.length,
        total_questions: questions.length,
        total_attempts: attempts.length,
        active_subscriptions: subs.length,
        active_advertisers: advertisers.filter(a => a.status === 'active').length,
        overall_accuracy: attempts.length ? Math.round((totalCorrect / attempts.length) * 100) : 0,
        estimated_revenue: planRevenue + adRevenue
      },
      subscription_breakdown: {
        free: subs.filter(s => s.plan === 'free').length,
        basic: subs.filter(s => s.plan === 'basic').length,
        premium: subs.filter(s => s.plan === 'premium').length
      },
      advertisers: advertisers.map(a => ({ brand_name: a.brand_name, status: a.status, amount_paid: a.amount_paid, placement_side: a.placement_side })),
      recent_activity: logs,
      recent_attempts,
      students
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});