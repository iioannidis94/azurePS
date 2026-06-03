// app.js - Logic and rendering (No commands data here)

let activeFilter = "all";
let searchTerm = "";
let expandedCard = null;

function totalCmdCount() {
  return data.reduce((a, s) => a + s.cmds.length, 0);
}

function renderFilters() {
  const c = document.getElementById("filterBtns");
  c.innerHTML = `<button class="fbtn active" onclick="setFilter('all')">All (${totalCmdCount()})</button>`;
  data.forEach(s => {
    c.innerHTML += `<button class="fbtn" onclick="setFilter('${s.id}')">${s.icon} ${s.label}</button>`;
  });
  
  // Update header counters
  document.getElementById("totalCmds").textContent = totalCmdCount() + " commands";
  document.getElementById("totalCats").textContent = data.length + " categories";
  document.getElementById("footerCount").textContent = totalCmdCount();
}

function setFilter(id) {
  activeFilter = id;
  document.querySelectorAll(".fbtn").forEach(b => {
    if (id === "all") { b.classList.toggle("active", b.textContent.startsWith("All")); return; }
    const sec = data.find(s => s.id === id);
    b.classList.toggle("active", sec && b.textContent.includes(sec.label));
  });
  renderSections();
}

function filterAll() {
  searchTerm = document.getElementById("searchInput").value.toLowerCase();
  document.getElementById("searchClear").classList.toggle("visible", searchTerm.length > 0);
  renderSections();
}

function clearSearch() {
  document.getElementById("searchInput").value = "";
  searchTerm = "";
  document.getElementById("searchClear").classList.remove("visible");
  renderSections();
}

function hl(code) {
  return code
    .replace(/(&lt;[^&]+&gt;)/g, '<span class="kw">$1</span>')
    .replace(/(#.*)/g, '<span class="cm">$1</span>')
    .replace(/(\$\w[\w.]*)/g, '<span class="va">$1</span>')
    .replace(/(&quot;[^&]*&quot;)/g, '<span class="st">$1</span>');
}

function renderSections() {
  const container = document.getElementById("mainContent");
  let html = "";
  let totalVisible = 0;

  data.forEach(section => {
    if (activeFilter !== "all" && section.id !== activeFilter) return;

    const cmds = section.cmds.filter(c => {
      if (!searchTerm) return true;
      return c.name.toLowerCase().includes(searchTerm)
          || c.desc.toLowerCase().includes(searchTerm)
          || c.code.toLowerCase().includes(searchTerm)
          || (c.params || []).some(p => p[0].toLowerCase().includes(searchTerm) || p[1].toLowerCase().includes(searchTerm));
    });

    if (!cmds.length) return;
    totalVisible += cmds.length;

    html += `<div class="section" id="sec-${section.id}">
      <div class="sec-header">
        <div class="sec-icon-wrap" aria-hidden="true">${section.icon}</div>
        <span class="sec-title">${section.label}</span>
        <span class="sec-count">${cmds.length}</span>
      </div>
      <div class="cmd-grid">`;

    cmds.forEach((cmd, i) => {
      const cardId = `${section.id}-${i}`;
      html += `
        <div class="cmd-card" id="card-${cardId}" onclick="toggleCard('${cardId}')" role="button" tabindex="0" aria-expanded="false">
          <div class="cmd-top">
            <div class="cmd-name-wrap">
              <span class="cmd-name">${cmd.name}</span>
            </div>
            <div class="cmd-actions">
              <button class="cmd-copy" onclick="copyCode(event,'${cardId}')" title="Copy code" aria-label="Copy">
                <i class="ti ti-copy" aria-hidden="true"></i>
              </button>
              <i class="ti ti-chevron-down cmd-expand-icon" aria-hidden="true"></i>
            </div>
          </div>
          <div class="cmd-desc">${cmd.desc}</div>
          <div class="cmd-detail" id="detail-${cardId}">
            <div class="detail-label">Code</div>
            <div class="code-block" id="code-${cardId}">${hl(escHtml(cmd.code))}</div>
            ${cmd.params && cmd.params.length ? `
            <div class="param-section-title">Parameters</div>
            <table class="param-table">
              ${cmd.params.map(p => `<tr><td>${p[0]}</td><td>${p[1]}</td></tr>`).join("")}
            </table>` : ""}
          </div>
        </div>`;
    });

    html += `</div></div>`;
  });

  if (!totalVisible) {
    html = `<div class="no-results">
      <i class="ti ti-mood-sad" aria-hidden="true"></i>
      No commands found for "<strong>${searchTerm}</strong>"
    </div>`;
  }

  container.innerHTML = html;
  document.getElementById("footerCount").textContent = totalVisible;
}

function toggleCard(id) {
  const detail = document.getElementById("detail-" + id);
  const card   = document.getElementById("card-" + id);
  if (!detail) return;

  const isOpen = detail.classList.contains("show");

  if (expandedCard && expandedCard !== id) {
    const prev = document.getElementById("detail-" + expandedCard);
    const prevCard = document.getElementById("card-" + expandedCard);
    if (prev) prev.classList.remove("show");
    if (prevCard) { prevCard.classList.remove("expanded"); prevCard.setAttribute("aria-expanded","false"); }
  }

  detail.classList.toggle("show", !isOpen);
  card.classList.toggle("expanded", !isOpen);
  card.setAttribute("aria-expanded", !isOpen ? "true" : "false");
  expandedCard = !isOpen ? id : null;
}

function copyCode(e, id) {
  e.stopPropagation();
  const el = document.getElementById("code-" + id);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const btn = e.currentTarget;
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="ti ti-check" style="color:#3DD68C" aria-hidden="true"></i>';
    setTimeout(() => btn.innerHTML = orig, 2000);
  });
}

function escHtml(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// Keyboard support
document.addEventListener("keydown", e => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    document.getElementById("searchInput").focus();
  }
  if (e.key === "Escape") clearSearch();
});

// Initialization
document.addEventListener("DOMContentLoaded", () => {
  renderFilters();
  renderSections();
});
