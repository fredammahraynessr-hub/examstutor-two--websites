import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

const PLANS = {
  basic: { name: "Basic Plan", price: "19.99", questions: 500 },
  premium: { name: "Premium Plan", price: "49.99", questions: 100000 }
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const planKey = (body.plan || "premium").toLowerCase();
    const plan = PLANS[planKey];
    if (!plan) {
      return Response.json({ error: "Invalid plan. Use 'basic' or 'premium'." }, { status: 400 });
    }

    const ALLOWED_ORIGINS = ["https://examstutor2.com", "https://www.examstutor2.com"];
    const rawOrigin = req.headers.get("origin") || req.headers.get("Origin") || "";
    const origin = ALLOWED_ORIGINS.includes(rawOrigin) ? rawOrigin : "https://examstutor2.com";
    const postFlowUrl = `${origin}/`;
    const thankYouPageUrl = `${origin}/thank-you`;

    const items = [{
      name: plan.name,
      quantity: 1,
      price: plan.price,
      subscriptionInfo: {
        subscriptionSettings: { frequency: "MONTH" },
        title: plan.name,
        description: "WAEC exam preparation subscription - unlimited practice questions"
      }
    }];

    const response = await fetch("https://www.wixapis.com/payments/platform/v1/checkout-sessions/construct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": Deno.env.get("WIX_PAYMENTS_API_KEY"),
        "wix-site-id": Deno.env.get("WIX_PAYMENTS_SITE_ID")
      },
      body: JSON.stringify({ cart: { items }, callbackUrls: { postFlowUrl, thankYouPageUrl } })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Wix checkout error:", JSON.stringify(data));
      return Response.json({
        error: data?.details?.applicationError?.description || data?.message || "Checkout failed"
      }, { status: 400 });
    }

    const checkoutSession = data.checkoutSession;

    // Persist a pending subscription record; the webhook flips it to active
    await base44.asServiceRole.entities.Subscription.create({
      plan: planKey,
      status: "pending",
      started_date: new Date().toISOString(),
      questions_remaining: 0,
      checkout_id: checkoutSession.id,
      payment_reference: checkoutSession.id
    });

    return Response.json({ redirectUrl: checkoutSession.redirectUrl, checkoutId: checkoutSession.id });
  } catch (error) {
    console.error("create-checkout error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});