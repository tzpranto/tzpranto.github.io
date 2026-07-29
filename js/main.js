/* =====================================================
   main.js – Renders page content into Material Web components
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderTopBarAndDrawer();
  renderAbout();
  renderResearchInterests();
  renderNews();
  renderPublications();
  renderExperience();
  renderEducation();
  renderTeaching();
  renderServices();
  renderAwards();
  renderContact();
  initScrollSpy();
});

/* ── Escape helper — data is trusted (author-authored), but we still avoid
   accidentally injecting HTML from fields that shouldn't be markup ── */
function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ── Icon helper — Material Symbols name OR an inline SVG for brand marks
   (Twitter/X doesn't ship in Material Symbols). ── */
const BRAND_SVG = {
  x: `<svg viewBox="0 0 1200 1227" fill="currentColor" aria-hidden="true" class="brand-svg">
        <path d="M714 519 1160 0h-106L671 448 366 0H12l468 681L12 1227h106l409-478 327 478h354L714 519Zm-145 169-47-68L155 80h163l305 436 47 68 396 566H903L569 688Z"/>
      </svg>`,
};
function iconMarkup(icon) {
  if (icon && icon.startsWith("brand:")) {
    return BRAND_SVG[icon.slice(6)] || "";
  }
  return `<md-icon>${icon}</md-icon>`;
}

/* ── Top bar + drawer ── */
function renderTopBarAndDrawer() {
  const p = PROFILE;

  const tbPhoto = document.getElementById("topbar-photo");
  const tbName  = document.getElementById("topbar-name");
  const tbSub   = document.getElementById("topbar-sub");
  tbPhoto.src = p.photo; tbPhoto.alt = p.name;
  tbName.textContent = p.preferredName || p.name;
  tbSub.textContent  = [p.title, p.institution].filter(Boolean).join(" · ");

  const cvBtn = document.getElementById("cv-btn");
  if (cvBtn && p.links.cv) cvBtn.setAttribute("href", p.links.cv);
  const emailBtn = document.getElementById("email-btn");
  if (emailBtn && p.links.email) {
    emailBtn.setAttribute("href", `mailto:${p.links.email}`);
  }

  const drawerPhoto = document.getElementById("drawer-photo");
  drawerPhoto.src = p.photo; drawerPhoto.alt = p.name;
  document.getElementById("drawer-name").textContent = p.name;
  document.getElementById("drawer-sub").textContent  =
    [p.title, p.department, p.institution].filter(Boolean).join(" · ");
  document.getElementById("drawer-loc").innerHTML =
    `<md-icon class="loc-icon" aria-hidden="true">place</md-icon>${esc(p.location || "")}`;

  const linkDefs = [
    { key: "cv",           icon: "description",       label: "Curriculum Vitae", href: () => p.links.cv,                     target: "_blank" },
    { key: "email",        icon: "mail",              label: p.links.email,      href: () => `mailto:${p.links.email}`,      target: "_self" },
    { key: "googleScholar",icon: "school",            label: "Google Scholar",   href: () => p.links.googleScholar,          target: "_blank" },
    { key: "github",       icon: "code",              label: "GitHub",           href: () => p.links.github,                 target: "_blank" },
    { key: "linkedin",     icon: "business_center",   label: "LinkedIn",         href: () => p.links.linkedin,               target: "_blank" },
    { key: "twitter",      icon: "brand:x",           label: "Twitter / X",      href: () => p.links.twitter,                target: "_blank" },
    { key: "buetProfile",  icon: "account_balance",   label: "BUET Profile",     href: () => p.links.buetProfile,            target: "_blank" },
  ];
  const drawerLinks = document.getElementById("drawer-links");
  drawerLinks.innerHTML = linkDefs
    .filter(d => p.links[d.key])
    .map(d => `
      <md-list-item type="link" href="${esc(d.href())}" target="${d.target}" rel="noopener">
        <span slot="start" class="link-icon-slot">${iconMarkup(d.icon)}</span>
        <div slot="headline">${esc(d.label)}</div>
      </md-list-item>`)
    .join("");

  const navItems = [
    { id: "about",        label: "About",        icon: "person" },
    { id: "news",         label: "News",         icon: "campaign" },
    { id: "publications", label: "Publications", icon: "menu_book" },
    { id: "experience",   label: "Experience",   icon: "work" },
    { id: "education",    label: "Education",    icon: "school" },
    { id: "teaching",     label: "Teaching",     icon: "cast_for_education" },
    { id: "services",     label: "Services",     icon: "handshake" },
    { id: "awards",       label: "Awards",       icon: "emoji_events" },
    { id: "contact",      label: "Contact",      icon: "alternate_email" },
  ];
  const nav = document.getElementById("drawer-nav");
  nav.innerHTML = navItems.map(n => `
    <md-list-item type="link" href="#${n.id}" data-nav="${n.id}">
      <md-icon slot="start">${n.icon}</md-icon>
      <div slot="headline">${n.label}</div>
    </md-list-item>`).join("");
}

/* ── About ── */
function renderAbout() {
  document.getElementById("about-bio").innerHTML = PROFILE.bio;

  const featuredEl = document.getElementById("about-featured");
  if (!PROFILE.featured || PROFILE.featured.length === 0) {
    featuredEl.style.display = "none";
    return;
  }
  featuredEl.innerHTML = PROFILE.featured.map(f => `
    <a class="featured-card" href="${esc(f.url)}" target="_blank" rel="noopener">
      <md-elevation></md-elevation>
      <md-ripple></md-ripple>
      <md-icon class="featured-star" aria-hidden="true">star</md-icon>
      <div class="featured-body">
        <div class="featured-label md-typescale-label-small">Featured · ${esc(f.label)}</div>
        <div class="featured-text md-typescale-body-medium">${f.text}</div>
      </div>
      <md-icon class="featured-arrow" aria-hidden="true">arrow_outward</md-icon>
    </a>`).join("");
}

/* ── Research Interests ── */
function renderResearchInterests() {
  const el = document.getElementById("interests-list");
  el.innerHTML = PROFILE.researchInterests
    .map(i => `<md-assist-chip label="${esc(i)}"></md-assist-chip>`)
    .join("");

  const hobbiesEl = document.getElementById("hobbies-list");
  if (PROFILE.hobbies && PROFILE.hobbies.length) {
    hobbiesEl.innerHTML = `
      <h3 class="subsection-title md-typescale-title-small">Other Interests</h3>
      <md-chip-set>
        ${PROFILE.hobbies.map(h => `<md-suggestion-chip label="${esc(h)}"></md-suggestion-chip>`).join("")}
      </md-chip-set>`;
  }
}

/* ── News / Timeline ── */
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function typeMeta(type) {
  if (type === "personal") return { cls: "timeline-personal", icon: "favorite",    tag: "Personal"    };
  if (type === "pub")      return { cls: "timeline-pub",      icon: "menu_book",   tag: "Publication" };
  if (type === "career")   return { cls: "timeline-career",   icon: "work",        tag: "Career"      };
  return                             { cls: "",                icon: "info",        tag: "News"        };
}

function renderNews() {
  const el = document.getElementById("news-list");
  if (!NEWS || NEWS.length === 0) {
    el.innerHTML = `<p class="news-empty md-typescale-body-medium">No news yet – check back soon.</p>`;
    return;
  }
  const byYear = {};
  NEWS.forEach(n => {
    const year = n.date.split(".")[0];
    (byYear[year] ||= []).push(n);
  });
  const years = Object.keys(byYear).sort((a, b) => b - a);

  let html = `<ol class="timeline">`;
  years.forEach(year => {
    html += `
      <li class="timeline-year-block">
        <div class="timeline-year-label md-typescale-title-medium">${year}</div>
        <ol class="timeline-items">`;
    byYear[year].forEach(n => {
      const monthNum = parseInt(n.date.split(".")[1], 10);
      const monthLabel = MONTH_NAMES[monthNum - 1] || n.date.split(".")[1];
      const m = typeMeta(n.type);
      html += `
        <li class="timeline-item ${m.cls}">
          <span class="timeline-month md-typescale-label-medium">${monthLabel}</span>
          <span class="timeline-dot" aria-hidden="true">
            <md-icon>${m.icon}</md-icon>
          </span>
          <span class="timeline-text md-typescale-body-medium">
            <span class="timeline-tag md-typescale-label-small">${m.tag}</span>${n.text}
          </span>
        </li>`;
    });
    html += `</ol></li>`;
  });
  html += `</ol>`;
  el.innerHTML = html;
}

/* ── Publications ── */
function renderPublications() {
  const el = document.getElementById("pub-list");
  el.innerHTML = `<ul class="pub-list">` +
    PUBLICATIONS.map(pub => `
      <li class="pub-card">
        <md-elevation></md-elevation>
        <div class="pub-title md-typescale-title-medium">${pub.title}</div>
        <div class="pub-authors md-typescale-body-medium">${pub.authors}</div>
        <div class="pub-venue md-typescale-body-small">${pub.venue}</div>
        ${pub.links && pub.links.length
          ? `<div class="pub-links">${pub.links.map(l =>
              `<md-text-button href="${esc(l.url)}" target="_blank" rel="noopener">
                <md-icon slot="icon">open_in_new</md-icon>${esc(l.label)}
              </md-text-button>`
            ).join("")}</div>`
          : ""}
      </li>`).join("") +
    `</ul>`;

  if (PROFILE.erdosNumber) {
    const note = document.getElementById("erdos-note");
    note.innerHTML =
      `<md-icon aria-hidden="true">functions</md-icon>
       <span><strong>Erdős Number: ${PROFILE.erdosNumber.number}</strong> — ${esc(PROFILE.erdosNumber.chain)}</span>`;
    note.hidden = false;
  }
}

/* ── Experience ── */
function renderExperience() {
  const el = document.getElementById("exp-list");
  el.innerHTML = `<ul class="exp-list">` +
    EXPERIENCE.map(e => `
      <li class="exp-card">
        <md-elevation></md-elevation>
        <div class="exp-head">
          <div class="exp-role md-typescale-title-medium">${esc(e.role)}</div>
          <md-assist-chip label="${esc(e.period)}"></md-assist-chip>
        </div>
        <div class="exp-org md-typescale-body-medium">
          <a href="${esc(e.orgUrl)}" target="_blank" rel="noopener">${esc(e.org)}</a>
        </div>
        ${e.description ? `<div class="exp-desc md-typescale-body-medium">${e.description}</div>` : ""}
      </li>`).join("") +
    `</ul>`;
}

/* ── Education ── */
function renderEducation() {
  const el = document.getElementById("edu-list");
  el.innerHTML = `<ul class="edu-list">` +
    EDUCATION.map(e => `
      <li class="edu-card">
        <md-elevation></md-elevation>
        <div class="exp-head">
          <div class="edu-degree md-typescale-title-medium">${esc(e.degree)}</div>
          <md-assist-chip label="${esc(e.period)}"></md-assist-chip>
        </div>
        <div class="edu-inst md-typescale-body-medium">
          <a href="${esc(e.institutionUrl)}" target="_blank" rel="noopener">${esc(e.institution)}</a>
        </div>
        ${e.detail ? `<div class="edu-detail md-typescale-body-small">${e.detail}</div>` : ""}
      </li>`).join("") +
    `</ul>`;
}

/* ── Teaching ── */
function renderTeaching() {
  const el = document.getElementById("teaching-list");
  el.innerHTML = `<md-list class="teaching-list">` +
    TEACHING.map(t => `
      <md-list-item>
        <md-icon slot="start">cast_for_education</md-icon>
        <div slot="headline">${t.title}</div>
        <div slot="supporting-text">${esc(t.code)}</div>
      </md-list-item>`).join("") +
    `</md-list>`;
}

/* ── Services ── */
function renderServices() {
  const el = document.getElementById("services-list");
  el.innerHTML = `<md-list class="services-list">` +
    SERVICES.map(s => `
      <md-list-item>
        <md-icon slot="start">check_circle</md-icon>
        <div slot="headline">${s}</div>
      </md-list-item>`).join("") +
    `</md-list>`;
}

/* ── Awards ── */
function renderAwards() {
  const el = document.getElementById("awards-list");
  el.innerHTML = `<md-list class="awards-list">` +
    AWARDS.map(a => `
      <md-list-item>
        <md-icon slot="start">emoji_events</md-icon>
        <div slot="headline">${a}</div>
      </md-list-item>`).join("") +
    `</md-list>`;
}

/* ── Contact ── */
function renderContact() {
  const el = document.getElementById("contact-card");
  if (!el) return;
  const p = PROFILE;
  const emails = [
    { addr: p.links.email,         label: "Penn State (primary)", primary: true },
    { addr: p.links.emailBuet,     label: "BUET" },
    { addr: p.links.emailPersonal, label: "Personal" },
  ].filter(e => e.addr);

  const socials = [
    { key: "googleScholar", icon: "school",           label: "Google Scholar" },
    { key: "github",        icon: "code",             label: "GitHub" },
    { key: "linkedin",      icon: "business_center",  label: "LinkedIn" },
    { key: "twitter",       icon: "brand:x",          label: "Twitter / X" },
    { key: "buetProfile",   icon: "account_balance",  label: "BUET Profile" },
  ].filter(s => p.links[s.key]);

  el.innerHTML = `
    <div class="contact-card">
      <md-elevation></md-elevation>
      <div class="contact-emails">
        <div class="contact-label md-typescale-label-small">Email</div>
        ${emails.map(e => `
          <a class="contact-email md-typescale-body-large" href="mailto:${esc(e.addr)}">
            <md-icon aria-hidden="true">mail</md-icon>
            <span class="contact-email-addr">${esc(e.addr)}</span>
            <span class="contact-email-tag md-typescale-label-small">${esc(e.label)}</span>
          </a>`).join("")}
      </div>
      <div class="contact-socials">
        ${socials.map(s => `
          <md-icon-button href="${esc(p.links[s.key])}" target="_blank" rel="noopener" aria-label="${esc(s.label)}" title="${esc(s.label)}">
            ${iconMarkup(s.icon)}
          </md-icon-button>`).join("")}
      </div>
    </div>`;
}

/* ── Scroll Spy — highlight the active md-list-item in the drawer nav ── */
function initScrollSpy() {
  const sections = document.querySelectorAll(".section[id]");
  const navItems = document.querySelectorAll("#drawer-nav md-list-item[data-nav]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navItems.forEach(item => {
            item.classList.toggle("nav-active", item.dataset.nav === entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );
  sections.forEach(s => observer.observe(s));
}
