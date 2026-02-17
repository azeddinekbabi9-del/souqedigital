// =======================
// CONFIG: بدّل رقم واتساب ديالك هنا
// المغرب مثال: +2126xxxxxxx => "2126xxxxxxx" (بلا + ولا 00)
// =======================
const STORE_WHATSAPP_NUMBER = "212782901677"; // <-- بدّلها

const ORDERS_KEY = "vortex_orders_v1";

// =======================
// DATA
// =======================
const products = [
  {
    id: "ebook-starter",
    name: "NETFLIX",
    price: 3.5,
    tag: "account" ,
    desc: "Watch unlimited movies, series, and Netflix originals anytime, anywhere",
    details: "Includes HD streaming, multiple profiles, watch on TV, laptop, phone, and tablet. Cancel anytime.",
    img:"https://image2url.com/r2/default/images/1771338955670-2a9083bf-9459-42d6-953d-dc3026c84449.png"
  },
];

const slidesData = [
  {
    title: "Sell Digital Products",
    text: ".",
    cta: { label: "Browse products", href: "#products" },
    img: "https://image2url.com/r2/default/images/1771339966515-55691de9-bec2-4225-ad4e-7a12d8cc3998.png"
  },

];

// =======================
// Helpers
// =======================
const money = (n) => `$${n.toFixed(2)}`;
const $ = (sel) => document.querySelector(sel);
const getProductById = (id) => products.find(p => p.id === id);

function safeLoad(key, fallback){
  try { return JSON.parse(localStorage.getItem(key) || "") ?? fallback; }
  catch { return fallback; }
}
function safeSave(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizePhone(raw){
  return String(raw || "").trim().replace(/\s+/g, "");
}

function buildWhatsAppMessage(order){
  const p = order.product;
  const lines = [
    "🛒 New Order",
    `• Product: ${p.name}`,
    `• Price: ${money(p.price)}`,
    "",
    "👤 Customer info",
    `• Name: ${order.fullName}`,
    `• Gmail: ${order.email}`,
    `• Phone: ${order.phone}`,
    `• WhatsApp: ${order.whatsapp}`,
  ];
  if (order.note) {
    lines.push("", "📝 Note", order.note);
  }
  lines.push("", `✅ Product ID: ${p.id}`);
  return lines.join("\n");
}

function openWhatsAppToStore(message){
  const text = encodeURIComponent(message);
  const number = (STORE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const url = number
    ? `https://wa.me/${number}?text=${text}`
    : `https://wa.me/?text=${text}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Reveal animation
function setupReveal(){
  const els = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("show");
    });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// =======================
// HOME
// =======================
function initHome(){
  const slidesEl = $("#slides");
  const dotsEl = $("#dots");
  const gridEl = $("#productGrid");
  if (!slidesEl || !dotsEl || !gridEl) return;

  // slider render
  slidesEl.innerHTML = slidesData.map(s => `
    <div class="slide">
      <div class="slide__text">
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <a class="btn primary" href="${s.cta.href}">${s.cta.label}</a>
        <a class="btn ghost" href="product.html?id=ui-kit" style="margin-left:10px">Featured</a>
      </div>
      <img class="slide__img" src="${s.img}" alt="${s.title}" />
    </div>
  `).join("");

  dotsEl.innerHTML = slidesData.map((_, i) =>
    `<button class="dot" data-dot="${i}" aria-label="Go to slide ${i+1}"></button>`
  ).join("");

  let index = 0;
  const setActive = () => {
    slidesEl.style.transform = `translateX(-${index * 100}%)`;
    dotsEl.querySelectorAll(".dot").forEach((d, i) => d.classList.toggle("active", i === index));
  };

  const next = () => { index = (index + 1) % slidesData.length; setActive(); };
  const prev = () => { index = (index - 1 + slidesData.length) % slidesData.length; setActive(); };

  $("#nextBtn").addEventListener("click", next);
  $("#prevBtn").addEventListener("click", prev);
  dotsEl.addEventListener("click", (e) => {
    const d = e.target.getAttribute("data-dot");
    if (d !== null) { index = Number(d); setActive(); }
  });

  setActive();
  setInterval(next, 4500);

  // products render
  gridEl.innerHTML = products.map(p => `
    <article class="card reveal">
      <img class="card__img" src="${p.img}" alt="${p.name}" />
      <div class="card__body">
        <div class="card__row">
          <h4 class="card__title">${p.name}</h4>
          <span class="tag">${p.tag}</span>
        </div>
        <p class="card__desc">${p.desc}</p>
        <div class="card__row">
          <div class="price">${money(p.price)}</div>
          <div class="card__actions">
            <a class="btn ghost" href="product.html?id=${p.id}">View</a>
            <a class="btn primary" href="product.html?id=${p.id}#order">Order</a>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  setupReveal();

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// =======================
// PRODUCT PAGE + MODAL
// =======================
function initProductPage(){
  const holder = $("#productPage");
  if (!holder) return;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const p = getProductById(id);

  if (!p) {
    holder.innerHTML = `
      <div class="product-info">
        <h1>Product not found</h1>
        <p class="muted">رجع للصفحة الرئيسية واختار واحد المنتج.</p>
        <a class="btn primary" href="index.html">Back to store</a>
      </div>
    `;
    return;
  }

  document.title = p.name;

  holder.innerHTML = `
    <div class="product-media">
      <img src="${p.img}" alt="${p.name}" />
    </div>

    <div class="product-info">
      <div class="kv">
        <span>${p.tag}</span>
        <span>Digital product</span>
        <span>Order via WhatsApp</span>
      </div>

      <h1 class="title-glow">${p.name}</h1>
      <p class="muted">${p.details}</p>

      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px">
        <div class="price" style="font-size:22px">${money(p.price)}</div>
        <button class="btn primary" id="openOrderBtn">Order now</button>
      </div>

      <p class="hint">
       للطلب أملي الفورم بالمعطيات ديالك، و غادي يجيك مساج جاهز فواتساب باش تأكد الطلب ديالك. ما عليك غير تضغط على "إرسال" فواتساب و غادي نتواصل معاك في أقرب وقت. شكرا لك!
      </p>

      <a class="btn ghost" href="index.html#products">← Continue shopping</a>
    </div>
  `;

  const modal = $("#orderModal");
  const overlay = $("#orderOverlay");
  const closeBtn = $("#closeOrderBtn");
  const form = $("#orderForm");
  const previewBtn = $("#previewMsgBtn");
  const previewBox = $("#msgPreview");
  const openBtn = $("#openOrderBtn");

  if (!modal || !overlay || !closeBtn || !form || !openBtn) return;

  const openModal = () => modal.setAttribute("aria-hidden", "false");
  const closeModal = () => modal.setAttribute("aria-hidden", "true");

  openBtn.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);

  if (location.hash === "#order") openModal();

  function collectOrderFromForm(){
    const fd = new FormData(form);
    return {
      id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
      createdAt: new Date().toISOString(),
      product: p,
      fullName: String(fd.get("fullName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: normalizePhone(fd.get("phone")),
      whatsapp: normalizePhone(fd.get("whatsapp")),
      note: String(fd.get("note") || "").trim(),
    };
  }

  function validateOrder(order){
    if (!order.fullName) return "Name is required.";
    if (!order.email || !order.email.includes("@")) return "Valid Gmail is required.";
    if (!order.phone) return "Phone is required.";
    if (!order.whatsapp) return "WhatsApp is required.";
    return null;
  }

  function saveOrder(order){
    const orders = safeLoad(ORDERS_KEY, []);
    orders.unshift(order);
    safeSave(ORDERS_KEY, orders);
  }

  previewBtn?.addEventListener("click", () => {
    const order = collectOrderFromForm();
    const err = validateOrder(order);
    previewBox.style.display = "block";
    previewBox.textContent = err ? "⚠️ " + err : buildWhatsAppMessage(order);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const order = collectOrderFromForm();
    const err = validateOrder(order);

    if (err) {
      previewBox.style.display = "block";
      previewBox.textContent = "⚠️ " + err;
      return;
    }

    saveOrder(order);
    openWhatsAppToStore(buildWhatsAppMessage(order));

    closeModal();
    form.reset();
    previewBox.style.display = "none";
    previewBox.textContent = "";
  });
}

// =======================
// Init
// =======================
initHome();
initProductPage();
