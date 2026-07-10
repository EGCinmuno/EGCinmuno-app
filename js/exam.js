/**
 * EGCinmuno-App — Lógica del Examen v2
 * Modo guiado + Modo libre (texto natural)
 */

let currentCase = null;
let session = null;
let queryHistory = [];
let pendingFreeQuery = null;  // Bug fix: almacenar el parsed result en lugar de pasar por inline-onclick


let examCases = [];
let queryMode = "both";

document.addEventListener("DOMContentLoaded", async () => {
  initData();
  session = requireAuth();
  if (!session) return;
  session = syncSession();

  // Cargar configuraciones globales
  await fetchSystemSettings();

  // Restaurar historial desde la base de datos de Supabase
  try {
    const { data: dbLogs, error } = await supabaseClient
      .from('logs')
      .select('*')
      .eq('student_mail', session.email)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error("Error al cargar historial desde Supabase:", error);
    } else if (dbLogs) {
      queryHistory = dbLogs.map(entry => {
        const type = STUDY_TYPES.find(t => t.id === entry.type_id) || { id: "unknown", label: entry.study_type, color: "#666", icon: "📄" };
        const subtype = type.subtypes ? type.subtypes.find(s => s.id === entry.subtype_id) : null;
        return {
          type,
          subtype,
          target: entry.target,
          result: entry.result_text || "⚠️ Sin texto guardado.",
          found: entry.result_found,
          tokensLeft: "—",
          time: new Date(entry.timestamp),
          caseId: entry.case_id
        };
      }).reverse();
    }
  } catch (err) {
    console.error("Excepción al cargar historial de Supabase:", err);
  }

  // Cargar casos desde Supabase
  try {
    const { data: csData, error: csErr } = await supabaseClient
      .from('cases')
      .select('*')
      .eq('status', 'published')
      .order('id', { ascending: true });

    if (csErr) {
      console.error("Error al obtener casos de Supabase:", csErr);
    } else if (csData && csData.length > 0) {
      examCases = csData.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || "",
        status: c.status || "published",
        patient: c.patient || {},
        results: c.results || {}
      }));
    }
  } catch (err) {
    console.error("Excepción al cargar casos de Supabase:", err);
  }

  // Fallback si no hay casos en Supabase
  if (examCases.length === 0) {
    const data = getData();
    examCases = (data.cases || []).filter(c => c.status === "published");
  }

  queryMode = cachedQueryMode;

  await renderHeader();
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

async function renderHeader() {
  document.getElementById("student-name").textContent = session.name;
  await updateTokenBadge();
}

async function updateTokenBadge() {
  const badge = document.getElementById("token-badge");
  const count = document.getElementById("token-count");
  session = syncSession();

  if (!currentCase) {
    count.textContent = "—";
    badge.className = "token-badge";
    return;
  }

  const caseId = currentCase.id;
  const tokens = await getStudentTokens(session, caseId);
  count.textContent = tokens;
  badge.className = "token-badge";
  if (tokens <= 1) badge.classList.add("critical");
  else if (tokens <= 2) badge.classList.add("warning");
}

// ──────────────────────────────────────────────
// SELECTOR DE CASO (solo publicados)
// ──────────────────────────────────────────────

function renderCaseSelector() {
  const container = document.getElementById("case-list");
  container.innerHTML = "";

  if (examCases.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);font-size:0.82rem;padding:0.5rem 0;">
      No hay casos disponibles aún. El docente los habilitará durante el examen.
    </p>`;
    return;
  }

  examCases.forEach(c => {
    const card = document.createElement("div");
    card.className = "case-card" + (currentCase?.id === c.id ? " active" : "");
    card.innerHTML = `
      <div class="case-card-header">
        <span class="case-icon">📋</span>
        <span class="case-name">${c.name}</span>
      </div>
    `;
    card.addEventListener("click", () => selectCase(c, card));
    container.appendChild(card);
  });
}

async function selectCase(c, cardEl) {
  currentCase = c;
  document.querySelectorAll(".case-card").forEach(el => el.classList.remove("active"));
  cardEl.classList.add("active");

  document.getElementById("no-case-msg").style.display = "none";
  document.getElementById("study-panel").style.display = "flex";
  document.getElementById("current-case-name").textContent = c.name;

  // Actualizar el marcador de tokens para el caso seleccionado
  await updateTokenBadge();

  // Mostrar info del paciente en el banner del caso
  renderCaseInfoBanner(c);

  // Renderizar barra libre y mensaje de bienvenida si aplica
  if (queryMode !== "guided") {
    renderFreeQueryBar();
  }

  // Renderizar el historial cada vez que se cambia de caso
  renderHistory();
}

// ══════════════════════════════════════════
// MAPA CORPORAL INTERACTIVO - CONFIGURACIÓN Y CLASIFICADOR
// 
// ¿CÓMO CONFIGURAR O AGREGAR NUEVAS REGIONES / ICONOS?
// 1. REGION_METADATA: Define el nombre de la sección, el emoji que aparece, su color y si va en la silueta.
// 2. getMarkerCoords: Define la posición (X, Y en % de 0 a 100) del botón sobre la silueta.
// 3. classifyFinding: Clasifica un estudio médico en una región escaneando palabras clave del estudio o del texto del resultado.
// 4. getFindingsForCase: Agrupa y da formato a la información del caso según las regiones clasificadas.
// ══════════════════════════════════════════

const REGION_METADATA = {
  antecedentes: { label: "Antecedentes Familiares", icon: "🌳", color: "var(--primary-light)" },
  head: { label: "Neurología", icon: "🧠", color: "var(--warning)" },
  lungs: { label: "Sistema Respiratorio", icon: "🫁", color: "var(--info)" },
  cardio: { label: "Sistema Cardiovascular", icon: "❤️", color: "var(--danger)" },
  hemato: { label: "Hematopoyético & Inmunoglobulinas", icon: "🩸", color: "var(--primary-light)" },
  vacunas: { label: "Respuesta a Vacunas", icon: "💉", color: "var(--info)" },
  gastro: { label: "Gastrointestinal", icon: "🦠", color: "var(--success)" },
  dermato: { label: "Piel & Tegumentario", icon: "🩹", color: "#ec4899" },
  joints: { label: "Sistema Osteoarticular", icon: "🦴", color: "var(--accent-light)" },
  
  // Regiones específicas fuera de la silueta (se anotan debajo):
  funcional: { label: "Ensayos Funcionales", icon: "⚙️", color: "var(--accent-light)", onSilhouette: false },
  western: { label: "Detección de Proteínas (Western Blot)", icon: "🧪", color: "var(--primary-light)", onSilhouette: false },
  molecular: { label: "Estudios de Biología Molecular", icon: "🧬", color: "var(--primary-light)", onSilhouette: false },
  genetica: { label: "Segregación Genética", icon: "👥", color: "var(--accent-light)", onSilhouette: false }
};

function getMarkerCoords(region) {
  const coords = {
    antecedentes: { x: 50, y: -3 }, // Logo arriba de la cabeza
    head: { x: 50, y: 9 },         // Centro de la cabeza
    lungs: { x: 58, y: 25 },        // Pulmón derecho
    cardio: { x: 45, y: 24 },       // Corazón (pecho izquierdo)
    hemato: { x: 79, y: 30 },       // Brazo derecho
    vacunas: { x: 21, y: 30 },      // Brazo izquierdo
    gastro: { x: 50, y: 36 },       // Abdomen
    dermato: { x: 30, y: 17 },      // Hombro izquierdo
    joints: { x: 41, y: 67 }        // Rodilla izquierda
  };
  return coords[region] || { x: 50, y: 50 };
}

function classifyFinding(typeId, subtypeId, target, resultText) {
  const searchStr = `${typeId || ""} ${subtypeId || ""} ${target || ""} ${resultText || ""}`.toLowerCase();
  
  // Categorías por tipo directo:
  if (typeId === "info-paciente") return "general";
  if (typeId === "ecografia") return "gastro";
  if (typeId === "tomografia") return "lungs";
  if (typeId === "pcr") return "molecular";
  if (typeId === "western-blot") return "western";
  if (typeId === "funcional") return "funcional";
  if (typeId === "segregacion") return "genetica";
  if (typeId === "antecedentes") return "antecedentes";
  if (typeId === "vacuna") return "vacunas";
  if (typeId === "hemograma" || typeId === "citometria" || typeId === "elisa" || typeId === "autoanticuerpos") {
    return "hemato";
  }
  
  // Clasificación por palabras clave (Interconsultas y otros targets):
  if (searchStr.includes("gastro") || searchStr.includes("diarrea") || searchStr.includes("salmonel") || searchStr.includes("esplenomeg") || searchStr.includes("abdominal") || searchStr.includes("bazo") || searchStr.includes("copro") || searchStr.includes("proctocolitis") || searchStr.includes("deposicion")) {
    return "gastro";
  }
  if (searchStr.includes("neumon") || searchStr.includes("bor ") || searchStr.includes("broncoespasmo") || searchStr.includes("respirator") || searchStr.includes("pulmon") || searchStr.includes("torax") || searchStr.includes("tórax") || searchStr.includes("sibilancia")) {
    return "lungs";
  }
  if (searchStr.includes("otitis") || searchStr.includes("sinusit") || searchStr.includes("oido") || searchStr.includes("oído") || searchStr.includes("oídos") || searchStr.includes("cabeza") || searchStr.includes("cerebro")) {
    return "head";
  }
  if (searchStr.includes("eccema") || searchStr.includes("dermat") || searchStr.includes("piel") || searchStr.includes("cutan") || searchStr.includes("eczema") || searchStr.includes("prurito") || searchStr.includes("rascado")) {
    return "dermato";
  }
  if ((searchStr.includes("artrit") || searchStr.includes("articulac") || searchStr.includes("reumato") || searchStr.includes("articular")) && !searchStr.includes("particularidades")) {
    return "joints";
  }
  if (searchStr.includes("cardio") || searchStr.includes("soplo") || searchStr.includes("corazon") || searchStr.includes("corazón") || searchStr.includes("ecocardiograma") || searchStr.includes("ecg")) {
    return "cardio";
  }
  if (searchStr.includes("neuro") || searchStr.includes("neurología") || searchStr.includes("neurologia")) {
    return "head";
  }
  
  return "hemato";
}

function isGenericTarget(typeId, target) {
  const normalized = normalize(target);
  const genericWords = [
    "vacuna", "vacunas", "estudio", "estudios", "analisis", "análisis", 
    "test", "ensayo", "ensayos", "prueba", "pruebas", "pcr", "pcr-rt", 
    "western", "blot", "western blot", "elisa", "dosaje", "dosajes", 
    "citometria", "citometría", "flow", "facs", "segregacion", "segregación",
    "anticuerpo", "anticuerpos", "autoanticuerpo", "autoanticuerpos",
    "interconsulta", "interconsultas", "derivacion", "derivación",
    "flujo", "citometria de flujo", "citometría de flujo", "poblacion", "población", "poblaciones", 
    "linfocitaria", "linfocitarias", "poblacion linfocitaria", "poblacion celular", 
    "poblaciones linfocitarias", "poblaciones celulares", "subpoblacion", "subpoblación", "subpoblaciones", "subpoblaciones linfocitarias"
  ];
  return genericWords.includes(normalized);
}

function getFindingsForCase(caseId) {
  const c = examCases.find(x => x.id === caseId);
  if (!c) return {};

  const hasUnlockedOnset = queryHistory.some(entry => 
    entry.caseId === caseId && 
    entry.type.id === "info-paciente" && 
    normalize(entry.target) === "inicio de sintomas" && 
    entry.found
  );

  const findings = {
    general: {
      title: "Datos Generales",
      icon: "🧑‍⚕️",
      text: `• <strong>Edad:</strong> ${c.patient.age || "—"}\n• <strong>Género:</strong> ${c.patient.gender || "—"}${hasUnlockedOnset ? `\n• <strong>Inicio de síntomas:</strong> ${c.patient.symptomOnset || "—"}` : ""}\n\n`
    }
  };

  // Buscar descubrimientos en el historial de sesión de este estudiante
  queryHistory.forEach(entry => {
    if (entry.caseId === caseId && entry.found) {
      const typeId = entry.type.id;
      const subtypeId = entry.subtype?.id || null;
      const region = classifyFinding(typeId, subtypeId, entry.target, entry.result);
      if (!findings[region]) {
        findings[region] = {
          title: REGION_METADATA[region].label,
          icon: REGION_METADATA[region].icon,
          text: ""
        };
      }
      findings[region].text += `• <strong>${entry.type.label}${entry.target ? ` (${entry.target})` : ''}:</strong>\n${entry.result}\n\n`;
    }
  });

  return findings;
}

function highlightFindingGroup(region) {
  const el = document.getElementById(`fg-${region}`);
  if (!el) return;

  // Quitar resaltados previos
  document.querySelectorAll(".findings-group").forEach(g => g.classList.remove("highlighted"));

  // Resaltar el grupo actual
  el.classList.add("highlighted");
  el.scrollIntoView({ behavior: "smooth", block: "nearest" });

  // Parpadeo visual
  el.style.outline = `2px dashed ${REGION_METADATA[region].color}`;
  setTimeout(() => {
    el.style.outline = "none";
  }, 1500);
}

function renderCaseInfoBanner(c) {
  const banner = document.getElementById("case-info-banner");
  if (!banner) return;
  const p = c.patient;
  if (!p) { banner.style.display = "none"; return; }
  banner.style.display = "flex";

  // Obtener los descubrimientos agrupados por región
  const findings = getFindingsForCase(c.id);

  // Determinar qué regiones están activas (tienen al menos un hallazgo)
  const activeRegions = Object.keys(findings).filter(r => r !== "general");

  // Elegir silueta según el género
  const isFemale = p.gender && p.gender.toLowerCase() === "femenino";

  // Detalle de la silueta SVG (Holograma médico geométrico)
  const headCircle = `<circle cx="50" cy="20" r="10" fill="rgba(99, 102, 241, 0.04)" stroke="var(--border-active)" stroke-width="1.5" />`;

  const bodyDetails = isFemale
    ? `
      <!-- Cuello -->
      <line x1="50" y1="30" x2="50" y2="38" stroke="var(--border-active)" stroke-width="1.5" />
      <!-- Clavícula -->
      <line x1="35" y1="38" x2="65" y2="38" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <!-- Tronco femenino (entallado) -->
      <path d="M35 38 L65 38 L60 70 L65 105 L35 105 L40 70 Z" fill="rgba(99, 102, 241, 0.03)" stroke="var(--border-active)" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Brazos -->
      <line x1="35" y1="38" x2="22" y2="95" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <line x1="65" y1="38" x2="78" y2="95" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <!-- Piernas -->
      <line x1="42" y1="105" x2="40" y2="200" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <line x1="58" y1="105" x2="60" y2="200" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
    `
    : `
      <!-- Cuello -->
      <line x1="50" y1="30" x2="50" y2="38" stroke="var(--border-active)" stroke-width="1.5" />
      <!-- Clavícula -->
      <line x1="33" y1="38" x2="67" y2="38" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <!-- Tronco masculino -->
      <path d="M33 38 L67 38 L64 70 L64 105 L36 105 L36 70 Z" fill="rgba(99, 102, 241, 0.03)" stroke="var(--border-active)" stroke-width="1.5" stroke-linejoin="round" />
      <!-- Brazos -->
      <line x1="33" y1="38" x2="20" y2="95" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <line x1="67" y1="38" x2="80" y2="95" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <!-- Piernas -->
      <line x1="40" y1="105" x2="38" y2="200" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
      <line x1="60" y1="105" x2="62" y2="200" stroke="var(--border-active)" stroke-width="1.5" stroke-linecap="round" />
    `;

  const specialRegions = activeRegions.filter(r => REGION_METADATA[r].onSilhouette === false);
  const specialStudiesHTML = specialRegions.length > 0
    ? `
      <div class="special-studies-silhouette">
        <div class="special-studies-title">Estudios Especiales</div>
        <div class="special-studies-tags">
          ${specialRegions.map(r => `
            <div class="special-study-tag" onclick="highlightFindingGroup('${r}')" title="${REGION_METADATA[r].label} (Click para ver detalles)">
              <span class="special-study-icon">${REGION_METADATA[r].icon}</span>
              <span class="special-study-label">${REGION_METADATA[r].label}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `
    : "";

  // HTML para la columna del mapa corporal
  const bodyMapHTML = `
    <div class="body-map-column">
      <span class="body-map-title">${p.gender || "Paciente"}</span>
      <div class="body-map-wrapper">
        <svg class="body-silhouette-svg" viewBox="0 0 100 220">
          ${headCircle}
          ${bodyDetails}
          
          <!-- Líneas de conexión decorativas de red médica en los marcadores activos -->
          ${activeRegions
            .filter(r => REGION_METADATA[r].onSilhouette !== false)
            .map(r => {
              const coords = getMarkerCoords(r);
              return `<line x1="50" y1="55" x2="${coords.x}" y2="${(coords.y * 2.2).toFixed(1)}" stroke="var(--border)" stroke-width="0.5" stroke-dasharray="2,2" />`;
            }).join("")}
        </svg>

        <!-- Puntos interactivos overlay (HTML con posicionamiento absoluto) - SOLO SE RENDERIZAN LOS ACTIVOS -->
        ${Object.keys(REGION_METADATA)
          .filter(r => REGION_METADATA[r].onSilhouette !== false && activeRegions.includes(r))
          .map(r => {
            const coords = getMarkerCoords(r);
            const label = REGION_METADATA[r].label;
            const icon = REGION_METADATA[r].icon;
            return `
              <div 
                class="body-marker active"
                style="left: ${coords.x}%; top: ${coords.y}%;"
                data-region="${r}"
                title="${label} (Ver hallazgos)"
                onclick="highlightFindingGroup('${r}')"
              >
                <span style="font-size:0.6rem;z-index:2;color:white;display:flex;align-items:center;justify-content:center;">${icon}</span>
              </div>
            `;
          }).join("")}
      </div>
      ${specialStudiesHTML}
    </div>
  `;

  // HTML para la columna de hallazgos
  const findingsHTML = `
    <div class="body-findings-column">
      <!-- Datos Generales -->
      <div class="findings-group" id="fg-general">
        <div class="findings-group-header">
          <span style="font-size:1.1rem;">${findings.general.icon}</span>
          <span class="findings-group-title">${findings.general.title}</span>
        </div>
        <p class="findings-group-text">${findings.general.text}</p>
      </div>

      <!-- Otros Hallazgos desbloqueados -->
      ${Object.keys(findings).filter(r => r !== "general").map(r => `
        <div class="findings-group" id="fg-${r}">
          <div class="findings-group-header">
            <span style="font-size:1.1rem;">${findings[r].icon}</span>
            <span class="findings-group-title" style="color:${REGION_METADATA[r].color};">${findings[r].title}</span>
          </div>
          <p class="findings-group-text">${findings[r].text.trim()}</p>
        </div>
      `).join("")}

      ${activeRegions.length === 0 ? `
        <div style="text-align:center;padding:1.5rem;color:var(--text-muted);font-size:0.8rem;border:1px dashed var(--border);border-radius:var(--radius-md);margin-top:0.5rem;">
          🔍 Solicitá estudios de laboratorio para revelar hallazgos en la figura humana.
        </div>
      ` : ""}
    </div>
  `;

  banner.innerHTML = bodyMapHTML + findingsHTML;
}

// ──────────────────────────────────────────────
// BARRA DE CONSULTA LIBRE
// ──────────────────────────────────────────────

function renderFreeQueryBar() {
  const container = document.getElementById("free-query-section");
  if (!container) return;

  // Si no hay caso seleccionado, mostrar estado deshabilitado inicial
  if (!currentCase) {
    container.innerHTML = `
      <div class="free-query-bar">
        <div class="free-query-header">
          <span class="free-query-badge">🔍 Modo libre</span>
          <span class="free-query-hint">Describí consulta o estudio que querés preguntar o solicitar</span>
        </div>
        <form id="free-query-form" class="free-query-form">
          <input
            type="text"
            id="free-query-input"
            class="free-query-input"
            placeholder="Primero seleccioná un caso clínico..."
            disabled
          >
          <button type="submit" class="btn-free-query" id="free-query-btn" disabled>Interpretar →</button>
        </form>
      </div>
    `;
    return;
  }

  // Verificar si ya se realizó alguna consulta válida para este caso
  const hasQueries = queryHistory.some(entry => entry.caseId === currentCase.id);
  const welcomeHTML = (!hasQueries && currentCase.description)
    ? `
      <div id="case-welcome-bubble" class="welcome-speech-bubble" style="background: var(--primary-glow); border: 1px solid var(--border-active); border-radius: var(--radius-md); padding: 1.2rem; margin-bottom: 1.25rem; position: relative; animation: fadeInUp 0.4s ease; box-shadow: var(--shadow-sm);">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--primary-light); margin-bottom: 0.35rem; display: flex; align-items: center; gap: 0.4rem;">
          💬 Consulta Inicial / Motivo del Paciente:
        </div>
        <p style="margin: 0; font-size: 0.88rem; color: var(--text-primary); font-style: italic; line-height: 1.45;">
          "${currentCase.description}"
        </p>
        <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.6rem; font-weight: 500; border-top: 1px dashed var(--border); padding-top: 0.4rem;">
          💡 Escribí en el cuadro de abajo lo que quieras preguntarle al paciente (ej: <em>"motivo de consulta"</em>, <em>"antecedentes familiares"</em>, <em>"inicio de síntomas"</em>) o solicita un estudio (ej: <em>"hemograma"</em>).
        </div>
      </div>`
    : "";

  container.innerHTML = welcomeHTML + `
    <div class="free-query-bar">
      <div class="free-query-header">
        <span class="free-query-badge">🔍 Modo libre</span>
        <span class="free-query-hint">Describí consulta o estudio que querés preguntar o solicitar</span>
      </div>
      <form id="free-query-form" class="free-query-form">
        <input
          type="text"
          id="free-query-input"
          class="free-query-input"
          placeholder="Escribí aquí tu consulta... ej: 'Motivo de consulta'"
          autocomplete="off"
          spellcheck="false"
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

window.autocompleteQueryInput = function(label) {
  const input = document.getElementById("free-query-input");
  if (input) {
    input.value = label;
    input.focus();
  }
};

async function handleFreeQuery() {
  if (!currentCase) {
    showToast("⚠️ Primero seleccioná un caso clínico", "warning");
    return;
  }

  session = syncSession();
  const caseId = currentCase.id;
  const currentTokens = await getStudentTokens(session, caseId);
  if (currentTokens <= 0) {
    showToast("❌ Sin tokens disponibles", "error");
    return;
  }

  const text = document.getElementById("free-query-input").value.trim();
  if (!text) return;

  const parsed = parseNaturalQuery(text);
  const resultDiv = document.getElementById("free-query-result");

  if (parsed.confidence === "none" || !parsed.type) {
    // Registrar consulta fallida en Supabase sin costo de tokens (0 tokens)
    logFailedQuery(caseId, text);

    resultDiv.innerHTML = `
      <div class="free-parse-card error">
        <div class="parse-card-title">⚠️ No pude interpretar tu consulta</div>
        <div class="parse-card-body">
          <p>Intentá mencionar el tipo de estudio que querés (hacé clic para autocompletar):</p>
          <div class="parse-hints">
            ${STUDY_TYPES.map(t => `<span class="parse-hint-tag clickable-hint" onclick="autocompleteQueryInput('${t.label}')">${t.icon} ${t.label}</span>`).join("")}
          </div>
          <p style="margin-top:0.75rem;font-size:0.8rem;">Ejemplo: <em>"Quiero pedir un Western Blot de BTK"</em> o <em>"Necesito un hemograma"</em></p>
        </div>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;">⚡ No se consumió ningún token.</p>
      </div>`;
    pendingFreeQuery = null;
    return;
  }

  // Verificar si necesita aclaración/follow-up
  const needsTarget = !parsed.type.fixed &&
    parsed.type.id !== "info-paciente" &&
    parsed.type.id !== "antecedentes" &&
    (!parsed.target || isGenericTarget(parsed.type.id, parsed.target));
  const needsSubtype = parsed.type.hasSub && !parsed.subtype;

  if (needsTarget || needsSubtype) {
    showFreeQueryFollowup(parsed);
    return;
  }

  const targetDisplay = parsed.type.fixed
    ? parsed.type.fixedTarget
    : (parsed.target || "");

  const targets = splitTargets(parsed.type.id, targetDisplay);
  const cost = targets.length;
  if (currentTokens < cost) {
    resultDiv.innerHTML = `
      <div class="free-parse-card error">
        <div class="parse-card-title">❌ Tokens insuficientes</div>
        <div class="parse-card-body">
          <p>Esta consulta requiere <strong>${cost} tokens</strong> (uno por cada analito: ${targets.join(", ")}), pero solo te quedan <strong>${currentTokens} tokens</strong> para este caso.</p>
        </div>
        <p style="font-size:0.78rem;color:var(--text-muted);margin-top:0.5rem;">⚡ No se consumió ningún token.</p>
      </div>`;
    pendingFreeQuery = null;
    return;
  }

  pendingFreeQuery = {
    type: parsed.type,
    subtype: parsed.subtype,
    target: targetDisplay,
    rawQuery: text,
    secondaryTypes: parsed.secondaryTypes
  };
  showConfirmationCardFromPending();
}

function showFreeQueryFollowup(parsed) {
  const resultDiv = document.getElementById("free-query-result");
  pendingFreeQuery = { type: parsed.type, subtype: parsed.subtype, target: "", secondaryTypes: parsed.secondaryTypes };

  const type = parsed.type;
  let questionText = "";
  let formFieldsHTML = "";

  if (type.id === "funcional" && !parsed.subtype) {
    questionText = `Identificamos que querés solicitar un <strong>${type.label}</strong>. ¿Qué tipo de ensayo y qué estímulo o target deseás realizar?`;

    const subOptions = type.subtypes.map(s => `<option value="${s.id}" data-placeholder="${s.placeholder}">${s.label}</option>`).join("");
    formFieldsHTML = `
      <div class="input-group" style="margin-bottom: 0.75rem;">
        <label for="followup-subtype" style="display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.3rem;">Tipo de ensayo</label>
        <select id="followup-subtype" class="study-select" style="width:100%;">
          ${subOptions}
        </select>
      </div>
      <div class="input-group" style="margin-bottom: 0.75rem;">
        <label for="followup-target" style="display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.3rem;">Estímulo / Target</label>
        <input type="text" id="followup-target" class="free-query-input" style="width:100%;" placeholder="${type.subtypes[0].placeholder}" autocomplete="off" spellcheck="false">
      </div>
    `;
  } else {
    const label = type.label;
    const subtype = parsed.subtype;
    const subtypeDisplay = subtype ? ` (${subtype.label})` : "";

    if (type.id === "western-blot") {
      questionText = `Identificamos que querés solicitar un <strong>Western Blot</strong>. ¿Para qué gen o proteína querés realizarlo?`;
    } else if (type.id === "elisa") {
      questionText = `Identificamos que querés solicitar un <strong>ELISA / Dosaje</strong>. ¿Para qué inmunoglobulina, citoquina o analito querés realizarlo?`;
    } else if (type.id === "pcr") {
      questionText = `Identificamos que querés solicitar un estudio de <strong>Sanger / PCR / RT-PCR</strong>. ¿Para qué gen o transcripto querés realizarlo?`;
    } else if (type.id === "citometria") {
      questionText = `Identificamos que querés solicitar una <strong>Citometría de Flujo</strong>. ¿Para qué marcador o subpoblación celular querés realizarla?`;
    } else if (type.id === "interconsulta") {
      questionText = `Identificamos que querés solicitar una <strong>Interconsulta Médica</strong>. ¿Con qué especialidad (ej: Dermatología, Neurología, Neumonología) deseás realizarla?`;
    } else if (type.id === "autoanticuerpos") {
      questionText = `Identificamos que querés medir <strong>Anticuerpos de Autoinmunidad</strong>. ¿Qué anticuerpo específico querés dosar?`;
    } else if (type.id === "vacuna") {
      questionText = `Identificamos que querés solicitar un estudio de <strong>Respuesta a Vacunas</strong>. ¿Para qué antígeno vacunal (ej: Tétanos, Neumococo) querés realizarlo?`;
    } else if (type.id === "segregacion") {
      questionText = `Identificamos que querés solicitar un estudio de <strong>Segregación Familiar</strong>. ¿Para qué gen querés realizarlo?`;
    } else if (type.id === "funcional" && subtype) {
      if (subtype.id === "proliferacion") {
        questionText = `Identificamos: <strong>Ensayo Funcional › Proliferación celular</strong>. ¿Con qué estímulo/mitógeno?`;
      } else if (subtype.id === "citotoxicidad") {
        questionText = `Identificamos: <strong>Ensayo Funcional › Citotoxicidad</strong>. ¿Para qué células o diana?`;
      } else if (subtype.id === "citoquinas") {
        questionText = `Identificamos: <strong>Ensayo Funcional › Producción de citoquinas</strong>. ¿Qué citoquina querés medir?`;
      } else if (subtype.id === "degranulacion") {
        questionText = `Identificamos: <strong>Ensayo Funcional › Degranulación</strong>. ¿Con qué estímulo o marcador?`;
      } else if (subtype.id === "via-interferon") {
        questionText = `Identificamos: <strong>Ensayo Funcional › Vía del Interferón</strong>. ¿Para qué gen específico?`;
      }
    } else {
      questionText = `Identificamos que querés solicitar un estudio de <strong>${label}${subtypeDisplay}</strong>. ¿Para qué target o analito específico querés realizarlo?`;
    }

    const placeholder = subtype ? subtype.placeholder : (type.placeholder || "Ej: BTK...");
    formFieldsHTML = `
      <div class="input-group" style="margin-bottom: 0.75rem;">
        <label for="followup-target" style="display:block;font-size:0.8rem;color:var(--text-secondary);margin-bottom:0.3rem;">Especificación de la consulta</label>
        <input type="text" id="followup-target" class="free-query-input" style="width:100%;" placeholder="${placeholder}" autocomplete="off" spellcheck="false">
      </div>
    `;
  }

  const secWarning = (parsed.secondaryTypes && parsed.secondaryTypes.length > 0)
    ? `<p style="font-size:0.75rem;color:#f59e0b;margin-top:0.5rem;font-weight:600;">⚠️ También detectamos una consulta para '${parsed.secondaryTypes[0].label}'. Podés solicitarla después de confirmar esta.</p>`
    : "";

  resultDiv.innerHTML = `
    <div class="free-parse-card followup">
      <div class="parse-card-title">🔍 Consulta incompleta</div>
      <div class="parse-card-body">
        <p style="margin-bottom: 0.75rem; font-size: 0.85rem; line-height: 1.4; color: var(--text-primary);">${questionText}</p>
        <form id="followup-form">
          ${formFieldsHTML}
          <div class="parse-actions" style="margin-top: 1rem;">
            <button type="submit" class="btn-parse-continue">Continuar →</button>
            <button type="button" class="btn-parse-cancel" id="btn-cancel-followup">✗ Cancelar</button>
          </div>
        </form>
      </div>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.5rem;">⚡ No se consume ningún token en esta etapa.</p>
      ${secWarning}
    </div>
  `;

  const subSelect = document.getElementById("followup-subtype");
  if (subSelect) {
    subSelect.addEventListener("change", () => {
      const selected = subSelect.options[subSelect.selectedIndex];
      const targetInput = document.getElementById("followup-target");
      if (targetInput && selected.dataset.placeholder) {
        targetInput.placeholder = selected.dataset.placeholder;
      }
    });
  }

  document.getElementById("followup-form").addEventListener("submit", (e) => {
    e.preventDefault();
    let targetVal = document.getElementById("followup-target")?.value.trim();
    
    const selectEl = document.getElementById("followup-subtype");
    if (selectEl) {
      const subId = selectEl.value;
      const subtypeObj = type.subtypes.find(s => s.id === subId);
      pendingFreeQuery.subtype = subtypeObj;
    }

    if (!targetVal && !type.fixed) {
      showToast("⚠️ Por favor ingresá una especificación", "warning");
      return;
    }

    pendingFreeQuery.target = targetVal;
    showConfirmationCardFromPending();
  });

  document.getElementById("btn-cancel-followup").addEventListener("click", () => {
    cancelFreeQuery();
  });
}

function showConfirmationCardFromPending() {
  if (!pendingFreeQuery) return;
  const { type, subtype, target, rawQuery } = pendingFreeQuery;
  const resultDiv = document.getElementById("free-query-result");

  const subtypeDisplay = subtype ? ` › ${subtype.label}` : "";
  const hasTarget = !type.fixed && target;

  const targets = splitTargets(type.id, target);
  const cost = targets.length;

  const secWarning = (pendingFreeQuery.secondaryTypes && pendingFreeQuery.secondaryTypes.length > 0)
    ? `<p style="font-size:0.75rem;color:#f59e0b;margin-top:0.5rem;font-weight:600;">⚠️ También detectamos una consulta para '${pendingFreeQuery.secondaryTypes[0].label}'. Podés solicitarla después de confirmar esta.</p>`
    : "";

  resultDiv.innerHTML = `
    <div class="free-parse-card confirm">
      <div class="parse-card-title">🎯 Interpretación de tu consulta</div>
      <div class="parse-card-body">
        <div class="parse-row">
          <span class="parse-label">Tipo de estudio:</span>
          <span class="parse-value">${type.icon} ${type.label}${subtypeDisplay}</span>
        </div>
        ${hasTarget ? `<div class="parse-row">
          <span class="parse-label">Consulta específica:</span>
          <span class="parse-value parse-target">${target}</span>
        </div>` : ""}
      </div>
      <div class="parse-actions">
        <button class="btn-parse-confirm" id="btn-confirm-query">✓ Confirmar y solicitar <span style="font-size:0.75rem;opacity:0.7">−${cost} token${cost > 1 ? 's' : ''}</span></button>
        <button class="btn-parse-cancel" id="btn-cancel-query">✗ Cancelar</button>
      </div>
      ${secWarning}
    </div>`;

  document.getElementById("btn-confirm-query").addEventListener("click", () => confirmFreeQuery());
  document.getElementById("btn-cancel-query").addEventListener("click", () => cancelFreeQuery());
}

async function confirmFreeQuery() {
  if (!pendingFreeQuery) return;
  const { type, subtype, target, rawQuery } = pendingFreeQuery;
  pendingFreeQuery = null;

  document.getElementById("free-query-result").innerHTML = "";
  document.getElementById("free-query-input").value = "";

  await submitStudyDirect(type, subtype, target, rawQuery);
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

async function submitStudyGuided(type) {
  if (!currentCase) { showToast("⚠️ Seleccioná un caso primero", "warning"); return; }
  session = syncSession();
  const caseId = currentCase.id;
  const currentTokens = await getStudentTokens(session, caseId);
  if (currentTokens <= 0) { showToast("❌ Sin tokens disponibles", "error"); return; }

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

  await submitStudyDirect(type, subtype, target);

  if (!type.fixed) {
    const inp = document.getElementById(`target-${type.id}`);
    if (inp) inp.value = "";
  }
}

// ──────────────────────────────────────────────
// LÓGICA CENTRAL DE SOLICITUD
// ──────────────────────────────────────────────

function splitTargets(typeId, targetText) {
  if (!targetText) return [];
  const type = STUDY_TYPES.find(t => t.id === typeId);
  if (type && type.fixed) return [targetText];
  
  // Reemplazar conjunciones y separar por comas
  let cleaned = targetText.replace(/\b(y|e|o)\b/gi, ",");
  let rawParts = cleaned.split(",");
  return rawParts
    .map(p => p.trim())
    .filter(p => p.length > 0);
}

async function submitStudyDirect(type, subtype, target, rawQuery = "") {
  const targets = splitTargets(type.id, target);
  if (targets.length === 0) {
    showToast("⚠️ Target no válido", "warning");
    return;
  }
  
  session = syncSession();
  const caseId = currentCase.id;
  const currentTokens = await getStudentTokens(session, caseId);
  const cost = targets.length;
  
  if (currentTokens < cost) {
    showToast(`❌ No tenés suficientes tokens para estas ${cost} consultas (te quedan ${currentTokens} tokens)`, "error");
    return;
  }
  
  showProcessing(type, subtype, targets.join(", "), async () => {
    let finalTokensLeft = currentTokens;
    let anyFound = false;
    
    for (const tgt of targets) {
      const result = findResult(currentCase, type.id, subtype?.id, tgt);
      const resultFound = result !== null;
      if (resultFound) anyFound = true;
      const resultText = result || buildNotFoundText(type, subtype, tgt);
      
      const response = await consumeToken(
        session.name, currentCase.id,
        type.label + (subtype ? ` › ${subtype.label}` : ""),
        tgt, resultFound, resultText, type.id, subtype?.id,
        rawQuery
      );
      
      if (response && response.success) {
        finalTokensLeft = response.tokensLeft;
      }
      
      addToHistory(type, subtype, tgt, resultText, resultFound, finalTokensLeft);
    }
    
    await updateTokenBadge();
    
    if (anyFound) {
      renderCaseInfoBanner(currentCase);
    }
    
    if (finalTokensLeft === 0) {
      showToast("⚠️ Usaste tu último token", "warning");
    }
  });
}

/**
 * Búsqueda flexible de resultado.
 * Claves: "tipo::target" o "tipo::subtipo::target"
 */
function findResult(c, typeId, subtypeId, target) {
  const nTarget = normalize(target);

  // Caso especial: autoinmunidad unificada
  if (typeId === "autoanticuerpos") {
    const autoKeys = Object.keys(c.results).filter(k => k.startsWith("autoanticuerpos::"));
    if (autoKeys.length > 0) {
      return autoKeys.map(k => c.results[k]).join("\n\n");
    }
    return null;
  }

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
    if (nTarget && (kvTarget.includes(nTarget) || nTarget.includes(kvTarget))) return value;
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

  if (queryMode !== "guided") {
    renderFreeQueryBar();
  }

  // Scroll al resultado
  setTimeout(() => {
    const firstCard = document.querySelector(".result-card");
    if (firstCard) firstCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, 100);
}

function renderHistory() {
  const container = document.getElementById("history-list");
  const emptyMsg = document.getElementById("history-empty");
  
  // Filtrar el historial por el caso actual
  const caseHistory = queryHistory.filter(item => item.caseId === currentCase?.id);
  
  if (caseHistory.length === 0) {
    container.innerHTML = "";
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  container.innerHTML = "";

  caseHistory.forEach((item, i) => {
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
        <span class="result-case">${examCases.find(c => c.id === item.caseId)?.name || currentCase?.name || ""}</span>
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
