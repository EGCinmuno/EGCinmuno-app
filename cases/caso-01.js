if (!window.EGC_CASES) window.EGC_CASES = [];

window.EGC_CASES.push({
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
    "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 8 años\n• Género: Masculino\n• Antecedentes de infecciones bacterianas recurrentes desde los 6 meses de vida (otitis, neumonías, sinusitis).",
    "info-paciente::edad y género": "Edad: 8 años. Género: Masculino.",
    "info-paciente::motivo de consulta": "Motivo de consulta: Infecciones bacterianas.",
    "info-paciente::inicio de síntomas": "Inicio de síntomas: 6 meses de vida.\n Infecciones bacterianas severas a repetición desde los 6 meses (otitis media). Requirieron hospitalizaciones repetidas.",
    "info-paciente::infecciones": "Infecciones: Infecciones bacterianas recurrentes (neumonías, otitis media, sinusitis) desde los 6 meses de vida. Cuadros severos que requirieron múltiples hospitalizaciones.",

    // Antecedentes
    "antecedentes::abuelos/tíos": "Antecedentes abuelos/tíos:\nUn tío materno (hermano de la madre) falleció a los 4 años de neumonía de repetición. Sin otro familiar con historia similar documentada.\nAbuela materna sana. Abuelo materno sano.",
    "antecedentes::parentales": "ANTECEDENTES — PADRES:\n• Padre (♂, 38 años): sano, sin enfermedades crónicas ni infecciones recurrentes.\n• Madre (♀, 36 años): sana. \n No CONSANGUÍNEOS.",
    "antecedentes::hermanos": "ANTECEDENTES — HERMANOS/HERMANAS:\nPaciente es primogénito. SIN HERMANOS conocidos hasta la fecha de consulta.",

    // Western Blot
    "western-blot::BTK": "Western Blot para BTK:\nNo se observa banda en el peso molecular esperado (~76 kDa). Control positivo presente y correcto.\nRESULTADO: Ausencia completa de expresión de BTK.",
    "western-blot::AKT": "Western Blot para AKT:\nBanda presente a ~60 kDa. Intensidad normal respecto al control.\nRESULTADO: Expresión normal de AKT.",

    // Hemograma
    "hemograma::completo": "Hemograma completo:\n• Leucocitos: 4.200/μL (↓ leve)\n• Linfocitos: 850/μL (↓↓ marcado, VN: 1500–4000)\n• Neutrófilos: 3.100/μL (normal)\n• Hemoglobina: 12.8 g/dL (normal)\n• Plaquetas: 230.000/μL (normal)\nCONCLUSIÓN: Linfopenia significativa.",

    // Citometría
    "citometria::CD19 B cells": "Citometría — Linfocitos B (CD19+):\nCD19+ = 0.1% (VN: 6–25%)\n",
    "citometria::CD20 B cells": "Citometría — Linfocitos B (CD20+):\nCD20+ = 0.1% (VN: 6–25%)\n",
    "citometria::CD3 T cells": "Citometría — Linfocitos T (CD3+):\nCD3+ = 72% (VN: 60–85%)\n",
    "citometria::CD4 T cells": "Citometría — Linfocitos T CD4+:\nCD4+ = 28% (VN: 25–45%)\n",
    "citometria::CD8 T cells": "Citometría — Linfocitos T CD8+:\nCD8+ = 31% (VN: 20–35%)\n",
    "citometria::LB memoria": "Citometría — Linfocitos B de Memoria (CD19+CD27+):\nCD19+CD27+ = 0.0% (VN: 1.5–10%)\n",

    // PCR
    "pcr::BTK mRNA": "RT-PCR para BTK mRNA:\nNo se detecta producto de amplificación en la muestra del paciente. Control positivo amplifica correctamente.\n",

    // ELISA / Dosaje Ig
    "elisa::IgG": "Dosaje — Inmunoglobulina G (IgG):\nIgG sérica = 142 mg/dL (700–1600 mg/dL)\n",
    "elisa::IgM": "Dosaje — Inmunoglobulina M (IgM):\nIgM sérica = 18 mg/dL (40–230 mg/dL)\n",
    "elisa::IgA": "Dosaje — Inmunoglobulina A (IgA):\nIgA sérica = 5 mg/dL (70–400 mg/dL)\n",

    // Vacunas
    "vacuna::Tétanos": "Respuesta a vacuna — Tétanos:\nTítulo pre: < 0.01 UI/mL · Título post: 0.02 UI/mL\nNivel protector: ≥ 0.1 UI/mL\n",
    "vacuna::Hepatitis B": "Respuesta a vacuna — Hepatitis B:\nAnti-HBs post: < 10 mUI/mL (VN protector: ≥ 10 mUI/mL)\n",
    "vacuna::Neumococo": "Respuesta a vacuna — Neumococo 23v:\nTítulos anti-polisacáridos: indetectables para todos los serotipos evaluados.\n",

    // Segregación
    "segregacion::BTK": "SEGREGACIÓN FAMILIAR — Gen BTK (Xq21.3) · Herencia ligada al X:\n\n• Probando (♂, 8 años): AFECTADO — hemicigoto mutación c.1684C>T (p.Arg562Cys)\n• Madre (♀, 38 años): PORTADORA — heterocigota. Asintomática.\n• Hermana (♀, 5 años): PORTADORA — heterocigota. Asintomática.\n• Padre (♂, 40 años): No portador (no aplica cromosoma X).\n• Tío materno (♂, fallecido): Probable AFECTADO (no disponible para estudio).\n• Abuela materna (♀): PORTADORA — heterocigota. Asintomática.\n",

    // Ensayos funcionales
    "funcional::proliferacion::PHA": "Proliferación Celular — PHA:\nÍndice de estimulación (IE): 1.2 (↓↓, VN: IE > 10)\nCD4+ Ki67+: 3% · CD8+ Ki67+: 4%\n",
    "funcional::proliferacion::anti-CD3": "Proliferación — anti-CD3:\nIE: 18.4 (normal, VN: > 10)\n",
    "funcional::citotoxicidad::NK": "Citotoxicidad NK (ratio 10:1):\nActividad lítica: 38% (VN: 20–50%)\n",
    "funcional::via-interferon::STAT1": "Vía del Interferón — STAT1:\nFosfopSTAT1 tras IFN-γ (30 min): 62% (normal, VN: > 50%)\nFosfopSTAT1 tras IFN-α: 58% (normal)\n",

    // Interconsultas
    "interconsulta::Dermatología": "Dermatología: Paciente refiere eccema leve transitorio en brazos. Sin lesiones activas relevantes al examen físico.",
    "interconsulta::Neurología": "Neurología: Examen neurológico completo normal. Sin alteraciones ni signos de organicidad.",
    "interconsulta::Gastrointestinal": "Gastrointestinal: Sin síntomas de malabsorción ni diarrea crónica. Examen físico abdominal normal.",
    "interconsulta::Cardiología": "Cardiología: Examen cardiovascular normal. Ruidos cardíacos netos, normofrecuentes, sin soplos.",

    // Autoanticuerpos
    "autoanticuerpos::ANA": "Anticuerpos Antinucleares (ANA): Negativo (no reactivo). (No se observan títulos de autoanticuerpos circulantes).",
    "autoanticuerpos::anti-DNA": "Anticuerpos anti-DNA de doble cadena: Negativo.",

    // Ecografía
    "ecografia::completa": "Órganos abdominales normales, sin esplenomegalia ni hepatomegalia. No se detecta líquido libre en cavidad peritoneal."
  }
});
