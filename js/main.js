// إعداد سنة الفوتر تلقائيًا
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// قائمة الموبايل
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// إرسال نموذج التواصل على الواتساب
const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const targetPhone = "201557676261"; // رقم الواتساب مع كود الدولة (مصر 20+)

    const text =
      `طلب جديد من نموذج الموقع:%0A` +
      `الاسم: ${name || "-"}%0A` +
      `رقم الجوال: ${phone || "-"}%0A` +
      `الرسالة: ${message || "-"}%0A` +
      `%0Aمرسل من موقع Vortex Control`;

    const waUrl = `https://wa.me/${targetPhone}?text=${text}`;
    window.open(waUrl, "_blank");
  });
}

// إنشاء QR Code لرابط الموقع الحالي
let SITE_URL = window.location.href;
// لو الرابط محلي file:// نخلي قيمة افتراضية يمكن تعديلها عند الرفع على الدومين
if (!SITE_URL.startsWith("http")) {
  SITE_URL = "https://your-domain.com"; // عدّل الرابط هنا عند الرفع
}

const qrContainer = document.getElementById("qrcode");
if (qrContainer && window.QRCode) {
  // تنظيف لو تم إنشاؤه من قبل
  qrContainer.innerHTML = "";
  new QRCode(qrContainer, {
    text: SITE_URL,
    width: 180,
    height: 180,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

// دالة عامة لسلايدر بالكروت (تُستخدم للأعمال والبرامج)
function setupCarousel(trackSelector, cardSelector, prevSelector, nextSelector, draggable = false) {
  const track = document.querySelector(trackSelector);
  const cards = document.querySelectorAll(cardSelector);
  const prevBtn = document.querySelector(prevSelector);
  const nextBtn = document.querySelector(nextSelector);

  if (!track || cards.length === 0) return;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  const update = () => {
    const cardWidth = cards[0].getBoundingClientRect().width || 0;
    const gap = 16;
    currentTranslate = -(currentIndex * (cardWidth + gap));
    prevTranslate = currentTranslate;
    track.style.transform = `translateX(${currentTranslate}px)`;

    if (prevBtn && nextBtn) {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= cards.length - 1;
    }
  };

  update();

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        update();
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < cards.length - 1) {
        currentIndex++;
        update();
      }
    });
  }

  if (!draggable) return;

  const startDrag = (x) => {
    isDragging = true;
    startX = x - currentTranslate;
    track.classList.add("is-dragging");
  };

  const moveDrag = (x) => {
    if (!isDragging) return;
    currentTranslate = x - startX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  };

  const endDrag = () => {
    if (!isDragging) return;
    isDragging = false;
    track.classList.remove("is-dragging");

    const cardWidth = cards[0].getBoundingClientRect().width;
    const gap = 16;
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentIndex < cards.length - 1) {
      currentIndex++;
    } else if (movedBy > 50 && currentIndex > 0) {
      currentIndex--;
    }
    update();
  };

  track.addEventListener("mousedown", (e) => startDrag(e.clientX));
  window.addEventListener("mousemove", (e) => moveDrag(e.clientX));
  window.addEventListener("mouseup", endDrag);

  track.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX);
  });
  window.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    moveDrag(touch.clientX);
  });
  window.addEventListener("touchend", endDrag);
}

// سلايدر ديناميكي لصور الأعمال (يعرض 4 ويبدل بينهم)
(function setupProjectsSlider() {
  const workImages = [
    { src: "images/work-1.jpg", title: "رش وتعقيم مطعم" },
    { src: "images/work-2.jpg", title: "مكافحة حشرات المنازل" },
    { src: "images/work-3.jpg", title: "مصائد قوارض للمخازن" },
    { src: "images/work-4.jpg", title: "معالجة محيط المنشأة" },
    { src: "images/work-5.jpg", title: "تعقيم مستودعات" },
  ].filter((img) => !!img.src);

  const track = document.querySelector(".projects-track");
  const cards = document.querySelectorAll(".projects-track .project-card");
  const prevBtn = document.querySelector(".projects-carousel .prev");
  const nextBtn = document.querySelector(".projects-carousel .next");

  if (!track || cards.length === 0 || workImages.length === 0) return;

  let startIndex = 0;

  const fillCards = () => {
    cards.forEach((card, idx) => {
      const dataIndex = (startIndex + idx) % workImages.length;
      const data = workImages[dataIndex];
      const imgEl = card.querySelector("img");
      const titleEl = card.querySelector("h3");
      const descEl = card.querySelector("p");

      if (imgEl) {
        imgEl.src = data.src;
        imgEl.alt = data.title;
      }
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) {
        descEl.textContent =
          idx === 0
            ? "تنفيذ برنامج رش وتعقيم احترافي."
            : idx === 1
            ? "خدمة مكافحة آمنة مع متابعة."
            : idx === 2
            ? "تركيب ومراجعة مصائد القوارض."
            : "تعقيم وتطهير مستمر للمنشآت.";
      }

      card.setAttribute("data-image", data.src);
    });
  };

  fillCards();

  const goNext = () => {
    startIndex = (startIndex + 1) % workImages.length;
    fillCards();
  };

  const goPrev = () => {
    startIndex = (startIndex - 1 + workImages.length) % workImages.length;
    fillCards();
  };

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);
})();

// سلايدر ديناميكي للبرامج والتقارير (يعرض 4 كروت ويبدل بينهم)
(function setupProgramsSlider() {
  const programs = [
    {
      title: "برنامج العمل",
      desc: "خطة عمل تفصيلية لدورات الرش والمتابعة الدورية.",
      href: "pdf/برنامج العمل2.pdf",
      iconClass: "fa-file-lines",
      linkText: "عرض برنامج العمل",
    },
    {
      title: "البرنامج البيولوجي",
      desc: "شرح بيولوجي لدورة حياة الآفات وأفضل طرق مكافحتها.",
      href: "pdf/بيولوجى.pdf",
      iconClass: "fa-dna",
      linkText: "عرض البرنامج البيولوجي",
    },
    {
      title: "تقرير المصائد والقوارض",
      desc: "توثيق مواقع المصائد ونتائجها وتحليلها بشكل دوري.",
      href: "pdf/تقرير المصائد الداخلية  والقوارض13.pdf",
      iconClass: "fa-chart-line",
      linkText: "عرض تقرير المصائد",
    },
    {
      title: "ليبل مصائد الحوائط",
      desc: "ملصقات تعريفية ومعلومات أمان للمصائد داخل الموقع.",
      href: "pdf/ليبل حوائط مصيدة.pdf",
      iconClass: "fa-tag",
      linkText: "عرض الليبل",
    },
  ];

  const track = document.querySelector(".programs-track");
  const cards = document.querySelectorAll(".programs-track .program-card");
  const prevBtn = document.querySelector(".programs-carousel .prev");
  const nextBtn = document.querySelector(".programs-carousel .next");

  if (!track || cards.length === 0 || programs.length === 0) return;

  let startIndex = 0;

  const fillCards = () => {
    cards.forEach((card, idx) => {
      const dataIndex = (startIndex + idx) % programs.length;
      const data = programs[dataIndex];

      const iconEl = card.querySelector(".program-icon");
      const titleEl = card.querySelector("h3");
      const descEl = card.querySelector("p");
      const linkEl = card.querySelector(".program-link");

      if (iconEl) {
        iconEl.className = `fa-solid ${data.iconClass} program-icon`;
      }
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (linkEl) {
        linkEl.href = data.href;
        linkEl.textContent = data.linkText;
      }
    });
  };

  fillCards();

  const goNext = () => {
    startIndex = (startIndex + 1) % programs.length;
    fillCards();
  };

  const goPrev = () => {
    startIndex = (startIndex - 1 + programs.length) % programs.length;
    fillCards();
  };

  if (nextBtn) nextBtn.addEventListener("click", goNext);
  if (prevBtn) prevBtn.addEventListener("click", goPrev);
})();

// Lightbox لعرض صورة العمل عند الضغط عليها
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-image");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.querySelector(".lightbox-close");
const lightboxBackdrop = document.querySelector(".lightbox-backdrop");

if (projectCards.length > 0 && lightbox && lightboxImg && lightboxCaption) {
  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const imgEl = card.querySelector("img");
      const src = card.getAttribute("data-image") || imgEl?.src;
      const title = card.querySelector("h3")?.textContent || "";

      lightboxImg.src = src;
      lightboxCaption.textContent = title;
      lightbox.classList.add("open");
    });
  });
}

const closeLightbox = () => {
  if (lightbox) {
    lightbox.classList.remove("open");
  }
};

if (lightboxClose) {
  lightboxClose.addEventListener("click", closeLightbox);
}
if (lightboxBackdrop) {
  lightboxBackdrop.addEventListener("click", closeLightbox);
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox();
  }
});


