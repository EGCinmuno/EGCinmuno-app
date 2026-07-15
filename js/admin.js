let dbStudents = [];
let dbCases = [];
let selectedCaseId = null;

async function refreshAdminData() {
  try {
    // Cargar configuraciones del sistema
    await fetchSystemSettings();

    const { data: csData, error: csErr } = await supabaseClient
      .from('cases')
      .select('*')
      .order('id', { ascending: true });

    if (csErr) {
      console.error("Error al obtener casos de Supabase:", csErr);
    } else if (csData) {
      dbCases = csData.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        status: c.status || "published",
        patient: c.patient || {},
        results: c.results || {},
        internal_notes: c.internal_notes || ""
      }));

      // Auto-seleccionar primer caso si es null
      if (!selectedCaseId && dbCases.length > 0) {
        selectedCaseId = dbCases[0].id;
      }
    }

    const { data: stData, error: stErr } = await supabaseClient
      .from('students')
      .select('*');

    if (stErr) {
      console.error("Error al obtener estudiantes de Supabase:", stErr);
      showAdminToast("Error de permisos RLS o conexión al leer estudiantes", "error");
      return;
    }

    let tokData = [];
    const { data: tData, error: tErr } = await supabaseClient
      .from('student_tokens')
      .select('*');
    if (tErr) {
      console.error("Error al obtener tokens de Supabase (posible RLS):", tErr);
    } else if (tData) {
      tokData = tData;
    }

    let lgData = [];
    const { data: lData, error: lErr } = await supabaseClient
      .from('logs')
      .select('*');
    if (lErr) {
      console.error("Error al obtener logs de Supabase (posible RLS):", lErr);
    } else if (lData) {
      lgData = lData;
    }

    dbStudents = stData.map(st => {
      const tokensPerCase = {};
      tokData.filter(t => t.student_mail === st.email).forEach(t => {
        tokensPerCase[t.case_id] = t.tokens_left;
      });

      const studentLogs = lgData.filter(l => l.student_mail === st.email);

      return {
        name: st.name,
        email: st.email || "",
        role: st.role || "estudiante",
        tokensPerCase: tokensPerCase,
        tokensLeft: 15,
        log: studentLogs.map(l => ({
          timestamp: l.timestamp,
          caseId: l.case_id,
          studyType: l.study_type,
          target: l.target,
          resultFound: l.result_found,
          resultText: l.result_text,
          typeId: l.type_id,
          subtypeId: l.subtype_id,
          rawQuery: l.raw_query
        }))
      };
    });
  } catch (err) {
    console.error("Error al refrescar datos desde Supabase:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  initData();
  checkAdminSession();

  if (sessionStorage.getItem("egc_admin") === "true") {
    await refreshAdminData();
  }

  const loginForm = document.getElementById("admin-login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", async e => {
      e.preventDefault();
      const pw = document.getElementById("admin-password").value;
      if (loginAdmin(pw)) {
        await refreshAdminData();
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

let adminCurrentTab = "students";

async function switchAdminTab(tab) {
  adminCurrentTab = tab;
  document.querySelectorAll(".admin-nav-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
  const content = document.getElementById("admin-content");
  content.innerHTML = "";

  if (tab === "students" || tab === "log") {
    await refreshAdminData();
  }

  if (tab === "students") renderStudentsTab(content);
  else if (tab === "cases") renderCasesTab(content);
  else if (tab === "settings") renderSettingsTab(content);
  else if (tab === "log") renderLogTab(content);
}

// ──────────────────────────────────────────────
// TAB: ESTUDIANTES
// ──────────────────────────────────────────────

function renderStudentsTab(container) {
  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header">
        <h2>Gestión de Estudiantes</h2>
        <button class="btn-admin-primary" onclick="openAddStudentModal()">+ Agregar</button>
      </div>
      <div class="admin-stats">
        <div class="stat-card">
          <span class="stat-num">${dbStudents.length}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">${dbStudents.filter(s => s.role !== 'docente').length}</span>
          <span class="stat-label">Estudiantes</span>
        </div>
        <div class="stat-card">
          <span class="stat-num">${dbStudents.filter(s => s.log.length > 0).length}</span>
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
  renderStudentsTable(dbStudents);
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
      const caseTokens = s.tokensPerCase && s.tokensPerCase[c.id] !== undefined ? s.tokensPerCase[c.id] : (s.role === 'docente' ? 999 : TOKENS_PER_STUDENT);
      const statusClass = caseTokens === 0 ? 'empty' : caseTokens <= 2 ? 'low' : 'ok';
      const label = c.name.split("—")[0].trim().split(" ")[0] + " " + (c.name.split("—")[0].trim().split(" ")[1] || "");
      tokensPillsHTML += `
        <div style="font-size:0.65rem; margin-bottom:2px; display:inline-block; margin-right:4px;">
          <span class="token-pill ${statusClass}" style="padding: 2px 4px; font-size: 0.65rem;" title="${c.name}">
            ${label}: ${caseTokens}/${s.role === 'docente' ? 999 : TOKENS_PER_STUDENT}
          </span>
        </div>
      `;
    });

    return `
      <tr>
        <td><strong>${s.name}</strong> ${s.role === 'docente' ? '<span style="font-size:0.7rem;color:var(--primary-light);font-weight:600;">(Docente)</span>' : ''}</td>
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

function filterStudents(val) { renderStudentsTable(dbStudents, val); }

async function editStudentTokens(name, currentTokens) {
  const newVal = prompt(`Ingrese la nueva cantidad de tokens POR CASO para ${name}:`, currentTokens);
  if (newVal === null || newVal.trim() === "") return;
  const tokens = parseInt(newVal, 10);
  if (isNaN(tokens) || tokens < 0) {
    showAdminToast("Cantidad inválida", "error");
    return;
  }

  try {
    const data = getData();
    const cases = data.cases || [];
    const email = dbStudents.find(s => s.name === name)?.email || "";

    for (const c of cases) {
      const { data: existing } = await supabaseClient
        .from('student_tokens')
        .select('*')
        .eq('student_mail', email)
        .eq('case_id', c.id)
        .maybeSingle();

      if (existing) {
        await supabaseClient
          .from('student_tokens')
          .update({ tokens_left: tokens })
          .eq('id', existing.id);
      } else {
        await supabaseClient
          .from('student_tokens')
          .insert({
            student_mail: email,
            case_id: c.id,
            tokens_left: tokens
          });
      }
    }

    await refreshAdminData();
    renderStudentsTable(dbStudents);
    showAdminToast(`Tokens de ${name} actualizados a ${tokens} por caso`);
  } catch (err) {
    console.error("Error al actualizar tokens en Supabase:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function resetStudentTokens(name) {
  if (!confirm(`¿Resetear tokens y borrar logs de ${name}?`)) return;
  try {
    const email = dbStudents.find(s => s.name === name)?.email || "";
    await supabaseClient.from('student_tokens').delete().eq('student_mail', email);
    await supabaseClient.from('logs').delete().eq('student_mail', email);

    await refreshAdminData();
    renderStudentsTable(dbStudents);
    showAdminToast(`Tokens reseteados y logs eliminados para ${name}`);
  } catch (err) {
    console.error("Error al resetear tokens:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function resetAllTokens() {
  if (!confirm("¿Resetear tokens y borrar logs de TODOS los estudiantes?")) return;
  try {
    await supabaseClient.from('student_tokens').delete().neq('student_mail', '');
    await supabaseClient.from('logs').delete().neq('student_mail', '');

    await refreshAdminData();
    renderStudentsTable(dbStudents);
    showAdminToast("Tokens y logs reseteados para todos");
  } catch (err) {
    console.error("Error al resetear todos los tokens:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function deleteStudent(name) {
  if (!confirm(`¿Eliminar a ${name} y borrar todos sus registros?`)) return;
  try {
    const email = dbStudents.find(s => s.name === name)?.email || "";
    await supabaseClient.from('students').delete().eq('email', email);
    await supabaseClient.from('student_tokens').delete().eq('student_mail', email);
    await supabaseClient.from('logs').delete().eq('student_mail', email);

    await refreshAdminData();
    renderStudentsTable(dbStudents);
    showAdminToast(`${name} eliminado de Supabase`);
  } catch (err) {
    console.error("Error al eliminar estudiante:", err);
    showAdminToast("Error de conexión", "error");
  }
}

function buildAddStudentModal() {
  return `
    <div class="modal-overlay" id="add-student-modal">
      <div class="modal">
        <div class="modal-header"><h3>Agregar Estudiante / Docente</h3><button class="modal-close" data-modal="add-student-modal">✕</button></div>
        <form id="add-student-form" onsubmit="addStudent(event)">
          <div class="form-group"><label>Nombre completo</label><input type="text" id="new-student-name" required></div>
          <div class="form-group"><label>Email</label><input type="email" id="new-student-email" required></div>
          <div class="form-group">
            <label>Rol</label>
            <select id="new-student-role" style="width:100%; padding:0.5rem; background:var(--bg-input); border:1px solid var(--border); border-radius:var(--radius-md); color:var(--text-primary); font-size:0.875rem;">
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
            </select>
          </div>
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

async function addStudent(e) {
  e.preventDefault();
  const name = document.getElementById("new-student-name").value.trim();
  const email = document.getElementById("new-student-email").value.trim();
  const role = document.getElementById("new-student-role").value;

  if (dbStudents.some(s => normalize(s.name) === normalize(name))) {
    showAdminToast("Ya existe un usuario con ese nombre en Supabase", "error");
    return;
  }

  try {
    const { error } = await supabaseClient
      .from('students')
      .insert({
        name: name,
        email: email || null,
        role: role
      });

    if (error) throw error;

    document.getElementById("add-student-modal").classList.remove("open");
    document.getElementById("add-student-form").reset();

    await refreshAdminData();
    renderStudentsTable(dbStudents);
    showAdminToast(`${name} agregado con éxito (${role})`);
  } catch (err) {
    console.error("Error al agregar estudiante:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function processBulkImport() {
  const raw = document.getElementById("bulk-input").value.trim();
  const lines = raw.split("\n").filter(l => l.trim());
  let added = 0, skipped = 0;

  try {
    const insertPayloads = [];

    for (const line of lines) {
      const parts = line.split(",").map(p => p.trim());
      const name = parts[0];
      const email = parts[1] || `${normalize(name).replace(/\s+/g, ".")}@egcinmuno.edu`;
      if (!name) continue;

      if (dbStudents.some(s => normalize(s.name) === normalize(name))) {
        skipped++;
        continue;
      }

      insertPayloads.push({
        name: name,
        email: email,
        role: 'estudiante'
      });
      added++;
    }

    if (insertPayloads.length > 0) {
      const { error } = await supabaseClient
        .from('students')
        .insert(insertPayloads);
      if (error) throw error;
    }

    document.getElementById("bulk-result").innerHTML =
      `<p class="success-msg">✅ ${added} agregado(s).${skipped > 0 ? ` ${skipped} duplicado(s) omitido(s).` : ""}</p>`;

    await refreshAdminData();
    renderStudentsTable(dbStudents);
  } catch (err) {
    console.error("Error en bulk import:", err);
    showAdminToast("Error de conexión", "error");
  }
}

// ──────────────────────────────────────────────
// TAB: CASOS
// ──────────────────────────────────────────────

function renderCasesTab(container) {
  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
        <h2>Gestión de Casos Clínicos</h2>
        <button class="btn-admin-primary" onclick="openCaseModal()">+ Nuevo Caso</button>
      </div>
      
      <div class="admin-cases-layout" style="display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; align-items: start; margin-top: 1rem;">
        <!-- Left Sidebar: Cases List -->
        <div class="admin-cases-sidebar" style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
          <h3 style="font-size: 0.75rem; font-weight: 700; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.25rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
            Casos Clínicos
          </h3>
          <div style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 480px; overflow-y: auto; padding-right: 0.25rem;">
            ${dbCases.length === 0
      ? `<p class="empty-msg" style="font-size:0.78rem; text-align:center;">No hay casos. Clic en "+ Nuevo Caso" para crear uno.</p>`
      : dbCases.map(c => {
        const isSelected = c.id === selectedCaseId;
        const isPub = c.status === "published";
        return `
                    <div onclick="selectAdminCase('${c.id}')" style="padding: 0.65rem 0.75rem; border-radius: var(--radius-md); border: 1px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}; background: ${isSelected ? 'var(--primary-glow)' : 'transparent'}; cursor: pointer; transition: all var(--transition); display:flex; flex-direction:column; gap:0.2rem;">
                      <div style="display:flex; justify-content:space-between; align-items:center; gap: 0.25rem;">
                        <span style="font-weight:600; font-size:0.82rem; color:${isSelected ? 'var(--primary-light)' : 'var(--text-primary)'}; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                          ${c.name} ${c.internal_notes ? `<span style="font-weight:normal; font-size:0.75rem; color:var(--text-muted); font-style:italic;">(${c.internal_notes})</span>` : ""}
                        </span>
                        <span style="font-size:0.6rem; padding:0.1rem 0.35rem; border-radius:1rem; font-weight:700; background:${isPub ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)'}; color:${isPub ? 'var(--success)' : 'var(--text-muted)'}; flex-shrink:0;">
                          ${isPub ? 'Activo' : 'Borrador'}
                        </span>
                      </div>
                    </div>`;
      }).join("")}
          </div>
          <button class="btn-admin-secondary" onclick="syncLocalCasesToSupabase()" style="margin-top:0.5rem; font-size:0.78rem; width:100%; padding: 0.4rem 0.5rem;">
            🔄 Importar Locales
          </button>
        </div>
        
        <!-- Right Panel: Selected Case Detail Editor -->
        <div id="cases-editor-pane" style="min-width: 0; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; min-height: 400px;">
          <!-- Rendered dynamically by renderSelectedCaseDetail -->
        </div>
      </div>
    </div>
    ${buildCaseModal()}
    ${buildResultModal()}
    ${buildPatientModal()}
  `;
  renderSelectedCaseDetail();
  bindModalCloses();
}

function selectAdminCase(id) {
  selectedCaseId = id;
  const content = document.getElementById("admin-content");
  renderCasesTab(content);
}

function renderSelectedCaseDetail() {
  const container = document.getElementById("cases-editor-pane");
  if (!container) return;

  const c = dbCases.find(x => x.id === selectedCaseId);
  if (!c) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
        <span style="font-size: 3rem; display: block; margin-bottom: 1rem;">📋</span>
        <h3>Seleccioná un caso de la lista</h3>
        <p style="font-size: 0.85rem; margin-top: 0.5rem; color: var(--text-muted);">Hacé clic sobre cualquier caso clínico en el menú lateral de la izquierda para ver y editar su información.</p>
      </div>`;
    return;
  }

  const isPublished = c.status === "published";
  const patientInfo = c.patient && (c.patient.age || c.patient.gender || c.patient.symptomOnset)
    ? `🧑‍⚕️ <strong>Edad:</strong> ${c.patient.age || '—'} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Género:</strong> ${c.patient.gender || '—'} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Inicio de síntomas:</strong> ${c.patient.symptomOnset || '—'}`
    : "Sin datos demográficos.";

  // Organizar los resultados por categorías
  const categories = {
    patient: { label: "👨‍👩‍👧‍👦 Datos Clínicos y Antecedentes", items: [] },
    lab: { label: "🔬 Estudios de Laboratorio y Genética", items: [] },
    consult: { label: "🧑‍⚕️💬 Interconsultas y Evaluaciones", items: [] }
  };

  Object.entries(c.results).forEach(([key, val]) => {
    // Ocultar la ficha de información general porque ya se edita en la tarjeta superior
    if (key === "info-paciente::general") return;

    const parts = key.split("::");
    const typeId = parts[0];
    const typeObj = STUDY_TYPES.find(t => t.id === typeId);
    const displayKey = parts.length === 3
      ? `${parts[1]} › ${parts[2]}`
      : parts.slice(1).join(" › ");

    const item = {
      key,
      val,
      typeId,
      typeObj,
      displayKey
    };

    if (typeId === "antecedentes" || typeId === "info-paciente") {
      categories.patient.items.push(item);
    } else if (typeId === "interconsulta") {
      categories.consult.items.push(item);
    } else {
      categories.lab.items.push(item);
    }
  });

  const totalItems = categories.patient.items.length + categories.lab.items.length + categories.consult.items.length;

  container.innerHTML = `
    <!-- Case Header -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:1px solid var(--border); padding-bottom:1rem; flex-wrap:wrap; gap:1rem;">
      <div style="flex: 1; min-width: 200px;">
        <h2 style="font-size:1.25rem; margin:0; display:flex; align-items:center; gap:0.5rem; color:var(--text-primary);">
          ${c.name}
          <span style="font-size:0.7rem; font-weight:700; padding:0.15rem 0.45rem; border-radius:1rem; background:${isPublished ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)'}; color:${isPublished ? 'var(--success)' : 'var(--text-muted)'};">
            ${isPublished ? '🟢 Publicado' : '⚪ Borrador'}
          </span>
        </h2>
        <p style="margin:0.25rem 0 0 0; font-size:0.85rem; color:var(--text-secondary);">${c.description || 'Sin descripción clínica.'}</p>
      </div>
      
      <div class="btn-group" style="display:flex; gap:0.4rem;">
        <button class="btn-status-toggle ${isPublished ? 'toggle-unpublish' : 'toggle-publish'}" onclick="toggleCaseStatus('${c.id}')" style="font-size:0.78rem; padding:0.4rem 0.8rem; border-radius: var(--radius-md);">
          ${isPublished ? '⏸ Borrador' : '▶ Publicar'}
        </button>
        <button class="btn-admin-secondary danger" onclick="deleteCase('${c.id}')" style="font-size:0.78rem; padding:0.4rem 0.8rem; border-radius: var(--radius-md);">
          🗑 Borrar Caso
        </button>
      </div>
    </div>

    <!-- Patient Info Card -->
    <div style="background:rgba(255,255,255,0.015); border:1px solid var(--border); border-radius:var(--radius-md); padding:0.85rem 1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
      <div style="font-size:0.85rem; color:var(--text-primary);">
        ${patientInfo}
      </div>
      <button class="btn-admin-secondary" onclick="openPatientModal('${c.id}')" style="font-size:0.78rem; padding:0.4rem 0.75rem;">
        ✏️ Editar Ficha
      </button>
    </div>

    <!-- Study Results Grid -->
    <div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">
        <h3 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin:0;">Resultados de Estudios y Consultas</h3>
        <button class="btn-admin-primary" onclick="openAddResultModal('${c.id}')" style="font-size:0.78rem; padding:0.4rem 0.8rem;">
          + Agregar Resultado
        </button>
      </div>

      <div class="results-sections-wrapper" style="max-height:420px; overflow-y:auto; padding-right:0.25rem; display:flex; flex-direction:column; gap:1.25rem;">
        ${totalItems === 0
      ? `<p class="empty-msg" style="padding:2rem 0; text-align:center; font-style:italic; font-size:0.85rem; color:var(--text-muted);">No hay estudios cargados para este caso.</p>`
      : Object.entries(categories).map(([catKey, cat]) => {
        if (cat.items.length === 0) return "";
        return `
                <div class="category-block" style="display:flex; flex-direction:column; gap:0.5rem;">
                  <h4 style="font-size:0.75rem; font-weight:700; color:var(--primary-light); text-transform:uppercase; letter-spacing:0.06em; margin:0 0 0.25rem 0;">
                    ${cat.label}
                  </h4>
                  <div style="display:flex; flex-direction:column; gap:0.5rem;">
                    ${cat.items.map(item => `
                      <div class="result-admin-item" style="display:flex; align-items:center; padding:0.65rem 0.85rem; border-radius:var(--radius-md); border:1px solid var(--border); background:rgba(255,255,255,0.015); gap:1rem;">
                        <div class="result-admin-actions" style="display:flex; gap:0.35rem; flex-shrink:0;">
                          <button class="btn-icon-sm" onclick="editResult('${c.id}', '${item.key}')" style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px;">✏️</button>
                          <button class="btn-icon-sm danger" onclick="deleteResult('${c.id}', '${item.key}')" style="display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px;">🗑</button>
                        </div>
                        <div style="flex:1; min-width:0;">
                          <div style="display:flex; align-items:center; gap:0.4rem; margin-bottom:0.2rem; flex-wrap:wrap;">
                            <span class="result-type-badge" style="font-size:0.65rem; font-weight:700; text-transform:uppercase; background:var(--primary-glow); color:var(--primary-light); padding:0.15rem 0.4rem; border-radius:4px;">
                              ${item.typeObj ? item.typeObj.icon + " " + item.typeObj.label : item.typeId}
                            </span>
                            <span style="font-size:0.78rem; font-weight:700; color:var(--text-primary);">${item.displayKey}</span>
                          </div>
                          <p class="result-preview" style="margin:0; font-size:0.78rem; color:var(--text-secondary); display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; text-overflow:ellipsis;" title="${item.val.replace(/"/g, '&quot;')}">
                            ${item.val}
                          </p>
                        </div>
                      </div>
                    `).join("")}
                  </div>
                </div>
              `;
      }).join("")}
      </div>
    </div>
  `;
}

async function syncLocalCasesToSupabase() {
  if (!confirm("¿Deseas subir todos los casos cargados localmente en EGC_CASES a Supabase? Esto sobreescribirá los existentes con el mismo ID.")) return;
  const casesToSync = window.EGC_CASES || [];
  if (casesToSync.length === 0) {
    showAdminToast("No se encontraron casos locales en memoria", "error");
    return;
  }

  showAdminToast("Sincronizando casos con Supabase...");
  let count = 0;
  for (const c of casesToSync) {
    try {
      const { error } = await supabaseClient
        .from('cases')
        .upsert({
          id: c.id,
          name: c.name,
          description: c.description || "",
          status: c.status || "published",
          patient: c.patient || {},
          results: c.results || {}
        });
      if (error) throw error;
      count++;
    } catch (err) {
      console.error(`Error al subir el caso ${c.id}:`, err);
    }
  }

  await refreshAdminData();
  const content = document.getElementById("admin-content");
  renderCasesTab(content);
  showAdminToast(`Sincronización completa: ${count} casos importados.`);
}

async function toggleCaseStatus(caseId) {
  const c = dbCases.find(x => x.id === caseId);
  if (!c) return;
  const newStatus = c.status === "published" ? "draft" : "published";

  try {
    const { error } = await supabaseClient
      .from('cases')
      .update({ status: newStatus })
      .eq('id', caseId);

    if (error) throw error;

    await refreshAdminData();
    const content = document.getElementById("admin-content");
    renderCasesTab(content);
    showAdminToast(newStatus === "published" ? "🟢 Caso publicado — visible para estudiantes" : "⚪ Caso pasado a borrador");
  } catch (err) {
    console.error("Error al cambiar estado del caso:", err);
    showAdminToast("Error al guardar en Supabase", "error");
  }
}

function buildCaseModal() {
  return `
    <div class="modal-overlay" id="case-modal">
      <div class="modal">
        <div class="modal-header"><h3>Nuevo Caso Clínico</h3><button class="modal-close" data-modal="case-modal">✕</button></div>
        <form id="case-form" onsubmit="addCase(event)">
          <div class="form-group"><label>Nombre del caso</label><input type="text" id="case-name" required placeholder="Caso 4 — Paciente con..."></div>
          <div class="form-group"><label>Mensaje de bienvenida / Motivo de consulta (visible para estudiantes)</label><textarea id="case-desc" rows="3" required placeholder="Ej: Hola doctor, me han recomendado mucho que me atienda con usted..."></textarea></div>
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
      <div class="modal modal-lg">
        <div class="modal-header"><h3>Editar Datos del Caso y Paciente</h3><button class="modal-close" data-modal="patient-modal">✕</button></div>
        <form id="patient-form" onsubmit="savePatientData(event)">
          <input type="hidden" id="patient-case-id">
          
          <h4 style="margin: 0 0 0.75rem 0; font-size: 0.85rem; text-transform: uppercase; color: var(--primary-light); letter-spacing: 0.05em; border-bottom: 1px dashed var(--border); padding-bottom: 0.25rem;">Información del Caso</h4>
          <div class="form-group">
            <label>Nombre del Caso</label>
            <input type="text" id="patient-case-name" required placeholder="Ej: Caso 1">
          </div>
          <div class="form-group">
            <label>Mensaje de bienvenida / Motivo de consulta (visible para estudiantes)</label>
            <textarea id="patient-case-desc" rows="2" required placeholder="Ej: Hola doctor, me han recomendado mucho que me atienda con usted..."></textarea>
          </div>
          <div class="form-group">
            <label>Anotación Interna / Diagnóstico (Solo visible para docentes)</label>
            <input type="text" id="patient-internal-notes" placeholder="Ej: Síndrome de Wiskott-Aldrich, XLA, LAD-1...">
          </div>

          <h4 style="margin: 1.25rem 0 0.75rem 0; font-size: 0.85rem; text-transform: uppercase; color: var(--primary-light); letter-spacing: 0.05em; border-bottom: 1px dashed var(--border); padding-bottom: 0.25rem;">Ficha Demográfica del Paciente</h4>
          <div class="form-group">
            <label>Edad</label>
            <input type="text" id="patient-age" required placeholder="Ej: 8 años, 18 meses...">
          </div>
          <div class="form-group">
            <label>Género</label>
            <select id="patient-gender">
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No especificado">No especificado</option>
            </select>
          </div>
          <div class="form-group">
            <label>Inicio de síntomas</label>
            <input type="text" id="patient-onset" placeholder="Ej: Desde los 6 meses de vida">
          </div>
          
          <button type="submit" class="btn-admin-primary full-width" style="margin-top:0.5rem;">Guardar Cambios</button>
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
  const c = dbCases.find(x => x.id === caseId);
  if (!c) return;
  document.getElementById("patient-case-id").value = caseId;
  document.getElementById("patient-case-name").value = c.name || "";
  document.getElementById("patient-case-desc").value = c.description || "";
  document.getElementById("patient-internal-notes").value = c.internal_notes || "";
  document.getElementById("patient-age").value = c.patient?.age || "";
  document.getElementById("patient-gender").value = c.patient?.gender || "Masculino";
  document.getElementById("patient-onset").value = c.patient?.symptomOnset || "";
  document.getElementById("patient-modal").classList.add("open");
}

async function savePatientData(e) {
  e.preventDefault();
  const caseId = document.getElementById("patient-case-id").value;
  const c = dbCases.find(x => x.id === caseId);
  if (!c) return;

  const name = document.getElementById("patient-case-name").value.trim();
  const description = document.getElementById("patient-case-desc").value.trim();
  const internal_notes = document.getElementById("patient-internal-notes").value.trim();

  const patient = {
    age: document.getElementById("patient-age").value.trim(),
    gender: document.getElementById("patient-gender").value,
    symptomOnset: document.getElementById("patient-onset").value.trim()
  };

  // Actualizar también el resultado de info-paciente si no existe o actualizarlo
  const infoKey = "info-paciente::general";
  const results = { ...c.results };
  results[infoKey] = `INFORMACIÓN DEL PACIENTE:\n• Edad: ${patient.age}\n• Género: ${patient.gender}\n• Inicio de síntomas: ${patient.symptomOnset}`;

  try {
    const { error } = await supabaseClient
      .from('cases')
      .update({
        name,
        description,
        internal_notes,
        patient,
        results
      })
      .eq('id', caseId);

    if (error) throw error;

    document.getElementById("patient-modal").classList.remove("open");
    await refreshAdminData();
    // Volver a renderizar la pestaña entera para que se actualice el nombre en la barra lateral
    const content = document.getElementById("admin-content");
    renderCasesTab(content);
    showAdminToast("Datos del caso y paciente actualizados");
  } catch (err) {
    console.error("Error al actualizar datos en Supabase:", err);
    showAdminToast("Error de conexión", "error");
  }
}

function editResult(caseId, key) {
  const c = dbCases.find(x => x.id === caseId);
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

async function addCase(e) {
  e.preventDefault();
  const name = document.getElementById("case-name").value.trim();
  const desc = document.getElementById("case-desc").value.trim();
  const age = document.getElementById("case-age").value.trim() || "—";
  const gender = document.getElementById("case-gender").value;
  const onset = document.getElementById("case-onset").value.trim() || "—";

  const id = "caso-" + Date.now();
  const infoText = `INFORMACIÓN DEL PACIENTE:\n• Edad: ${age}\n• Género: ${gender}\n• Inicio de síntomas: ${onset}`;

  try {
    const { error } = await supabaseClient
      .from('cases')
      .insert({
        id,
        name,
        description: desc,
        status: "draft",
        patient: { age, gender, symptomOnset: onset },
        results: { "info-paciente::general": infoText }
      });

    if (error) throw error;

    document.getElementById("case-modal").classList.remove("open");
    selectedCaseId = id; // Auto-select the newly created case
    await refreshAdminData();
    const content = document.getElementById("admin-content");
    renderCasesTab(content);
    showAdminToast("Caso creado en Supabase (en borrador)");
  } catch (err) {
    console.error("Error al crear caso en Supabase:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function saveResult(e) {
  e.preventDefault();
  const caseId = document.getElementById("result-case-id").value;
  const originalKey = document.getElementById("result-original-key").value;
  const typeId = document.getElementById("result-study-type").value;
  const type = STUDY_TYPES.find(t => t.id === typeId);
  const text = document.getElementById("result-text").value.trim();

  const c = dbCases.find(x => x.id === caseId);
  if (!c) return;

  let key;
  if (type?.hasSub) {
    const subtypeVal = document.getElementById("result-subtype")?.value || "";
    const subtypeId = subtypeVal.split("::")[1] || "";
    const target = document.getElementById("result-target")?.value.trim() || "";
    key = `${typeId}::${subtypeId}::${target}`;
  } else if (type?.fixed) {
    key = `${typeId}::${type.fixedTarget}`;
  } else {
    const target = document.getElementById("result-target")?.value.trim() || "";
    key = `${typeId}::${target}`;
  }

  const results = { ...c.results };
  if (originalKey && originalKey !== key) delete results[originalKey];
  results[key] = text;

  try {
    const { error } = await supabaseClient
      .from('cases')
      .update({ results })
      .eq('id', caseId);

    if (error) throw error;

    document.getElementById("result-modal").classList.remove("open");
    await refreshAdminData();
    renderSelectedCaseDetail();
    showAdminToast("Resultado guardado en Supabase");
  } catch (err) {
    console.error("Error al guardar resultado en Supabase:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function deleteResult(caseId, key) {
  if (!confirm("¿Eliminar este resultado?")) return;
  const c = dbCases.find(x => x.id === caseId);
  if (!c) return;

  const results = { ...c.results };
  delete results[key];

  try {
    const { error } = await supabaseClient
      .from('cases')
      .update({ results })
      .eq('id', caseId);

    if (error) throw error;

    await refreshAdminData();
    renderSelectedCaseDetail();
    showAdminToast("Resultado eliminado de Supabase");
  } catch (err) {
    console.error("Error al eliminar resultado en Supabase:", err);
    showAdminToast("Error de conexión", "error");
  }
}

async function deleteCase(caseId) {
  if (!confirm("¿Eliminar este caso y todos sus resultados de Supabase?")) return;
  try {
    const { error } = await supabaseClient
      .from('cases')
      .delete()
      .eq('id', caseId);

    if (error) throw error;

    selectedCaseId = null; // Clear selection
    await refreshAdminData();
    const content = document.getElementById("admin-content");
    renderCasesTab(content);
    showAdminToast("Caso eliminado de Supabase");
  } catch (err) {
    console.error("Error al eliminar caso en Supabase:", err);
    showAdminToast("Error de conexión", "error");
  }
}

function renderSettingsTab(container) {
  const mode = cachedQueryMode || "both";
  const tokenLimit = cachedTokensLimit || 15;
  const showBanner = cachedShowBanner !== false;
  const bannerLogos = cachedBannerLogos || [];

  container.innerHTML = `
    <div class="admin-section">
      <div class="admin-section-header"><h2>Configuración del Examen</h2></div>

      <div class="settings-card" style="background:var(--bg-card); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius-lg); margin-bottom:1.5rem;">
        <h3>🔍 Modo de Consulta para Estudiantes</h3>
        <p style="margin-bottom:1.25rem; font-size:0.875rem; color:var(--text-secondary);">Controlá qué interfaz ven los estudiantes al solicitar estudios.</p>
        <div class="mode-options" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1rem;">
          <label class="mode-option ${mode === 'both' ? 'active' : ''}" style="border:1px solid ${mode === 'both' ? 'var(--primary)' : 'var(--border)'}; background:${mode === 'both' ? 'var(--primary-glow)' : 'transparent'}; padding:1rem; border-radius:var(--radius-md); display:block; cursor:pointer;">
            <input type="radio" name="query-mode" value="both" ${mode === 'both' ? 'checked' : ''} onchange="saveSystemSetting('query_mode', this.value)" style="display:none;">
            <div class="mode-option-content">
              <span class="mode-icon" style="font-size:1.5rem; display:block; margin-bottom:0.25rem;">🔀</span>
              <strong style="color:var(--text-primary);">Ambos modos</strong>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin:0.25rem 0 0 0;">El estudiante puede usar el modo libre (texto) y el modo guiado (menús). Recomendado.</p>
            </div>
          </label>
          <label class="mode-option ${mode === 'free' ? 'active' : ''}" style="border:1px solid ${mode === 'free' ? 'var(--primary)' : 'var(--border)'}; background:${mode === 'free' ? 'var(--primary-glow)' : 'transparent'}; padding:1rem; border-radius:var(--radius-md); display:block; cursor:pointer;">
            <input type="radio" name="query-mode" value="free" ${mode === 'free' ? 'checked' : ''} onchange="saveSystemSetting('query_mode', this.value)" style="display:none;">
            <div class="mode-option-content">
              <span class="mode-icon" style="font-size:1.5rem; display:block; margin-bottom:0.25rem;">🗣️</span>
              <strong style="color:var(--text-primary);">Solo modo libre</strong>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin:0.25rem 0 0 0;">El estudiante escribe su consulta en lenguaje natural. Más desafiante.</p>
            </div>
          </label>
          <label class="mode-option ${mode === 'guided' ? 'active' : ''}" style="border:1px solid ${mode === 'guided' ? 'var(--primary)' : 'var(--border)'}; background:${mode === 'guided' ? 'var(--primary-glow)' : 'transparent'}; padding:1rem; border-radius:var(--radius-md); display:block; cursor:pointer;">
            <input type="radio" name="query-mode" value="guided" ${mode === 'guided' ? 'checked' : ''} onchange="saveSystemSetting('query_mode', this.value)" style="display:none;">
            <div class="mode-option-content">
              <span class="mode-icon" style="font-size:1.5rem; display:block; margin-bottom:0.25rem;">📋</span>
              <strong style="color:var(--text-primary);">Solo modo guiado</strong>
              <p style="font-size:0.75rem; color:var(--text-secondary); margin:0.25rem 0 0 0;">El estudiante usa menús y pestañas para seleccionar el estudio.</p>
            </div>
          </label>
        </div>
      </div>

      <div class="settings-card" style="background:var(--bg-card); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius-lg); margin-bottom:1.5rem;">
        <h3>🪙 Límite de Tokens por Caso</h3>
        <p style="margin-bottom:1rem; font-size:0.875rem; color:var(--text-secondary);">Cantidad de tokens que reciben los alumnos al iniciar cada caso.</p>
        <div style="display:flex; gap:0.75rem; align-items:center; max-width:300px;">
          <input type="number" id="settings-token-limit" value="${tokenLimit}" min="1" max="100" style="padding:0.5rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border); background:rgba(0,0,0,0.1); color:var(--text-primary); outline:none; font-size:0.875rem; width:80px; text-align:center;">
          <button class="btn-admin-primary" onclick="updateTokensSetting()" style="font-size:0.8rem; padding:0.5rem 1rem;">Guardar Tokens</button>
        </div>
        <p class="form-hint" style="margin-top:0.75rem; font-size:0.75rem; color:var(--text-muted);">
          * Nota: Cambiar este límite no alterará los tokens de exámenes que ya fueron iniciados por los estudiantes. Para aplicarlo a todos, hacé clic en "Resetear tokens" en la pestaña Estudiantes.
        </p>
      </div>

      <div class="settings-card" style="background:var(--bg-card); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius-lg); margin-bottom:1.5rem;">
        <h3>🖼️ Banner de Logos (Pie de Página)</h3>
        <p style="margin-bottom:1.25rem; font-size:0.875rem; color:var(--text-secondary);">Configurá el banner que se muestra al final de la pantalla de estudiantes.</p>
        <div style="margin-bottom:1.25rem;">
          <label style="display:inline-flex; align-items:center; gap:0.5rem; cursor:pointer; color:var(--text-primary); font-weight:500;">
            <input type="checkbox" id="settings-show-banner" ${showBanner ? 'checked' : ''} onchange="toggleBannerVisibility(this.checked)" style="width:18px; height:18px;">
            Mostrar banner de logos
          </label>
        </div>
        <div id="banner-logos-selection" style="display:${showBanner ? 'block' : 'none'}; border-top:1px solid var(--border); padding-top:1rem;">
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.75rem;">Seleccioná los logos a mostrar:</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:0.75rem;">
            ${[
      { file: 'egc.png', label: 'EGC' },
      { file: 'lasid.png', label: 'LASID' },
      { file: 'exactas.png', label: 'Exactas (UBA)' },
      { file: 'logo egcinmuno.png', label: 'EGCinmuno' },
      { file: 'logo_square.png', label: 'Favicon Cuadrado' }
    ].map(logo => {
      const isChecked = bannerLogos.includes(logo.file);
      return `
                <label style="display:flex; align-items:center; gap:0.5rem; padding:0.5rem; border:1px solid var(--border); border-radius:var(--radius-md); background:rgba(255,255,255,0.02); cursor:pointer;">
                  <input type="checkbox" name="banner-logo" value="${logo.file}" ${isChecked ? 'checked' : ''} onchange="updateSelectedLogos()" style="width:16px; height:16px;">
                  <span style="font-size:0.85rem; color:var(--text-primary);">${logo.label}</span>
                </label>
              `;
    }).join('')}
          </div>
        </div>
      </div>

      <div class="settings-card danger-card" style="background:var(--bg-card); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius-lg);">
        <h3>⚠️ Reiniciar datos</h3>
        <p style="margin-bottom:1rem; font-size:0.875rem; color:var(--text-secondary);">Borra todo de la base de datos local y restaura los datos de ejemplo.</p>
        <button class="btn-admin-secondary danger" onclick="confirmResetData()">🗑 Restaurar datos de ejemplo</button>
      </div>
    </div>`;
}

async function saveSystemSetting(key, value) {
  try {
    const { error } = await supabaseClient
      .from('settings')
      .upsert({ key, value });
    if (error) throw error;
    showAdminToast(`Configuración de ${key} guardada en Supabase`);
    await refreshAdminData();
    const content = document.getElementById("admin-content");
    renderSettingsTab(content);
  } catch (err) {
    console.error("Error al guardar config en Supabase:", err);
    showAdminToast("Error al guardar configuración", "error");
  }
}

async function updateTokensSetting() {
  const input = document.getElementById("settings-token-limit");
  if (!input) return;
  const val = parseInt(input.value, 10);
  if (isNaN(val) || val < 1 || val > 100) {
    showAdminToast("Valor de tokens no válido", "error");
    return;
  }
  await saveSystemSetting('tokens_per_student', val.toString());
}

async function toggleBannerVisibility(visible) {
  cachedShowBanner = visible;
  const selectionDiv = document.getElementById("banner-logos-selection");
  if (selectionDiv) {
    selectionDiv.style.display = visible ? "block" : "none";
  }
  await saveSystemSetting('show_banner', visible ? 'true' : 'false');
}

async function updateSelectedLogos() {
  const checkboxes = document.querySelectorAll('input[name="banner-logo"]:checked');
  const selected = Array.from(checkboxes).map(cb => cb.value);
  cachedBannerLogos = selected;
  await saveSystemSetting('banner_logos', JSON.stringify(selected));
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
  const allLogs = [];
  dbStudents.forEach(s => s.log.forEach(e => allLogs.push({ ...e, studentName: s.name })));
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
            <thead><tr><th>Fecha/Hora</th><th>Estudiante</th><th>Caso</th><th>Tipo</th><th>Target</th><th>Consulta Escrita</th><th>Resultado</th></tr></thead>
            <tbody>${allLogs.map(e => `
              <tr>
                <td class="text-muted">${new Date(e.timestamp).toLocaleString("es-AR")}</td>
                <td><strong>${e.studentName}</strong></td>
                <td>${e.caseId}</td>
                <td>${e.studyType}</td>
                <td>${e.target}</td>
                <td style="font-style: italic; color: var(--text-secondary); max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${e.rawQuery || ''}">
                  ${e.rawQuery || '—'}
                </td>
                <td><span class="${e.resultFound ? 'badge-found' : 'badge-missing'}">${e.resultFound ? "✓" : "✗"}</span></td>
              </tr>`).join("")}
            </tbody>
          </table>`}
    </div>`;
}

function exportLog() {
  let csv = "Fecha,Estudiante,Caso,Tipo de estudio,Target,Consulta Escrita,Resultado encontrado\n";
  dbStudents.forEach(s => s.log.forEach(e => {
    csv += `"${new Date(e.timestamp).toLocaleString("es-AR")}","${s.name}","${e.caseId}","${e.studyType}","${e.target}","${e.rawQuery || ''}","${e.resultFound ? "Sí" : "No"}"\n`;
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
