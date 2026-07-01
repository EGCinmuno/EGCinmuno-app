/**
 * EGCinmuno-App — Panel de Administración v2.1
 */

let adminCurrentTab = "students";

document.addEventListener("DOMContentLoaded", () => {
  initData();
  checkAdminSession();

  const loginForm = document.getElementById("admin-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      const pw = document.getElementById("admin-password").value;
      if (loginAdmin(pw)) {
        showAdminApp();
      } else {
        showLoginError("Contraseña incorrecta");
      }
    });
  }
});

function checkAdminSession() {
  if (sessionStorage.getItem("egc_admin") === "true") showAdminApp();
}

function showAdminApp() {
  document.getElementById("admin-login").style.display = "none";
  document.getElementById("admin-app").style.display = "flex";
  renderAdminNav();
  switchAdminTab("students");
}

function showLoginError(msg) {
  const err = document.getElementById("login-error");
  err.textContent = msg;
  err.style.display = "block";
  setTimeout(() => err.style.display = "none", 3000);
}

// ──────────────────────────────────────────────
// NAVEGACIÓN ADMIN
// ──────────────────────────────────────────────

function renderAdminNav() {
  const tabs = ["students", "cases", "settings", "log"];
  const labels = { students: "👥 Estudiantes", cases: "📋 Casos", settings: "⚙️ Configuración", log: "📊 Registro" };
  const nav = document.getElementById("admin-nav");
  nav.innerHTML = "";
  tabs.forEach(t => {
    const btn = document.createElement("button");
    btn.className = "admin-nav-btn" + (t === adminCurrentTab ? " active" : "");
    btn.textContent = labels[t];
    btn.dataset.tab = t;
    btn.addEventListener("click", () => switchAdminTab(t));
    nav.appendChild(btn);
  });
}

function switchAdminTab(tab) {
  adminCurrentTab = tab;
  document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  const content = document.getElementById("admin-content");
  content.innerHTML = "";
  if (tab === "students") renderStudentsTab(content);
  else if (tab === "cases") renderCasesTab(content);
  else if (tab === "settings") renderSettingsTab(content);
  else if (tab === "log") renderLogTab(content);
}

// ──────────────────────────────────────────────
// TAB: ESTUDIANTES
// ──────────────────────────────────────────────

function renderStudentsTab(container) {
  const data = getData();
  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header">
        <h2>Gestión de Estudiantes</h2>
        <button class="btn-admin-primary" onclick="openAddStudentModal()">+ Agregar</button>
      </div>
      <div class="admin-stats">
        <div class="stat-card">
          <span class="stat-num">${data.students.length}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">${data.students.filter(s => s.tokensLeft > 0).length}</span>
          <span class="stat-label">Con tokens</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">${data.students.filter(s => s.log.length > 0).length}</span>
          <span class="stat-label">Han consultado</span>
        </div>
      </div>
      <div class="admin-toolbar">
        <input type="text" id="student-search" placeholder="Buscar estudiante..." oninput="filterStudents(this.value)">
        <div class="btn-group">
          <button class="btn-admin-secondary" onclick="resetAllTokens()">🔄 Resetear tokens</button>
          <button class="btn-admin-secondary" onclick="openBulkImportModal()">📋 Importar lista</button>
        </div>
      </div>
      <table class="admin-table" id="students-table">
        <thead><tr><th>Nombre</th><th>Email</th><th>Tokens</th><th>Consultas</th><th>Acciones</th></tr></thead>
        <tbody id="students-tbody"></tbody>
      </table>
    </div>
    ${buildAddStudentModal()}
    ${buildBulkImportModal()}
  `;
  renderStudentsTable(data.students);
  bindModalCloses();
}

function renderStudentsTable(students, filter = "") {
  const tbody = document.getElementById("students-tbody");
  if (!tbody) return;
  const filtered = filter
    ? students.filter(s => normalize(s.name).includes(normalize(filter)) || normalize(s.email).includes(normalize(filter)))
    : students;

  const data = getData();
  const cases = data.cases || [];

  tbody.innerHTML = filtered.map(s => {
    let tokensPillsHTML = "";
    cases.forEach(c => {
      const caseTokens = s.tokensPerCase && s.tokensPerCase[c.id] !== undefined ? s.tokensPerCase[c.id] : TOKENS_PER_STUDENT;
      const statusClass = caseTokens === 0 ? 'empty' : caseTokens <= 2 ? 'low' : 'ok';
      const label = c.name.split("—")[0].trim().split(" ")[0] + " " + (c.name.split("—")[0].trim().split(" ")[1] || "");
      tokensPillsHTML += `
        <div style="font-size:0.65rem; margin-bottom:2px; display:inline-block; margin-right:4px;">
          <span class="token-pill ${statusClass}" style="padding: 2px 4px; font-size: 0.65rem;" title="${c.name}">
            ${label}: ${caseTokens}/${TOKENS_PER_STUDENT}
          </span>
        </div>
      `;
    });
    
    if (cases.length === 0) {
      tokensPillsHTML = `<span class="token-pill ok">${s.tokensLeft}/${TOKENS_PER_STUDENT}</span>`;
    }

    return `
      <tr>
        <td><strong>${s.name}</strong></td>
        <td class="text-muted">${s.email}</td>
        <td><div style="max-width:300px; display:flex; flex-wrap:wrap; gap:2px;">${tokensPillsHTML}</div></td>
        <td>${s.log.length}</td>
        <td class="actions-cell">
          <button class="btn-icon-sm" title="Editar tokens (por caso)" onclick="editStudentTokens('${s.name}', ${s.tokensLeft})">✏️</button>
          <button class="btn-icon-sm" title="Resetear tokens" onclick="resetStudentTokens('${s.name}')">🔄</button>
          <button class="btn-icon-sm danger" title="Eliminar" onclick="deleteStudent('${s.name}')">🗑</button>
        </td>
      </tr>
    `;
  }).join("") || `<tr><td colspan="5" class="empty-row">Sin estudiantes</td></tr>`;
}

function filterStudents(val) { renderStudentsTable(getData().students, val); }

function editStudentTokens(name, currentTokens) {
  const newVal = prompt(`Ingrese la nueva cantidad de tokens POR CASO para ${name}:`, currentTokens);
  if (newVal === null || newVal.trim() === "") return;
  const tokens = parseInt(newVal, 10);
  if (isNaN(tokens) || tokens < 0) {
    showAdminToast("Cantidad inválida", "error");
    return;
  }
  const data = getData();
  const idx = data.students.findIndex(s => normalize(s.name) === normalize(name));
  if (idx === -1) return;
  
  data.students[idx].tokensLeft = tokens;
  if (!data.students[idx].tokensPerCase) data.students[idx].tokensPerCase = {};
  data.cases.forEach(c => {
    data.students[idx].tokensPerCase[c.id] = tokens;
  });
  
  saveData(data);
  renderStudentsTable(data.students);
  showAdminToast(`Tokens de ${name} actualizados a ${tokens} por caso`);
}

function resetStudentTokens(name) {
  const data = getData();
  const idx = data.students.findIndex(s => normalize(s.name) === normalize(name));
  if (idx === -1) return;
  
  data.students[idx].tokensLeft = TOKENS_PER_STUDENT;
  data.students[idx].tokensPerCase = {};
  
  saveData(data);
  renderStudentsTable(data.students);
  showAdminToast(`Tokens reseteados por caso para ${name}`);
}

function resetAllTokens() {
  if (!confirm("¿Resetear tokens de TODOS los estudiantes?")) return;
  const data = getData();
  data.students.forEach(s => {
    s.tokensLeft = TOKENS_PER_STUDENT;
    s.tokensPerCase = {};
  });
  saveData(data);
  renderStudentsTable(data.students);
  showAdminToast("Tokens reseteados por caso para todos");
}

function deleteStudent(name) {
  if (!confirm(`¿Eliminar a ${name}?`)) return;
  const data = getData();
  data.students = data.students.filter(s => normalize(s.name) !== normalize(name));
  saveData(data);
  renderStudentsTable(data.students);
  showAdminToast(`${name} eliminado`);
}

function buildAddStudentModal() {
  return `
    <div class="modal-overlay" id="add-student-modal">
      <div class="modal">
        <div class="modal-header"><h3>Agregar Estudiante</h3><button class="modal-close" data-modal="add-student-modal">✕</button></div>
        <form id="add-student-form" onsubmit="addStudent(event)">
          <div class="form-group"><label>Nombre completo</label><input type="text" id="new-student-name" required></div>
          <div class="form-group"><label>Email</label><input type="email" id="new-student-email" required></div>
          <div class="form-group"><label>Tokens iniciales</label><input type="number" id="new-student-tokens" value="${TOKENS_PER_STUDENT}" min="1" max="20"></div>
          <button type="submit" class="btn-admin-primary full-width">Agregar</button>
        </form>
      </div>
    </div>`;
}

function buildBulkImportModal() {
  return `
    <div class="modal-overlay" id="bulk-import-modal">
      <div class="modal">
        <div class="modal-header"><h3>Importar Lista</h3><button class="modal-close" data-modal="bulk-import-modal">✕</button></div>
        <div class="form-group">
          <label>Una entrada por línea</label>
          <p class="form-hint">Formato: <code>Nombre Apellido, email@ejemplo.com</code></p>
          <textarea id="bulk-input" rows="10" placeholder="Ana García, ana@uni.edu&#10;Carlos López, carlos@uni.edu&#10;María Fernández"></textarea>
        </div>
        <button class="btn-admin-primary full-width" onclick="processBulkImport()">Importar</button>
        <div id="bulk-result" class="bulk-result"></div>
      </div>
    </div>`;
}

function openAddStudentModal() { document.getElementById("add-student-modal").classList.add("open"); }
function openBulkImportModal() { document.getElementById("bulk-import-modal").classList.add("open"); }

function addStudent(e) {
  e.preventDefault();
  const name = document.getElementById("new-student-name").value.trim();
  const email = document.getElementById("new-student-email").value.trim();
  const tokens = parseInt(document.getElementById("new-student-tokens").value);
  const data = getData();
  if (data.students.some(s => normalize(s.name) === normalize(name))) {
    showAdminToast("Ya existe un estudiante con ese nombre", "error"); return;
  }
  data.students.push({ name, email, tokensLeft: tokens, log: [] });
  saveData(data);
  document.getElementById("add-student-modal").classList.remove("open");
  document.getElementById("add-student-form").reset();
  renderStudentsTable(data.students);
  showAdminToast(`${name} agregado`);
}

function processBulkImport() {
  const raw = document.getElementById("bulk-input").value.trim();
  const lines = raw.split("\n").filter(l => l.trim());
  const data = getData();
  let added = 0, skipped = 0;
  lines.forEach(line => {
    const parts = line.split(",").map(p => p.trim());
    const name = parts[0];
    const email = parts[1] || `${normalize(name).replace(/\s+/g, ".")}@egcinmuno.edu`;
    if (!name) return;
    if (data.students.some(s => normalize(s.name) === normalize(name))) { skipped++; return; }
    data.students.push({ name, email, tokensLeft: TOKENS_PER_STUDENT, log: [] });
    added++;
  });
  saveData(data);
  document.getElementById("bulk-result").innerHTML =
    `<p class="success-msg">✅ ${added} agregado(s).${skipped > 0 ? ` ${skipped} duplicado(s) omitido(s).` : ""}</p>`;
  renderStudentsTable(data.students);
}

// ──────────────────────────────────────────────
// TAB: CASOS
// ──────────────────────────────────────────────

function renderCasesTab(container) {
  const data = getData();
  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header">
        <h2>Gestión de Casos Clínicos</h2>
        <button class="btn-admin-primary" onclick="openCaseModal()">+ Nuevo Caso</button>
      </div>
      <div id="cases-list"></div>
    </div>
    ${buildCaseModal()}
    ${buildResultModal()}
    ${buildPatientModal()}
  `;
  renderCasesList(data.cases);
  bindModalCloses();
}

function renderCasesList(cases) {
  const container = document.getElementById("cases-list");
  container.innerHTML = cases.map(c => {
    const isPublished = c.status === "published";
    const patientInfo = c.patient
      ? `${c.patient.age} · ${c.patient.gender} · Inicio: ${c.patient.symptomOnset}`
      : "Sin datos demográficos";
    return `
    <div class="case-admin-card ${isPublished ? '' : 'case-draft'}">
      <div class="case-admin-header">
        <div>
          <div class="case-title-row">
            <h3>${c.name}</h3>
            <span class="status-badge ${isPublished ? 'status-published' : 'status-draft'}">
              ${isPublished ? '🟢 Publicado' : '⚪ Borrador'}
            </span>
          </div>
          <p class="text-muted">${c.description}</p>
          <p class="patient-summary">🧑‍⚕️ ${patientInfo}</p>
        </div>
        <div class="btn-group case-actions-group">
          <button class="btn-status-toggle ${isPublished ? 'toggle-unpublish' : 'toggle-publish'}"
            onclick="toggleCaseStatus('${c.id}')">
            ${isPublished ? '⏸ Borrador' : '▶ Publicar'}
          </button>
          <button class="btn-admin-secondary" onclick="openPatientModal('${c.id}')">🧑‍⚕️ Paciente</button>
          <button class="btn-admin-secondary" onclick="openAddResultModal('${c.id}')">+ Resultado</button>
          <button class="btn-admin-secondary danger" onclick="deleteCase('${c.id}')">🗑</button>
        </div>
      </div>
      <div class="results-grid">
        ${Object.entries(c.results).length === 0
        ? `<p class="empty-msg">Sin resultados. Agregá el primero.</p>`
        : Object.entries(c.results).map(([key, val]) => {
          const parts = key.split("::");
          const typeId = parts[0];
          const typeObj = STUDY_TYPES.find(t => t.id === typeId);
          const displayKey = parts.length === 3
            ? `${parts[1]} › ${parts[2]}`
            : parts.slice(1).join(" › ");
          return `
              <div class="result-admin-item">
                <div class="result-admin-key">
                  <span class="result-type-badge">${typeObj ? typeObj.icon + " " + typeObj.label : typeId}</span>
                  <span>${displayKey}</span>
                </div>
                <p class="result-preview">${val.substring(0, 90)}${val.length > 90 ? "..." : ""}</p>
                <div class="result-admin-actions">
                  <button class="btn-icon-sm" onclick="editResult('${c.id}', '${key}')">✏️</button>
                  <button class="btn-icon-sm danger" onclick="deleteResult('${c.id}', '${key}')">🗑</button>
                </div>
              </div>`;
        }).join("")}
      </div>
    </div>`;
  }).join("") || `<p class="empty-msg">No hay casos. Creá el primero.</p>`;
}

function toggleCaseStatus(caseId) {
  const data = getData();
  const c = data.cases.find(x => x.id === caseId);
  if (!c) return;
  c.status = c.status === "published" ? "draft" : "published";
  saveData(data);
  renderCasesList(data.cases);
  showAdminToast(c.status === "published" ? "🟢 Caso publicado — visible para estudiantes" : "⚪ Caso pasado a borrador");
}

function buildCaseModal() {
  return `
    <div class="modal-overlay" id="case-modal">
      <div class="modal">
        <div class="modal-header"><h3>Nuevo Caso Clínico</h3><button class="modal-close" data-modal="case-modal">✕</button></div>
        <form id="case-form" onsubmit="addCase(event)">
          <div class="form-group"><label>Nombre del caso</label><input type="text" id="case-name" required placeholder="Caso 4 — Paciente con..."></div>
          <div class="form-group"><label>Descripción clínica breve</label><textarea id="case-desc" rows="3" required></textarea></div>
          <div class="form-group"><label>Edad del paciente</label><input type="text" id="case-age" placeholder="Ej: 8 años, 24 años..."></div>
          <div class="form-group"><label>Género</label>
            <select id="case-gender">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
          <div class="form-group"><label>Inicio de síntomas</label><input type="text" id="case-onset" placeholder="Ej: Desde los 6 meses de vida, 4 meses de evolución..."></div>
          <button type="submit" class="btn-admin-primary full-width">Crear Caso</button>
        </form>
      </div>
    </div>`;
}

function buildPatientModal() {
  return `
    <div class="modal-overlay" id="patient-modal">
      <div class="modal">
        <div class="modal-header"><h3>Datos Demográficos del Paciente</h3><button class="modal-close" data-modal="patient-modal">✕</button></div>
        <form id="patient-form" onsubmit="savePatientData(event)">
          <input type="hidden" id="patient-case-id">
          <div class="form-group"><label>Edad</label><input type="text" id="patient-age" required></div>
          <div class="form-group"><label>Género</label>
            <select id="patient-gender">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
          <div class="form-group"><label>Inicio de síntomas</label><input type="text" id="patient-onset" placeholder="Ej: Desde los 6 meses de vida"></div>
          <button type="submit" class="btn-admin-primary full-width">Guardar</button>
        </form>
      </div>
    </div>`;
}

function buildResultModal() {
  const studyOptions = STUDY_TYPES.map(t =>
    `<option value="${t.id}" data-hassub="${t.hasSub || false}" data-fixed="${t.fixed || false}">${t.icon} ${t.label}</option>`
  ).join("");

  // Agrupar subtypes de todos los tipos
  const allSubtypes = STUDY_TYPES.flatMap(t =>
    (t.subtypes || []).map(s => `<option value="${t.id}::${s.id}">${t.label} › ${s.label}</option>`)
  ).join("");

  return `
    <div class="modal-overlay" id="result-modal">
      <div class="modal modal-lg">
        <div class="modal-header"><h3 id="result-modal-title">Agregar Resultado</h3><button class="modal-close" data-modal="result-modal">✕</button></div>
        <form id="result-form" onsubmit="saveResult(event)">
          <input type="hidden" id="result-case-id">
          <input type="hidden" id="result-original-key">
          <div class="form-group">
            <label>Tipo de Estudio</label>
            <select id="result-study-type" onchange="onResultTypeChange()">${studyOptions}</select>
          </div>
          <div class="form-group" id="result-subtype-group" style="display:none;">
            <label>Subtipo de Ensayo</label>
            <select id="result-subtype">${allSubtypes}</select>
          </div>
          <div class="form-group" id="result-target-group">
            <label>Target / Analito / Estímulo</label>
            <input type="text" id="result-target" placeholder="Ej: BTK, IgG, PHA, CD107a...">
          </div>
          <div class="form-group">
            <label>Resultado (texto completo)</label>
            <textarea id="result-text" rows="9" placeholder="Describí el resultado completo con todos los detalles..." required></textarea>
          </div>
          <button type="submit" class="btn-admin-primary full-width">Guardar Resultado</button>
        </form>
      </div>
    </div>`;
}

function onResultTypeChange() {
  const select = document.getElementById("result-study-type");
  const opt = select.options[select.selectedIndex];
  const hasSub = opt.dataset.hassub === "true";
  const isFixed = opt.dataset.fixed === "true";
  const subtypeGroup = document.getElementById("result-subtype-group");
  const targetGroup = document.getElementById("result-target-group");
  if (subtypeGroup) subtypeGroup.style.display = hasSub ? "block" : "none";
  if (targetGroup) targetGroup.style.display = isFixed ? "none" : "block";
}

function openCaseModal() { document.getElementById("case-modal").classList.add("open"); }

function openAddResultModal(caseId) {
  document.getElementById("result-modal-title").textContent = "Agregar Resultado";
  document.getElementById("result-case-id").value = caseId;
  document.getElementById("result-original-key").value = "";
  document.getElementById("result-form").reset();
  document.getElementById("result-case-id").value = caseId;
  onResultTypeChange();
  document.getElementById("result-modal").classList.add("open");
}

function openPatientModal(caseId) {
  const data = getData();
  const c = data.cases.find(x => x.id === caseId);
  if (!c) return;
  document.getElementById("patient-case-id").value = caseId;
  document.getElementById("patient-age").value = c.patient?.age || "";
  document.getElementById("patient-gender").value = c.patient?.gender || "Masculino";
  document.getElementById("patient-onset").value = c.patient?.symptomOnset || "";
  document.getElementById("patient-modal").classList.add("open");
}

function savePatientData(e) {
  e.preventDefault();
  const caseId = document.getElementById("patient-case-id").value;
  const data = getData();
  const c = data.cases.find(x => x.id === caseId);
  if (!c) return;
  c.patient = {
    age: document.getElementById("patient-age").value.trim(),
    gender: document.getElementById("patient-gender").value,
    symptomOnset: document.getElementById("patient-onset").value.trim()
  };
  // Actualizar también el resultado de info-paciente si existe
  const infoKey = "info-paciente::general";
  if (!c.results[infoKey]) {
    c.results[infoKey] = `INFORMACIÓN DEL PACIENTE:\n• Edad: ${c.patient.age}\n• Género: ${c.patient.gender}\n• Inicio de síntomas: ${c.patient.symptomOnset}`;
  }
  saveData(data);
  document.getElementById("patient-modal").classList.remove("open");
  renderCasesList(data.cases);
  showAdminToast("Datos del paciente actualizados");
}

function editResult(caseId, key) {
  const data = getData();
  const c = data.cases.find(x => x.id === caseId);
  if (!c) return;
  const parts = key.split("::");
  const typeId = parts[0];
  document.getElementById("result-modal-title").textContent = "Editar Resultado";
  document.getElementById("result-case-id").value = caseId;
  document.getElementById("result-original-key").value = key;
  document.getElementById("result-study-type").value = typeId;
  onResultTypeChange();

  if (parts.length === 3) {
    // funcional::subtipo::target
    const subtypeSelect = document.getElementById("result-subtype");
    if (subtypeSelect) subtypeSelect.value = `${parts[0]}::${parts[1]}`;
    document.getElementById("result-target").value = parts[2];
  } else {
    document.getElementById("result-target").value = parts[1] || "";
  }
  document.getElementById("result-text").value = c.results[key];
  document.getElementById("result-modal").classList.add("open");
}

function addCase(e) {
  e.preventDefault();
  const name = document.getElementById("case-name").value.trim();
  const desc = document.getElementById("case-desc").value.trim();
  const age = document.getElementById("case-age").value.trim() || "—";
  const gender = document.getElementById("case-gender").value;
  const onset = document.getElementById("case-onset").value.trim() || "—";
  const data = getData();
  const id = "caso-" + Date.now();
  const infoText = `INFORMACIÓN DEL PACIENTE:\n• Edad: ${age}\n• Género: ${gender}\n• Inicio de síntomas: ${onset}`;
  data.cases.push({
    id, name, description: desc, status: "draft",
    patient: { age, gender, symptomOnset: onset },
    results: { "info-paciente::general": infoText }
  });
  saveData(data);
  document.getElementById("case-modal").classList.remove("open");
  renderCasesList(data.cases);
  showAdminToast("Caso creado (en borrador)");
}

function saveResult(e) {
  e.preventDefault();
  const caseId = document.getElementById("result-case-id").value;
  const originalKey = document.getElementById("result-original-key").value;
  const typeId = document.getElementById("result-study-type").value;
  const type = STUDY_TYPES.find(t => t.id === typeId);
  const text = document.getElementById("result-text").value.trim();
  const data = getData();
  const c = data.cases.find(x => x.id === caseId);
  if (!c) return;

  let key;
  if (type?.hasSub) {
    const subtypeVal = document.getElementById("result-subtype")?.value || "";
    // subtypeVal is "typeId::subtypeId"
    const subtypeId = subtypeVal.split("::")[1] || "";
    const target = document.getElementById("result-target")?.value.trim() || "";
    key = `${typeId}::${subtypeId}::${target}`;
  } else if (type?.fixed) {
    key = `${typeId}::${type.fixedTarget}`;
  } else {
    const target = document.getElementById("result-target")?.value.trim() || "";
    key = `${typeId}::${target}`;
  }

  if (originalKey && originalKey !== key) delete c.results[originalKey];
  c.results[key] = text;
  saveData(data);
  document.getElementById("result-modal").classList.remove("open");
  renderCasesList(data.cases);
  showAdminToast("Resultado guardado");
}

function deleteResult(caseId, key) {
  if (!confirm("¿Eliminar este resultado?")) return;
  const data = getData();
  const c = data.cases.find(x => x.id === caseId);
  if (c) delete c.results[key];
  saveData(data);
  renderCasesList(data.cases);
  showAdminToast("Resultado eliminado");
}

function deleteCase(caseId) {
  if (!confirm("¿Eliminar este caso y todos sus resultados?")) return;
  const data = getData();
  data.cases = data.cases.filter(c => c.id !== caseId);
  saveData(data);
  renderCasesList(data.cases);
  showAdminToast("Caso eliminado");
}

// ──────────────────────────────────────────────
// TAB: CONFIGURACIÓN
// ──────────────────────────────────────────────

function renderSettingsTab(container) {
  const data = getData();
  const mode = data.settings?.queryMode || "both";

  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header"><h2>Configuración del Examen</h2></div>

      <div class="settings-card">
        <h3>🔍 Modo de Consulta para Estudiantes</h3>
        <p style="margin-bottom:1.25rem;">Controlá qué interfaz ven los estudiantes al solicitar estudios.</p>
        <div class="mode-options">
          <label class="mode-option ${mode === 'both' ? 'active' : ''}">
            <input type="radio" name="query-mode" value="both" ${mode === 'both' ? 'checked' : ''} onchange="saveQueryMode(this.value)">
            <div class="mode-option-content">
              <span class="mode-icon">🔀</span>
              <strong>Ambos modos</strong>
              <p>El estudiante puede usar el modo libre (texto) y el modo guiado (menús). Recomendado.</p>
            </div>
          </label>
          <label class="mode-option ${mode === 'free' ? 'active' : ''}">
            <input type="radio" name="query-mode" value="free" ${mode === 'free' ? 'checked' : ''} onchange="saveQueryMode(this.value)">
            <div class="mode-option-content">
              <span class="mode-icon">🗣️</span>
              <strong>Solo modo libre</strong>
              <p>El estudiante escribe su consulta en lenguaje natural. Más desafiante pedagógicamente.</p>
            </div>
          </label>
          <label class="mode-option ${mode === 'guided' ? 'active' : ''}">
            <input type="radio" name="query-mode" value="guided" ${mode === 'guided' ? 'checked' : ''} onchange="saveQueryMode(this.value)">
            <div class="mode-option-content">
              <span class="mode-icon">📋</span>
              <strong>Solo modo guiado</strong>
              <p>El estudiante usa menús y pestañas para seleccionar el estudio. Más estructurado.</p>
            </div>
          </label>
        </div>
      </div>

      <div class="settings-card" style="margin-top:1.5rem;">
        <h3>🪙 Tokens por Estudiante</h3>
        <p style="margin-bottom:1rem;">Valor actual: <strong>${TOKENS_PER_STUDENT} tokens</strong> por sesión.</p>
        <p class="form-hint">Para cambiar este valor, editá la constante <code>TOKENS_PER_STUDENT</code> en <code>js/data.js</code> y reseteá los tokens desde la pestaña Estudiantes.</p>
      </div>

      <div class="settings-card danger-card" style="margin-top:1.5rem;">
        <h3>⚠️ Reiniciar datos</h3>
        <p style="margin-bottom:1rem;">Borra todo y restaura los datos de ejemplo. <strong>Irreversible.</strong></p>
        <button class="btn-admin-secondary danger" onclick="confirmResetData()">🗑 Restaurar datos de ejemplo</button>
      </div>
    </div>`;
}

function saveQueryMode(value) {
  const data = getData();
  if (!data.settings) data.settings = {};
  data.settings.queryMode = value;
  saveData(data);
  // Actualizar clases visuales
  document.querySelectorAll(".mode-option").forEach(el => el.classList.remove("active"));
  document.querySelector(`input[value="${value}"]`)?.closest(".mode-option")?.classList.add("active");
  showAdminToast(`Modo actualizado: ${value}`);
}

function confirmResetData() {
  if (!confirm("¿Restaurar TODOS los datos de ejemplo? Se borrarán estudiantes, casos y configuración personalizados.")) return;
  resetData();
  showAdminToast("Datos restaurados");
  switchAdminTab("cases");
}

// ──────────────────────────────────────────────
// TAB: LOG
// ──────────────────────────────────────────────

function renderLogTab(container) {
  const data = getData();
  const allLogs = [];
  data.students.forEach(s => s.log.forEach(e => allLogs.push({ ...e, studentName: s.name })));
  allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header">
        <h2>Registro de Consultas</h2>
        <button class="btn-admin-secondary" onclick="exportLog()">📥 Exportar CSV</button>
      </div>
      ${allLogs.length === 0
      ? `<p class="empty-msg">No hay consultas registradas aún.</p>`
      : `<table class="admin-table">
            <thead><tr><th>Fecha/Hora</th><th>Estudiante</th><th>Caso</th><th>Tipo</th><th>Target</th><th>Resultado</th></tr></thead>
            <tbody>${allLogs.map(e => `
              <tr>
                <td class="text-muted">${new Date(e.timestamp).toLocaleString("es-AR")}</td>
                <td><strong>${e.studentName}</strong></td>
                <td>${e.caseId}</td>
                <td>${e.studyType}</td>
                <td>${e.target}</td>
                <td><span class="${e.resultFound ? 'badge-found' : 'badge-missing'}">${e.resultFound ? "✓" : "✗"}</span></td>
              </tr>`).join("")}
            </tbody>
          </table>`}
    </div>`;
}

function exportLog() {
  const data = getData();
  let csv = "Fecha,Estudiante,Caso,Tipo de estudio,Target,Resultado encontrado\n";
  data.students.forEach(s => s.log.forEach(e => {
    csv += `"${new Date(e.timestamp).toLocaleString("es-AR")}","${s.name}","${e.caseId}","${e.studyType}","${e.target}","${e.resultFound ? "Sí" : "No"}"\n`;
  }));
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `egcinmuno-log-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
}

// ──────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────

function bindModalCloses() {
  document.querySelectorAll(".modal-close").forEach(btn => {
    btn.addEventListener("click", () => {
      document.getElementById(btn.dataset.modal).classList.remove("open");
    });
  });
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
  });
}

function showAdminToast(msg, type = "success") {
  const toast = document.createElement("div");
  toast.className = `admin-toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 300); }, 2800);
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("admin-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", () => { logoutAdmin(); window.location.reload(); });
});
