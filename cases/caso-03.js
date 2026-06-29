if (!window.EGC_CASES) window.EGC_CASES = [];

window.EGC_CASES.push({
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
    "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 3 años\n• Género: Femenino\n• Inicio de síntomas: Primer mes de vida (eccema severo). Trombocitopenia detectada al mes de vida.\n• Motivo de consulta: Eccema resistente a tratamiento + otitis media recurrentes (6 episodios en 2 años) + plaquetas bajas con volumen reducido.",
    "info-paciente::edad y género": "Edad: 3 años. Género: Femenino.",
    "info-paciente::inicio de síntomas": "Inicio de síntomas: Desde el primer mes de vida.\nPrimeras manifestaciones: eccema severo y generalizado resistente a corticoides tópicos desde el mes de vida. Trombocitopenia detectada en hemograma del primer mes. Otitis media recurrente a partir de los 8 meses (6 episodios en 2 años).",
    "info-paciente::motivo de consulta": "Motivo de consulta: Niña con eccema, trombocitopenia e infecciones recurrentes. Referida por sospecha de inmunodeficiencia primaria asociada a trombocitopenia.",

    "antecedentes::abuelos/tíos": "ANTECEDENTES FAMILIARES (completos):\nTío materno (32 años): trombocitopenia crónica y eccema leve desde la infancia (sin diagnóstico).\nAbuela materna: sana. Sin consanguinidad parental.\nCONCLUSIÓN: Antecedente en tío materno. Compatible con herencia ligada al X (WAS).",
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

    // Interconsultas
    "interconsulta::Dermatología": "Dermatología: Se constata eccema atópico severo y generalizado, liquenificado, con lesiones de rascado y sobreinfección en flexuras. Prurito intenso.",
    "interconsulta::Neurología": "Neurología: Examen neurológico normal. Sin signos focales.",
    "interconsulta::Gastrointestinal": "Gastrointestinal: Episodios intermitentes de diarrea con estrías de sangre (proctocolitis). Frecuencia de deposiciones aumentada.",
    "interconsulta::Cardiología": "Cardiología: Ruidos cardíacos normales, normofrecuentes, sin soplos.",

    // Autoanticuerpos
    "autoanticuerpos::ANA": "Anticuerpos Antinucleares (ANA): Negativo.",
    "autoanticuerpos::anti-DNA": "Anticuerpos anti-DNA: Negativo.",
    
    // Ecografía
    "ecografia::completa": "Ecografía abdominal:\nEsplenomegalia moderada (longitud del bazo 9.8 cm). Hígado y riñones normales sin particularidades. No se evidencia líquido libre."
  }
});
