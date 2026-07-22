import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const { brand_name, contact_email, target_url, ad_image_url, placement_side, status, amount_paid } = body;

    if (!brand_name || !contact_email) {
      return Response.json({ error: 'brand_name and contact_email are required' }, { status: 400 });
    }

    const created = await base44.asServiceRole.entities.Advertiser.create({
      brand_name,
      contact_email,
      target_url: target_url || '',
      ad_image_url: ad_image_url || '',
      placement_side: ['left', 'right', 'both'].includes(placement_side) ? placement_side : 'both',
      status: ['pending', 'active', 'paused', 'ended'].includes(status) ? status : 'pending',
      amount_paid: typeof amount_paid === 'number' && !isNaN(amount_paid) ? amount_paid : 0,
      impressions: 0,
      clicks: 0,
    });

    await base44.asServiceRole.entities.ActivityLog.create({
      user_id: user.id,
      action: 'advertiser_created',
      entity_type: 'Advertiser',
      entity_id: created.id,
      details: `${brand_name} · ${placement_side || 'both'}`,
      severity: 'info',
    });

    return Response.json({ advertiser: created });
  } catch (error) {
    console.error('addAdvertiser error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});