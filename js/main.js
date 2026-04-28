/* =====================================================
   main.js – Renders all page content from data files
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  renderSidebar();
  renderAbout();
  renderResearchInterests();
  renderNews();
  renderPublications();
  renderExperience();
  renderEducation();
  renderTeaching();
  renderServices();
  renderAwards();
  initScrollSpy();
});

/* ── Sidebar ── */
function renderSidebar() {
  const p = PROFILE;

  document.getElementById("sidebar-photo").src = p.photo;
  document.getElementById("sidebar-photo").alt = p.name;
  document.getElementById("sidebar-name").textContent = p.name;
  document.getElementById("sidebar-title").textContent = p.title;
  document.getElementById("sidebar-dept").textContent = p.department;
  document.getElementById("sidebar-institution").textContent = p.institution;
  document.getElementById("sidebar-location").innerHTML =
    `<i class="fas fa-map-marker-alt" style="font-size:0.75rem;margin-right:3px"></i>${p.location}`;

  const linksEl = document.getElementById("sidebar-links");
  const defs = [
    { key: "email",        icon: "fas fa-envelope",      label: "Email",          href: () => `mailto:${p.links.email}` },
    { key: "googleScholar",icon: "fas fa-graduation-cap", label: "Google Scholar", href: () => p.links.googleScholar },
    { key: "github",       icon: "fab fa-github",         label: "GitHub",         href: () => p.links.github },
    { key: "linkedin",     icon: "fab fa-linkedin",       label: "LinkedIn",       href: () => p.links.linkedin },
    { key: "twitter",      icon: "fab fa-twitter",        label: "Twitter / X",    href: () => p.links.twitter },
    { key: "cv",           icon: "fas fa-file-alt",       label: "CV",             href: () => p.links.cv },
    { key: "buetProfile",  icon: "fas fa-university",     label: "BUET Profile",   href: () => p.links.buetProfile },
  ];
  linksEl.innerHTML = defs
    .filter(d => p.links[d.key])
    .map(d => `<a class="sidebar-link" href="${d.href()}" target="${d.key === 'email' ? '_self' : '_blank'}" rel="noopener">
      <i class="${d.icon}"></i><span>${d.label}</span>
    </a>`)
    .join("");
}

/* ── About ── */
function renderAbout() {
  document.getElementById("about-bio").innerHTML = PROFILE.bio;
}

/* ── Research Interests ── */
function renderResearchInterests() {
  const el = document.getElementById("interests-list");
  el.innerHTML = PROFILE.researchInterests
    .map(i => `<li>${i}</li>`)
    .join("");
}

/* ── News ── */
function renderNews() {
  const el = document.getElementById("news-list");
  if (!NEWS || NEWS.length === 0) {
    el.innerHTML = `<p class="news-empty">No news yet – check back soon.</p>`;
    return;
  }
  el.innerHTML = `<ul class="news-list">` +
    NEWS.map(n => `
      <li class="news-item">
        <span class="news-date">[${n.date}]</span>
        <span>${n.text}</span>
      </li>`).join("") +
    `</ul>`;
}

/* ── Publications ── */
function renderPublications() {
  const el = document.getElementById("pub-list");
  el.innerHTML = `<ul class="pub-list">` +
    PUBLICATIONS.map(pub => `
      <li class="pub-item">
        <div class="pub-title">${pub.title}</div>
        <div class="pub-authors">${pub.authors}</div>
        <div class="pub-venue">${pub.venue}</div>
        ${pub.links && pub.links.length
          ? `<div class="pub-links">${pub.links.map(l =>
              `<a class="pub-link" href="${l.url}" target="_blank" rel="noopener">${l.label}</a>`
            ).join("")}</div>`
          : ""}
      </li>`).join("") +
    `</ul>`;

  if (PROFILE.erdosNumber) {
    document.getElementById("erdos-note").innerHTML =
      `<strong>Erdős Number: ${PROFILE.erdosNumber.number}</strong> – ${PROFILE.erdosNumber.chain}`;
    document.getElementById("erdos-note").style.display = "";
  }
}

/* ── Experience ── */
function renderExperience() {
  const el = document.getElementById("exp-list");
  el.innerHTML = `<ul class="exp-list">` +
    EXPERIENCE.map(e => `
      <li class="exp-item">
        <div class="exp-role">${e.role}</div>
        <div class="exp-period">${e.period}</div>
        <div class="exp-org"><a href="${e.orgUrl}" target="_blank" rel="noopener">${e.org}</a></div>
        ${e.description ? `<div class="exp-desc">${e.description}</div>` : ""}
      </li>`).join("") +
    `</ul>`;
}

/* ── Education ── */
function renderEducation() {
  const el = document.getElementById("edu-list");
  el.innerHTML = `<ul class="edu-list">` +
    EDUCATION.map(e => `
      <li class="edu-item">
        <div class="edu-degree">${e.degree}</div>
        <div class="edu-period">${e.period}</div>
        <div class="edu-inst"><a href="${e.institutionUrl}" target="_blank" rel="noopener">${e.institution}</a></div>
        ${e.detail ? `<div class="edu-detail">${e.detail}</div>` : ""}
      </li>`).join("") +
    `</ul>`;
}

/* ── Teaching ── */
function renderTeaching() {
  const el = document.getElementById("teaching-list");
  el.innerHTML = `<ul class="teaching-grid">` +
    TEACHING.map(t => `
      <li class="teaching-item">
        <span class="teaching-code">${t.code}</span>
        <span>${t.title}</span>
      </li>`).join("") +
    `</ul>`;
}

/* ── Services ── */
function renderServices() {
  const el = document.getElementById("services-list");
  el.innerHTML = `<ul>` +
    SERVICES.map(s => `<li>${s}</li>`).join("") +
    `</ul>`;
}

/* ── Awards ── */
function renderAwards() {
  const el = document.getElementById("awards-list");
  el.innerHTML = `<ul class="awards-list">` +
    AWARDS.map(a => `<li><span>${a}</span></li>`).join("") +
    `</ul>`;
}

/* ── Scroll Spy ── */
function initScrollSpy() {
  const sections = document.querySelectorAll(".section[id]");
  const navLinks = document.querySelectorAll(".sidebar-nav a[href^='#']");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-20% 0px -70% 0px" }
  );

  sections.forEach(s => observer.observe(s));
}
