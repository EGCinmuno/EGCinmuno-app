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

/**
 * Intenta iniciar sesión con nombre o email.
 * @returns {{ success: boolean, student?: object, error?: string }}
 */
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

  if (found.tokensLeft <= 0) {
    return { success: false, error: "Has agotado todos tus tokens de consulta para este examen." };
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
 * Consume un token del estudiante y actualiza localStorage + session.
 * Registra la consulta en el log del estudiante.
 * @returns {{ success: boolean, tokensLeft: number }}
 */
function consumeToken(studentName, caseId, studyType, target, resultFound) {
  const data = getData();
  const idx = data.students.findIndex(s => normalize(s.name) === normalize(studentName));

  if (idx === -1) return { success: false, tokensLeft: 0 };
  if (data.students[idx].tokensLeft <= 0) return { success: false, tokensLeft: 0 };

  data.students[idx].tokensLeft--;
  data.students[idx].log.push({
    timestamp: new Date().toISOString(),
    caseId,
    studyType,
    target,
    resultFound
  });

  saveData(data);

  // Actualizar sesión con los nuevos tokens
  const updatedStudent = data.students[idx];
  setSession(updatedStudent);

  return { success: true, tokensLeft: updatedStudent.tokensLeft };
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
