import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    let side = 'left';
    try {
      const body = await req.json();
      if (body && body.side) side = body.side;
    } catch (e) {
      const url = new URL(req.url);
      side = url.searchParams.get('side') || 'left';
    }

    if (!['left', 'right'].includes(side)) {
      return Response.json({ error: 'Invalid side. Use "left" or "right".' }, { status: 400 });
    }

    const allActive = await base44.asServiceRole.entities.Advertiser.filter(
      { status: 'active' },
      '-created_date',
      50
    );

    const filtered = allActive.filter(
      (a) => a.placement_side === side || a.placement_side === 'both'
    );

    const result = filtered.slice(0, 6).map((a) => ({
      title: a.brand_name,
      image_url: a.ad_image_url,
      link_url: a.target_url,
    }));

    return Response.json({ advertisers: result });
  } catch (error) {
    console.error('getAdvertisers error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});