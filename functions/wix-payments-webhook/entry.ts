import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';
import jwt from 'npm:jsonwebtoken@9.0.2';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const requestBody = await req.text();

    const WEBHOOK_PUBLIC_KEY = Deno.env.get("WIX_PAYMENTS_WEBHOOK_PUBLIC_KEY");
    if (!WEBHOOK_PUBLIC_KEY) {
      console.error("Missing WIX_PAYMENTS_WEBHOOK_PUBLIC_KEY");
      return Response.json({ error: "Missing webhook public key" }, { status: 500 });
    }

    // Step 1: Verify JWT signature - fail closed
    let rawPayload;
    try {
      rawPayload = jwt.verify(requestBody, WEBHOOK_PUBLIC_KEY, { algorithms: ["RS256"] });
    } catch (e) {
      console.error("JWT verification failed:", e.message);
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Step 2: Parse double-nested JSON
    const event = JSON.parse(rawPayload.data);
    const eventData = JSON.parse(event.data);

    if (event.eventType === "wix.ecom.v1.order_approved") {
      const order = eventData.actionEvent.body.order;
      const checkoutId = order.checkoutId;

      const subs = await base44.asServiceRole.entities.Subscription.filter({ checkout_id: checkoutId });
      const sub = subs[0];
      if (sub) {
        const updates = {
          status: "active",
          started_date: new Date().toISOString(),
          user_email: order.buyerInfo?.email || sub.user_email
        };
        const subItem = order.lineItems?.find(li => li.subscriptionInfo);
        if (subItem) updates.wix_subscription_id = subItem.subscriptionInfo.id;
        if (sub.plan === "premium") updates.questions_remaining = 100000;
        else if (sub.plan === "basic") updates.questions_remaining = 500;
        await base44.asServiceRole.entities.Subscription.update(sub.id, updates);
      }

      await base44.asServiceRole.entities.ActivityLog.create({
        action: "order_approved",
        entity_type: "Subscription",
        entity_id: checkoutId,
        details: `Order ${order.id} approved, status ${order.paymentStatus}`,
        severity: "info"
      });

    } else if (
      event.eventType === "wix.ecom.subscription_contracts.v1.subscription_contract_canceled" ||
      event.eventType === "wix.ecom.subscription_contracts.v1.subscription_contract_expired"
    ) {
      const contract = eventData.actionEvent.body.subscriptionContract;
      const subscriptionId = contract.id;
      const isCanceled = event.eventType.includes("canceled");

      const subs = await base44.asServiceRole.entities.Subscription.filter({ wix_subscription_id: subscriptionId });
      const sub = subs[0];
      if (sub) {
        await base44.asServiceRole.entities.Subscription.update(sub.id, {
          status: isCanceled ? "cancelled" : "expired",
          expires_date: new Date().toISOString()
        });
      }

      await base44.asServiceRole.entities.ActivityLog.create({
        action: isCanceled ? "subscription_cancelled" : "subscription_expired",
        entity_type: "Subscription",
        entity_id: subscriptionId,
        details: `Subscription ${subscriptionId} ${isCanceled ? "cancelled" : "expired"}`,
        severity: "warning"
      });
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("webhook error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});