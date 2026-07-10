if (!window.EGC_CASES) window.EGC_CASES = [];

window.EGC_CASES.push({
  id: "caso-04",
  name: "Caso 4",
  description: "TP7-A",
  status: "published",
  patient: {
    age: "2 años y 11 meses",
    gender: "Masculino"
  },
  results: {
    // Info general
    "info-paciente::general": "INFORMACIÓN DEL PACIENTE:\n• Edad: 2 años y 11 meses\n• Género: Masculino",
    "info-paciente::edad y género": "Edad: 2 años y 11 meses. Género: Masculino.",
    "info-paciente::inicio de síntomas": "Inicio de síntomas: Desde los 3 meses de vida, caracterizado por episodios de broncoespasmo obstructivo recurrente (BOR).",
    "info-paciente::motivo de consulta": "Motivo de consulta: Evaluación de la función inmunológica tras internación en terapia intensiva por Salmonellosis grave con fallo multiorgánico",
    "info-paciente::infecciones": "Infecciones: Salmonellosis grave con fallo multiorgánico a los 1 año y 10 meses. Neumonía Adquirida en la Comunidad (NAC). Antecedentes de Broncoespasmo Obstructivo Recurrente (BOR) e infecciones respiratorias a repetición desde los 3 meses de edad.",

    // Antecedentes
    "antecedentes::abuelos/tíos": "ANTECEDENTES FAMILIARES (completos):\nPadres jóvenes y sanos, no consanguíneos. Hijo único. Sin antecedentes familiares conocidos de inmunodeficiencias, enfermedades autoinmunes ni muertes tempranas de causa infecciosa.",
    "antecedentes::parentales": "ANTECEDENTES — PADRES:\n• Madre (28 años): sana.\n• Padre (31 años): sano.\nNo consanguíneos. Sin antecedentes de infecciones recurrentes.",
    "antecedentes::hermanos": "ANTECEDENTES — HERMANOS:\nHijo único. No tiene hermanos.",

    // Hemograma
    "hemograma::completo": "Hemograma completo:\n• Leucocitos: 8.800/μL (normal)\n• Monocitos: 8% (Abs: 704/μL, normal)\n• Neutrófilos: 58% (Abs: 5.104/μL, normal)\n• Linfocitos Totales: 32% (Abs: 2.816/μL, normal-bajo)\n• Plaquetas: 277.000/μL (normal)\n• Hemoglobina: 11.5 g/dL (normal)",

    // Citometría de flujo
    "citometria::CD3 T cells (Linfocitos T / CD3+)": "Citometría — Linfocitos T (CD3+):\nCD3+ = 73% (Abs del reporte: 5.813/μL; Abs calculado según hemograma: 2.056/μL).\n",
    "citometria::CD4 T cells (Linfocitos T CD4+ / Helper / Cooperadores)": "Citometría — Linfocitos T CD4+:\nCD4+ = 30% (Abs del reporte: 2.360/μL; Abs calculado según hemograma: 845/μL).\n",
    "citometria::CD8 T cells (Linfocitos T CD8+ / Citotoxicos)": "Citometría — Linfocitos T CD8+:\nCD8+ = 38% (Abs del reporte: 3.038/μL; Abs calculado según hemograma: 1.070/μL).\n",
    "citometria::CD19 B cells (Linfocitos B / CD19+)": "Citometría — Linfocitos B (CD19+):\nCD19+ = 17% (Abs calculado según hemograma: 479/μL).\n.",
    "citometria::NK cells (Celulas NK / CD56+ CD16+)": "Citometría — Células NK (CD3-CD56+CD16+):\nNK = 10% (Abs del reporte: 775/μL; Abs calculado según hemograma: 282/μL).\n",
    "citometria::LB memoria (CD19+CD27+)": "Citometría — Linfocitos B de Memoria (CD19+CD27+):\nCD19+CD27+ = 38% (dentro del total de células B CD19+).\n",
    "citometria::CD19+CD27+IgM- (B memoria con cambio de isotipo / switched)": "Citometría — B memoria con cambio de isotipo (CD19+CD27+IgM-):\nCD19+CD27+IgM- = 2.5% (dentro del total de células B CD19+).\n",

    // ELISA / Dosaje
    "elisa::IgG (Inmunoglobulina G)": "Dosaje — Inmunoglobulina G (IgG):\nIgG sérica = 356 mg/dL (VN: 500-1300 mg/dL).\n",
    "elisa::IgA (Inmunoglobulina A)": "Dosaje — Inmunoglobulina A (IgA):\nIgA sérica = 31 mg/dL (VN: 20-100 mg/dL).\n",
    "elisa::IgM (Inmunoglobulina M)": "Dosaje — Inmunoglobulina M (IgM):\nIgM sérica = 40 mg/dL (VN: 40-150 mg/dL).\n",
    "elisa::IgE (Inmunoglobulina E)": "Dosaje — Inmunoglobulina E (IgE):\nIgE sérica: No detectable\n",

    // Vacunas
    "vacuna::Tétanos (Difteria / Tetanos)": "Respuesta a vacuna — Tétanos:\nTítulo pre-refuerzo: 0.05 UI/mL (no protector).\nTítulo post-refuerzo (1 mes): 0.12 UI/mL (protector limítrofe, VN protector: ≥ 0.1 UI/mL).\nRESULTADO: Respuesta vacunal a antígenos proteicos conservada pero limítrofe.",
    "vacuna::Neumococo (Neumococo 23v / conjugada)": "Respuesta a vacuna — Neumococo:\nTítulos IgG post-vacunación: Adecuados para 6 de los 10 serotipos evaluados.\nRESULTADO: Respuesta a antígenos polisacáridos parcial.",

    // Ensayos funcionales
    "funcional::proliferacion::PHA (Fitohemaglutinina / mitogenos)": "Proliferación Celular — PHA:\nÍndice de estimulación (IE): 15 (normal, VN: IE > 10).\nCONCLUSIÓN: Respuesta mitogénica de células T conservada.",
    "funcional::proliferacion::anti-CD3 (TCR)": "Proliferación — anti-CD3:\nIE: 12 (normal, VN: > 10).\nCONCLUSIÓN: Activación y proliferación T vía TCR conservada.",
    "funcional::citotoxicidad::NK (Actividad litica)": "Citotoxicidad NK (ratio 10:1):\nActividad lítica: 42% (normal, VN: 20–50%).\nCONCLUSIÓN: Función citotóxica NK normal.",
    "funcional::degranulacion::CD107a (NK degranulacion)": "Degranulación NK (CD107a):\nCD107a+ post-activación: 25% (normal, VN: > 20%).\nCONCLUSIÓN: Degranulación NK conservada.",

    // Western Blot
    "western-blot::BTK (XLA / Agammaglobulinemia de Bruton)": "Western Blot para BTK:\nSe observa banda de intensidad normal en el peso molecular esperado (~76 kDa).\nRESULTADO: Expresión de proteína BTK normal.",
    "western-blot::WASp (Wiskott-Aldrich)": "Western Blot para WASp:\nSe observa banda de intensidad normal en el peso molecular esperado (~53 kDa).\nRESULTADO: Expresión de proteína WASp normal.",

    // PCR
    "pcr::BTK (Sanger / RT-PCR)": "RT-PCR para BTK mRNA:\nPresencia de transcripto de BTK normal.\nCONCLUSIÓN: Expresión y procesamiento de ARNm de BTK normal.",
    "pcr::WAS (Sanger / RT-PCR)": "RT-PCR para WAS mRNA:\nPresencia de transcripto de WAS normal.\nCONCLUSIÓN: Expresión y procesamiento de ARNm de WAS normal.",

    // Segregación
    "segregacion::normal (Analisis genetico)": "Segregación familiar:\nNo se identificaron mutaciones genéticas patogénicas en el probando ni portación en los progenitores para genes asociados a XLA o WAS.\nCONCLUSIÓN: Estudio de segregación genética sin particularidades.",

    // Interconsultas
    "interconsulta::Gastrointestinal (Gastroenterologia)": "Gastroenterología: Paciente evaluado por antecedente de Salmonellosis con fallo multiorgánico. Coprocultivos de control negativos. Actualmente sin diarrea, buena tolerancia alimentaria y curva de crecimiento y peso normales.",
    "interconsulta::Dermatología": "Dermatología: Examen de piel normal, sin eccemas activos ni signos de dermatitis atópica severa.",
    "interconsulta::Neurología": "Neurología: Examen neurológico completo sin particularidades para la edad.",
    "interconsulta::Neumonología": "Neumonología: Paciente con antecedentes de broncoespasmo obstructivo recurrente (BOR). Actualmente clínicamente estable, bajo tratamiento preventivo con corticoides inhalados y rescates intermitentes con salbutamol. Buena ventilación pulmonar sin sibilancias activas.",
    "interconsulta::Infectología": "Infectología: Paciente en seguimiento por hipogammaglobulinemia transitoria de la infancia vs. inmunodeficiencia humoral en estudio. Actualmente bajo tratamiento sustitutivo con gammaglobulina humana y profilaxis antibiótica con trimetoprima-sulfametoxazol (Bactrim) con excelente evolución y sin nuevos eventos infecciosos.",

    // Autoanticuerpos
    "autoanticuerpos::ANA (FAN)": "Anticuerpos Antinucleares (ANA): Negativo.",
    "autoanticuerpos::anti-DNA": "Anticuerpos anti-DNA de doble cadena: Negativo.",

    // Ecografía
    "ecografia::completa": "Ecografía abdominal:\nEvidencia esplenomegalia leve persistente (bazo de 8.2 cm, límite superior para la edad), sin hepatomegalia.",

    // Tomografía
    "tomografia::de tórax": "Tomografía computada de tórax de alta resolución (TCAR):\nSin evidencia GLILD."
  }
});
