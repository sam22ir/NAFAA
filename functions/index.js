// Firebase Cloud Functions scaffold for NAFAA
// To deploy: cd functions && npm install && firebase deploy --only functions
//
// Required env vars (set via firebase functions:secrets:set):
//   WHATSAPP_TOKEN, WHATSAPP_PHONE_ID
//   YALIDINE_TOKEN, YALIDINE_CENTER_ID
//   INSTAGRAM_ACCESS_TOKEN
//   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

const { onSchedule } = require("firebase-functions/v2/scheduler");
const { onDocumentCreated, onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { defineSecret } = require("firebase-functions/params");
const { createClient } = require("@supabase/supabase-js");

const WHATSAPP_TOKEN = defineSecret("WHATSAPP_TOKEN");
const WHATSAPP_PHONE_ID = defineSecret("WHATSAPP_PHONE_ID");
const SUPABASE_URL = defineSecret("SUPABASE_URL");
const SUPABASE_SERVICE_KEY = defineSecret("SUPABASE_SERVICE_KEY");
const INSTAGRAM_TOKEN = defineSecret("INSTAGRAM_ACCESS_TOKEN");

// ── Helper: Send WhatsApp Message ──────────────────────────────────
async function sendWhatsApp(to, message, token, phoneId) {
  const url = `https://graph.facebook.com/v18.0/${phoneId}/messages`;
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: to.replace(/\+/g, ""),
      type: "text",
      text: { body: message },
    }),
  });
}

// ── 1. onNewOrder ──────────────────────────────────────────────────
// Trigger: when new order is written to Supabase (via polling or webhook)
// Since Supabase doesn't natively trigger Firebase Functions,
// call this function via HTTP from the checkout page or a Supabase webhook.
exports.onNewOrder = async (orderData) => {
  const { customer_name, phone, order_number, wilaya, total } = orderData;

  const customerMsg = `✅ مرحباً ${customer_name}!\n\nتم استلام طلبك رقم *${order_number}* بنجاح.\n\n📦 الولاية: ${wilaya}\n💰 المجموع: ${total?.toLocaleString()} DA\n\nسنتواصل معك قريباً لتأكيد الطلب. شكراً لتسوقك من *NAFAA* 🙏`;

  // Send to customer
  // await sendWhatsApp(phone, customerMsg, token, phoneId);
  console.log("New order notification:", order_number);
};

// ── 2. syncInstagramFeed ───────────────────────────────────────────
// Scheduled every 60 minutes — syncs latest Instagram posts to Supabase
exports.syncInstagramFeed = onSchedule(
  { schedule: "every 60 minutes", secrets: [INSTAGRAM_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_KEY] },
  async () => {
    try {
      const token = INSTAGRAM_TOKEN.value();
      const supabaseUrl = SUPABASE_URL.value();
      const supabaseKey = SUPABASE_SERVICE_KEY.value();

      const response = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=${token}`
      );
      const { data: posts } = await response.json();

      const supabase = createClient(supabaseUrl, supabaseKey);
      for (const post of posts || []) {
        await supabase.from("instagram_posts").upsert({
          id: post.id,
          media_url: post.media_url || post.thumbnail_url,
          media_type: post.media_type,
          caption: post.caption,
          posted_at: post.timestamp,
          synced_at: new Date().toISOString(),
        }, { onConflict: "id" });
      }
      console.log(`Synced ${posts?.length || 0} Instagram posts`);
    } catch (err) {
      console.error("Instagram sync failed:", err);
    }
  }
);

// ── 3. scheduledInventoryAlert ─────────────────────────────────────
// Every 6 hours — alerts admin about low-stock products
exports.scheduledInventoryAlert = onSchedule(
  { schedule: "every 6 hours", secrets: [SUPABASE_URL, SUPABASE_SERVICE_KEY, WHATSAPP_TOKEN, WHATSAPP_PHONE_ID] },
  async () => {
    const supabase = createClient(SUPABASE_URL.value(), SUPABASE_SERVICE_KEY.value());
    const { data: lowStock } = await supabase
      .from("products")
      .select("name_ar, stock_count")
      .lt("stock_count", 3)
      .eq("is_active", true);

    if (lowStock?.length > 0) {
      const msg = `⚠️ تنبيه مخزون NAFAA:\n\n` +
        lowStock.map(p => `• ${p.name_ar}: ${p.stock_count} قطعة متبقية`).join("\n");
      console.log("Low stock alert:", msg);
      // await sendWhatsApp(ADMIN_PHONE, msg, WHATSAPP_TOKEN.value(), WHATSAPP_PHONE_ID.value());
    }
  }
);

// ── 4. smartCartAlert ──────────────────────────────────────────────
// Daily — finds products with high cart adds but low sales
exports.smartCartAlert = onSchedule(
  { schedule: "every 24 hours", secrets: [SUPABASE_URL, SUPABASE_SERVICE_KEY] },
  async () => {
    const supabase = createClient(SUPABASE_URL.value(), SUPABASE_SERVICE_KEY.value());
    const { data: products } = await supabase
      .from("products")
      .select("name_ar, cart_add_count, sales_count, price_dzd")
      .gt("cart_add_count", 10)
      .eq("is_active", true);

    const suspicious = (products || []).filter(
      (p) => p.cart_add_count > 0 && p.sales_count / p.cart_add_count < 0.2
    );

    if (suspicious.length > 0) {
      console.log("Smart Cart Alert — Products with low conversion:", suspicious);
      // Send WhatsApp or FCM to admin
    }
  }
);

// ── 5. onBackInStockRestock ─────────────────────────────────────────
// Called when admin updates stock — notifies waiting customers
exports.notifyBackInStock = async (productId, size) => {
  // This should be triggered via Supabase webhook when stock_count changes from 0 to >0
  // Query back_in_stock_requests and send WhatsApp to each subscriber
  console.log(`Back in stock: product ${productId}, size: ${size || "any"}`);
};
