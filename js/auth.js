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

async function fetchSystemSettings() {
  try {
    const { data, error } = await supabaseClient
      .from('settings')
      .select('*');
    if (!error && data) {
      const tokensRow = data.find(r => r.key === 'tokens_per_student');
      const modeRow = data.find(r => r.key === 'query_mode');
      if (tokensRow) cachedTokensLimit = parseInt(tokensRow.value, 10) || 15;
      if (modeRow) cachedQueryMode = modeRow.value || "both";
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

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle-btn");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }
});
