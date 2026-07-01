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

function loginStudent(input) {
  initData();
  const data = getData();
  const normalizedInput = normalize(input);

  const found = data.students.find(s =>
    normalize(s.name) === normalizedInput ||
    normalize(s.email) === normalizedInput
  );

  if (!found) {
    return { success: false, error: "Nombre o email no encontrado en la lista de participantes." };
  }

  setSession(found);
  return { success: true, student: found };
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
function getStudentTokens(student, caseId) {
  if (!student) return 0;
  if (!student.tokensPerCase) {
    student.tokensPerCase = {};
  }
  if (student.tokensPerCase[caseId] === undefined) {
    student.tokensPerCase[caseId] = TOKENS_PER_STUDENT;
  }
  return student.tokensPerCase[caseId];
}

/**
 * Consume un token del estudiante y actualiza localStorage + session.
 * Registra la consulta en el log del estudiante.
 * @returns {{ success: boolean, tokensLeft: number }}
 */
function consumeToken(studentName, caseId, studyType, target, resultFound, resultText = "", typeId = "", subtypeId = "") {
  const data = getData();
  const idx = data.students.findIndex(s => normalize(s.name) === normalize(studentName));

  if (idx === -1) return { success: false, tokensLeft: 0 };
  
  const student = data.students[idx];
  if (!student.tokensPerCase) {
    student.tokensPerCase = {};
  }
  if (student.tokensPerCase[caseId] === undefined) {
    student.tokensPerCase[caseId] = TOKENS_PER_STUDENT;
  }

  if (student.tokensPerCase[caseId] <= 0) return { success: false, tokensLeft: 0 };

  student.tokensPerCase[caseId]--;
  
  // Retrocompatibilidad con tokensLeft global
  if (student.tokensLeft > 0) {
    student.tokensLeft--;
  }

  student.log.push({
    timestamp: new Date().toISOString(),
    caseId,
    studyType,
    target,
    resultFound,
    resultText,
    typeId,
    subtypeId
  });

  saveData(data);

  // Actualizar sesión con los nuevos tokens
  setSession(student);

  return { success: true, tokensLeft: student.tokensPerCase[caseId] };
}

/**
 * Sincroniza los datos del estudiante desde localStorage a la sesión.
 */
function syncSession() {
  const session = getSession();
  if (!session) return null;
  const data = getData();
  const fresh = data.students.find(s => normalize(s.name) === normalize(session.name));
  if (fresh) {
    setSession(fresh);
    return fresh;
  }
  return session;
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
