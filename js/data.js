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
    description: "Historia familiar: parentales, hermanos o historia completa",
    placeholder: "Ej: historia completa, parentales, hermanos/hermanas...",
    keywords: ["antecedente", "familiar", "familia", "historia", "anamnesis", "hereditario", "hereditaria", "padres", "parentales", "hermano", "hermana", "siblings"]
  },
  {
    id: "western-blot",
    label: "Western Blot",
    icon: "🧬",
    color: "#6366f1",
    placeholder: "Ej: BTK, p53, WASp, STAT1, JAK3...",
    description: "Detección de proteína específica por electroforesis e inmunotransferencia",
    keywords: ["western", "blot", "wb", "inmunotransferencia", "proteina", "proteína", "banda"]
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
    keywords: ["citometria", "citometría", "flow", "facs", "cd4", "cd8", "cd19", "cd3", "subpoblacion", "subpoblación", "marcador", "fenotipo"]
  },
  {
    id: "elisa",
    label: "ELISA / Dosaje",
    icon: "🔬",
    color: "#10b981",
    placeholder: "Ej: IgG, IgM, IgA, IgE, IL-6, TNF-α...",
    description: "Cuantificación de inmunoglobulinas, citoquinas y proteínas séricas",
    keywords: ["elisa", "dosaje", "dosage", "inmunoglobulina", "inmunoglobulinas", "anticuerpo", "anticuerpos", "igg", "igm", "iga", "ige", "igd", "inmuno", "serico", "sérico", "cuantificacion", "cuantificación"]
  },
  {
    id: "pcr",
    label: "PCR / RT-PCR",
    icon: "🧪",
    color: "#f59e0b",
    placeholder: "Ej: BTK mRNA, WAS mRNA, JAK3...",
    description: "Detección y cuantificación de transcriptos génicos",
    keywords: ["pcr", "rtpcr", "rt-pcr", "mrna", "transcripto", "amplificacion", "amplificación", "gen", "expresion", "expresión"]
  },
  {
    id: "vacuna",
    label: "Respuesta a Vacunas",
    icon: "💉",
    color: "#06b6d4",
    placeholder: "Ej: Tétanos, Neumococo, Hepatitis B, Difteria...",
    description: "Títulos de anticuerpos pre/post vacunación y evaluación de respuesta protectora",
    keywords: ["vacuna", "vacunacion", "vacunación", "titulo", "título", "inmunizacion", "inmunización", "tetanos", "tétanos", "neumococo", "hepatitis", "difteria"]
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
        keywords: ["proliferacion", "proliferación", "proliferar", "pha", "timidina", "ki67", "cfse", "division", "división"]
      },
      {
        id: "citotoxicidad",
        label: "Citotoxicidad",
        placeholder: "Ej: NK, CTL, célula diana K562",
        keywords: ["citotoxicidad", "citotóxico", "citotoxica", "nk", "ctl", "lisis", "killing"]
      },
      {
        id: "citoquinas",
        label: "Producción de citoquinas",
        placeholder: "Ej: IL-2, IFN-γ, TNF-α, IL-10...",
        keywords: ["citoquina", "citocina", "citokina", "il-2", "il2", "ifn", "interferon", "interferón", "tnf", "interleucina"]
      },
      {
        id: "degranulacion",
        label: "Degranulación",
        placeholder: "Ej: CD107a (NK), perforina, granzima",
        keywords: ["degranulacion", "degranulación", "cd107", "perforina", "granzima", "granzyme"]
      },
      {
        id: "via-interferon",
        label: "Vía del Interferón (gen específico)",
        placeholder: "Ej: STAT1, IRF3, IRF7, MX1, IFNAR1...",
        keywords: ["via interferon", "vía interferón", "signaling", "señalizacion", "stat1", "irf3", "irf7", "mx1", "ifnar", "sting", "jak1", "tyk2"]
      }
    ],
    keywords: ["funcional", "ensayo", "proliferacion", "proliferación", "citotoxicidad", "citoquina", "citocina", "degranulacion", "degranulación", "interferon", "interferón", "via del interferon"]
  }
];

// ──────────────────────────────────────────────
// DATOS POR DEFECTO
// ──────────────────────────────────────────────

const DEFAULT_DATA = {
  settings: {
    // 'both' | 'free' | 'guided'
    queryMode: "both"
  },

  students: [
    { name: "Ana García", email: "ana.garcia@ejemplo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Carlos López", email: "carlos.lopez@ejemplo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "María Fernández", email: "maria.fernandez@ejemplo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Estudiante Demo", email: "demo@demo.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
    { name: "Jonathan Zaiat", email: "jzaiat@gmail.com", tokensLeft: TOKENS_PER_STUDENT, log: [] },
  ],

  cases: [
    {
      id: "caso-01",
      name: "Caso 1",
      description: "",
      status: "published",
      // Datos demográficos del paciente
      patient: {
        age: "8 años",
        gender: "Masculino",
        symptomOnset: "Desde los 6 meses de vida"
      },
      results: {
        // Info general
        "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 60 años\n• Género: Masculino\n• Sin historia familiar conocida de inmunodeficiencia al momento de la consulta inicial.",
        "info-paciente::edad y género": "Edad: 8 años. Género: Masculino.",
        "info-paciente::motivo de consulta": "Motivo de consulta: Infecciones bacterianas.",
        "info-paciente::inicio de síntomas": "Inicio de síntomas: 6 meses de vida.\n Infecciones bacterianas severas a repetición desde los 6 meses (otitis media). Requirieron hospitalizaciones repetidas.",
        "info-paciente::infecciones": "Infecciones: Infecciones bacterianas recurrentes (neumonías, otitis media, sinusitis) desde los 6 meses de vida. Cuadros severos que requirieron múltiples hospitalizaciones.",

        // Antecedentes
        "antecedentes::historia completa": "ANTECEDENTES FAMILIARES (completos):\nPaciente masculino, primogénito. Padres sanos, no consanguíneos.\nUn tío materno (hermano de la madre) falleció a los 4 años de neumonía de repetición. Sin otro familiar con historia similar documentada.\nAbuela materna sana. Abuelo materno sano.\nCONCLUSIÓN: Historia compatible con herencia ligada al X.",
        "antecedentes::parentales": "ANTECEDENTES — PADRES:\n• Padre (♂, 38 años): sano, sin enfermedades crónicas ni infecciones recurrentes.\n• Madre (♀, 36 años): sana. Refiere un hermano (tío del paciente) fallecido a los 4 años por neumonía de repetición.\nNO CONSANGUÍNEOS. Sin otras patologías conocidas.",
        "antecedentes::hermanos": "ANTECEDENTES — HERMANOS/HERMANAS:\nPaciente es primogénito. SIN HERMANOS conocidos hasta la fecha de consulta.",

        // Western Blot
        "western-blot::BTK": "Western Blot para BTK:\nNo se observa banda en el peso molecular esperado (~76 kDa). Control positivo presente y correcto.\nRESULTADO: Ausencia completa de expresión de BTK.",
        "western-blot::AKT": "Western Blot para AKT:\nBanda presente a ~60 kDa. Intensidad normal respecto al control.\nRESULTADO: Expresión normal de AKT.",

        // Hemograma
        "hemograma::completo": "Hemograma completo:\n• Leucocitos: 4.200/μL (↓ leve)\n• Linfocitos: 850/μL (↓↓ marcado, VN: 1500–4000)\n• Neutrófilos: 3.100/μL (normal)\n• Hemoglobina: 12.8 g/dL (normal)\n• Plaquetas: 230.000/μL (normal)\nCONCLUSIÓN: Linfopenia significativa.",

        // Citometría
        "citometria::CD19 B cells": "Citometría — Linfocitos B (CD19+):\nCD19+ = 0.1% (↓↓ marcadamente reducido, VN: 6–25%)\nLas células B son prácticamente indetectables.\nCONCLUSIÓN: Ausencia de linfocitos B circulantes.",
        "citometria::CD4 T cells": "Citometría — Linfocitos T CD4+:\nCD4+ = 28% (normal, VN: 25–45%)\nCONCLUSIÓN: Población T cooperadora normal.",
        "citometria::CD8 T cells": "Citometría — Linfocitos T CD8+:\nCD8+ = 31% (normal, VN: 20–35%)\nCONCLUSIÓN: Linfocitos T citotóxicos en rango normal.",

        // PCR
        "pcr::BTK mRNA": "RT-PCR para BTK mRNA:\nNo se detecta producto de amplificación en la muestra del paciente. Control positivo amplifica correctamente.\nCONCLUSIÓN: Ausencia de transcripto de BTK.",

        // ELISA / Dosaje Ig
        "elisa::IgG": "Dosaje — Inmunoglobulina G (IgG):\nIgG sérica = 142 mg/dL (↓↓↓ severamente reducida, VN: 700–1600 mg/dL)\nCONCLUSIÓN: Hipogammaglobulinemia severa.",
        "elisa::IgM": "Dosaje — Inmunoglobulina M (IgM):\nIgM sérica = 18 mg/dL (↓, VN: 40–230 mg/dL)\nCONCLUSIÓN: IgM disminuida.",
        "elisa::IgA": "Dosaje — Inmunoglobulina A (IgA):\nIgA sérica = 5 mg/dL (↓↓, VN: 70–400 mg/dL)\nCONCLUSIÓN: IgA prácticamente indetectable.",

        // Vacunas
        "vacuna::Tétanos": "Respuesta a vacuna — Tétanos:\nTítulo pre: < 0.01 UI/mL · Título post: 0.02 UI/mL\nNivel protector: ≥ 0.1 UI/mL\nRESULTADO: AUSENCIA DE RESPUESTA VACUNAL. No se generaron anticuerpos protectores.",
        "vacuna::Hepatitis B": "Respuesta a vacuna — Hepatitis B:\nAnti-HBs post: < 10 mUI/mL (VN protector: ≥ 10 mUI/mL)\nRESULTADO: SIN RESPUESTA. Paciente no respondedor.",
        "vacuna::Neumococo": "Respuesta a vacuna — Neumococo 23v:\nTítulos anti-polisacáridos: indetectables para todos los serotipos evaluados.\nRESULTADO: AUSENCIA TOTAL. Sin capacidad de responder a antígenos T-independientes.",

        // Segregación
        "segregacion::BTK": "SEGREGACIÓN FAMILIAR — Gen BTK (Xq21.3) · Herencia ligada al X:\n\n• Probando (♂, 8 años): AFECTADO — hemicigoto mutación c.1684C>T (p.Arg562Cys)\n• Madre (♀, 38 años): PORTADORA — heterocigota. Asintomática.\n• Hermana (♀, 5 años): PORTADORA — heterocigota. Asintomática.\n• Padre (♂, 40 años): No portador (no aplica cromosoma X).\n• Tío materno (♂, fallecido): Probable AFECTADO (no disponible para estudio).\n• Abuela materna (♀): PORTADORA — heterocigota. Asintomática.\n\nCONCLUSIÓN: Herencia ligada al X confirmada. Asesoramiento genético indicado.",

        // Ensayos funcionales
        "funcional::proliferacion::PHA": "Proliferación Celular — PHA:\nÍndice de estimulación (IE): 1.2 (↓↓, VN: IE > 10)\nCD4+ Ki67+: 3% · CD8+ Ki67+: 4%\nCONCLUSIÓN: Respuesta proliferativa T CONSERVADA. El defecto es humoral (XLA afecta células B, no T).",
        "funcional::proliferacion::anti-CD3": "Proliferación — anti-CD3:\nIE: 18.4 (normal, VN: > 10)\nCONCLUSIÓN: Proliferación T normal ante estímulo de TCR.",
        "funcional::citotoxicidad::NK": "Citotoxicidad NK (ratio 10:1):\nActividad lítica: 38% (VN: 20–50%)\nCONCLUSIÓN: Función NK conservada.",
        "funcional::via-interferon::STAT1": "Vía del Interferón — STAT1:\nFosfopSTAT1 tras IFN-γ (30 min): 62% (normal, VN: > 50%)\nFosfopSTAT1 tras IFN-α: 58% (normal)\nCONCLUSIÓN: Señalización por STAT1 conservada. No hay defecto en la vía JAK-STAT del interferón.",
      }
    },

    {
      id: "caso-02",
      name: "Caso 2 — Linfadenopatía generalizada en adulto joven",
      description: "Mujer con linfadenopatía generalizada, esplenomegalia y fiebre de origen desconocido durante los últimos 4 meses.",
      status: "published",
      patient: {
        age: "24 años",
        gender: "Femenino",
        symptomOnset: "4 meses de evolución"
      },
      results: {
        "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 24 años\n• Género: Femenino\n• Inicio de síntomas: Hace 4 meses (linfadenopatias progresivas, fiebre vespertina, sudoración nocturna)\n• Motivo de consulta: Linfadenopatia generalizada + esplenomegalia detectada en ecografia. Pérdida de 4 kg en 3 meses.",
        "info-paciente::edad y género": "Edad: 24 años. Género: Femenino.",
        "info-paciente::inicio de síntomas": "Inicio de síntomas: Hace 4 meses.\nPrimeras manifestaciones: aparición progresiva de ganglios inflamados en cuello, axilas e ingles. Fiebre vespertina (hasta 38.2 °C), sudoración nocturna empapante y pérdida de peso de 4 kg en 3 meses.",
        "info-paciente::motivo de consulta": "Motivo de consulta: Linfadenopatia generalizada con esplenomegalia (ecografia abdominal). Fiebre de origen desconocido y pérdida de peso involuntaria. Solicita estudio de causa hematológica vs infecciosa vs autoinmune.",

        "antecedentes::historia completa": "ANTECEDENTES FAMILIARES (completos):\nPadre: DM2. Madre: artritis reumatoidea.\nHermano (27 años): sano.\nAbuela paterna: 'cáncer de sangre' (sin documentar) a los 68 años.\nTío paterno: Linfoma no Hodgkin a los 55 años.\nCONCLUSIÓN: Antecedente de neoplasia hematológica en rama paterna.",
        "antecedentes::parentales": "ANTECEDENTES — PADRES:\n• Padre (♂, 54 años): DM2 en tratamiento. Refiere un hermano (tío paterno) con Linfoma no Hodgkin a los 55 años.\n• Madre (♀, 51 años): artritis reumatoidea diagnosticada a los 40 años, en remisión con MTX.\nNo consanguíneos.",
        "antecedentes::hermanos": "ANTECEDENTES — HERMANOS/HERMANAS:\n• Hermano (♂, 27 años): sano, sin patologías crónicas ni infecciones a repetición.\nSolo 1 hermano conocido. No hay hermanas.",

        "hemograma::completo": "Hemograma:\n• Leucocitos: 18.400/μL (↑↑)\n• Linfocitos: 12.800/μL (↑↑ marcada linfocitosis)\n• Neutrófilos: 4.100/μL (normal)\n• Hemoglobina: 10.2 g/dL (↓)\n• Plaquetas: 98.000/μL (↓)\nCONCLUSIÓN: Linfocitosis marcada + anemia + trombocitopenia.",

        "citometria::CD19 B cells": "Citometría — B (CD19+):\nCD19+ = 68% (↑↑) con co-expresión de CD5.\nCONCLUSIÓN: Expansión clonal B, fenotipo sugestivo de LLC.",
        "citometria::CD5 CD19": "Citometría — CD5+CD19+:\n68% de linfocitos son CD5+CD19+, CD23+, CD38−, IgS kappa restringida.\nCONCLUSIÓN: Fenotipo clásico de LLC-B.",
        "citometria::CD4 T cells": "Citometría — T CD4+:\n8% (↓ relativo por expansión B). CD4/CD8: 0.6 (invertida).\nCONCLUSIÓN: Reducción relativa T cooperadores.",

        "elisa::IgG": "Dosaje — IgG: 480 mg/dL (↓, VN: 700–1600)\nCONCLUSIÓN: Hipogammaglobulinemia secundaria.",

        "western-blot::p53": "Western Blot — p53:\nBanda a ~53 kDa con intensidad aumentada (acumulación proteica).\nCONCLUSIÓN: Sobreexpresión de p53 compatible con mutación con pérdida de función.",

        "vacuna::Neumococo": "Respuesta — Neumococo:\nTítulos bajos para 12/23 serotipos. Compatible con hipogammaglobulinemia secundaria.\nRESULTADO: RESPUESTA SUBÓPTIMA.",

        "segregacion::TP53": "SEGREGACIÓN — TP53 (17p13.1):\nMutación c.817C>T hallada en células leucémicas: origen SOMÁTICO (adquirido).\n• Madre: sin mutación germinal · Padre: sin mutación germinal.\nCONCLUSIÓN: Mutación somática. No hereditaria. No requiere cribado familiar.",

        "funcional::proliferacion::PHA": "Proliferación — PHA:\nIE: 6.2 (↓ levemente, VN: > 10). Interferido por la linfocitosis B dominante.\nCONCLUSIÓN: Función T proliferativa conservada con señal interferida.",
        "funcional::citotoxicidad::NK": "Citotoxicidad NK (10:1):\nActividad lítica: 18% (↓ leve, VN: 20–50%)\nCONCLUSIÓN: Función NK levemente disminuida.",
        "funcional::via-interferon::JAK1": "Vía del Interferón — JAK1:\nNo se detecta fosfo-JAK1 tras estimulación con IFN-α.\nCONCLUSIÓN: Defecto en señalización JAK1 en contexto tumoral. No necesariamente germinal.",
      }
    },

    {
      id: "caso-03",
      name: "Caso 3 — Niña con eccema, trombocitopenia e infecciones",
      description: "Niña con eccema severo desde los primeros meses de vida, trombocitopenia y múltiples infecciones recurrentes.",
      status: "draft",
      patient: {
        age: "3 años",
        gender: "Femenino",
        symptomOnset: "Desde el primer mes de vida"
      },
      results: {
        "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 3 años\n• Género: Femenino\n• Inicio de síntomas: Primer mes de vida (eccema severo). Trombocitopenia detectada al mes de vida.\n• Motivo de consulta: Eccema resistente a tratamiento + otitis media recurrente (6 episodios en 2 años) + plaquetas bajas con volumen reducido.",
        "info-paciente::edad y género": "Edad: 3 años. Género: Femenino.",
        "info-paciente::inicio de síntomas": "Inicio de síntomas: Desde el primer mes de vida.\nPrimeras manifestaciones: eccema severo y generalizado resistente a corticoides tópicos desde el mes de vida. Trombocitopenia detectada en hemograma del primer mes. Otitis media recurrente a partir de los 8 meses (6 episodios en 2 años).",
        "info-paciente::motivo de consulta": "Motivo de consulta: Niña con eccema, trombocitopenia e infecciones recurrentes. Referida por sospecha de inmunodeficiencia primaria asociada a trombocitopenia.",

        "antecedentes::historia completa": "ANTECEDENTES FAMILIARES (completos):\nTío materno (32 años): trombocitopenia crónica y eccema leve desde la infancia (sin diagnóstico).\nAbuela materna: sana. Sin consanguinidad parental.\nCONCLUSIÓN: Antecedente en tío materno. Compatible con herencia ligada al X (WAS).",
        "antecedentes::parentales": "ANTECEDENTES — PADRES:\n• Madre (♀, 31 años): sana. Refiere un hermano (tío materno, 32 años) con trombocitopenia y eccema crónicos no diagnosticados.\n• Padre (♂, 33 años): sano, sin antecedentes relevantes.\nNo consanguíneos.",
        "antecedentes::hermanos": "ANTECEDENTES — HERMANOS/HERMANAS:\n• Hermano (♂, 6 años): sano, sin eccema, sin trombocitopenia, sin infecciones recurrentes. Hemograma y plaquetas normales.\nSolo 1 hermano conocido. Hermano no afectado.",

        "hemograma::completo": "Hemograma:\n• Plaquetas: 42.000/μL (↓↓)\n• VPM: 5.2 fL (↓↓, VN: 7.5–11 fL) — microtrombocitopenia\n• Hemoglobina: 9.8 g/dL (↓ anemia leve)\n• Leucocitos: 7.800/μL (normal)\nCONCLUSIÓN: Microtrombocitopenia severa.",

        "citometria::CD4 T cells": "Citometría — T CD4+: 22% (↓ leve)\nCONCLUSIÓN: Linfopenia T CD4+ leve.",
        "citometria::CD8 T cells": "Citometría — T CD8+: 18% (↓, VN: 20–35%)\nCONCLUSIÓN: Linfopenia T CD8+ moderada.",
        "citometria::CD19 B cells": "Citometría — B CD19+: 12% (normal)\nCONCLUSIÓN: Linfocitos B normales.",

        "western-blot::WASp": "Western Blot — WASp:\nNo se detecta banda a ~53 kDa. Control positivo correcto.\nRESULTADO: Ausencia de expresión de WASp.",

        "elisa::IgG": "Dosaje IgG: 920 mg/dL (normal)\nCONCLUSIÓN: IgG normal.",
        "elisa::IgA": "Dosaje IgA: 210 mg/dL (↑ elevada, VN 3 años: 20–120 mg/dL)\nCONCLUSIÓN: IgA elevada.",
        "elisa::IgM": "Dosaje IgM: 28 mg/dL (↓)\nCONCLUSIÓN: IgM disminuida.",

        "pcr::WAS mRNA": "RT-PCR WAS mRNA: transcripto presente pero reducido (~40% del control).\nCONCLUSIÓN: Expresión reducida, compatible con mutación hipomórfica.",

        "vacuna::Tétanos": "Respuesta — Tétanos:\nTítulo post: 0.18 UI/mL (limítrofe, VN: ≥ 0.1 UI/mL)\nRESULTADO: RESPUESTA SUBÓPTIMA.",
        "vacuna::Neumococo": "Respuesta — Neumococo conjugada:\nAdecuada para 8/13 serotipos (respuesta T-dependiente parcialmente conservada).\nRESULTADO: RESPUESTA PARCIAL.",

        "segregacion::WAS": "SEGREGACIÓN — Gen WAS (Xp11.22) · Ligado al X:\n\n• Probanda (♀, 3 años): AFECTADA — hemicigota (fenotipo inusual en mujer → sesgo extremo de inactivación X)\n• Madre (♀, 31 años): PORTADORA — c.559C>T heterocigota. Asintomática.\n• Padre (♂): No portador.\n• Hermano (♂, 6 años): No afectado (alelo normal).\n• Tío materno (♂, 32 años): AFECTADO LEVE — hemicigoto, misma mutación hipomórfica.\n\nCONCLUSIÓN: Mutación hipomórfica en WAS con expresión variable.",

        "funcional::proliferacion::PHA": "Proliferación — PHA:\nIE: 4.8 (↓↓, VN: > 10)\nCONCLUSIÓN: Respuesta T reducida, compatible con disfunción de citoesqueleto de actina en WAS.",
        "funcional::citotoxicidad::NK": "Citotoxicidad NK (10:1): 12% (↓↓, VN: 20–50%)\nCONCLUSIÓN: Función NK significativamente reducida.",
        "funcional::degranulacion::CD107a": "Degranulación — CD107a (NK):\nCD107a+ post-activación: 8% (↓↓, VN: > 20%)\nCONCLUSIÓN: Defecto de degranulación NK por disfunción del citoesqueleto de actina.",
        "funcional::citoquinas::IFN-γ": "Citoquinas — IFN-γ intracelular (CD4+/PMA+ionomicina):\n3.2% IFN-γ+ (↓, VN: 10–25%)\nCONCLUSIÓN: Producción reducida. Disfunción Th1.",
        "funcional::via-interferon::STAT1": "Vía del Interferón — STAT1:\nFosfo-STAT1 tras IFN-γ: 14% (↓↓, VN: > 50%)\nFosfo-STAT1 tras IFN-α: 11% (↓↓)\nCONCLUSIÓN: Señalización por interferón REDUCIDA. Defecto funcional en la vía JAK-STAT en contexto de WAS.",
      }
    }
  ]
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
    if (!data.settings) data.settings = { queryMode: "both" };

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
  } else {
    // Extraer target removiendo palabras de ruido para otros estudios
    const noiseWords = [
      ...(detectedType.keywords || []),
      ...(detectedSubtype?.keywords || []),
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
