/**
   * PLANTILLA DE CASO CLÍNICO - EGCinmuno-App
   * 
   * Instrucciones:
   * 1. Duplica este archivo y nómbralo como `caso-0X.js` (ej. `caso-05.js`) en la carpeta `cases/`.
   * 2. Modifica el ID (ej: "caso-05"), el nombre y la descripción.
   * 3. Rellena los datos demográficos en `patient`.
   * 4. Rellena todos los resultados clínicos en el objeto `results`.
   *    - Las claves siguen el formato: "estudio::especificación"
   *    - Puedes usar formatos descriptivos con palabras clave para ayudar al buscador a encontrar el estudio
   *      (ej: "citometria::CD3 T cells (Linfocitos T / CD3+)" permitirá encontrarlo buscando "CD3" o "Linfocitos T").
   * 5. Registra tu nuevo archivo en `js/cases.js` agregando la línea correspondiente:
   *    document.write('<script src="cases/caso-0X.js"></script>');
   */

if (!window.EGC_CASES) window.EGC_CASES = [];

window.EGC_CASES.push({
  id: "caso-template", // Cambiar por "caso-05", etc.
  name: "Caso de Plantilla", // Nombre visible en el examen
  description: "Descripción clínica resumida visible en el selector",
  status: "draft", // "draft" para borrador (no visible para alumnos) o "published" para publicado
  patient: {
    age: "Edad del paciente (ej: 5 años)",
    gender: "Femenino / Masculino / No especificado",
    symptomOnset: "Inicio de síntomas (ej: Desde los 6 meses de vida)"
  },
  results: {
    // 🧑‍⚕️ Información del paciente (Requerido)
    "info-paciente::general": "INFORMACIÓN GENERAL DEL PACIENTE:\n• Edad: ... \n• Género: ... \n• Resumen ...",
    "info-paciente::edad y género": "Edad: ... Género: ...",
    "info-paciente::inicio de síntomas": "Inicio de síntomas: ...",
    "info-paciente::motivo de consulta": "Motivo de consulta: ...",
    "info-paciente::infecciones": "Detalle de infecciones presentadas por el paciente...",

    // 👨‍👩‍👧‍👦 Antecedentes familiares (Requerido)
    "antecedentes::abuelos/tíos": "Detalle completo de antecedentes familiares y árbol genealógico...",
    "antecedentes::parentales": "Antecedentes de los padres...",
    "antecedentes::hermanos": "Antecedentes de hermanos/hermanas...",

    // 🩸 Hemograma (Requerido)
    "hemograma::completo": "Hemograma completo:\n• Leucocitos: .../μL\n• Linfocitos: .../μL\n• Neutrófilos: .../μL\n• Plaquetas: .../μL\n• Hemoglobina: ... g/dL\nCONCLUSIÓN: ...",

    // ⚗️ Citometría de Flujo (CD3, CD4, CD8, CD19, NK, Células de Memoria)
    "citometria::CD3 T cells (Linfocitos T / CD3+)": "Citometría — Linfocitos T (CD3+):\n...",
    "citometria::CD4 T cells (Linfocitos T CD4+ / Helper / Cooperadores)": "Citometría — Linfocitos T CD4+:\n...",
    "citometria::CD8 T cells (Linfocitos T CD8+ / Citotoxicos)": "Citometría — Linfocitos T CD8+:\n...",
    "citometria::CD19 B cells (Linfocitos B / CD19+)": "Citometría — Linfocitos B (CD19+):\n...",
    "citometria::NK cells (Celulas NK / CD56+ CD16+)": "Citometría — Células NK (CD3-CD56+CD16+):\n...",
    "citometria::LB memoria (CD19+CD27+)": "Citometría — Linfocitos B de Memoria (CD19+CD27+):\n...",
    "citometria::CD19+CD27+IgM- (B memoria con cambio de isotipo / switched)": "Citometría — B memoria con cambio de isotipo (CD19+CD27+IgM-):\n...",

    // 🔬 ELISA / Dosaje de Inmunoglobulinas
    "elisa::IgG (Inmunoglobulina G)": "Dosaje — Inmunoglobulina G (IgG):\n...",
    "elisa::IgA (Inmunoglobulina A)": "Dosaje — Inmunoglobulina A (IgA):\n...",
    "elisa::IgM (Inmunoglobulina M)": "Dosaje — Inmunoglobulina M (IgM):\n...",
    "elisa::IgE (Inmunoglobulina E)": "Dosaje — Inmunoglobulina E (IgE):\n...",

    // 💉 Respuesta a Vacunas
    "vacuna::Tétanos (Difteria / Tetanos)": "Respuesta a vacuna — Tétanos:\n...",
    "vacuna::Neumococo (Neumococo 23v / conjugada)": "Respuesta a vacuna — Neumococo:\n...",

    // 🧬 Ensayos Funcionales (Proliferación, Citotoxicidad, Degranulación)
    "funcional::proliferacion::PHA (Fitohemaglutinina / mitogenos)": "Proliferación Celular — PHA:\n...",
    "funcional::proliferacion::anti-CD3 (TCR)": "Proliferación — anti-CD3:\n...",
    "funcional::citotoxicidad::NK (Actividad litica)": "Citotoxicidad NK:\n...",
    "funcional::degranulacion::CD107a (NK degranulacion)": "Degranulación NK (CD107a):\n...",

    // 🧬 Western Blot / Detección de proteínas
    "western-blot::BTK (XLA / Agammaglobulinemia de Bruton)": "Western Blot para BTK:\n...",
    "western-blot::WASp (Wiskott-Aldrich)": "Western Blot para WASp:\n...",

    // 🧪 Sanger / PCR / RT-PCR
    "pcr::BTK (Sanger / RT-PCR)": "RT-PCR para BTK mRNA:\n...",
    "pcr::WAS (Sanger / RT-PCR)": "RT-PCR para WAS mRNA:\n...",

    // 🌳 Segregación Familiar (Genética)
    "segregacion::normal (Analisis genetico)": "Segregación familiar:\n...",

    // 🧑‍⚕️💬 Interconsultas médicas
    "interconsulta::Gastrointestinal (Gastroenterologia)": "Gastroenterología: ...",
    "interconsulta::Dermatología": "Dermatología: ...",
    "interconsulta::Neurología": "Neurología: ...",
    "interconsulta::Infectología": "Infectología: ...",
    "interconsulta::Cardiología": "Cardiología: ...",

    // 🛡️ Autoanticuerpos
    "autoanticuerpos::ANA (FAN)": "Anticuerpos Antinucleares (ANA): ...",
    "autoanticuerpos::anti-DNA": "Anticuerpos anti-DNA: ...",

    // 🩻 Ecografía y Tomografía
    "ecografia::completa": "Ecografía abdominal:\n...",
    "tomografia::de tórax": "Tomografía computada de tórax:\n..."
  }
});
