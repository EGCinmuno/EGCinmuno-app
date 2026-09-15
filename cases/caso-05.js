if (!window.EGC_CASES) window.EGC_CASES = [];

window.EGC_CASES.push({
  id: "caso-05",
  name: "Caso 5",
  description: "Paciente de 8 años con Infecciones Recurrentes y Diarrea",
  internal_notes: "Inmunodeficiencia Común Variable (IDCV) / Alteración de LB memoria y switch / Falla anti-polisacáridos / Sospecha AD",
  status: "published",
  patient: {
    age: "7.9 años",
    gender: "Masculino",
    ageBracket: "child",
    symptomOnset: "0.6 años (7 meses de vida)"
  },
  results: {
    // 🧑‍⚕️ Información general
    "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 7.9 años (7 años y 11 meses)\n• Género: Masculino\n• Inicio de síntomas: 0.6 años (desde los 7 meses de vida)\n• Diagnóstico clínico presuntivo: 2.9 años\n• Motivo de consulta: Infecciones respiratorias bacterianas a repetición, diarrea crónica, candidiasis mucocutánea y micosis ungueal.",
    "info-paciente::edad y género": "Edad: 7.9 años (7 años y 11 meses). Género: Masculino.",
    "info-paciente::inicio de síntomas": "Inicio de síntomas: Desde los 7 meses de vida (0.6 años), con infecciones respiratorias frecuentes y cuadros diarreicos.",
    "info-paciente::motivo de consulta": "Motivo de consulta: Evaluación inmunológica por infecciones respiratorias bacterianas a repetición, diarrea crónica, candidiasis oral recidivante y micosis ungueal.",
    "info-paciente::infecciones": "Infecciones (relato del padre): 'Desde los 7 meses de vida comenzó con cuadros respiratorios recurrentes: neumonías a repetición que requirieron internaciones y antibióticos endovenosos, otitis y sinusitis frecuentes. Además, presenta episodios continuos de diarrea acuosa que dificultan que suba de peso, hongos blancos en la lengua (candidiasis oral) que vuelven apenas dejamos el tratamiento, y una micosis en las uñas que no mejora con las cremas comunes.'",

    // 👨‍👩‍👧‍👦 Antecedentes Familiares
    "antecedentes::parentales": "ANTECEDENTES PARENTALES (Relato del padre):\n• Padre (38 años): 'Yo también tengo problemas en las defensas desde chico, me dijeron que tengo las defensas bajas (hipogammaglobulinemia IgG e IgM moderada). Tuve muchas infecciones respiratorias, sufro de diarreas crónicas y en la última endoscopía me encontraron pólipos intestinales severos. Además, suelo tener infecciones por hongos en la piel de la cara (hifas hialinas ramificadas en el raspado).'\n• Madre (36 años): Sana, sin antecedentes de infecciones recurrentes ni enfermedades inmunológicas conocidas. No consanguíneos.",
    "antecedentes::abuelos/tíos": "ANTECEDENTES FAMILIARES (Abuelos y Tíos):\n• Abuela paterna: Antecedente documentado de infecciones respiratorias recurrentes (bronquiectasias y neumonías) y diagnóstico previo de hipogammaglobulinemia.\n• Abuelo paterno: Sano, sin antecedentes de relevancia.\n• Rama materna: Abuelos y tíos maternos vivos y sanos.\n• Orientación genética: Árbol genealógico compatible con patrón de herencia autosómica dominante con penetrancia y expresividad variable.",
    "antecedentes::hermanos": "ANTECEDENTES — HERMANOS:\nPaciente sin hermanos a la fecha (hijo único).",

    // 🩸 Hemograma
    "hemograma::completo": "Hemograma completo con fórmula leucocitaria:\n• Glóbulos Blancos (Leucocitos totales): 11.400 /μL (normal / leve leucocitosis reactiva)\n• Monocitos: 5% (Abs: 570 /μL, normal)\n• Neutrófilos segmentados: 44% (Abs: 5.016 /μL, normal)\n• Linfocitos Totales: 47% (Abs: 5.358 /μL, normal/conservado)\n• Plaquetas: 396.000 /μL (normales)\n• Glóbulos Rojos: 4.650.000 /μL · Hemoglobina: 12.4 g/dL · Hematocrito: 37.5%",

    // 🔬 Citometría de Flujo
    "citometria::CD3 T cells": "Citometría de Flujo — Linfocitos T Totales (CD3+):\n• CD3+ = 67% (3.735 cel/mm³) (VN: 60–85%, 1.200–4.000 cel/mm³)\n• Interpretación: Población de Linfocitos T cuantitativamente conservada.",
    "citometria::CD4 T cells": "Citometría de Flujo — Linfocitos T Helper / Cooperadores (CD4+):\n• CD4+ = 38% (2.100 cel/mm³) (VN: 25–45%, 700–2.200 cel/mm³)\n• Interpretación: Población CD4+ cuantitativamente normal.",
    "citometria::CD8 T cells": "Citometría de Flujo — Linfocitos T Citotóxicos (CD8+):\n• CD8+ = 23% (1.252 cel/mm³) (VN: 20–35%, 400–1.300 cel/mm³)\n• Relación CD4/CD8: 1.65 (Normal)",
    "citometria::CD19 B cells": "Citometría de Flujo — Linfocitos B Totales (CD19+):\n• CD19+ = 22% (1.219 cel/mm³) (VN: 6–25%, 200–1.200 cel/mm³)\n• Interpretación: Linfocitos B cuantitativamente presentes y conservados (descarta Agammaglobulinemia de Bruton / XLA).",
    "citometria::LB memoria": "Citometría de Flujo — Linfocitos B de Memoria Totales (CD19+ CD27+):\n• CD19+ CD27+ = 7.1% de los Linfocitos B (VN: 10–30%)\n• Interpretación: Disminución marcada de la fracción de Linfocitos B de memoria.",
    "citometria::CD19+CD27+IgM-": "Citometría de Flujo — Linfocitos B de Memoria con Cambio de Isotipo / Post-switch (CD19+ CD27+ IgM- IgD-):\n• CD19+ CD27+ IgM- = 2.3% (VN: > 6.5–15%)\n• Interpretación: Marcada alteración y defecto severo en la generación de Linfocitos B de memoria post-switch (Clasificación EUROclass: Grupo smB- / alteración madurativa terminal del Linfocito B).",
    "citometria::NK cells": "Citometría de Flujo — Células Natural Killer (CD3- CD16+ CD56+):\n• NK (CD16+CD56+) = 7.0% (410 cel/mm³) (VN: 5–20%, 100–600 cel/mm³)\n• Interpretación: Población NK dentro de límites normales.",

    // 🧪 ELISA / Dosaje de Inmunoglobulinas
    "elisa::IgG": "Dosaje Cuantitativo — Inmunoglobulina G (IgG):\n• IgG sérica = 631 mg/dL (VN para 7-9 años: 700–1.600 mg/dL)\n• Interpretación: Niveles por debajo del rango de referencia inferior / Hipogammaglobulinemia en contexto de fallo de isotipos asociados.",
    "elisa::IgA": "Dosaje Cuantitativo — Inmunoglobulina A (IgA):\n• IgA sérica = < 25 mg/dL (VN para 7-9 años: 70–350 mg/dL)\n• Interpretación: Hipogammaglobulinemia severa de IgA (marcadamente disminuida/indetectable).",
    "elisa::IgM": "Dosaje Cuantitativo — Inmunoglobulina M (IgM):\n• IgM sérica = 25 mg/dL (VN para 7-9 años: 50–220 mg/dL)\n• Interpretación: Hipogammaglobulinemia moderada-severa de IgM.",
    "elisa::IgE": "Dosaje Cuantitativo — Inmunoglobulina E Total (IgE):\n• IgE sérica = 2 UI/mL (VN: < 90 UI/mL)\n• Interpretación: Niveles basales muy disminuidos.",

    // 💉 Respuesta a Vacunas y Ensayos Funcionales
    "vacuna::Neumococo": "Respuesta Humoral a Antígenos Polisacáridos — Vacuna Neumococo 23-valente:\n• Título pre-vacunal: < 0.3 μg/mL (indetectable)\n• Título post-vacunación (a las 4 semanas): 0.4 μg/mL (Respuesta negativa / Falla funcional frente a antígenos polisacáridos. Título protector esperado: ≥ 1.3 μg/mL en > 70% de serotipos).\n• Interpretación: Falla franca en la producción de anticuerpos específicos anti-polisacáridos.",
    "vacuna::Tétanos": "Respuesta a Vacuna — Toxoide Tetánico (T-dependiente / proteico):\n• Título de anticuerpos IgG anti-tetánicos: 0.12 UI/mL (Respuesta subóptima/disminuida, VN: ≥ 0.5 UI/mL para inmunidad plena).",
    "funcional::proliferacion::PHA": "Ensayo Funcional — Proliferación Linfocitaria frente a Mitógenos (PHA):\n• Índice de Estimulación (IE) con Fitohemaglutinina (PHA): IE = 28.5 (VN: IE > 15)\n• Interpretación: Proliferación celular T normal frente a mitógenos policlonales.",

    // 🩻 Interconsultas Médicas
    "interconsulta::Gastroenterología": "Evaluación por Gastroenterología Infantil:\n• Cuadros de diarrea crónica recurrente no infecciosa con períodos de esteatorrea y distensión abdominal.\n• Coprocultivo y examen parasitológico seriado de materia fecal: Negativos para Giardia lamblia y bacterias patógenas habituales.\n• Videoendoscopía digestiva alta y baja: Mucosa duodenal con atrofia vellositaria focal leve y nodularidad linfoide; mucosa colónica con hiperplasia nodular linfoide (hallazgo característico en IDCV).",
    "interconsulta::Dermatología": "Evaluación Dermatológica y Micológica:\n• Cavidad oral: Placas blanquecinas confluentes en mucosa yugal compatibles con Candidiasis oral recurrente (muguet).\n• Uñas de miembros inferiores: Distrofia e hiperqueratosis subungueal.\n• Examen directo y cultivo micológico ungueal: Negativo para Candida albicans; positivo para hongos filamentosos no dermatofitos / micosis ungueal no cándida."
  }
});
