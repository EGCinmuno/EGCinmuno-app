/**
 * EGCinmuno-App — Data Store v2.1
 */

const ADMIN_PASSWORD = "egcinmuno2026";
const TOKENS_PER_STUDENT = 15;

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
    keywords: [
      "informacion", "información", "paciente", "edad", "genero", "género", "sexo", "datos", "ficha", "inicio", "sintoma", "síntoma", "comienzo", "cuando", "cuándo", "historia clinica", "hc", "motivo", "consulta", "infeccion", "infecciones",
      "patient", "information", "info", "age", "gender", "sex", "symptom", "symptoms", "onset", "presentation", "chief complaint", "reason for consultation", "complaint", "clinical history", "infection", "infections"
    ]
  },
  {
    id: "antecedentes",
    label: "Antecedentes Familiares",
    icon: "👨‍👩‍👧‍👦",
    color: "#ec4899",
    description: "Historia familiar: parentales, hermanos o abuelos/tíos",
    placeholder: "Ej: abuelos/tíos, parentales, hermanos/hermanas...",
    keywords: [
      "antecedente", "familiar", "familia", "historia", "anamnesis", "hereditario", "hereditaria", "padres", "parentales", "hermano", "hermana", "siblings", "abuelo", "abuela", "abuelos", "tío", "tía", "tio", "tia", "tíos", "tias", "tios",
      "family", "history", "pedigree", "parents", "father", "mother", "brother", "sister", "siblings", "grandparents", "grandfather", "grandmother", "uncle", "aunt", "uncles", "aunts", "consanguinity", "consanguineous", "hereditary", "pedigree"
    ]
  },
  {
    id: "western-blot",
    label: "Western Blot",
    icon: "🧬",
    color: "#6366f1",
    placeholder: "Ej: BTK, p53, WASp, STAT1, JAK3...",
    description: "Detección de proteína específica por electroforesis e inmunotransferencia",
    keywords: [
      "western", "blot", "wb", "inmunotransferencia", "proteina", "proteína", "proteinas", "proteínas", "banda", "bandas",
      "immunoblot", "protein", "proteins", "band", "bands", "blotting"
    ]
  },
  {
    id: "hemograma",
    label: "Hemograma",
    icon: "🩸",
    color: "#ef4444",
    description: "Análisis cuantitativo de células sanguíneas",
    fixed: true,
    fixedTarget: "completo",
    keywords: [
      "hemograma", "sangre", "cbc", "hematologia", "hematología", "formula", "fórmula", "leucocitos", "eritrocitos", "plaquetas",
      "complete blood count", "blood count", "blood test", "white blood cells", "wbc", "rbc", "platelets", "leukocytes", "hemogram"
    ]
  },
  {
    id: "citometria",
    label: "Citometría de Flujo",
    icon: "⚗️",
    color: "#8b5cf6",
    placeholder: "Ej: CD19 B cells, CD4 T cells, CD5 CD19, NK cells...",
    description: "Análisis de subpoblaciones leucocitarias por marcadores de superficie",
    keywords: [
      "citometria", "citometría", "citometrias", "flujo", "flow", "facs",
      "cd4", "cd8", "cd19", "cd20", "cd19/cd20", "cd20/cd19", "cd16", "cd56", "cd16/cd56", "cd56/cd16", "cd16/56", "cd56/16", "cd3", "cd5", "cd27", "cd38",
      "poblacion", "población", "poblaciones", "linfocitaria", "linfocitarias", "subpoblacion", "subpoblación", "subpoblaciones", "subpoblaciones linfocitarias",
      "linfocitos b", "linfocito b", "celulas b", "linfocitos t", "linfocito t", "celulas t", "nk", "natural killer", "celulas nk", "células nk",
      "marcador", "marcadores", "fenotipo", "fenotipos",
      "flow cytometry", "cytometry", "subsets", "lymphocyte subsets", "populations", "surface markers", "markers", "phenotype", "t cells", "b cells", "nk cells"
    ],
    indicators: [
      "citometria", "citometría", "citometrias", "flujo", "flow", "facs", "subpoblacion", "subpoblación", "subpoblaciones", "marcador", "marcadores", "fenotipo", "fenotipos",
      "flow cytometry", "cytometry", "subsets", "markers"
    ]
  },
  {
    id: "elisa",
    label: "ELISA / Dosaje",
    icon: "🔬",
    color: "#10b981",
    placeholder: "Ej: IgG, IgM, IgA, IgE, IL-6, TNF-α...",
    description: "Cuantificación de inmunoglobulinas, citoquinas y proteínas séricas",
    keywords: [
      "elisa", "dosaje", "dosajes", "dosage", "inmunoglobulina", "inmunoglobulinas", "IgG", "IgM", "IgA", "IgE", "IgD", "igg", "igm", "iga", "ige", "igd", "inmuno", "serico", "sérico", "cuantificacion", "cuantificación",
      "quantification", "immunoglobulins", "antibodies", "serum", "cytokines", "titers", "levels"
    ],
    indicators: [
      "elisa", "dosaje", "dosajes", "dosage", "inmunoglobulina", "inmunoglobulinas", "anticuerpo", "anticuerpos", "inmuno", "serico", "sérico", "cuantificacion", "cuantificación",
      "quantification", "dosage", "immunoglobulins", "antibodies"
    ]
  },
  {
    id: "pcr",
    label: "Sanger / PCR / RT-PCR",
    icon: "🧪",
    color: "#f59e0b",
    placeholder: "Ej: BTK mRNA, WAS mRNA, JAK3...",
    description: "Detección y cuantificación de transcriptos génicos",
    keywords: [
      "sanger", "Sanger", "pcr", "rtpcr", "rt-pcr", "mrna", "transcripto", "transcriptos", "amplificacion", "amplificación", "gen", "genes", "expresion", "expresión",
      "sequencing", "transcript", "transcripts", "gene", "genes", "expression", "mrna expression"
    ]
  },
  {
    id: "interconsulta",
    label: "Interconsulta Médica",
    icon: "🧑‍⚕️💬",
    color: "#eeca8c",
    placeholder: "Ej: Dermatología, Neurología, Gastroenterología, Cardiología, Neumonología...",
    description: "Consulta médica o derivación a otras especialidades",
    keywords: [
      "interconsulta", "interconsultas", "consulta", "consultas", "especialista", "especialistas", "derivacion", "derivación", "especialidad", "medica", "médica", "medico", "médico", "medicos", "médicos", "neurologia", "neurología", "neuro", "convulsion", "musculo", "músculo", "gastrointestinal", "gastroenterologia", "gastroenterología", "gastro", "intestin", "diarrea", "estomago", "estómago", "dermatologia", "dermatología", "dermato", "piel", "eccema", "dermatitis", "cardiologia", "cardiología", "cardio", "corazon", "corazón", "soplo", "neumonologia", "neumonología", "neumonología", "neumo", "pulmon", "respirat", "hematologia", "hematología", "infectologia", "infectología", "infecto",
      "consultation", "referral", "specialist", "specialty", "dermatology", "neurology", "gastroenterology", "cardiology", "pulmonology", "infectious", "skin", "eczema", "seizures", "heart", "lungs", "diarrhea"
    ],
    indicators: [
      "interconsulta", "interconsultas", "consulta", "consultas", "especialista", "especialistas", "derivacion", "derivación", "pedir", "solicitar", "evaluacion", "evaluación",
      "consultation", "referral", "evaluation", "specialist"
    ]
  },
  {
    id: "autoanticuerpos",
    label: "Anticuerpos de Autoinmunidad",
    icon: "🛡️",
    color: "#fb7185",
    description: "Detección de anticuerpos asociados a patologías autoinmunes",
    fixed: true,
    fixedTarget: "completo",
    keywords: [
      "autoanticuerpo", "autoanticuerpos", "autoinmune", "autoinmunidad", "ana", "fan", "anti-dna", "antidna", "anca", "anti-sm", "antism", "anti-ro", "anti-la", "lupus", "artritis", "factor reumatoideo",
      "autoantibody", "autoantibodies", "autoimmune", "autoimmunity", "rheumatoid factor", "antinuclear"
    ],
    indicators: [
      "autoanticuerpo", "autoanticuerpos", "autoinmune", "autoinmunidad", "deteccion", "detección", "presencia",
      "autoantibodies", "autoimmune"
    ]
  },
  {
    id: "vacuna",
    label: "Respuesta a Vacunas",
    icon: "💉",
    color: "#06b6d4",
    placeholder: "Ej: Tétanos, Neumococo, Hepatitis B, Difteria...",
    description: "Títulos de anticuerpos pre/post vacunación y evaluación de respuesta protectora",
    keywords: [
      "vacuna", "vacunas", "vacunacion", "vacunación", "vacunaciones", "titulo", "título", "titulos", "títulos", "inmunizacion", "inmunización", "tetanos", "tétanos", "neumococo", "hepatitis", "difteria",
      "vaccine", "vaccines", "vaccination", "immunization", "titers", "tetanus", "pneumococcal", "diphtheria", "hepatitis"
    ],
    indicators: [
      "vacuna", "vacunas", "vacunacion", "vacunación", "vacunaciones", "titulo", "título", "titulos", "títulos", "inmunizacion", "inmunización",
      "vaccine", "vaccination", "titers"
    ]
  },
  {
    id: "segregacion",
    label: "Segregación Familiar",
    icon: "🌳",
    color: "#84cc16",
    placeholder: "Ej: BTK, WAS, RAG1, DOCK8...",
    description: "Análisis de segregación del gen en los miembros de la familia (portadores/afectados)",
    keywords: [
      "segregacion", "segregación", "arbol", "árbol", "genealogico", "genealógico", "portador", "portadora", "herencia", "ligado",
      "segregation", "family segregation", "carrier", "pedigree", "inheritance", "x-linked"
    ]
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
        keywords: [
          "proliferacion", "proliferaciones", "proliferación", "proliferaciones", "proliferar", "proliferativo", "proliferativa", "proliferativos", "proliferativas",
          "pha", "timidina", "ki67", "cfse", "division", "división",
          "proliferation", "proliferations", "proliferative", "thymidine"
        ],
        indicators: [
          "proliferacion", "proliferaciones", "proliferación", "proliferaciones", "proliferar", "timidina", "ki67", "cfse", "division", "división",
          "proliferation", "proliferations"
        ]
      },
      {
        id: "citotoxicidad",
        label: "Citotoxicidad",
        placeholder: "Ej: NK, CTL, célula diana K562",
        keywords: ["citotoxicidad", "citotoxicidades", "citotóxico", "citotoxica", "citotoxicos", "citotoxicas", "nk", "ctl", "lisis", "killing", "actividad litica", "actividad lítica", "cytotoxicity", "cytotoxic", "lysis"],
        indicators: ["citotoxicidad", "citotoxicidades", "citotóxico", "citotoxica", "lisis", "killing", "cytotoxicity"]
      },
      {
        id: "citoquinas",
        label: "Producción de citoquinas",
        placeholder: "Ej: IL-2, IFN-γ, TNF-α, IL-10...",
        keywords: ["citoquina", "citoquinas", "citocina", "citocinas", "citokina", "citokinas", "il-2", "il2", "ifn", "interferon", "interferón", "tnf", "interleucina", "cytokine", "cytokines", "interleukin"],
        indicators: ["citoquina", "citoquinas", "citocina", "citocinas", "citokina", "citokinas", "interleucina", "cytokine", "cytokines"]
      },
      {
        id: "degranulacion",
        label: "Degranulación",
        placeholder: "Ej: CD107a (NK), perforina, granzima",
        keywords: ["degranulacion", "degranulaciones", "degranulación", "degranulaciones", "cd107", "perforina", "granzima", "granzyme", "degranulation", "perforin"],
        indicators: ["degranulacion", "degranulaciones", "degranulación", "degranulaciones", "perforina", "granzima", "granzyme", "degranulation"]
      },
      {
        id: "via-interferon",
        label: "Vía del Interferón (gen específico)",
        placeholder: "Ej: STAT1, IRF3, IRF7, MX1, IFNAR1...",
        keywords: ["via interferon", "vía interferón", "signaling", "señalizacion", "stat1", "irf3", "irf7", "mx1", "ifnar", "sting", "jak1", "tyk2", "interferon pathway"],
        indicators: ["via interferon", "vía interferón", "signaling", "señalizacion", "interferon pathway"]
      }
    ],
    keywords: [
      "funcional", "funcionales", "ensayo", "ensayos",
      "proliferacion", "proliferaciones", "proliferación", "proliferar",
      "citotoxicidad", "citotoxicidades", "citoquina", "citoquinas", "citocina", "citocinas",
      "degranulacion", "degranulaciones", "degranulación", "interferon", "interferón", "via del interferon",
      "functional", "assay", "assays", "proliferation", "proliferations"
    ]
  },
  {
    id: "ecografia",
    label: "Ecografía Abdominal",
    icon: "🩻",
    color: "#14b8a6",
    description: "Evaluación ecográfica de órganos abdominales (bazo, hígado, etc.)",
    fixed: true,
    fixedTarget: "completa",
    keywords: ["ecografia", "ecografía", "ultrasonido", "bazo", "esplenomegalia", "higado", "hígado", "hepatomegalia", "abdominal", "ecografía abdominal", "ecografia abdominal", "ultrasound", "abdominal ultrasound", "sonogram", "spleen", "liver"]
  },
  {
    id: "tomografia",
    label: "Tomografía Computada",
    icon: "🌀",
    color: "#06b6d4",
    description: "Tomografía computada de alta resolución (tórax, abdomen, etc.)",
    fixed: true,
    fixedTarget: "de tórax",
    keywords: ["tomografia", "tomografía", "tc", "tac", "tcar", "hrct", "tomografía computada", "tomografia de torax", "tomografia de tórax", "glild", "pulmon", "pulmón", "pulmonar", "ct", "computed tomography", "chest ct", "hrct", "lungs", "chest"]
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
    { name: "Virginia Paolini", email: "demo@gmail.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
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
  let target = "";

  // 1. Intercepción Citometría BTK -> Mapear a Western Blot de BTK
  if (normalized.includes("citometria") && normalized.includes("btk")) {
    detectedType = STUDY_TYPES.find(t => t.id === "western-blot");
    return {
      type: detectedType,
      subtype: null,
      target: "BTK",
      confidence: "high",
      secondaryTypes: []
    };
  }

  // 2. Intercepción Antecedentes Familiares (para evitar colisión por palabras como 'sintoma' o 'fallecido')
  const isSegregacion = normalized.includes("segregac") || normalized.includes("genetic");
  const isFamily = !isSegregacion && (
    normalized.includes("herman") || normalized.includes("sibling") ||
    normalized.includes("padre") || normalized.includes("madre") ||
    normalized.includes("parental") || normalized.includes("consanguin") ||
    normalized.includes("abuelo") || normalized.includes("abuela") ||
    normalized.includes("tío") || normalized.includes("tía") ||
    normalized.includes("tio") || normalized.includes("tia") ||
    normalized.includes("familiar") || normalized.includes("familia") ||
    normalized.includes("fallecido") || normalized.includes("fallecida") ||
    normalized.includes("fallecieron") || normalized.includes("muerto") ||
    normalized.includes("muerte") || normalized.includes("muertes") ||
    normalized.includes("fallece")
  );

  if (isSegregacion) {
    detectedType = STUDY_TYPES.find(t => t.id === "segregacion");
    typeScore = 100;
  } else if (isFamily) {
    detectedType = STUDY_TYPES.find(t => t.id === "antecedentes");
    typeScore = 100;
  }

  // 3. Evaluar puntuaciones de coincidencia para todos los tipos (para soporte multi-query)
  const matches = [];
  for (const type of STUDY_TYPES) {
    // Si ya forzamos el tipo por segregación/familia, no pisar score
    if ((isSegregacion && type.id !== "segregacion") || (isFamily && type.id !== "antecedentes")) {
      continue;
    }

    let score = 0;
    for (const kw of type.keywords) {
      if (normalized.includes(normalize(kw))) score++;
    }
    
    if (score > 0) {
      matches.push({ type, score });
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

  if (!detectedType) {
    return { type: null, subtype: null, target: "", confidence: "none", secondaryTypes: [] };
  }

  // Identificar tipos secundarios excluyendo el detectado como principal (para avisar al usuario)
  const secondaryTypes = matches
    .map(m => m.type)
    .filter(t => t.id !== detectedType.id);

  // 4. Mapeo específico de targets según el tipo de estudio
  if (detectedType.id === "info-paciente") {
    if (normalized.includes("inicio") || normalized.includes("sintoma") || normalized.includes("comienzo") || normalized.includes("onset") || normalized.includes("presentation") || normalized.includes("start")) {
      target = "inicio de síntomas";
    } else if (normalized.includes("motivo") || normalized.includes("consulta") || normalized.includes("complaint") || normalized.includes("reason")) {
      target = "motivo de consulta";
    } else if (
      normalized.includes("infeccion") || normalized.includes("infecciones") || normalized.includes("infection") || normalized.includes("infections") ||
      normalized.includes("bacteria") || normalized.includes("cultivo") || normalized.includes("culture") ||
      normalized.includes("germen") || normalized.includes("gérmenes") || normalized.includes("germ") ||
      normalized.includes("rescata") || normalized.includes("rescate") ||
      normalized.includes("hospitaliz") || normalized.includes("internac") || normalized.includes("hospital") ||
      normalized.includes("terapia") || normalized.includes("icu")
    ) {
      target = "infecciones";
    } else if (normalized.includes("edad") || normalized.includes("genero") || normalized.includes("sexo") || normalized.includes("años") || normalized.includes("age") || normalized.includes("gender") || normalized.includes("sex") || normalized.includes("years")) {
      target = "edad y género";
    } else {
      target = "general";
    }
  } else if (detectedType.id === "antecedentes") {
    if (normalized.includes("padre") || normalized.includes("madre") || normalized.includes("parental") || normalized.includes("consanguin") || normalized.includes("father") || normalized.includes("mother") || normalized.includes("parents")) {
      target = "parentales";
    } else if (normalized.includes("herman") || normalized.includes("sibling") || normalized.includes("brother") || normalized.includes("sister")) {
      target = "hermanos";
    } else {
      target = "abuelos/tíos";
    }
  } else if (detectedType.id === "interconsulta") {
    if (normalized.includes("dermato") || normalized.includes("piel") || normalized.includes("eccema") || normalized.includes("dermatitis") || normalized.includes("skin") || normalized.includes("eczema")) {
      target = "Dermatología";
    } else if (normalized.includes("neuro") || normalized.includes("convulsion") || normalized.includes("convulsión") || normalized.includes("seizure") || normalized.includes("sindrómico") || normalized.includes("sindromico") || normalized.includes("retraso motor") || normalized.includes("retraso desarrollo") || normalized.includes("retraso") || normalized.includes("musculo") || normalized.includes("músculo") || normalized.includes("muscle")) {
      target = "Neurología";
    } else if (normalized.includes("gastro") || normalized.includes("intestin") || normalized.includes("diarrea") || normalized.includes("estomago") || normalized.includes("estómago") || normalized.includes("diarrhea") || normalized.includes("gut") || normalized.includes("bowel")) {
      target = "Gastrointestinal";
    } else if (normalized.includes("cardio") || normalized.includes("corazon") || normalized.includes("corazón") || normalized.includes("soplo") || normalized.includes("heart") || normalized.includes("murmur")) {
      target = "Cardiología";
    } else if (normalized.includes("neumonol") || normalized.includes("neumono") || normalized.includes("neumo") || normalized.includes("pulmon") || normalized.includes("respirat") || normalized.includes("pulmonology") || normalized.includes("lung") || normalized.includes("respiratory") || normalized.includes("cough")) {
      target = "Neumonología";
    } else if (normalized.includes("infecto") || normalized.includes("infectious")) {
      target = "Infectología";
    } else {
      // Extraer target removiendo palabras de ruido para otros estudios
      const noiseWords = [
        ...(detectedType.indicators || detectedType.keywords || []),
        ...(detectedSubtype?.indicators || detectedSubtype?.keywords || []),
        "quiero", "necesito", "solicito", "pedir", "pido", "ver", "hacer", "dame",
        "mostrame", "obtener", "traeme", "un", "una", "el", "la", "los", "las", "medir", "detectar",
        "de", "del", "para", "por", "resultado", "estudio", "analisis", "análisis",
        "test", "hacer", "realizar", "pedir", "del", "gen", "proteina", "proteína",
        "want", "need", "request", "order", "show", "give", "get", "check", "measure",
        "assay", "results", "result", "level", "levels", "for", "to", "the", "a", "an", "of", "gene", "protein"
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
      "test", "hacer", "realizar", "pedir", "del", "gen", "proteina", "proteína",
      "want", "need", "request", "order", "show", "give", "get", "check", "measure",
      "assay", "results", "result", "level", "levels", "for", "to", "the", "a", "an", "of", "gene", "protein"
    ];

    const textWords = text.split(/\s+/);
    const filteredWords = textWords.filter(w => {
      const nw = normalize(w);
      return nw.length > 1 && !noiseWords.some(nois => normalize(nois) === nw || nw === normalize(nois));
    });
    target = filteredWords.join(" ").trim();
  }

  const confidence = typeScore >= 1 ? (target.length > 0 || detectedType.fixed ? "high" : "low") : "low";

  return { type: detectedType, subtype: detectedSubtype, target, confidence, secondaryTypes };
}
