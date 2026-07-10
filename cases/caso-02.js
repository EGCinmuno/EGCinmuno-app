if (!window.EGC_CASES) window.EGC_CASES = [];

window.EGC_CASES.push({
  id: "caso-02",
  name: "Caso 2",
  description: "TP6",
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

    "antecedentes::abuelos/tíos": "Abuela paterna: 'cáncer de sangre' (sin documentar) a los 68 años.\nTío paterno: Linfoma no Hodgkin a los 55 años.",
    "antecedentes::parentales": "Padre (♂, 54 años): DM2 en tratamiento.\n• Madre (51 años): artritis reumatoidea diagnosticada a los 40 años, en remisión con MTX.\nNo consanguíneos.",
    "antecedentes::hermanos": "Hermano (♂, 27 años): sano, sin patologías crónicas ni infecciones a repetición.\nSolo 1 hermano conocido. No hay hermanas.",

    "hemograma::completo": "Hemograma:\n• Leucocitos: 18.400/μL (↑↑)\n• Linfocitos: 12.800/μL (↑↑ marcada linfocitosis)\n• Neutrófilos: 4.100/μL (normal)\n• Hemoglobina: 10.2 g/dL (↓)\n• Plaquetas: 98.000/μL (↓)\n",

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

    // Interconsultas
    "interconsulta::Dermatología": "Dermatología: No se observan lesiones cutáneas activas ni eccemas.",
    "interconsulta::Neurología": "Neurología: Examen neurológico sin particularidades.",
    "interconsulta::Gastrointestinal": "Gastrointestinal: Sin alteraciones en el ritmo evacuatorio, no se refiere dolor abdominal recurrente.",
    "interconsulta::Cardiología": "Cardiología: Soplo sistólico eyectivo funcional fisiológico. ECG dentro de límites normales.",
    "interconsulta::Neumonología": "Neumonología: Sin síntomas respiratorios activos. Examen físico de tórax normal. Buena ventilación bilateral sin ruidos agregados ni signos de compromiso pulmonar en contexto de adenomegalias mediastínicas.",

    // Autoanticuerpos
    "autoanticuerpos::ANA": "ANA por IFI: Positivo (título 1:160, patrón moteado). Compatible con componente autoinmune secundario.",
    "autoanticuerpos::anti-DNA": "anti-DNA de doble cadena: Negativo.",
    
    // Ecografía
    "ecografia::completa": "Ecografía abdominal:\nSe observa esplenomegalia marcada (bazo de 18.5 cm de longitud, VN: < 12 cm). Hígado de tamaño y ecoestructura normal, sin lesiones focales. Ausencia de líquido libre en cavidad abdominal.",

    // Tomografía
    "tomografia::de tórax": "Tomografía de tórax:\nPresencia de múltiples adenomegalias mediastínicas e hiliares (la mayor de 3.2 cm). Parénquima pulmonar libre de infiltrados."
  }
});
