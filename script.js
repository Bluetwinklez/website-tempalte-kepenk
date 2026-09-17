document.addEventListener("DOMContentLoaded", function () {
  const burgerBtn = document.getElementById("burgerBtn");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => mobileMenu.classList.add("open"));
  }
  if (closeMenuBtn && mobileMenu) {
    closeMenuBtn.addEventListener("click", () => mobileMenu.classList.remove("open"));
  }
  if (mobileMenu) {
    mobileMenu.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => mobileMenu.classList.remove("open"))
    );
  }

  const waFloatBtn = document.getElementById("waFloatBtn");
  const waPanel = document.getElementById("waPanel");
  const waPanelClose = document.getElementById("waPanelClose");
  const waPanelForm = document.getElementById("waPanelForm");
  const waPanelInput = document.getElementById("waPanelInput");
  if (waFloatBtn && waPanel) {
    waFloatBtn.addEventListener("click", () => waPanel.classList.toggle("open"));
  }
  if (waPanelClose && waPanel) {
    waPanelClose.addEventListener("click", () => waPanel.classList.remove("open"));
  }
  if (waPanelForm && waPanelInput) {
    waPanelForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const number = waPanelForm.dataset.number;
      const text = waPanelInput.value.trim() || waPanelForm.dataset.defaultMessage;
      window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`, "_blank");
      waPanelInput.value = "";
    });
  }

  const revealEls = document.querySelectorAll(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => io.observe(el));
});
