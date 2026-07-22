import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { subscription_id, immediate, reason } = body;
    if (!subscription_id) {
      return Response.json({ error: 'subscription_id is required' }, { status: 400 });
    }

    // Ownership check: verify the subscription belongs to the caller before cancelling
    const subs = await base44.asServiceRole.entities.Subscription.filter({ wix_subscription_id: subscription_id });
    if (!subs[0]) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 });
    }
    const sub = subs[0];
    const callerEmail = (user.email || "").toLowerCase();
    const ownerEmail = (sub.user_email || "").toLowerCase();
    if (!ownerEmail || ownerEmail !== callerEmail) {
      return Response.json({ error: 'Forbidden: you do not own this subscription' }, { status: 403 });
    }

    const response = await fetch(`https://www.wixapis.com/payments/base44/v1/subscriptions/${subscription_id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Deno.env.get("WIX_PAYMENTS_API_KEY"),
        "wix-site-id": Deno.env.get("WIX_PAYMENTS_SITE_ID")
      },
      body: JSON.stringify({
        subscription_id,
        reason: reason || "User requested cancellation",
        immediate: immediate ?? false
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Wix cancel error:", JSON.stringify(data));
      return Response.json({ error: data?.message || "Cancellation failed" }, { status: 400 });
    }

    const status = data.subscription?.status === "CANCELED" ? "cancelled" : "active";
    await base44.asServiceRole.entities.Subscription.update(sub.id, { status });

    await base44.asServiceRole.entities.ActivityLog.create({
      user_id: user.id,
      action: "subscription_cancel_requested",
      entity_type: "Subscription",
      entity_id: subscription_id,
      details: `Cancel requested, immediate=${immediate ?? false}`,
      severity: "warning"
    });

    return Response.json({ subscription: data.subscription });
  } catch (error) {
    console.error("cancel-subscription error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});