// =======================
// Put your WhatsApp number (international format, no +, no spaces)
// Example Morocco: 2126XXXXXXX
// =======================
const STORE_WHATSAPP = "212782901677";

// Products (replace images with your 800x800)
const products = [
  { id:"netflix", name:"NETFLIX-Quantity not available", price:3.5, tag:"Acont",
    desc:"Includes HD streaming, multiple profiles, watch on TV, laptop, phone, and tablet. Cancel anytime.",
    details:"للطلب أملي الفورم بالمعطيات ديالك، و غادي يجيك مساج جاهز فواتساب باش تأكد الطلب ديالك. ما عليك غير تضغط على  فواتساب و غادي نتواصل معاك في أقرب وقت. شكرا لك!.",
    img:"https://image2url.com/r2/default/images/1771338955670-2a9083bf-9459-42d6-953d-dc3026c84449.png"
  },
    { id:"spotify", name:"SPOTIFY-Quantity not available", price:4, tag:"Acont",
    desc:"Includes unlimited music streaming, millions of songs, create your own playlists, listen on phone, laptop, tablet, and TV. Cancel anytime.",
    details:"للطلب أملي الفورم بالمعطيات ديالك، و غادي يجيك مساج جاهز فواتساب باش تأكد الطلب ديالك. ما عليك غير تضغط على  فواتساب و غادي نتواصل معاك في أقرب وقت. شكرا لك!.",
    img:"https://image2url.com/r2/default/images/1771346850466-81d01413-aa23-4aa4-9506-37e770c077b1.png"
  },
     { id:"instagram-followers", name:"FOLLOWERS-INSTAGRAM", price:2, tag:"1000 Followers",
    desc:"Real Instagram followers, fast delivery, secure growth.",
    details:"للطلب أملي الفورم بالمعطيات ديالك، و غادي يجيك مساج جاهز فواتساب باش تأكد الطلب ديالك. ما عليك غير تضغط على  فواتساب و غادي نتواصل معاك في أقرب وقت. شكرا لك!.",
    img:"https://image2url.com/r2/default/images/1771347594897-ea1b0dac-c5ca-4f0a-b8b5-8491b068d33b.png"
  },
    { id:"facebook-followers", name:"FOLLOWERS-FACEBOOK", price:2, tag:"1000 Followers",
    desc:"Real Facebook followers, fast delivery, secure growth.",
    details:"للطلب أملي الفورم بالمعطيات ديالك، و غادي يجيك مساج جاهز فواتساب باش تأكد الطلب ديالك. ما عليك غير تضغط على  فواتساب و غادي نتواصل معاك في أقرب وقت. شكرا لك!.",
    img:"https://image2url.com/r2/default/images/1771347594897-ea1b0dac-c5ca-4f0a-b8b5-8491b068d33b.png"
  },
];

// Slider (1600x600 recommended)
const slidesData = [
  {
    title: "Premium Digital Products",
    text: "Choose a product and order directly via WhatsApp.",
    ctaLabel: "Browse products",
    ctaHref: "#products",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80"
  },

];

// Helpers
const $ = (sel) => document.querySelector(sel);
const money = (n) => `$${n.toFixed(2)}`;

let toastTimer = null;
function showToast(msg){
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove("show"), 1400);
}

function setupReveal(){
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("show"); });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

function generateOrderId(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VX-${yyyy}${mm}${dd}-${rand}`;
}

function buildWhatsAppMessage({ orderId, product, qty, fullName, email, phone, note }){
  const total = product.price * qty;
  return [
    "🧾 *NEW ORDER*",
    `Order ID: *${orderId}*`,
    "----------------------",
    `Product: *${product.name}*`,
    `Tag: ${product.tag}`,
    `Unit price: ${money(product.price)}`,
    `Quantity: *${qty}*`,
    `Total: *${money(total)}*`,
    "----------------------",
    `Full name: ${fullName}`,
    `Gmail: ${email}`,
    `Number: ${phone}`,
    `Note: ${note ? note : "-"}`,
    "----------------------",
    `Date: ${new Date().toLocaleString()}`
  ].join("\n");
}

function openWhatsApp(message){
  const url = `https://wa.me/${STORE_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

// Slider init (index only)
function initSlider(){
  const slidesEl = $("#slides");
  const dotsEl = $("#dots");
  const prevBtn = $("#prevBtn");
  const nextBtn = $("#nextBtn");
  const slider = $("#slider");
  if (!slidesEl || !dotsEl || !prevBtn || !nextBtn || !slider) return;

  slidesEl.innerHTML = slidesData.map(s => `
    <div class="hero-slide">
      <img src="${s.img}" alt="${s.title}">
      <div class="hero-content">
        <h3>${s.title}</h3>
        <p>${s.text}</p>
        <a class="btn primary" href="${s.ctaHref}">${s.ctaLabel}</a>
      </div>
    </div>
  `).join("");

  dotsEl.innerHTML = slidesData.map((_, i) =>
    `<button class="hero-dot ${i===0 ? "active" : ""}" data-dot="${i}"></button>`
  ).join("");

  let index = 0;
  let timer = null;

  const apply = () => {
    slidesEl.style.transform = `translateX(-${index * 100}%)`;
    dotsEl.querySelectorAll(".hero-dot").forEach((d,i)=> d.classList.toggle("active", i===index));
  };

  const next = () => { index = (index + 1) % slidesData.length; apply(); };
  const prev = () => { index = (index - 1 + slidesData.length) % slidesData.length; apply(); };

  nextBtn.addEventListener("click", ()=>{ next(); restart(); });
  prevBtn.addEventListener("click", ()=>{ prev(); restart(); });

  dotsEl.querySelectorAll("[data-dot]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      index = parseInt(btn.getAttribute("data-dot"),10);
      apply(); restart();
    });
  });

  const start = () => { timer = setInterval(next, 4500); };
  const stop = () => { if (timer) clearInterval(timer); timer=null; };
  const restart = () => { stop(); start(); };

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);

  apply(); start();
}

// Home products
function initHome(){
  const gridEl = $("#productGrid");
  if (!gridEl) return;

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
            <a class="btn primary" href="product.html?id=${p.id}">Order</a>
          </div>
        </div>
      </div>
    </article>
  `).join("");

  setupReveal();

  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// Product page form
function initProductPage(){
  const holder = $("#productPage");
  if (!holder) return;

  const id = new URLSearchParams(location.search).get("id");
  const p = products.find(x => x.id === id);

  if (!p){
    holder.innerHTML = `<div class="product-info"><h2>Product not found</h2></div>`;
    return;
  }

  document.title = p.name;

  holder.innerHTML = `
    <div class="product-media">
      <img src="${p.img}" alt="${p.name}" />
    </div>

    <div class="product-info">
      <div class="kv">
        <span>${p.tag}</span><span>Digital</span><span>2026</span>
      </div>

      <h2 style="margin:0">${p.name}</h2>
      <p class="muted">${p.details}</p>

      <div class="card__row">
        <div class="price" style="font-size:22px">${money(p.price)}</div>
        <span class="muted">Unit price</span>
      </div>

      <form class="form" id="orderForm">
        <div>
          <div class="label">Full name</div>
          <input class="input" id="fullName" required placeholder="Your full name" />
        </div>

        <div>
          <div class="label">Gmail</div>
          <input class="input" id="email" type="email" required placeholder="example@gmail.com" />
        </div>

        <div>
          <div class="label">Number</div>
          <input class="input" id="phone" required placeholder="06xxxxxxxx" />
        </div>

        <div>
          <div class="label">Quantity</div>
          <div class="qty-controls">
            <button class="qty-btn" type="button" id="decQty">-</button>
            <input class="input qty-input" id="qtyInput" type="number" min="1" value="1" />
            <button class="qty-btn" type="button" id="incQty">+</button>
          </div>
        </div>

        <div>
          <div class="label">Note</div>
          <textarea class="textarea" id="note" placeholder="Any note... (optional)"></textarea>
        </div>

        <button class="btn primary" type="submit">Send order on WhatsApp</button>
        <p class="hint">This will open WhatsApp with your order message.</p>
      </form>
    </div>
  `;

  const qtyInput = $("#qtyInput");
  $("#incQty").addEventListener("click", ()=> qtyInput.value = String((parseInt(qtyInput.value,10)||1)+1));
  $("#decQty").addEventListener("click", ()=> qtyInput.value = String(Math.max(1,(parseInt(qtyInput.value,10)||1)-1)));

  $("#orderForm").addEventListener("submit", (e)=>{
    e.preventDefault();

    if (!STORE_WHATSAPP || STORE_WHATSAPP.includes("X")){
      showToast("Set your WhatsApp number in app.js first.");
      return;
    }

    const fullName = $("#fullName").value.trim();
    const email = $("#email").value.trim();
    const phone = $("#phone").value.trim();
    const note = $("#note").value.trim();
    const qty = Math.max(1, parseInt(qtyInput.value,10)||1);

    if (!fullName || !email || !phone){
      showToast("Fill Full name, Gmail, and Number.");
      return;
    }

    const orderId = generateOrderId();
    const msg = buildWhatsAppMessage({ orderId, product:p, qty, fullName, email, phone, note });

    showToast("Opening WhatsApp… ✅");
    openWhatsApp(msg);
  });
}

// Init
initSlider();
initHome();
initProductPage();
