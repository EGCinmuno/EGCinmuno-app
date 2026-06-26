/**
 * EGCinmuno-App — Lógica del Examen v2
 * Modo guiado + Modo libre (texto natural)
 */

let currentCase = null;
let session = null;
let queryHistory = [];
let pendingFreeQuery = null;  // Bug fix: almacenar el parsed result en lugar de pasar por inline-onclick


document.addEventListener("DOMContentLoaded", () => {
  initData();
  session = requireAuth();
  if (!session) return;
  session = syncSession();

  // Restaurar historial desde la sesión guardada
  queryHistory = session.log.map(entry => {
    const type = STUDY_TYPES.find(t => t.id === entry.typeId) || { id: "unknown", label: entry.studyType, color: "#666", icon: "📄" };
    const subtype = type.subtypes ? type.subtypes.find(s => s.id === entry.subtypeId) : null;
    return {
      type,
      subtype,
      target: entry.target,
      result: entry.resultText || "⚠️ Resultado de una sesión anterior (sin texto guardado).",
      found: entry.resultFound,
      tokensLeft: "—",
      time: new Date(entry.timestamp),
      caseId: entry.caseId
    };
  }).reverse();

  const data = getData();
  const queryMode = data.settings?.queryMode || "both";

  renderHeader();
  renderCaseSelector();
  
  // Renderizar el historial restaurado
  if (queryHistory.length > 0) renderHistory();

  // Mostrar/ocultar secciones según el modo configurado
  if (queryMode !== "guided") renderFreeQueryBar();
  if (queryMode !== "free") renderStudyPanel();

  // Ocultar separador si solo hay un modo
  if (queryMode !== "both") {
    const sep = document.querySelector(".guided-separator");
    if (sep) sep.style.display = "none";
  }
});

// ──────────────────────────────────────────────
// HEADER
// ──────────────────────────────────────────────

function renderHeader() {
  document.getElementById("student-name").textContent = session.name;
  updateTokenBadge();
}

function updateTokenBadge() {
  const badge = document.getElementById("token-badge");
  const count = document.getElementById("token-count");
  session = syncSession();
  count.textContent = session.tokensLeft;
  badge.className = "token-badge";
  if (session.tokensLeft <= 1) badge.classList.add("critical");
  else if (session.tokensLeft <= 2) badge.classList.add("warning");
}

// ──────────────────────────────────────────────
// SELECTOR DE CASO (solo publicados)
// ──────────────────────────────────────────────

function renderCaseSelector() {
  const data = getData();
  const container = document.getElementById("case-list");
  container.innerHTML = "";

  // Solo mostrar casos publicados
  const published = data.cases.filter(c => c.status === "published");

  if (published.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;padding:0.5rem 0;">
      No hay casos disponibles aún. El docente los habilitará durante el examen.
    </p>`;
    return;
  }

  published.forEach(c => {
    const card = document.createElement("div");
    card.className = "case-card" + (currentCase?.id === c.id ? " active" : "");
    card.innerHTML = `
      <div class="case-card-header">
        <span class="case-icon">📋</span>
        <span class="case-name">${c.name}</span>
      </div>
      <p class="case-desc">${c.description}</p>
    `;
    card.addEventListener("click", () => selectCase(c, card));
    container.appendChild(card);
  });
}

function selectCase(c, cardEl) {
  currentCase = c;
  document.querySelectorAll(".case-card").forEach(el => el.classList.remove("active"));
  cardEl.classList.add("active");

  document.getElementById("no-case-msg").style.display = "none";
  document.getElementById("study-panel").style.display = "flex";
  document.getElementById("current-case-name").textContent = c.name;

  // Mostrar info del paciente en el banner del caso
  renderCaseInfoBanner(c);

  // Habilitar barra libre
  const freeInput = document.getElementById("free-query-input");
  if (freeInput) {
    freeInput.disabled = false;
    freeInput.placeholder = "Escribí aquí tu consulta... ej: 'Motivo de la consulta'";
  }
  
  // Renderizar el historial cada vez que se cambia de caso (opcional, para mantener el contexto)
  renderHistory();
}

function renderCaseInfoBanner(c) {
  const banner = document.getElementById("case-info-banner");
  if (!banner) return;
  const p = c.patient;
  if (!p) { banner.style.display = "none"; return; }
  banner.style.display = "flex";
  // Buscar descubrimientos para este caso
  const discoveries = session.log
    .filter(entry => entry.caseId === c.id && entry.resultFound)
    .map(entry => `<strong>${entry.studyType}${entry.target ? ` (${entry.target})` : ''}:</strong> ${entry.resultText || '<em>(Información obtenida previamente)</em>'}`)
    .join("<br><br>");

  const descriptionHTML = c.description + 
    (discoveries ? `<br><br><div class="discoveries-section" style="margin-top:1rem; padding-top:1rem; border-top:1px dashed rgba(255,255,255,0.2);"><strong>🔍 Información obtenida:</strong><br><br>${discoveries}</div>` : "");

  banner.innerHTML = `
    <div class="case-info-pill">
      <span class="cip-label">🧑‍⚕️ Edad</span>
      <span class="cip-value">${p.age || "—"}</span>
    </div>
    <div class="case-info-pill">
      <span class="cip-label">⚧ Género</span>
      <span class="cip-value">${p.gender || "—"}</span>
    </div>
    <div class="case-info-pill" style="flex:4">
      <span class="cip-label">📝 Descripción clínica</span>
      <span class="cip-value">${descriptionHTML}</span>
    </div>
  `;
}

// ──────────────────────────────────────────────
// BARRA DE CONSULTA LIBRE
// ──────────────────────────────────────────────

function renderFreeQueryBar() {
  const container = document.getElementById("free-query-section");
  if (!container) return;

  container.innerHTML = `
    <div class="free-query-bar">
      <div class="free-query-header">
        <span class="free-query-badge">🔍 Modo libre</span>
        <span class="free-query-hint">Describí qué estudio querés solicitar con tus propias palabras</span>
      </div>
      <form id="free-query-form" class="free-query-form">
        <input
          type="text"
          id="free-query-input"
          class="free-query-input"
          placeholder="Primero seleccioná un caso clínico..."
          autocomplete="off"
          spellcheck="false"
          disabled
        >
        <button type="submit" class="btn-free-query" id="free-query-btn">Interpretar →</button>
      </form>
      <div id="free-query-result"></div>
    </div>
  `;

  document.getElementById("free-query-form").addEventListener("submit", e => {
    e.preventDefault();
    handleFreeQuery();
  });
}

function handleFreeQuery() {
  if (!currentCase) {
    showToast("⚠️ Primero seleccioná un caso clínico", "warning");
    return;
  }

  session = syncSession();
  if (session.tokensLeft <= 0) {
    showToast("❌ Sin tokens disponibles", "error");
    return;
  }

  const text = document.getElementById("free-query-input").value.trim();
  if (!text) return;

  const parsed = parseNaturalQuery(text);
  const resultDiv = document.getElementById("free-query-result");

  if (parsed.confidence === "none" || !parsed.type) {
    resultDiv.innerHTML = `
      <div class="free-parse-card error">
        <div class="parse-card-title">⚠️ No pude interpretar tu consulta</div>
        <div class="parse-card-body">
          <p>Intentá mencionar el tipo de estudio que querés:</p>
          <div class="parse-hints">
            ${STUDY_TYPES.map(t => `<span class="parse-hint-tag">${t.icon} ${t.label}</span>`).join("")}
          </div>
          <p style="margin-top:0.75rem;font-size:0.8rem;">Ejemplo: <em>"Quiero pedir un Western Blot de BTK"</em> o <em>"Necesito un hemograma"</em></p>
        </div>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;">⚡ No se consumió ningún token.</p>
      </div>`;
    pendingFreeQuery = null;
    return;
  }

  // Bug fix: almacenar la consulta en variable global en lugar de pasar por onclick
  const targetDisplay = parsed.type.fixed
    ? parsed.type.fixedTarget
    : (parsed.target || "");
  pendingFreeQuery = { type: parsed.type, subtype: parsed.subtype, target: targetDisplay };

  const subtypeDisplay = parsed.subtype ? ` › ${parsed.subtype.label}` : "";
  const hasTarget = !parsed.type.fixed && targetDisplay;

  resultDiv.innerHTML = `
    <div class="free-parse-card confirm">
      <div class="parse-card-title">🎯 Interpretación de tu consulta</div>
      <div class="parse-card-body">
        <div class="parse-row">
          <span class="parse-label">Tipo de estudio:</span>
          <span class="parse-value">${parsed.type.icon} ${parsed.type.label}${subtypeDisplay}</span>
        </div>
        ${hasTarget ? `<div class="parse-row">
          <span class="parse-label">Consulta específica:</span>
          <span class="parse-value parse-target">${targetDisplay}</span>
        </div>` : ""}
        ${parsed.confidence === "low" ? `<p class="parse-warning">⚠️ Interpretación incierta. Si no es lo que querés, cancelá y reescribí.</p>` : ""}
      </div>
      <div class="parse-actions">
        <button class="btn-parse-confirm" id="btn-confirm-query">✓ Confirmar y solicitar <span style="font-size:0.75rem;opacity:0.7">−1 token</span></button>
        <button class="btn-parse-cancel" id="btn-cancel-query">✗ Cancelar</button>
      </div>
    </div>`;

  // Bug fix: usar addEventListener en lugar de onclick inline
  document.getElementById("btn-confirm-query").addEventListener("click", () => confirmFreeQuery());
  document.getElementById("btn-cancel-query").addEventListener("click", () => cancelFreeQuery());
}

// Bug fix: no parámetros, usa pendingFreeQuery
function confirmFreeQuery() {
  if (!pendingFreeQuery) return;
  const { type, subtype, target } = pendingFreeQuery;
  pendingFreeQuery = null;

  document.getElementById("free-query-result").innerHTML = "";
  document.getElementById("free-query-input").value = "";

  submitStudyDirect(type, subtype, target);
}

function cancelFreeQuery() {
  pendingFreeQuery = null;
  document.getElementById("free-query-result").innerHTML = "";
  document.getElementById("free-query-input").focus();
}

// ──────────────────────────────────────────────
// PANEL DE ESTUDIOS (modo guiado)
// ──────────────────────────────────────────────

function renderStudyPanel() {
  const tabsContainer = document.getElementById("study-tabs");
  const panelsContainer = document.getElementById("study-panels");
  tabsContainer.innerHTML = "";
  panelsContainer.innerHTML = "";

  STUDY_TYPES.forEach((type, i) => {
    const tab = document.createElement("button");
    tab.className = "study-tab" + (i === 0 ? " active" : "");
    tab.dataset.tab = type.id;
    tab.innerHTML = `<span>${type.icon}</span><span>${type.label}</span>`;
    tab.style.setProperty("--tab-color", type.color);
    tab.addEventListener("click", () => switchTab(type.id));
    tabsContainer.appendChild(tab);

    const panel = document.createElement("div");
    panel.className = "study-panel-content" + (i === 0 ? " active" : "");
    panel.id = `panel-${type.id}`;
    panel.innerHTML = buildStudyForm(type);
    panelsContainer.appendChild(panel);
  });

  // Bind form submissions
  STUDY_TYPES.forEach(type => {
    const form = document.getElementById(`form-${type.id}`);
    if (form) form.addEventListener("submit", e => {
      e.preventDefault();
      submitStudyGuided(type);
    });
  });
}

function buildStudyForm(type) {
  let inputField = "";

  if (type.fixed) {
    inputField = `<input type="hidden" id="target-${type.id}" value="${type.fixedTarget}">`;
  } else if (type.hasSub) {
    const subOptions = type.subtypes.map(s => `<option value="${s.id}" data-placeholder="${s.placeholder}">${s.label}</option>`).join("");
    inputField = `
      <div class="input-group">
        <label for="subtype-${type.id}">Tipo de ensayo</label>
        <select id="subtype-${type.id}" class="study-select" onchange="updateSubPlaceholder('${type.id}')">
          ${subOptions}
        </select>
      </div>
      <div class="input-group">
        <label for="target-${type.id}">Estímulo / Target</label>
        <input type="text" id="target-${type.id}" placeholder="${type.subtypes[0].placeholder}" autocomplete="off" spellcheck="false">
      </div>`;
  } else {
    inputField = `
      <div class="input-group">
        <label for="target-${type.id}">Target / Analito</label>
        <input type="text" id="target-${type.id}" placeholder="${type.placeholder}" autocomplete="off" spellcheck="false">
      </div>`;
  }

  return `
    <div class="study-form-header">
      <span class="study-icon" style="color:${type.color}">${type.icon}</span>
      <div>
        <h3>${type.label}</h3>
        <p>${type.description}</p>
      </div>
    </div>
    <form id="form-${type.id}" class="study-form">
      ${inputField}
      <button type="submit" class="btn-request" style="--btn-color:${type.color}">
        <span class="btn-icon">🔍</span> Solicitar ${type.label}
        <span class="token-cost">−1 token</span>
      </button>
    </form>`;
}

function updateSubPlaceholder(typeId) {
  const select = document.getElementById(`subtype-${typeId}`);
  const input = document.getElementById(`target-${typeId}`);
  if (!select || !input) return;
  const selected = select.options[select.selectedIndex];
  input.placeholder = selected.dataset.placeholder || "";
}

function switchTab(id) {
  document.querySelectorAll(".study-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".study-panel-content").forEach(p => p.classList.remove("active"));
  document.querySelector(`[data-tab="${id}"]`).classList.add("active");
  document.getElementById(`panel-${id}`).classList.add("active");
}

// ──────────────────────────────────────────────
// SOLICITUD DESDE MODO GUIADO
// ──────────────────────────────────────────────

function submitStudyGuided(type) {
  if (!currentCase) { showToast("⚠️ Seleccioná un caso primero", "warning"); return; }
  session = syncSession();
  if (session.tokensLeft <= 0) { showToast("❌ Sin tokens disponibles", "error"); return; }

  let target, subtype = null;

  if (type.fixed) {
    target = type.fixedTarget;
  } else if (type.hasSub) {
    const subtypeId = document.getElementById(`subtype-${type.id}`)?.value;
    subtype = type.subtypes?.find(s => s.id === subtypeId) || null;
    target = document.getElementById(`target-${type.id}`)?.value.trim() || "";
    if (!target) { showToast("⚠️ Ingresá el target del ensayo", "warning"); return; }
  } else {
    target = document.getElementById(`target-${type.id}`)?.value.trim() || "";
    if (!target) { showToast("⚠️ Ingresá el target del estudio", "warning"); return; }
  }

  submitStudyDirect(type, subtype, target);

  if (!type.fixed) {
    const inp = document.getElementById(`target-${type.id}`);
    if (inp) inp.value = "";
  }
}

// ──────────────────────────────────────────────
// LÓGICA CENTRAL DE SOLICITUD
// ──────────────────────────────────────────────

function submitStudyDirect(type, subtype, target) {
  const result = findResult(currentCase, type.id, subtype?.id, target);
  const resultFound = result !== null;

  showProcessing(type, subtype, target, () => {
    const resultText = result || buildNotFoundText(type, subtype, target);
    
    const { tokensLeft } = consumeToken(
      session.name, currentCase.id,
      type.label + (subtype ? ` › ${subtype.label}` : ""),
      target, resultFound, resultText, type.id, subtype?.id
    );

    addToHistory(type, subtype, target, resultText, resultFound, tokensLeft);
    updateTokenBadge();
    
    // Actualizar la descripción del caso con la nueva info obtenida
    if (resultFound) {
      renderCaseInfoBanner(currentCase);
    }

    if (tokensLeft === 0) showToast("⚠️ Usaste tu último token", "warning");
  });
}

/**
 * Búsqueda flexible de resultado.
 * Claves: "tipo::target" o "tipo::subtipo::target"
 */
function findResult(c, typeId, subtypeId, target) {
  const nTarget = normalize(target);

  // Claves candidatas en orden de preferencia
  const keyCandidates = subtypeId
    ? [`${typeId}::${subtypeId}::${target}`, `${typeId}::${target}`]
    : [`${typeId}::${target}`];

  for (const key of keyCandidates) {
    if (c.results[key]) return c.results[key];
  }

  // Búsqueda normalizada sobre todas las claves del caso
  for (const [key, value] of Object.entries(c.results)) {
    const parts = key.split("::");
    const kt = parts[0];
    if (kt !== typeId) continue;

    const kvTarget = normalize(parts[parts.length - 1]);
    const kvSub = parts.length === 3 ? parts[1] : null;

    // Filtrar por subtipo si aplica
    if (subtypeId && kvSub && kvSub !== subtypeId) continue;

    if (kvTarget === nTarget) return value;
    if (kvTarget.includes(nTarget) || nTarget.includes(kvTarget)) return value;
  }

  return null;
}

function buildNotFoundText(type, subtype, target) {
  const subtypeStr = subtype ? ` (${subtype.label})` : "";
  return `Resultado no disponible.\n\nEl estudio de ${type.label}${subtypeStr} para "${target}" no se encuentra registrado en los datos de este caso.\n\nVerificá el nombre del target o consultá si el estudio fue solicitado correctamente.`;
}

// ──────────────────────────────────────────────
// HISTORIAL
// ──────────────────────────────────────────────

function addToHistory(type, subtype, target, result, found, tokensLeft) {
  queryHistory.unshift({ type, subtype, target, result, found, tokensLeft, time: new Date(), caseId: currentCase.id });
  renderHistory();

  // Scroll al resultado
  setTimeout(() => {
    const firstCard = document.querySelector(".result-card");
    if (firstCard) firstCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

function renderHistory() {
  const container = document.getElementById("history-list");
  const emptyMsg = document.getElementById("history-empty");
  if (queryHistory.length === 0) { emptyMsg.style.display = "block"; return; }
  emptyMsg.style.display = "none";
  container.innerHTML = "";

  queryHistory.forEach((item, i) => {
    const subtypeStr = item.subtype ? ` › ${item.subtype.label}` : "";
    const card = document.createElement("div");
    card.className = `result-card ${item.found ? "found" : "not-found"} ${i === 0 ? "new" : ""}`;
    card.innerHTML = `
      <div class="result-card-header">
        <div class="result-meta">
          <span class="result-study-icon" style="color:${item.type.color}">${item.type.icon}</span>
          <span class="result-study-name">${item.type.label}${subtypeStr}</span>
          <span class="result-target">${item.target}</span>
        </div>
        <div class="result-status ${item.found ? "status-found" : "status-missing"}">
          ${item.found ? "✓ Disponible" : "✗ No disponible"}
        </div>
      </div>
      <div class="result-body">
        <pre class="result-text">${item.result}</pre>
      </div>
      <div class="result-footer">
        <span class="result-case">${getData().cases.find(c => c.id === item.caseId)?.name || currentCase?.name || ""}</span>
        <span class="result-time">${formatTime(item.time)} · Tokens restantes: ${item.tokensLeft}</span>
      </div>`;
    container.appendChild(card);
  });
}

function formatTime(d) {
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

// ──────────────────────────────────────────────
// ANIMACIÓN DE PROCESAMIENTO
// ──────────────────────────────────────────────

function showProcessing(type, subtype, target, callback) {
  const overlay = document.getElementById("processing-overlay");
  const label = document.getElementById("processing-label");
  const subtypeStr = subtype ? ` › ${subtype.label}` : "";
  const targetStr = (type.fixed || !target) ? "" : ` — ${target}`;
  label.textContent = `Procesando ${type.label}${subtypeStr}${targetStr}...`;
  overlay.classList.add("visible");
  setTimeout(() => { overlay.classList.remove("visible"); callback(); }, 1200);
}

// ──────────────────────────────────────────────
// TOAST
// ──────────────────────────────────────────────

function showToast(msg, type = "info") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  container.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 3000);
}

// ──────────────────────────────────────────────
// LOGOUT
// ──────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("logout-btn");
  if (btn) btn.addEventListener("click", () => { clearSession(); window.location.href = "index.html"; });
});
