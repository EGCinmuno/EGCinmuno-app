/**
 * EGCinmuno-App — Data Store v2.1
 */

const ADMIN_PASSWORD = "egcinmuno2026";
const TOKENS_PER_STUDENT = 10;

// ──────────────────────────────────────────────
// TIPOS DE ESTUDIO
// ──────────────────────────────────────────────

const STUDY_TYPES = [
  {
    id: "info-paciente",
    label: "Información del Paciente",
    icon: "🧑‍⚕️",
    color: "#64748b",
    description: "Datos generales, edad, género, inicio de síntomas",
    placeholder: "Ej: edad y género, inicio de síntomas, historia clínica...",
    keywords: ["informacion", "información", "paciente", "edad", "genero", "género", "sexo", "datos", "ficha", "inicio", "sintoma", "síntoma", "comienzo", "cuando", "cuándo", "historia clinica", "hc", "motivo", "consulta", "infeccion", "infecciones"]
  },
  {
    id: "antecedentes",
    label: "Antecedentes Familiares",
    icon: "👨‍👩‍👧‍👦",
    color: "#ec4899",
    description: "Historia familiar: parentales, hermanos o abuelos/tíos",
    placeholder: "Ej: abuelos/tíos, parentales, hermanos/hermanas...",
    keywords: ["antecedente", "familiar", "familia", "historia", "anamnesis", "hereditario", "hereditaria", "padres", "parentales", "hermano", "hermana", "siblings", "abuelo", "abuela", "abuelos", "tío", "tía", "tio", "tia", "tíos", "tias", "tios"]
  },
  {
    id: "western-blot",
    label: "Western Blot",
    icon: "🧬",
    color: "#6366f1",
    placeholder: "Ej: BTK, p53, WASp, STAT1, JAK3...",
    description: "Detección de proteína específica por electroforesis e inmunotransferencia",
    keywords: ["western", "blot", "wb", "inmunotransferencia", "proteina", "proteína", "proteinas", "proteínas", "banda", "bandas"]
  },
  {
    id: "hemograma",
    label: "Hemograma",
    icon: "🩸",
    color: "#ef4444",
    description: "Análisis cuantitativo de células sanguíneas",
    fixed: true,
    fixedTarget: "completo",
    keywords: ["hemograma", "sangre", "cbc", "hematologia", "hematología", "formula", "fórmula", "leucocitos", "eritrocitos", "plaquetas"]
  },
  {
    id: "citometria",
    label: "Citometría de Flujo",
    icon: "⚗️",
    color: "#8b5cf6",
    placeholder: "Ej: CD19 B cells, CD4 T cells, CD5 CD19...",
    description: "Análisis de subpoblaciones leucocitarias por marcadores de superficie",
    keywords: ["citometria", "citometría", "citometrias", "flow", "facs", "cd4", "cd8", "cd19", "cd3", "subpoblacion", "subpoblación", "subpoblaciones", "marcador", "marcadores", "fenotipo", "fenotipos"],
    indicators: ["citometria", "citometría", "citometrias", "flow", "facs", "subpoblacion", "subpoblación", "subpoblaciones", "marcador", "marcadores", "fenotipo", "fenotipos"]
  },
  {
    id: "elisa",
    label: "ELISA / Dosaje",
    icon: "🔬",
    color: "#10b981",
    placeholder: "Ej: IgG, IgM, IgA, IgE, IL-6, TNF-α...",
    description: "Cuantificación de inmunoglobulinas, citoquinas y proteínas séricas",
    keywords: ["elisa", "dosaje", "dosajes", "dosage", "inmunoglobulina", "inmunoglobulinas", "IgG", "IgM", "IgA", "IgE", "IgD", "igg", "igm", "iga", "ige", "igd", "inmuno", "serico", "sérico", "cuantificacion", "cuantificación"],
    indicators: ["elisa", "dosaje", "dosajes", "dosage", "inmunoglobulina", "inmunoglobulinas", "anticuerpo", "anticuerpos", "inmuno", "serico", "sérico", "cuantificacion", "cuantificación"]
  },
  {
    id: "pcr",
    label: "Sanger / PCR / RT-PCR",
    icon: "🧪",
    color: "#f59e0b",
    placeholder: "Ej: BTK mRNA, WAS mRNA, JAK3...",
    description: "Detección y cuantificación de transcriptos génicos",
    keywords: ["sanger", "Sanger", "pcr", "rtpcr", "rt-pcr", "mrna", "transcripto", "transcriptos", "amplificacion", "amplificación", "gen", "genes", "expresion", "expresión"]
  },
  {
    id: "interconsulta",
    label: "Interconsulta Médica",
    icon: "🧑‍⚕️💬",
    color: "#eeca8c",
    placeholder: "Ej: Dermatología, Neurología, Gastroenterología, Cardiología...",
    description: "Consulta médica o derivación a otras especialidades",
    keywords: ["interconsulta", "interconsultas", "consulta", "consultas", "especialista", "especialistas", "derivacion", "derivación", "especialidad", "neurologia", "neurología", "neuro", "convulsion", "musculo", "músculo", "gastrointestinal", "gastroenterologia", "gastroenterología", "gastro", "intestin", "diarrea", "estomago", "estómago", "dermatologia", "dermatología", "dermato", "piel", "eccema", "dermatitis", "cardiologia", "cardiología", "cardio", "corazon", "corazón", "soplo", "neumonologia", "neumonología", "hematologia", "hematología", "infectologia", "infectología"],
    indicators: ["interconsulta", "interconsultas", "consulta", "consultas", "especialista", "especialistas", "derivacion", "derivación", "pedir", "solicitar", "evaluacion", "evaluación"]
  },
  {
    id: "autoanticuerpos",
    label: "Anticuerpos de Autoinmunidad",
    icon: "🛡️",
    color: "#fb7185",
    placeholder: "Ej: ANA, anti-DNA, ANCA, anti-Sm...",
    description: "Detección de anticuerpos asociados a patologías autoinmunes",
    keywords: ["autoanticuerpo", "autoanticuerpos", "autoinmune", "autoinmunidad", "ana", "fan", "anti-dna", "antidna", "anca", "anti-sm", "antism", "anti-ro", "anti-la", "lupus", "artritis", "factor reumatoideo"],
    indicators: ["autoanticuerpo", "autoanticuerpos", "autoinmune", "autoinmunidad", "deteccion", "detección", "presencia"]
  },
  {
    id: "vacuna",
    label: "Respuesta a Vacunas",
    icon: "💉",
    color: "#06b6d4",
    placeholder: "Ej: Tétanos, Neumococo, Hepatitis B, Difteria...",
    description: "Títulos de anticuerpos pre/post vacunación y evaluación de respuesta protectora",
    keywords: ["vacuna", "vacunas", "vacunacion", "vacunación", "vacunaciones", "titulo", "título", "titulos", "títulos", "inmunizacion", "inmunización", "tetanos", "tétanos", "neumococo", "hepatitis", "difteria"],
    indicators: ["vacuna", "vacunas", "vacunacion", "vacunación", "vacunaciones", "titulo", "título", "titulos", "títulos", "inmunizacion", "inmunización"]
  },
  {
    id: "segregacion",
    label: "Segregación Familiar",
    icon: "🌳",
    color: "#84cc16",
    placeholder: "Ej: BTK, WAS, RAG1, DOCK8...",
    description: "Análisis de segregación del gen en los miembros de la familia (portadores/afectados)",
    keywords: ["segregacion", "segregación", "arbol", "árbol", "genealogico", "genealógico", "portador", "portadora", "herencia", "ligado"]
  },
  {
    id: "funcional",
    label: "Ensayo Funcional",
    icon: "🔭",
    color: "#f97316",
    placeholder: "Ej: anti-CD3, PHA, PMA/ionomicina, NK...",
    description: "Proliferación, citotoxicidad, citoquinas, degranulación, vía del interferón",
    hasSub: true,
    subtypes: [
      {
        id: "proliferacion",
        label: "Proliferación celular",
        placeholder: "Ej: PHA, anti-CD3, PWM, PMA+ionomicina",
        keywords: ["proliferacion", "proliferación", "proliferar", "pha", "timidina", "ki67", "cfse", "division", "división"],
        indicators: ["proliferacion", "proliferación", "proliferar", "timidina", "ki67", "cfse", "division", "división"]
      },
      {
        id: "citotoxicidad",
        label: "Citotoxicidad",
        placeholder: "Ej: NK, CTL, célula diana K562",
        keywords: ["citotoxicidad", "citotóxico", "citotoxica", "nk", "ctl", "lisis", "killing"],
        indicators: ["citotoxicidad", "citotóxico", "citotoxica", "lisis", "killing"]
      },
      {
        id: "citoquinas",
        label: "Producción de citoquinas",
        placeholder: "Ej: IL-2, IFN-γ, TNF-α, IL-10...",
        keywords: ["citoquina", "citocina", "citokina", "il-2", "il2", "ifn", "interferon", "interferón", "tnf", "interleucina"],
        indicators: ["citoquina", "citocina", "citokina", "interleucina"]
      },
      {
        id: "degranulacion",
        label: "Degranulación",
        placeholder: "Ej: CD107a (NK), perforina, granzima",
        keywords: ["degranulacion", "degranulación", "cd107", "perforina", "granzima", "granzyme"],
        indicators: ["degranulacion", "degranulación", "perforina", "granzima", "granzyme"]
      },
      {
        id: "via-interferon",
        label: "Vía del Interferón (gen específico)",
        placeholder: "Ej: STAT1, IRF3, IRF7, MX1, IFNAR1...",
        keywords: ["via interferon", "vía interferón", "signaling", "señalizacion", "stat1", "irf3", "irf7", "mx1", "ifnar", "sting", "jak1", "tyk2"],
        indicators: ["via interferon", "vía interferón", "signaling", "señalizacion"]
      }
    ],
    keywords: ["funcional", "ensayo", "proliferacion", "proliferación", "citotoxicidad", "citoquina", "citocina", "degranulacion", "degranulación", "interferon", "interferón", "via del interferon"]
  },
  {
    id: "ecografia",
    label: "Ecografía Abdominal",
    icon: "🩻",
    color: "#14b8a6",
    description: "Evaluación ecográfica de órganos abdominales (bazo, hígado, etc.)",
    fixed: true,
    fixedTarget: "completa",
    keywords: ["ecografia", "ecografía", "ultrasonido", "bazo", "esplenomegalia", "higado", "hígado", "hepatomegalia", "abdominal", "ecografía abdominal", "ecografia abdominal"]
  },
  {
    id: "tomografia",
    label: "Tomografía Computada",
    icon: "🌀",
    color: "#06b6d4",
    description: "Tomografía computada de alta resolución (tórax, abdomen, etc.)",
    fixed: true,
    fixedTarget: "de tórax",
    keywords: ["tomografia", "tomografía", "tc", "tac", "tcar", "hrct", "tomografía computada", "tomografia de torax", "tomografia de tórax", "glild", "pulmon", "pulmón", "pulmonar"]
  }
];

// ──────────────────────────────────────────────
// DATOS POR DEFECTO
// ──────────────────────────────────────────────

const DEFAULT_DATA = {
  settings: {
    // 'both' | 'free' | 'guided'
    queryMode: "free"
  },

  students: [
    { name: "Ana García", email: "ana.garcia@ejemplo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Carlos X", email: "carlos.lopez@ejemplo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "María Fernández", email: "maria.fernandez@ejemplo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Estudiante Demo", email: "demo@demo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Jonathan Zaiat", email: "jzaiat@gmail.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Belen Almejun", email: "mbalmejun@gmail.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Ana Laura Lopez", email: "analopez@gmail.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Nico Di Biasi", email: "dibiasinicolasar@gmail.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
  ],

  cases: window.EGC_CASES || []
};

// ──────────────────────────────────────────────
// FUNCIONES DE ACCESO A DATOS
// ──────────────────────────────────────────────

function initData() {
  if (!localStorage.getItem("egc_data")) {
    localStorage.setItem("egc_data", JSON.stringify(DEFAULT_DATA));
  } else {
    // Migrar y sincronizar datos existentes
    const data = getData();
    if (!data.settings) data.settings = {};
    data.settings.queryMode = DEFAULT_DATA.settings.queryMode;

    // Sincronizar estudiantes predefinidos desde DEFAULT_DATA (agregar nuevos o actualizar emails)
    DEFAULT_DATA.students.forEach(defaultStudent => {
      const idx = data.students.findIndex(s =>
        normalize(s.name) === normalize(defaultStudent.name) ||
        (s.email && defaultStudent.email && normalize(s.email) === normalize(defaultStudent.email))
      );
      if (idx === -1) {
        data.students.push(JSON.parse(JSON.stringify(defaultStudent)));
      } else {
        data.students[idx].email = defaultStudent.email;
      }
    });

    // Sincronizar casos predefinidos desde DEFAULT_DATA (actualizar textos modificados en data.js)
    DEFAULT_DATA.cases.forEach(defaultCase => {
      const idx = data.cases.findIndex(c => c.id === defaultCase.id);
      if (idx === -1) {
        data.cases.push(JSON.parse(JSON.stringify(defaultCase)));
      } else {
        // Actualizar datos del caso para que coincidan con data.js
        data.cases[idx].name = defaultCase.name;
        data.cases[idx].description = defaultCase.description;
        data.cases[idx].patient = JSON.parse(JSON.stringify(defaultCase.patient));

        if (!data.cases[idx].results) data.cases[idx].results = {};
        // Sobrescribir/agregar resultados definidos en data.js
        Object.keys(defaultCase.results).forEach(key => {
          data.cases[idx].results[key] = defaultCase.results[key];
        });
        // Eliminar resultados que ya no están en data.js para este caso por defecto
        Object.keys(data.cases[idx].results).forEach(key => {
          if (!(key in defaultCase.results)) {
            delete data.cases[idx].results[key];
          }
        });
      }
    });

    data.cases.forEach(c => {
      if (!c.status) c.status = "published";
      if (!c.patient) c.patient = { age: "—", gender: "—", symptomOnset: "—" };
    });
    saveData(data);
  }
}

function getData() {
  return JSON.parse(localStorage.getItem("egc_data")) || DEFAULT_DATA;
}

function saveData(data) {
  localStorage.setItem("egc_data", JSON.stringify(data));
}

function resetData() {
  localStorage.setItem("egc_data", JSON.stringify(DEFAULT_DATA));
}

function normalize(str) {
  return String(str).trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// ──────────────────────────────────────────────
// PARSER DE TEXTO LIBRE
// ──────────────────────────────────────────────

function parseNaturalQuery(text) {
  const normalized = normalize(text);
  let detectedType = null;
  let detectedSubtype = null;
  let typeScore = 0;

  // Evitar colisión entre "segregación familiar" y "antecedentes familiares"
  if (normalized.includes("segregac") || normalized.includes("genetic")) {
    detectedType = STUDY_TYPES.find(t => t.id === "segregacion");
    typeScore = 100;
  }

  for (const type of STUDY_TYPES) {
    let score = 0;
    for (const kw of type.keywords) {
      if (normalized.includes(normalize(kw))) score++;
    }
    if (score > typeScore) {
      typeScore = score;
      detectedType = type;
      detectedSubtype = null;
    }
    if (type.hasSub && score > 0) {
      for (const sub of type.subtypes) {
        for (const kw of sub.keywords) {
          if (normalized.includes(normalize(kw))) {
            detectedSubtype = sub;
            break;
          }
        }
        if (detectedSubtype) break;
      }
    }
  }

  if (!detectedType) return { type: null, subtype: null, target: "", confidence: "none" };

  let target = "";

  if (detectedType.id === "info-paciente") {
    // Para info-paciente, mapeamos directamente la intención basada en las palabras clave
    if (normalized.includes("inicio") || normalized.includes("sintoma") || normalized.includes("comienzo")) {
      target = "inicio de síntomas";
    } else if (normalized.includes("motivo") || normalized.includes("consulta")) {
      target = "motivo de consulta";
    } else if (normalized.includes("infeccion")) {
      target = "infecciones";
    } else if (normalized.includes("edad") || normalized.includes("genero") || normalized.includes("sexo") || normalized.includes("años")) {
      target = "edad y género";
    } else {
      target = "general";
    }
  } else if (detectedType.id === "antecedentes") {
    // Mapeo directo para antecedentes familiares
    if (normalized.includes("padre") || normalized.includes("madre") || normalized.includes("parental") || normalized.includes("consanguin")) {
      target = "parentales";
    } else if (normalized.includes("herman") || normalized.includes("sibling")) {
      target = "hermanos";
    } else {
      target = "abuelos/tíos";
    }
  } else if (detectedType.id === "interconsulta") {
    // Mapeo directo para especialidades comunes de interconsulta
    if (normalized.includes("dermato") || normalized.includes("piel") || normalized.includes("eccema") || normalized.includes("dermatitis")) {
      target = "Dermatología";
    } else if (normalized.includes("neuro") || normalized.includes("convulsion") || normalized.includes("convulsión") || normalized.includes("sindrómico") || normalized.includes("sindromico") || normalized.includes("retraso motor") || normalized.includes("retraso desarrollo") || normalized.includes("retraso") || normalized.includes("musculo") || normalized.includes("músculo")) {
      target = "Neurología";
    } else if (normalized.includes("gastro") || normalized.includes("intestin") || normalized.includes("diarrea") || normalized.includes("estomago") || normalized.includes("estómago")) {
      target = "Gastrointestinal";
    } else if (normalized.includes("cardio") || normalized.includes("corazon") || normalized.includes("corazón") || normalized.includes("soplo")) {
      target = "Cardiología";
    } else {
      // Extraer target removiendo palabras de ruido para otros estudios
      const noiseWords = [
        ...(detectedType.indicators || detectedType.keywords || []),
        ...(detectedSubtype?.indicators || detectedSubtype?.keywords || []),
        "quiero", "necesito", "solicito", "pedir", "pido", "ver", "hacer", "dame",
        "mostrame", "obtener", "traeme", "un", "una", "el", "la", "los", "las", "medir", "detectar",
        "de", "del", "para", "por", "resultado", "estudio", "analisis", "análisis",
        "test", "hacer", "realizar", "pedir", "del", "gen", "proteina", "proteína"
      ];

      const textWords = text.split(/\s+/);
      const filteredWords = textWords.filter(w => {
        const nw = normalize(w);
        return nw.length > 1 && !noiseWords.some(nois => normalize(nois) === nw || nw === normalize(nois));
      });
      target = filteredWords.join(" ").trim();
    }
  } else {
    // Extraer target removiendo palabras de ruido para otros estudios
    const noiseWords = [
      ...(detectedType.indicators || detectedType.keywords || []),
      ...(detectedSubtype?.indicators || detectedSubtype?.keywords || []),
      "quiero", "necesito", "solicito", "pedir", "pido", "ver", "hacer", "dame",
      "mostrame", "obtener", "traeme", "un", "una", "el", "la", "los", "las",
      "de", "del", "para", "por", "resultado", "estudio", "analisis", "análisis",
      "test", "hacer", "realizar", "pedir", "del", "gen", "proteina", "proteína"
    ];

    const textWords = text.split(/\s+/);
    const filteredWords = textWords.filter(w => {
      const nw = normalize(w);
      return nw.length > 1 && !noiseWords.some(nois => normalize(nois) === nw || nw === normalize(nois));
    });
    target = filteredWords.join(" ").trim();
  }

  const confidence = typeScore >= 1 ? (target.length > 0 || detectedType.fixed ? "high" : "low") : "low";

  return { type: detectedType, subtype: detectedSubtype, target, confidence };
}
