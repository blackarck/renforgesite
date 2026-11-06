// ====== Repo configuration ======
const GITHUB_OWNER = "blackarck";
const GITHUB_REPO  = "renforge";
// =================================

const repoUrl     = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
// The "latest" tag is the rolling build that carries the downloadable files.
const releasesUrl = `${repoUrl}/releases/tag/latest`;
const issuesUrl   = `${repoUrl}/issues`;

// Wire up all repo / release / issues links by id pattern
const setHref = (id, href) => {
  const el = document.getElementById(id);
  if (el) el.href = href;
};

["repoLink", "repoLink2", "repoLink3"].forEach(id => setHref(id, repoUrl));
["downloadBtn", "getReleaseBtn", "getReleaseBtn2", "releasesLink"].forEach(id => setHref(id, releasesUrl));
setHref("issuesLink", issuesUrl);

// ---------- Reveal-on-scroll ----------
const reveals = Array.from(document.querySelectorAll(".reveal"));
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  reveals.forEach(el => io.observe(el));
} else {
  reveals.forEach(el => el.classList.add("in"));
}

// ---------- Smooth scroll for in-page links ----------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (ev) => {
    const href = a.getAttribute("href");
    if (!href || href === "#") return;
    const target = document.querySelector(href);
    if (!target) return;
    ev.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

// ---------- Quick start tabs ----------
const tabs = document.querySelectorAll(".code-tab");
const panes = document.querySelectorAll(".code-pane");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    tabs.forEach(t => t.classList.toggle("active", t === tab));
    panes.forEach(p => p.classList.toggle("active", p.dataset.pane === target));
  });
});

// ---------- Copy-to-clipboard for active code pane ----------
const copyBtn = document.getElementById("copyBtn");
if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const activePane = document.querySelector(".code-pane.active pre");
    if (!activePane) return;
    // Strip prompts and comments for a cleaner paste
    const text = Array.from(activePane.childNodes)
      .map(n => n.textContent || "")
      .join("")
      .split("\n")
      .map(line => line.replace(/^\s*(\$|PS>)\s?/, ""))
      .filter(line => !line.trim().startsWith("#") && line.trim().length > 0)
      .join("\n");

    try {
      await navigator.clipboard.writeText(text);
      copyBtn.textContent = "Copied";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1600);
    } catch {
      copyBtn.textContent = "Copy failed";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1600);
    }
  });
}

// ---------- Screenshot lightbox ----------
const modal      = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const imgbox     = document.getElementById("imgbox");
const closeBtn   = document.getElementById("modalClose");

function openModal(title, src) {
  modalTitle.textContent = title || "Screenshot";
  imgbox.innerHTML = "";
  if (src && src.trim().length > 0) {
    const img = document.createElement("img");
    img.src = src;
    img.alt = title || "Screenshot";
    imgbox.appendChild(img);
  } else {
    imgbox.innerHTML = `<div class="hint">No screenshot configured for this card.</div>`;
  }
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelectorAll(".shot").forEach(card => {
  card.addEventListener("click", () => {
    openModal(card.dataset.title, card.dataset.src);
  });
});

if (closeBtn) closeBtn.addEventListener("click", closeModal);
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal && modal.classList.contains("open")) closeModal();
});
