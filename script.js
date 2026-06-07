const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelectorAll(".main-nav a");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const contactModal = document.querySelector(".contact-modal");
const contactOpeners = document.querySelectorAll(".contact-open, a[href='#contact']");
const contactClosers = document.querySelectorAll(".contact-close");
const modalContactForm = document.querySelector(".modal-contact-form");
const faqItems = document.querySelectorAll(".faq-list details");
const chatToggle = document.querySelector(".chat-toggle");
const chatWidget = document.querySelector(".chat-widget");
const chatClose = document.querySelector(".chat-close");
const chatLangButtons = document.querySelectorAll("[data-chat-lang]");
const typingWord = document.querySelector(".typing-word");
const visitCount = document.querySelector("#visit-count");
const typingWords = ["Tự động hóa", "Quản lý", "Số hóa"];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (visitCount) {
  visitCount.textContent = String(Math.floor(Math.random() * 899999) + 100001);
}

menuButton?.addEventListener("click", () => {
  const isOpen = header?.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener(
  "scroll",
  () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  },
  { passive: true },
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

faqItems.forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    faqItems.forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

const openContactModal = () => {
  contactModal?.classList.add("is-open");
  contactModal?.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  contactModal?.querySelector("input")?.focus();
};

const closeContactModal = () => {
  contactModal?.classList.remove("is-open");
  contactModal?.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

contactOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    event.preventDefault();
    header?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    if (opener.closest(".chat-widget")) closeChatWidget();
    openContactModal();
  });
});

contactClosers.forEach((closer) => {
  closer.addEventListener("click", closeContactModal);
});

const getFormStatus = (form) => {
  let status = form.querySelector(".form-status");
  if (!status) {
    status = document.createElement("div");
    status.className = "form-status";
    status.setAttribute("role", "status");
    form.append(status);
  }
  return status;
};

const setFormStatus = (form, message, type) => {
  const status = getFormStatus(form);
  status.textContent = message;
  status.className = `form-status is-${type}`;
};

const validateLeadForm = (form) => {
  const name = form.querySelector("[name='name']");
  const phone = form.querySelector("[name='phone']");
  const email = form.querySelector("[name='email']");
  const fields = [name, phone, email].filter(Boolean);

  fields.forEach((field) => field.classList.remove("is-invalid"));

  if (!name?.value.trim()) {
    name?.classList.add("is-invalid");
    return "Vui lòng nhập họ tên.";
  }

  const phoneValue = phone?.value.replace(/\s/g, "") || "";
  if (!/^(0|\+84)[0-9]{8,10}$/.test(phoneValue)) {
    phone?.classList.add("is-invalid");
    return "Vui lòng nhập số điện thoại hợp lệ.";
  }

  if (email?.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    email.classList.add("is-invalid");
    return "Email chưa đúng định dạng.";
  }

  return "";
};

[contactForm, modalContactForm].filter(Boolean).forEach((form) => {
  form.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("input", () => {
      field.classList.remove("is-invalid");
    });
  });
});

const openChatWidget = () => {
  chatWidget?.classList.add("is-open");
  chatWidget?.setAttribute("aria-hidden", "false");
};

const closeChatWidget = () => {
  chatWidget?.classList.remove("is-open");
  chatWidget?.setAttribute("aria-hidden", "true");
};

chatToggle?.addEventListener("click", () => {
  if (chatWidget?.classList.contains("is-open")) {
    closeChatWidget();
  } else {
    openChatWidget();
  }
});

chatClose?.addEventListener("click", closeChatWidget);

const chatCopy = {
  vi: {
    company: "Công ty cổ phần...",
    title: "Xin chào!",
    subtitle: "Rất vui khi được hỗ trợ bạn",
    intro: "Bắt đầu trò chuyện với Công ty cổ phần phần mềm SHPT",
    zalo: "Chat bằng Zalo",
    quick: "Chat nhanh",
  },
  en: {
    company: "SHPT Software JSC",
    title: "Hello!",
    subtitle: "Glad to support you",
    intro: "Start a conversation with SHPT Software JSC",
    zalo: "Chat via Zalo",
    quick: "Quick chat",
  },
};

const setChatLanguage = (lang) => {
  const copy = chatCopy[lang] || chatCopy.vi;
  chatWidget.querySelector(".chat-company strong").textContent = copy.company;
  chatWidget.querySelector(".chat-greeting h2").textContent = copy.title;
  chatWidget.querySelector(".chat-greeting p").textContent = copy.subtitle;
  chatWidget.querySelector(".chat-widget-body p").textContent = copy.intro;
  chatWidget.querySelector(".zalo-button").textContent = copy.zalo;
  chatWidget.querySelector(".quick-chat").textContent = copy.quick;

  chatLangButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.chatLang === lang);
  });
};

chatLangButtons.forEach((button) => {
  button.addEventListener("click", () => setChatLanguage(button.dataset.chatLang));
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && contactModal?.classList.contains("is-open")) {
    closeContactModal();
  }
  if (event.key === "Escape" && chatWidget?.classList.contains("is-open")) {
    closeChatWidget();
  }
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = validateLeadForm(contactForm);
  if (error) {
    setFormStatus(contactForm, error, "error");
    return;
  }
  const button = contactForm.querySelector("button");
  button.textContent = "Đã gửi thành công";
  button.disabled = true;
  setFormStatus(contactForm, "Cảm ơn bạn. SHPT sẽ liên hệ tư vấn trong thời gian sớm nhất.", "success");
});

modalContactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const error = validateLeadForm(modalContactForm);
  if (error) {
    setFormStatus(modalContactForm, error, "error");
    return;
  }
  const button = modalContactForm.querySelector("button");
  button.textContent = "Đã gửi thành công";
  button.disabled = true;
  setFormStatus(modalContactForm, "Thông tin đã được ghi nhận. Đội ngũ SHPT sẽ liên hệ lại với bạn.", "success");
});

if (typingWord && !prefersReducedMotion) {
  let wordIndex = 0;
  let charIndex = typingWords[0].length;
  let deleting = true;

  const typeNext = () => {
    const currentWord = typingWords[wordIndex];
    typingWord.textContent = currentWord.slice(0, charIndex);

    if (deleting) {
      charIndex -= 1;
      if (charIndex < 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % typingWords.length;
        window.setTimeout(typeNext, 360);
        return;
      }
    } else {
      charIndex += 1;
      if (charIndex > typingWords[wordIndex].length) {
        deleting = true;
        window.setTimeout(typeNext, 1900);
        return;
      }
    }

    window.setTimeout(typeNext, deleting ? 76 : 125);
  };

  window.setTimeout(typeNext, 1800);
}
