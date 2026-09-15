/**
 * EGCinmuno-App — Autenticación
 * Maneja login, sesión del estudiante y validación de tokens.
 */

// ──────────────────────────────────────────────
// SESIÓN ACTIVA
// ──────────────────────────────────────────────

function getSession() {
  const s = sessionStorage.getItem("egc_session");
  return s ? JSON.parse(s) : null;
}

function setSession(student) {
  sessionStorage.setItem("egc_session", JSON.stringify(student));
}

function clearSession() {
  sessionStorage.removeItem("egc_session");
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return null;
  }
  return session;
}

// ──────────────────────────────────────────────
// CONFIGURACIÓN DINÁMICA DESDE SUPABASE
// ──────────────────────────────────────────────

let cachedTokensLimit = 15;
let cachedQueryMode = "both";
let cachedShowBanner = true;
let cachedBannerLogos = ["egc.png", "lasid.png", "Logo_exactas.svg"];
let cachedCasesOrder = [];

try {
  const localOrder = localStorage.getItem("egc_cases_order");
  if (localOrder) cachedCasesOrder = JSON.parse(localOrder);
} catch (e) {
  cachedCasesOrder = [];
}

function sortCasesByOrder(casesList, orderArray) {
  if (!casesList || !Array.isArray(casesList)) return [];
  const order = (orderArray && orderArray.length > 0) ? orderArray : cachedCasesOrder;
  if (!order || order.length === 0) return casesList;
  return [...casesList].sort((a, b) => {
    let idxA = order.indexOf(a.id);
    let idxB = order.indexOf(b.id);
    if (idxA === -1) idxA = 9999;
    if (idxB === -1) idxB = 9999;
    if (idxA !== idxB) return idxA - idxB;
    return (a.name || "").localeCompare(b.name || "");
  });
}

function getAgeBracket(ageStr, explicitBracket = null) {
  if (explicitBracket && explicitBracket !== "auto" && ["baby", "child", "adult"].includes(explicitBracket)) {
    return explicitBracket;
  }
  if (!ageStr) return "adult";
  const s = ageStr.toLowerCase().trim();
  
  // Detección de neonatos, lactantes, meses, semanas o días
  if (s.includes("mes") || s.includes("month") || s.includes("día") || s.includes("dia") || s.includes("day") || s.includes("semana") || s.includes("week") || s.includes("neonato") || s.includes("lactante") || s.includes("infant") || s.includes("rn") || s.includes("recién") || s.includes("recien") || s.includes("bebé") || s.includes("bebe") || s.includes("baby")) {
    const matchMonths = s.match(/(\d+(?:[.,]\d+)?)\s*(?:mes|month|m\b)/);
    if (matchMonths) {
      const months = parseFloat(matchMonths[1].replace(',', '.'));
      if (months > 24) return "child";
    }
    return "baby";
  }
  
  // Detección de años o números decimales/enteros con unidad de año (ej: "7.9 años", "7,9", "8 años", "0.6 años")
  const matchYears = s.match(/(\d+(?:[.,]\d+)?)\s*(?:año|ano|year|yr|y\.?o\.?|y\b|a\b)/);
  if (matchYears) {
    const years = parseFloat(matchYears[1].replace(',', '.'));
    if (years < 2) return "baby";
    if (years <= 12) return "child";
    return "adult";
  }
  
  // Número suelto (ej: "7.9", "0.6", "8", "24")
  const matchNum = s.match(/(\d+(?:[.,]\d+)?)/);
  if (matchNum) {
    const num = parseFloat(matchNum[1].replace(',', '.'));
    if (num < 2) return "baby";
    if (num <= 12) return "child";
    return "adult";
  }

  return "adult";
}

async function fetchSystemSettings() {
  try {
    const { data, error } = await supabaseClient
      .from('settings')
      .select('*');
    if (!error && data) {
      const tokensRow = data.find(r => r.key === 'tokens_per_student');
      const modeRow = data.find(r => r.key === 'query_mode');
      const showBannerRow = data.find(r => r.key === 'show_banner');
      const bannerLogosRow = data.find(r => r.key === 'banner_logos');
      const casesOrderRow = data.find(r => r.key === 'cases_order');

      if (tokensRow) cachedTokensLimit = parseInt(tokensRow.value, 10) || 15;
      if (modeRow) cachedQueryMode = modeRow.value || "both";
      if (showBannerRow) cachedShowBanner = showBannerRow.value !== "false";
      if (bannerLogosRow) {
        try {
          cachedBannerLogos = JSON.parse(bannerLogosRow.value);
        } catch (e) {
          cachedBannerLogos = ["egc.png", "lasid.png", "Logo_exactas.svg"];
        }
      } else {
        cachedBannerLogos = ["egc.png", "lasid.png", "Logo_exactas.svg"];
      }

      if (casesOrderRow) {
        try {
          cachedCasesOrder = JSON.parse(casesOrderRow.value);
          localStorage.setItem("egc_cases_order", casesOrderRow.value);
        } catch (e) {
          console.warn("Error parseando cases_order:", e);
        }
      }
    }
  } catch (err) {
    console.error("Error al cargar configuraciones de Supabase:", err);
  }
}

function requireAdmin() {
  const isAdmin = sessionStorage.getItem("egc_admin");
  if (!isAdmin) {
    window.location.href = "admin.html";
    return false;
  }
  return true;
}

// ──────────────────────────────────────────────
// LOGIN DE ESTUDIANTE
// ──────────────────────────────────────────────

async function loginStudent(input) {
  initData();
  const normalizedInput = normalize(input);

  try {
    const { data: dbStudents, error } = await supabaseClient
      .from('students')
      .select('*');

    if (error) {
      console.error("Error al consultar estudiantes en Supabase:", error);
      return { success: false, error: "Error de conexión con el servidor de base de datos." };
    }

    const found = dbStudents.find(s =>
      normalize(s.name) === normalizedInput ||
      (s.email && normalize(s.email) === normalizedInput)
    );

    if (!found) {
      return { success: false, error: "Nombre o email no encontrado en la lista de participantes de Supabase." };
    }

    setSession(found);
    return { success: true, student: found };
  } catch (err) {
    console.error("Excepción en loginStudent:", err);
    return { success: false, error: "Excepción al conectar con la base de datos." };
  }
}

// ──────────────────────────────────────────────
// LOGIN DE ADMINISTRADOR
// ──────────────────────────────────────────────

function loginAdmin(password) {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem("egc_admin", "true");
    return true;
  }
  return false;
}

function logoutAdmin() {
  sessionStorage.removeItem("egc_admin");
}

// ──────────────────────────────────────────────
// GESTIÓN DE TOKENS (consultas)
// ──────────────────────────────────────────────

/**
 * Obtiene los tokens restantes de un estudiante para un caso específico.
 */
async function getStudentTokens(student, caseId) {
  if (!student) return 0;
  const studentMail = student.email;

  try {
    const { data, error } = await supabaseClient
      .from('student_tokens')
      .select('tokens_left')
      .eq('student_mail', studentMail)
      .eq('case_id', caseId)
      .maybeSingle();

    if (error) {
      console.error("Error en getStudentTokens:", error);
      return student.role === 'docente' ? 999 : cachedTokensLimit;
    }

    if (data) {
      return data.tokens_left;
    }

    // Si no existe el registro, lo creamos
    const initialTokens = student.role === 'docente' ? 999 : cachedTokensLimit;
    const { error: insertError } = await supabaseClient
      .from('student_tokens')
      .insert({
        student_mail: studentMail,
        case_id: caseId,
        tokens_left: initialTokens
      });

    if (insertError) {
      console.error("Error al insertar tokens iniciales:", insertError);
    }

    return initialTokens;
  } catch (err) {
    console.error("Excepción en getStudentTokens:", err);
    return student.role === 'docente' ? 999 : cachedTokensLimit;
  }
}

/**
 * Consume un token del estudiante y actualiza Supabase + session.
 * Registra la consulta en el log de Supabase.
 * @returns {{ success: boolean, tokensLeft: number }}
 */
async function consumeToken(studentName, caseId, studyType, target, resultFound, resultText = "", typeId = "", subtypeId = "", rawQuery = "") {
  const activeSession = getSession();
  const studentMail = activeSession ? activeSession.email : "";
  const isDocente = activeSession && activeSession.role === 'docente';

  try {
    const { data: tokenData, error: tokenError } = await supabaseClient
      .from('student_tokens')
      .select('tokens_left')
      .eq('student_mail', studentMail)
      .eq('case_id', caseId)
      .maybeSingle();

    if (tokenError) {
      console.error("Error al obtener tokens para consumo:", tokenError);
      return { success: false, tokensLeft: 0 };
    }

    let tokensLeft = tokenData ? tokenData.tokens_left : (isDocente ? 999 : cachedTokensLimit);

    // Si es estudiante, validamos que tenga tokens y decrementamos
    if (!isDocente) {
      if (tokensLeft <= 0) return { success: false, tokensLeft: 0 };
      tokensLeft--;

      const { error: updateError } = await supabaseClient
        .from('student_tokens')
        .update({ tokens_left: tokensLeft })
        .eq('student_mail', studentMail)
        .eq('case_id', caseId);

      if (updateError) {
        console.error("Error al descontar token:", updateError);
        return { success: false, tokensLeft: tokensLeft + 1 };
      }
    }

    // Insertar registro en logs de Supabase
    const { error: logError } = await supabaseClient
      .from('logs')
      .insert({
        student_mail: studentMail,
        case_id: caseId,
        study_type: studyType,
        target: target,
        result_found: resultFound,
        result_text: resultText,
        type_id: typeId,
        subtype_id: subtypeId || null,
        raw_query: rawQuery,
        timestamp: new Date().toISOString()
      });

    if (logError) {
      console.error("Error al insertar log en Supabase:", logError);
    }

    // Actualizar los tokens en la sesión local por retrocompatibilidad
    if (activeSession) {
      if (!activeSession.tokensPerCase) activeSession.tokensPerCase = {};
      activeSession.tokensPerCase[caseId] = tokensLeft;
      setSession(activeSession);
    }

    return { success: true, tokensLeft };
  } catch (err) {
    console.error("Excepción en consumeToken:", err);
    return { success: false, tokensLeft: 0 };
  }
}

/**
 * Registra una consulta que no pudo ser interpretada (sin costo de tokens) para auditoría del docente.
 */
async function logFailedQuery(caseId, rawQuery) {
  const activeSession = getSession();
  if (!activeSession) return;
  const studentMail = activeSession.email;

  try {
    const { error } = await supabaseClient
      .from('logs')
      .insert({
        student_mail: studentMail,
        case_id: caseId,
        study_type: "Consulta fallida (No interpretada)",
        target: "",
        result_found: false,
        result_text: "",
        type_id: "fallido",
        subtype_id: null,
        raw_query: rawQuery,
        timestamp: new Date().toISOString()
      });

    if (error) {
      console.error("Error al insertar log fallido en Supabase:", error);
    }
  } catch (err) {
    console.error("Excepción en logFailedQuery:", err);
  }
}

/**
 * Sincroniza los datos del estudiante desde localStorage a la sesión.
 */
function syncSession() {
  return getSession();
}

// ──────────────────────────────────────────────
// GESTIÓN DE TEMA (CLARO/OSCURO)
// ──────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // Renderizar el banner de logos si corresponde en el examen
  const isExamPage = document.querySelector(".exam-layout");
  if (isExamPage) {
    await renderFooterBanner();
  }
});

async function renderFooterBanner() {
  await fetchSystemSettings();

  let banner = document.getElementById("logo-banner-footer");
  if (!banner) {
    banner = document.createElement("footer");
    banner.id = "logo-banner-footer";
    banner.className = "logo-banner";

    const examLayout = document.querySelector(".exam-layout");
    const loginPage = document.querySelector(".login-page");

    if (examLayout) {
      examLayout.appendChild(banner);
    } else if (loginPage) {
      loginPage.appendChild(banner);
    } else {
      document.body.appendChild(banner);
    }
  }

  if (!cachedShowBanner || !cachedBannerLogos || cachedBannerLogos.length === 0) {
    banner.style.display = "none";
    return;
  }

  banner.style.display = "flex";
  banner.innerHTML = cachedBannerLogos.map(logo => {
    return `<img src="images/${logo}" alt="${logo}" />`;
  }).join('');
}

