/**
 * EGCinmuno-App — Módulo de Internacionalización (i18n)
 * Soporte Bilingüe Profesional: Español (ES) / English (EN)
 */

let currentLang = localStorage.getItem("egc_lang") || "es";

const UI_TRANSLATIONS = {
  es: {
    // Top Bar & Header
    "title_app": "EGC-Inmuno",
    "subtitle_app": "Simulador Clínico",
    "header_brand": "EGC-Inmuno · Consulta y Laboratorio Virtual",
    "session_label": "Sesión:",
    "role_docente": "Docente",
    "btn_logout": "Salir",
    "btn_admin": "Panel Docente",
    "tokens_available": "tokens disponibles",
    "tokens_left": "Tokens restantes",
    "theme_toggle": "Cambiar tema",

    // Welcome Screen (Sin caso)
    "welcome_main_title": "Laboratorio Virtual EGC-Inmuno",
    "welcome_main_sub": "Entorno virtual de simulación clínica y diagnóstico inmunológico",
    "step1_title": "Elegir Paciente",
    "step1_desc": "Seleccioná uno de los <strong>Casos clínicos</strong> del panel izquierdo para comenzar.<br>Verás su ficha y la descripción inicial del cuadro.",
    "step2_title": "Interrogar libremente",
    "step2_desc": "<strong>Interroga</strong> al paciente sobre sus síntomas, antecedentes o el motivo de consulta.",
    "step3_title": "Solicitar Estudios",
    "step3_desc": "<strong>Solicitá</strong> análisis usando la barra de búsqueda.",
    "step4_title": "Gestionar Recursos",
    "step4_desc": "Cada consulta o examen consume <strong>tokens</strong>. Administralos con criterio.",
    "welcome_hint": "👈 Seleccioná un paciente de la lista de la izquierda para comenzar el examen clínico.",

    // Sidebar & Cases
    "cases_title": "Casos Clínicos",
    "sidebar_title": "📋 Casos clínicos disponibles",
    "case_selector_title": "📋 Casos Clínicos",
    "loading_cases": "Cargando casos...",
    "published_badge": "🟢 Publicado",
    "draft_badge": "⚪ Borrador",

    // Free Query Bar
    "free_query_badge": "🔍 Modo libre",
    "free_query_hint": "Describí consulta o estudio que querés preguntar o solicitar",
    "free_query_placeholder": "Escribí aquí tu consulta... ej: 'Motivo de consulta', 'Hemograma', 'Western Blot BTK'...",
    "free_query_placeholder_disabled": "Primero seleccioná un caso clínico...",
    "btn_interpret": "Interpretar →",
    "welcome_bubble_title": "💬 Consulta Inicial / Motivo del Paciente:",
    "welcome_bubble_tip": "💡 Escribí en el cuadro de abajo lo que quieras preguntarle al paciente (ej: <em>'motivo de consulta'</em>, <em>'antecedentes familiares'</em>, <em>'inicio de síntomas'</em>) o solicita un estudio (ej: <em>'hemograma'</em>).",

    // Guided Mode Separator & Tabs
    "guided_separator": "— o usá el modo guiado —",
    "guided_tab_target": "Estudio o Target:",
    "btn_request_study": "Solicitar Estudio",
    "btn_request_cost": "token",

    // History & Findings
    "findings_general_title": "Datos Generales",
    "findings_special_studies": "Estudios Especiales",
    "findings_empty_hint": "🔍 Solicitá estudios de laboratorio para revelar hallazgos en la figura humana.",
    "history_title": "📄 Resultados de esta sesión",
    "history_empty": "Aún no solicitaste ningún estudio.",
    "status_found": "✓ Disponible",
    "status_missing": "✗ No disponible",
    "time_label": "hora",

    // Dialog & Confirmations
    "parse_card_confirm_title": "🎯 Interpretación de tu consulta",
    "parse_card_study_type": "Tipo de estudio:",
    "parse_card_specific": "Consulta específica:",
    "btn_confirm_study": "✓ Confirmar y solicitar",
    "btn_cancel": "✗ Cancelar",
    "btn_continue": "Continuar →",
    "parse_card_incomplete_title": "🔍 Consulta incompleta",
    "parse_card_error_title": "⚠️ No pude interpretar tu consulta",
    "parse_card_error_sub": "Intentá mencionar el tipo de estudio que querés (hacé clic para autocompletar):",
    "parse_example_hint": "Ejemplo: <em>'Quiero pedir un Western Blot de BTK'</em> o <em>'Necesito un hemograma'</em>",
    "no_token_spent": "⚡ No se consumió ningún token.",
    "tokens_insufficient_title": "❌ Tokens insuficientes",
    "tokens_insufficient_body": "Esta consulta requiere <strong>{cost} tokens</strong> (uno por cada analito: {targets}), pero solo te quedan <strong>{current} tokens</strong> para este caso.",
    "sec_query_warning": "⚠️ También detectamos una consulta para '{label}'. Podés solicitarla después de confirmar esta.",
    "followup_label_assay": "Tipo de ensayo",
    "followup_label_stimulus": "Estímulo / Target",
    "followup_label_spec": "Especificación de la consulta",
    "followup_toast_req": "⚠️ Por favor ingresá una especificación",

    // Toasts
    "toast_case_first": "⚠️ Primero seleccioná un caso clínico",
    "toast_no_tokens": "❌ Sin tokens disponibles",
    "toast_last_token": "⚠️ Usaste tu último token",
    "toast_processing": "Procesando",

    // Admin Panel
    "admin_title": "Panel de Administración",
    "admin_badge": "🔐 Acceso Docente",
    "tab_students": "Estudiantes",
    "tab_cases": "Casos Clínicos",
    "tab_settings": "Configuración",
    "tab_audit": "Auditoría & Logs",
    "btn_new_case": "+ Nuevo Caso",
    "btn_sync_cases": "🔄 Sincronizar Locales a Supabase"
  },

  en: {
    // Top Bar & Header
    "title_app": "EGC-Immuno",
    "subtitle_app": "Clinical Simulator",
    "header_brand": "EGC-Immuno · Virtual Consultation & Laboratory",
    "session_label": "Session:",
    "role_docente": "Instructor",
    "btn_logout": "Log out",
    "btn_admin": "Instructor Panel",
    "tokens_available": "tokens available",
    "tokens_left": "Tokens remaining",
    "theme_toggle": "Toggle theme",

    // Welcome Screen (Sin caso)
    "welcome_main_title": "EGC-Immuno Virtual Laboratory",
    "welcome_main_sub": "Virtual clinical simulation and immunological diagnosis environment",
    "step1_title": "Select Patient",
    "step1_desc": "Choose one of the <strong>Clinical Cases</strong> from the left sidebar to start.<br>You will see their patient profile and initial clinical presentation.",
    "step2_title": "Natural Consultation",
    "step2_desc": "<strong>Interview</strong> the patient about their symptoms, family background, or chief complaint.",
    "step3_title": "Order Diagnostic Tests",
    "step3_desc": "<strong>Request</strong> laboratory tests using the search bar.",
    "step4_title": "Manage Resources",
    "step4_desc": "Each consultation or assay consumes <strong>tokens</strong>. Spend them judiciously.",
    "welcome_hint": "👈 Select a patient from the list on the left to begin the clinical workup.",

    // Sidebar & Cases
    "cases_title": "Clinical Cases",
    "sidebar_title": "📋 Available Clinical Cases",
    "case_selector_title": "📋 Clinical Cases",
    "loading_cases": "Loading cases...",
    "published_badge": "🟢 Published",
    "draft_badge": "⚪ Draft",

    // Free Query Bar
    "free_query_badge": "🔍 Free Mode",
    "free_query_hint": "Describe the question or diagnostic test you wish to order",
    "free_query_placeholder": "Type your query here... e.g. 'Chief complaint', 'CBC', 'Western Blot BTK'...",
    "free_query_placeholder_disabled": "First select a clinical case...",
    "btn_interpret": "Interpret →",
    "welcome_bubble_title": "💬 Initial Consultation / Patient Presentation:",
    "welcome_bubble_tip": "💡 Type in the box below what you want to ask the patient (e.g., <em>'chief complaint'</em>, <em>'family history'</em>, <em>'symptom onset'</em>) or order a test (e.g., <em>'complete blood count'</em>).",

    // Guided Mode Separator & Tabs
    "guided_separator": "— or use guided mode —",
    "guided_tab_target": "Assay or Target:",
    "btn_request_study": "Request Study",
    "btn_request_cost": "token",

    // History & Findings
    "findings_general_title": "General Demographics",
    "findings_special_studies": "Specialized Studies",
    "findings_empty_hint": "🔍 Request laboratory studies to reveal clinical findings on the human figure.",
    "history_title": "📄 Session Results & Log",
    "history_empty": "You have not ordered any tests yet.",
    "status_found": "✓ Available",
    "status_missing": "✗ Not available",
    "time_label": "time",

    // Dialog & Confirmations
    "parse_card_confirm_title": "🎯 Query Interpretation",
    "parse_card_study_type": "Study type:",
    "parse_card_specific": "Specific target:",
    "btn_confirm_study": "✓ Confirm and Request",
    "btn_cancel": "✗ Cancel",
    "btn_continue": "Continue →",
    "parse_card_incomplete_title": "🔍 Incomplete Query",
    "parse_card_error_title": "⚠️ Could not interpret your query",
    "parse_card_error_sub": "Try specifying the type of study you want (click to autocomplete):",
    "parse_example_hint": "Example: <em>'I want to order a Western Blot for BTK'</em> or <em>'I need a complete blood count'</em>",
    "no_token_spent": "⚡ No tokens were consumed.",
    "tokens_insufficient_title": "❌ Insufficient tokens",
    "tokens_insufficient_body": "This query requires <strong>{cost} tokens</strong> (one per analyte: {targets}), but you only have <strong>{current} tokens</strong> remaining for this case.",
    "sec_query_warning": "⚠️ We also detected a query for '{label}'. You can request it after confirming this one.",
    "followup_label_assay": "Assay type",
    "followup_label_stimulus": "Stimulus / Target",
    "followup_label_spec": "Query specification",
    "followup_toast_req": "⚠️ Please enter a specific target or analyte",

    // Toasts
    "toast_case_first": "⚠️ Please select a clinical case first",
    "toast_no_tokens": "❌ No tokens available",
    "toast_last_token": "⚠️ You used your last token",
    "toast_processing": "Processing",

    // Admin Panel
    "admin_title": "Instructor Dashboard",
    "admin_badge": "🔐 Instructor Access",
    "tab_students": "Students",
    "tab_cases": "Clinical Cases",
    "tab_settings": "Settings",
    "tab_audit": "Audit & Logs",
    "btn_new_case": "+ New Case",
    "btn_sync_cases": "🔄 Sync Local Cases to Supabase"
  }
};

/**
 * Diccionario de títulos y etiquetas médicas para UI
 */
const LABELS_DICTIONARY_EN = {
  // Géneros
  "masculino": "Male",
  "femenino": "Female",
  "no especificado": "Not specified",
  "paciente": "Patient",

  // Nombres de casos
  "caso 1": "Case 1",
  "caso 2": "Case 2",
  "caso 3": "Case 3",
  "caso 4": "Case 4",
  "caso 3 — niña con eccema, trombocitopenia e infecciones": "Case 3 — Female child with eczema, thrombocytopenia and infections",

  // Tipos de estudio
  "información del paciente": "Patient Information",
  "informacion del paciente": "Patient Information",
  "antecedentes familiares": "Family History",
  "antecedentes": "Family History",
  "western blot": "Western Blot",
  "hemograma": "Complete Blood Count (CBC)",
  "citometría de flujo": "Flow Cytometry",
  "citometria de flujo": "Flow Cytometry",
  "elisa / dosaje": "ELISA / Dosage",
  "sanger / pcr / rt-pcr": "Sanger / PCR / RT-PCR",
  "interconsulta médica": "Medical Consultation",
  "interconsulta medica": "Medical Consultation",
  "anticuerpos de autoinmunidad": "Autoimmunity Antibodies",
  "respuesta a vacunas": "Vaccine Response",
  "segregación familiar": "Family Segregation",
  "segregacion familiar": "Family Segregation",
  "ensayo funcional": "Functional Assay",
  "ecografía abdominal": "Abdominal Ultrasound",
  "ecografia abdominal": "Abdominal Ultrasound",
  "tomografía computada": "Computed Tomography (CT)",
  "tomografia computada": "Computed Tomography (CT)",

  // Subtipos
  "proliferación celular": "Cell Proliferation",
  "citotoxicidad": "Cytotoxicity",
  "producción de citoquinas": "Cytokine Production",
  "degranulación": "Degranulation",
  "vía del interferón": "Interferon Pathway",

  // Targets comunes
  "abuelos/tíos": "grandparents/uncles",
  "abuelos/tios": "grandparents/uncles",
  "parentales": "parents",
  "hermanos": "siblings",
  "hermanos/hermanas": "siblings",
  "inicio de síntomas": "symptom onset",
  "inicio de sintomas": "symptom onset",
  "motivo de consulta": "chief complaint",
  "edad y género": "age and gender",
  "edad y genero": "age and gender",
  "infecciones": "infections",
  "completo": "complete",
  "completa": "complete",
  "de tórax": "chest",
  "de torax": "chest",
  "dermatología": "Dermatology",
  "neurología": "Neurology",
  "gastroenterología": "Gastroenterology",
  "gastrointestinal": "Gastrointestinal",
  "cardiología": "Cardiology",
  "neumonología": "Pulmonology",
  "infectología": "Infectious Diseases",

  // Regiones anatómicas de la silueta
  "sistema respiratorio": "Respiratory System",
  "sistema cardiovascular": "Cardiovascular System",
  "hematopoyético & inmunoglobulinas": "Hematopoietic & Immunoglobulins",
  "hematopoyetico & inmunoglobulinas": "Hematopoietic & Immunoglobulins",
  "piel & tegumentario": "Skin & Integumentary",
  "sistema osteoarticular": "Osteoarticular System",
  "ensayos funcionales": "Functional Assays",
  "detección de proteínas (western blot)": "Protein Detection (Western Blot)",
  "estudios de biología molecular": "Molecular Biology Studies",
  "segregación genética": "Genetic Segregation"
};

/**
 * Diccionario de patrones médicos por frases completas para evitar Spanglish
 */
const MEDICAL_GLOSSARY_EN = [
  // 1. Frases y encabezados principales
  [/\bINFORMACIÓN DEL PACIENTE:\b/gi, "PATIENT INFORMATION:"],
  [/\bANTECEDENTES — PADRES:\b/gi, "FAMILY HISTORY — PARENTS:"],
  [/\bANTECEDENTES — HERMANOS\/HERMANAS:\b/gi, "FAMILY HISTORY — SIBLINGS:"],
  [/\bANTECEDENTES — HERMANOS:\b/gi, "FAMILY HISTORY — SIBLINGS:"],
  [/\bANTECEDENTES FAMILIARES \(completos\):\b/gi, "FAMILY HISTORY (complete):"],
  [/\bANTECEDENTES FAMILIARES\b/gi, "FAMILY HISTORY"],
  [/\bAntecedentes abuelos\/tíos:\b/gi, "Grandparents/uncles history:"],
  [/\bAntecedentes abuelos\/tios:\b/gi, "Grandparents/uncles history:"],

  // Casos y presentaciones clínicas
  [/\bCaso (\d+) — Niña con eccema, trombocitopenia e infecciones\b/gi, "Case $1 — Female child with eczema, thrombocytopenia, and infections"],
  [/\bNiña con eccema severo desde los primeros meses de vida, trombocitopenia y múltiples infecciones recurrentes\./gi, "Female child with severe eczema since the first months of life, thrombocytopenia, and multiple recurrent infections."],
  [/\bCaso (\d+)\b/gi, "Case $1"],

  // Relaciones familiares complejas en antecedentes
  [/\bUn tío materno \(hermano de la madre\) falleció a los (\d+) años de neumonía de repetición\b/gi, "A maternal uncle (mother's brother) died at $1 years of age from recurrent pneumonia"],
  [/\bUn tío materno \(hermano de la madre\) falleció a los (\d+) años\b/gi, "A maternal uncle (mother's brother) died at $1 years of age"],
  [/\bUn tío materno \(hermano de la madre\)\b/gi, "A maternal uncle (mother's brother)"],
  [/\bUn tío paterno \(hermano del padre\)\b/gi, "A paternal uncle (father's brother)"],
  [/\bUna tía materna \(hermana de la madre\)\b/gi, "A maternal aunt (mother's sister)"],
  [/\bUna tía paterna \(hermana del padre\)\b/gi, "A paternal aunt (father's sister)"],
  [/\bUn tío materno\b/gi, "A maternal uncle"],
  [/\bUn tío paterno\b/gi, "A paternal uncle"],
  [/\bUna tía materna\b/gi, "A maternal aunt"],
  [/\bUna tía paterna\b/gi, "A paternal aunt"],
  [/\bTío materno \((\d+) años\): trombocitopenia crónica y eccema leve desde la infancia \(sin diagnóstico\)\./gi, "Maternal uncle ($1 years old): chronic thrombocytopenia and mild eczema since childhood (undiagnosed)."],
  [/\bTío materno \(♂, (\d+) años\): AFECTADO LEVE — hemicigoto, misma mutación hipomórfica\./gi, "Maternal uncle (♂, $1 years old): MILDLY AFFECTED — hemizygous, same hypomorphic mutation."],
  [/\bTío materno \(♂, fallecido\): Probable AFECTADO \(no disponible para estudio\)\./gi, "Maternal uncle (♂, deceased): Probable AFFECTED (unavailable for study)."],
  [/\bTío paterno: Linfoma no Hodgkin a los (\d+) años\./gi, "Paternal uncle: Non-Hodgkin lymphoma at $1 years of age."],
  [/\bAbuela paterna: 'cáncer de sangre' \(sin documentar\) a los (\d+) años\./gi, "Paternal grandmother: 'blood cancer' (undocumented) at $1 years of age."],
  [/\bAbuela paterna sana\b/gi, "Paternal grandmother healthy"],
  [/\bAbuelo paterno sano\b/gi, "Paternal grandfather healthy"],
  [/\bAbuela materna: sana\. Sin consanguinidad parental\./gi, "Maternal grandmother: healthy. No parental consanguinity."],
  [/\bAbuela materna \(♀\): PORTADORA — heterocigota\. Asintomática\./gi, "Maternal grandmother (♀): CARRIER — heterozygous. Asymptomatic."],
  [/\bAbuela materna sana\. Abuelo materno sano\./gi, "Maternal grandmother healthy. Maternal grandfather healthy."],
  [/\bAbuela materna sana\b/gi, "Maternal grandmother healthy"],
  [/\bAbuelo materno sano\b/gi, "Maternal grandfather healthy"],
  [/\bSin otro familiar con historia similar documentada\./gi, "No other family member with documented similar history."],
  [/\bSin otro familiar con historia similar documentada\b/gi, "No other family member with documented similar history"],
  [/\bSin otros antecedentes familiares de relevancia\b/gi, "No other relevant family history"],
  [/\bSin antecedentes familiares conocidos de inmunodeficiencias, enfermedades autoinmunes ni muertes tempranas de causa infecciosa\./gi, "No known family history of immunodeficiencies, autoimmune disorders, or early deaths from infectious causes."],
  [/\bPadres jóvenes y sanos, no consanguíneos\. Hijo único\./gi, "Young and healthy parents, non-consanguineous. Only child."],
  [/\bHijo único\. No tiene hermanos\./gi, "Only child. Has no siblings."],
  [/\bHijo único\b/gi, "Only child"],

  // Padres y Consanguinidad
  [/\bPadre \(♂, (\d+) años\): sano, sin enfermedades crónicas ni infecciones recurrentes\./gi, "Father (♂, $1 years old): healthy, without chronic diseases or recurrent infections."],
  [/\bMadre \(♀, (\d+) años\): sana\.\s*No CONSANGUÍNEOS\./gi, "Mother (♀, $1 years old): healthy. NON-CONSANGUINEOUS."],
  [/\bMadre \(♀, (\d+) años\): sana\./gi, "Mother (♀, $1 years old): healthy."],
  [/\bMadre \((\d+) años\): sana\./gi, "Mother ($1 years old): healthy."],
  [/\bPadre \((\d+) años\): sano\./gi, "Father ($1 years old): healthy."],
  [/\bPadre \(♂, (\d+) años\): DM2 en tratamiento\./gi, "Father (♂, $1 years old): T2D on treatment."],
  [/\bMadre \((\d+) años\): artritis reumatoidea diagnosticada a los (\d+) años, en remisión con MTX\./gi, "Mother ($1 years old): rheumatoid arthritis diagnosed at $2 years of age, in remission on MTX."],
  [/\bMadre \(♀, (\d+) años\): sana\. Refiere un hermano \(tío materno, (\d+) años\) con trombocitopenia y eccema crónicos no diagnosticados\./gi, "Mother (♀, $1 years old): healthy. Reports a brother (maternal uncle, $2 years old) with undiagnosed chronic thrombocytopenia and eczema."],
  [/\bPadre \(♂, (\d+) años\): sano, sin antecedentes relevantes\./gi, "Father (♂, $1 years old): healthy, without relevant background."],
  [/\bNo consanguíneos\. Sin antecedentes de infecciones recurrentes\./gi, "Non-consanguineous. No history of recurrent infections."],
  [/\bNo CONSANGUÍNEOS\./gi, "NON-CONSANGUINEOUS."],
  [/\bNo consanguíneos\./gi, "Non-consanguineous."],
  [/\bNo consanguíneos\b/gi, "Non-consanguineous"],
  [/\bConsanguíneos\b/gi, "Consanguineous"],
  [/\bPaciente es primogénito\. SIN HERMANOS conocidos hasta la fecha de consulta\./gi, "Patient is the first-born. NO SIBLINGS known to date of consultation."],
  [/\bHermano \(♂, (\d+) años\): sano, sin patologías crónicas ni infecciones a repetición\.\s*Solo 1 hermano conocido\. No hay hermanas\./gi, "Brother (♂, $1 years old): healthy, without chronic pathologies or recurrent infections. Only 1 known brother. No sisters."],
  [/\bHermano \(♂, (\d+) años\): sano, sin eccema, sin trombocitopenia, sin infecciones recurrentes\. Hemograma y plaquetas normales\.\s*Solo 1 hermano conocido\. Hermano no afectado\./gi, "Brother (♂, $1 years old): healthy, without eczema, thrombocytopenia, or recurrent infections. Normal CBC and platelets. Only 1 known brother. Brother unaffected."],

  // Motivo de Consulta & Presentación
  [/\bAntecedentes de infecciones bacterianas recurrentes desde los (\d+) meses de vida \(otitis, neumonías, sinusitis\)\./gi, "History of recurrent bacterial infections since $1 months of age (otitis, pneumonias, sinusitis)."],
  [/\bMotivo de consulta: Infecciones bacterianas\./gi, "Chief complaint: Bacterial infections."],
  [/\bMotivo de consulta: Linfadenopatia generalizada \+ esplenomegalia detectada en ecografia\. Pérdida de (\d+) kg en (\d+) meses\./gi, "Chief complaint: Generalized lymphadenopathy + splenomegaly detected on ultrasound. Loss of $1 kg in $2 months."],
  [/\bMotivo de consulta: Linfadenopatia generalizada con esplenomegalia \(ecografia abdominal\)\. Fiebre de origen desconocido y pérdida de peso involuntaria\. Solicita estudio de causa hematológica vs infecciosa vs autoinmune\./gi, "Chief complaint: Generalized lymphadenopathy with splenomegaly (abdominal ultrasound). Fever of unknown origin and involuntary weight loss. Requests workup for hematologic vs infectious vs autoimmune etiology."],
  [/\bMotivo de consulta: Eccema resistente a tratamiento \+ otitis media recurrentes \((\d+) episodios en (\d+) años\) \+ plaquetas bajas con volumen reducido\./gi, "Chief complaint: Treatment-resistant eczema + recurrent otitis media ($1 episodes in $2 years) + low platelets with reduced volume."],
  [/\bMotivo de consulta: Niña con eccema, trombocitopenia e infecciones recurrentes\. Referida por sospecha de inmunodeficiencia primaria asociada a trombocitopenia\./gi, "Chief complaint: Female child with eczema, thrombocytopenia, and recurrent infections. Referred for suspected primary immunodeficiency associated with thrombocytopenia."],
  [/\bMotivo de consulta: Evaluación de la función inmunológica tras internación en terapia intensiva por Salmonellosis grave con fallo multiorgánico\b/gi, "Chief complaint: Immunological function evaluation following ICU admission for severe Salmonellosis with multiorgan failure"],
  [/\bInicio de síntomas: (\d+) meses de vida\.\s*Infecciones bacterianas severas a repetición desde los (\d+) meses \(otitis media\)\. Requirieron hospitalizaciones repetidas\./gi, "Symptom onset: $1 months of age.\nSevere recurrent bacterial infections since $2 months (otitis media). Required repeated hospitalizations."],
  [/\bInicio de síntomas: Hace (\d+) meses \(linfadenopatias progresivas, fiebre vespertina, sudoración nocturna\)\b/gi, "Symptom onset: 4 months ago (progressive lymphadenopathy, evening fever, night sweats)"],
  [/\bInicio de síntomas: Hace (\d+) meses\.\s*Primeras manifestaciones: aparición progresiva de ganglios inflamados en cuello, axilas e ingles\. Fiebre vespertina \(hasta ([0-9\.]+) °C\), sudoración nocturna empapante y pérdida de peso de (\d+) kg en (\d+) meses\./gi, "Symptom onset: $1 months ago.\nInitial manifestations: progressive appearance of swollen lymph nodes in neck, armpits, and groins. Evening fever (up to $2 °C), drenching night sweats, and weight loss of $3 kg in $4 months."],
  [/\bInicio de síntomas: Primer mes de vida \(eccema severo\)\. Trombocitopenia detectada al mes de vida\./gi, "Symptom onset: First month of life (severe eczema). Thrombocytopenia detected at 1 month of age."],
  [/\bInicio de síntomas: Desde el primer mes de vida\.\s*Primeras manifestaciones: eccema severo y generalizado resistente a corticoides tópicos desde el mes de vida\. Trombocitopenia detectada en hemograma del primer mes\. Otitis media recurrente a partir de los (\d+) meses \((\d+) episodios en (\d+) años\)\./gi, "Symptom onset: Since the first month of life.\nInitial manifestations: severe generalized eczema resistant to topical corticosteroids since 1 month of age. Thrombocytopenia detected on 1st-month CBC. Recurrent otitis media starting at $1 months ($2 episodes in $3 years)."],
  [/\bInicio de síntomas: Desde los (\d+) meses de vida, caracterizado por episodios de broncoespasmo obstructivo recurrente \(BOR\)\./gi, "Symptom onset: Since $1 months of age, characterized by episodes of recurrent obstructive bronchospasm (ROB)."],
  [/\bInfecciones: Infecciones bacterianas recurrentes \(neumonías, otitis media, sinusitis\) desde los (\d+) meses de vida\. Cuadros severos que requirieron múltiples hospitalizaciones\./gi, "Infections: Recurrent bacterial infections (pneumonias, otitis media, sinusitis) since $1 months of age. Severe episodes requiring multiple hospitalizations."],
  [/\bInfecciones: Salmonellosis grave con fallo multiorgánico a los (\d+) año y (\d+) meses\. Neumonía Adquirida en la Comunidad \(NAC\)\. Antecedentes de Broncoespasmo Obstructivo Recurrente \(BOR\) e infecciones respiratorias a repetición desde los (\d+) meses de edad\./gi, "Infections: Severe Salmonellosis with multiorgan failure at $1 year and $2 months of age. Community-Acquired Pneumonia (CAP). History of Recurrent Obstructive Bronchospasm (ROB) and recurrent respiratory infections since $3 months of age."],
  [/\bDesde los (\d+) meses de vida\b/gi, "Since $1 months of age"],
  [/\bDesde el primer mes de vida\b/gi, "Since the first month of life"],
  [/\b(\d+) meses de evolución\b/gi, "$1 months of duration"],

  // Western Blot
  [/\bWestern Blot para ([A-Za-z0-9_\-]+):\s*No se observa banda en el peso molecular esperado \((~?[0-9]+ kDa)\)\. Control positivo presente y correcto\.\s*RESULTADO: Ausencia completa de expresión de ([A-Za-z0-9_\-]+)\./gi, "Western Blot for $1:\nNo band is observed at the expected molecular weight ($2). Positive control present and correct.\nRESULT: Complete absence of $3 expression."],
  [/\bWestern Blot para ([A-Za-z0-9_\-]+):\s*Banda presente a (~?[0-9]+ kDa)\. Intensidad normal respecto al control\.\s*RESULTADO: Expresión normal de ([A-Za-z0-9_\-]+)\./gi, "Western Blot for $1:\nBand present at $2. Normal intensity relative to control.\nRESULT: Normal expression of $3."],
  [/\bWestern Blot para ([A-Za-z0-9_\-]+):\s*Se observa banda de intensidad normal en el peso molecular esperado \((~?[0-9]+ kDa)\)\.\s*RESULTADO: Expresión de proteína ([A-Za-z0-9_\-]+) normal\./gi, "Western Blot for $1:\nBand of normal intensity observed at expected molecular weight ($2).\nRESULT: Normal $3 protein expression."],
  [/\bWestern Blot — p53:\s*Banda a (~?[0-9]+ kDa) con intensidad aumentada \(acumulación proteica\)\.\s*CONCLUSIÓN: Sobreexpresión de p53 compatible con mutación con pérdida de función\./gi, "Western Blot — p53:\nBand at $1 with increased intensity (protein accumulation).\nCONCLUSION: p53 overexpression compatible with loss-of-function mutation."],
  [/\bWestern Blot — WASp:\s*No se detecta banda a (~?[0-9]+ kDa)\. Control positivo correcto\.\s*RESULTADO: Ausencia de expresión de WASp\./gi, "Western Blot — WASp:\nNo band detected at $1. Positive control correct.\nRESULT: Absence of WASp expression."],

  // Hemograma
  [/\bHemograma completo:\b/gi, "Complete blood count (CBC):"],
  [/\bHemograma:\b/gi, "Complete blood count (CBC):"],
  [/\bLeucocitos totales:\b/gi, "Total WBC:"],
  [/\bLeucocitos:\b/gi, "WBC:"],
  [/\bLinfocitos Totales:\b/gi, "Total Lymphocytes:"],
  [/\bLinfocitos:\b/gi, "Lymphocytes:"],
  [/\bNeutrófilos:\b/gi, "Neutrophils:"],
  [/\bMonocitos:\b/gi, "Monocytes:"],
  [/\bEosinófilos:\b/gi, "Eosinophils:"],
  [/\bBasófilos:\b/gi, "Basophils:"],
  [/\bHemoglobina:\b/gi, "Hemoglobin:"],
  [/\bHematocrito:\b/gi, "Hematocrit:"],
  [/\bPlaquetas:\b/gi, "Platelets:"],
  [/\bVPM:\b/gi, "MPV (Mean Platelet Volume):"],
  [/\b\(↓ leve\)\b/gi, "(↓ mild)"],
  [/\b\(↓↓ marcado, VN: 1500–4000\)\b/gi, "(↓↓ marked, Ref: 1500–4000)"],
  [/\b\(↑↑ marcada linfocitosis\)\b/gi, "(↑↑ marked lymphocytosis)"],
  [/\b\(↓ anemia leve\)\b/gi, "(↓ mild anemia)"],
  [/\b\(normal-bajo\)\b/gi, "(normal-low)"],
  [/\bCONCLUSIÓN: Linfopenia significativa\./gi, "CONCLUSION: Significant lymphopenia."],
  [/\bCONCLUSIÓN: Microtrombocitopenia severa\./gi, "CONCLUSION: Severe microthrombocytopenia."],

  // Citometría
  [/\bCitometría — Linfocitos B \(CD19\+\):\s*CD19\+ = ([0-9\.]+)% \(VN: 6–25%\)/gi, "Flow Cytometry — B Lymphocytes (CD19+):\nCD19+ = $1% (Ref: 6–25%)"],
  [/\bCitometría — Linfocitos B \(CD20\+\):\s*CD20\+ = ([0-9\.]+)% \(VN: 6–25%\)/gi, "Flow Cytometry — B Lymphocytes (CD20+):\nCD20+ = $1% (Ref: 6–25%)"],
  [/\bCitometría — Linfocitos T \(CD3\+\):\s*CD3\+ = ([0-9\.]+)% \(VN: 60–85%\)/gi, "Flow Cytometry — T Lymphocytes (CD3+):\nCD3+ = $1% (Ref: 60–85%)"],
  [/\bCitometría — Linfocitos T CD4\+:\s*CD4\+ = ([0-9\.]+)% \(VN: 25–45%\)/gi, "Flow Cytometry — CD4+ T Lymphocytes:\nCD4+ = $1% (Ref: 25–45%)"],
  [/\bCitometría — Linfocitos T CD8\+:\s*CD8\+ = ([0-9\.]+)% \(VN: 20–35%\)/gi, "Flow Cytometry — CD8+ T Lymphocytes:\nCD8+ = $1% (Ref: 20–35%)"],
  [/\bCitometría — Linfocitos B de Memoria \(CD19\+CD27\+\):\s*CD19\+CD27\+ = ([0-9\.]+)% \(VN: 1\.5–10%\)/gi, "Flow Cytometry — Memory B Cells (CD19+CD27+):\nCD19+CD27+ = $1% (Ref: 1.5–10%)"],
  [/\bCitometría — B \(CD19\+\):\s*CD19\+ = 68% \(↑↑\) con co-expresión de CD5\.\s*CONCLUSIÓN: Expansión clonal B, fenotipo sugestivo de LLC\./gi, "Flow Cytometry — B Cells (CD19+):\nCD19+ = 68% (↑↑) with CD5 co-expression.\nCONCLUSION: Clonal B expansion, phenotype suggestive of CLL."],
  [/\bCitometría — CD5\+CD19\+:\s*68% de linfocitos son CD5\+CD19\+, CD23\+, CD38−, IgS kappa restringida\.\s*CONCLUSIÓN: Fenotipo clásico de LLC-B\./gi, "Flow Cytometry — CD5+CD19+:\n68% of lymphocytes are CD5+CD19+, CD23+, CD38−, sIg kappa restricted.\nCONCLUSION: Classic B-CLL phenotype."],
  [/\bCitometría — T CD4\+:\s*8% \(↓ relativo por expansión B\)\. CD4\/CD8: 0\.6 \(invertida\)\.\s*CONCLUSIÓN: Reducción relativa T cooperadores\./gi, "Flow Cytometry — CD4+ T Cells:\n8% (↓ relative due to B expansion). CD4/CD8: 0.6 (inverted).\nCONCLUSION: Relative reduction of helper T cells."],
  [/\bCitometría — T CD4\+: 22% \(↓ leve\)\s*CONCLUSIÓN: Linfopenia T CD4\+ leve\./gi, "Flow Cytometry — CD4+ T Cells: 22% (↓ mild)\nCONCLUSION: Mild CD4+ T lymphopenia."],
  [/\bCitometría — T CD8\+: 18% \(↓, VN: 20–35%\)\s*CONCLUSIÓN: Linfopenia T CD8\+ moderada\./gi, "Flow Cytometry — CD8+ T Cells: 18% (↓, Ref: 20–35%)\nCONCLUSION: Moderate CD8+ T lymphopenia."],
  [/\bCitometría — B CD19\+: 12% \(normal\)\s*CONCLUSIÓN: Linfocitos B normales\./gi, "Flow Cytometry — CD19+ B Cells: 12% (normal)\nCONCLUSION: Normal B lymphocytes."],
  [/\b\(Abs del reporte: ([0-9\.\,]+)\/μL; Abs calculado según hemograma: ([0-9\.\,]+)\/μL\)\./gi, "(Report Abs: $1/μL; CBC-calculated Abs: $2/μL)."],
  [/\b\(Abs calculado según hemograma: ([0-9\.\,]+)\/μL\)\./gi, "(CBC-calculated Abs: $1/μL)."],
  [/\b\(dentro del total de células B CD19\+\)\./gi, "(within total CD19+ B cells)."],
  [/\bCitometría — B memoria con cambio de isotipo \(CD19\+CD27\+IgM-\):\s*CD19\+CD27\+IgM- = ([0-9\.]+)%/gi, "Flow Cytometry — Switched Memory B Cells (CD19+CD27+IgM-):\nCD19+CD27+IgM- = $1%"],

  // PCR / Genética
  [/\bRT-PCR para BTK mRNA:\s*No se detecta producto de amplificación en la muestra del paciente\. Control positivo amplifica correctamente\./gi, "RT-PCR for BTK mRNA:\nNo amplification product is detected in patient sample. Positive control amplifies correctly."],
  [/\bRT-PCR para BTK mRNA:\s*Presencia de transcripto de BTK normal\.\s*CONCLUSIÓN: Expresión y procesamiento de ARNm de BTK normal\./gi, "RT-PCR for BTK mRNA:\nPresence of normal BTK transcript.\nCONCLUSION: Normal BTK mRNA expression and processing."],
  [/\bRT-PCR para WAS mRNA:\s*Presencia de transcripto de WAS normal\.\s*CONCLUSIÓN: Expresión y procesamiento de ARNm de WAS normal\./gi, "RT-PCR for WAS mRNA:\nPresence of normal WAS transcript.\nCONCLUSION: Normal WAS mRNA expression and processing."],
  [/\bRT-PCR WAS mRNA: transcripto presente pero reducido \(~40% del control\)\.\s*CONCLUSIÓN: Expresión reducida, compatible con mutación hipomórfica\./gi, "RT-PCR WAS mRNA: transcript present but reduced (~40% of control).\nCONCLUSION: Reduced expression, compatible with hypomorphic mutation."],
  [/\bSEGREGACIÓN FAMILIAR — Gen BTK \(Xq21\.3\) · Herencia ligada al X:\s*• Probando \(♂, 8 años\): AFECTADO — hemicigoto mutación c\.1684C>T \(p\.Arg562Cys\)\s*• Madre \(♀, 38 años\): PORTADORA — heterocigota\. Asintomática\.\s*• Padre \(♂, 40 años\): No portador \(no aplica cromosoma X\)\.\s*• Tío materno \(♂, fallecido\): Probable AFECTADO \(no disponible para estudio\)\.\s*• Abuela materna \(♀\): PORTADORA — heterocigota\. Asintomática\./gi, "FAMILY SEGREGATION — BTK Gene (Xq21.3) · X-linked Inheritance:\n\n• Proband (♂, 8 years old): AFFECTED — hemizygous mutation c.1684C>T (p.Arg562Cys)\n• Mother (♀, 38 years old): CARRIER — heterozygous. Asymptomatic.\n• Father (♂, 40 years old): Non-carrier (X chromosome does not apply).\n• Maternal uncle (♂, deceased): Probable AFFECTED (unavailable for testing).\n• Maternal grandmother (♀): CARRIER — heterozygous. Asymptomatic."],
  [/\bSEGREGACIÓN — TP53 \(17p13\.1\):\s*Mutación c\.817C>T hallada en células leucémicas: origen SOMÁTICO \(adquirido\)\.\s*• Madre: sin mutación germinal · Padre: sin mutación germinal\.\s*CONCLUSIÓN: Mutación somática\. No hereditaria\. No requiere cribado familiar\./gi, "SEGREGATION — TP53 (17p13.1):\nMutation c.817C>T found in leukemic cells: SOMATIC origin (acquired).\n• Mother: no germline mutation · Father: no germline mutation.\nCONCLUSION: Somatic mutation. Non-hereditary. Does not require family screening."],
  [/\bSEGREGACIÓN — Gen WAS \(Xp11\.22\) · Ligado al X:\s*• Probanda \(♀, 3 años\): AFECTADA — hemicigota \(fenotipo inusual en mujer → sesgo extremo de inactivación X\)\s*• Madre \(♀, 31 años\): PORTADORA — c\.559C>T heterocigota\. Asintomática\.\s*• Padre \(♂\): No portador\.\s*• Hermano \(♂, 6 años\): No afectado \(alelo normal\)\.\s*• Tío materno \(♂, 32 años\): AFECTADO LEVE — hemicigoto, misma mutación hipomórfica\.\s*CONCLUSIÓN: Mutación hipomórfica en WAS con expresión variable\./gi, "SEGREGATION — WAS Gene (Xp11.22) · X-linked:\n\n• Proband (♀, 3 years old): AFFECTED — hemizygous (unusual phenotype in female → extreme X-inactivation skewing)\n• Mother (♀, 31 years old): CARRIER — c.559C>T heterozygous. Asymptomatic.\n• Father (♂): Non-carrier.\n• Brother (♂, 6 years old): Unaffected (normal allele).\n• Maternal uncle (♂, 32 years old): MILDLY AFFECTED — hemizygous, same hypomorphic mutation.\n\nCONCLUSION: Hypomorphic mutation in WAS with variable expression."],
  [/\bSegregación familiar:\s*No se identificaron mutaciones genéticas patogénicas en el probando ni portación en los progenitores para genes asociados a XLA o WAS\.\s*CONCLUSIÓN: Estudio de segregación genética sin particularidades\./gi, "Family segregation:\nNo pathogenic genetic mutations identified in proband nor carrier status in parents for XLA- or WAS-associated genes.\nCONCLUSION: Genetic segregation study unremarkable."],

  // ELISA / Inmunoglobulinas
  [/\bDosaje — Inmunoglobulina G \(IgG\):\s*IgG sérica = ([0-9]+) mg\/dL/gi, "Dosage — Immunoglobulin G (IgG):\nSerum IgG = $1 mg/dL"],
  [/\bDosaje — Inmunoglobulina M \(IgM\):\s*IgM sérica = ([0-9]+) mg\/dL/gi, "Dosage — Immunoglobulin M (IgM):\nSerum IgM = $1 mg/dL"],
  [/\bDosaje — Inmunoglobulina A \(IgA\):\s*IgA sérica = ([0-9]+) mg\/dL/gi, "Dosage — Immunoglobulin A (IgA):\nSerum IgA = $1 mg/dL"],
  [/\bDosaje — Inmunoglobulina E \(IgE\):\s*IgE sérica: No detectable/gi, "Dosage — Immunoglobulin E (IgE):\nSerum IgE: Undetectable"],
  [/\bDosaje — IgG: 480 mg\/dL \(↓, VN: 700–1600\)\s*CONCLUSIÓN: Hipogammaglobulinemia secundaria\./gi, "Dosage — IgG: 480 mg/dL (↓, Ref: 700–1600)\nCONCLUSION: Secondary hypogammaglobulinemia."],
  [/\bDosaje IgG: 920 mg\/dL \(normal\)\s*CONCLUSIÓN: IgG normal\./gi, "Dosage IgG: 920 mg/dL (normal)\nCONCLUSION: Normal IgG."],
  [/\bDosaje IgA: 210 mg\/dL \(↑ elevada, VN 3 años: 20–120 mg\/dL\)\s*CONCLUSIÓN: IgA elevada\./gi, "Dosage IgA: 210 mg/dL (↑ elevated, Ref 3yo: 20–120 mg/dL)\nCONCLUSION: Elevated IgA."],
  [/\bDosaje IgM: 28 mg\/dL \(↓\)\s*CONCLUSIÓN: IgM disminuida\./gi, "Dosage IgM: 28 mg/dL (↓)\nCONCLUSION: Decreased IgM."],

  // Vacunas
  [/\bRespuesta a vacuna — Tétanos:\s*Título pre: < ([0-9\.]+) UI\/mL · Título post: ([0-9\.]+) UI\/mL\s*Nivel protector: ≥ ([0-9\.]+) UI\/mL/gi, "Vaccine response — Tetanus:\nPre-titer: < $1 IU/mL · Post-titer: $2 IU/mL\nProtective level: ≥ $3 IU/mL"],
  [/\bRespuesta a vacuna — Hepatitis B:\s*Anti-HBs post: < 10 mUI\/mL \(VN protector: ≥ 10 mUI\/mL\)/gi, "Vaccine response — Hepatitis B:\nPost Anti-HBs: < 10 mIU/mL (Protective Ref: ≥ 10 mIU/mL)"],
  [/\bRespuesta a vacuna — Neumococo 23v:\s*Títulos anti-polisacáridos: indetectables para todos los serotipos evaluados\./gi, "Vaccine response — Pneumococcal 23v:\nAnti-polysaccharide titers: undetectable for all evaluated serotypes."],
  [/\bRespuesta — Neumococo:\s*Títulos bajos para 12\/23 serotipos\. Compatible con hipogammaglobulinemia secundaria\.\s*RESULTADO: RESPUESTA SUBÓPTIMA\./gi, "Response — Pneumococcus:\nLow titers for 12/23 serotypes. Compatible with secondary hypogammaglobulinemia.\nRESULT: SUBOPTIMAL RESPONSE."],
  [/\bRespuesta — Tétanos:\s*Título post: ([0-9\.]+) UI\/mL \(limítrofe, VN: ≥ 0\.1 UI\/mL\)\s*RESULTADO: RESPUESTA SUBÓPTIMA\./gi, "Response — Tetanus:\nPost-titer: $1 IU/mL (borderline, Ref: ≥ 0.1 IU/mL)\nRESULT: SUBOPTIMAL RESPONSE."],
  [/\bRespuesta — Neumococo conjugada:\s*Adecuada para 8\/13 serotipos \(respuesta T-dependiente parcialmente conservada\)\.\s*RESULTADO: RESPUESTA PARCIAL\./gi, "Response — Conjugated Pneumococcus:\nAdequate for 8/13 serotypes (partially preserved T-dependent response).\nRESULT: PARTIAL RESPONSE."],
  [/\bRespuesta a vacuna — Tétanos:\s*Título pre-refuerzo: ([0-9\.]+) UI\/mL \(no protector\)\.\s*Título post-refuerzo \(1 mes\): ([0-9\.]+) UI\/mL \(protector limítrofe, VN protector: ≥ 0\.1 UI\/mL\)\.\s*RESULTADO: Respuesta vacunal a antígenos proteicos conservada pero limítrofe\./gi, "Vaccine response — Tetanus:\nPre-booster titer: $1 IU/mL (non-protective).\nPost-booster titer (1 month): $2 IU/mL (borderline protective, Protective Ref: ≥ 0.1 IU/mL).\nRESULT: Vaccine response to protein antigens preserved but borderline."],
  [/\bRespuesta a vacuna — Neumococo:\s*Títulos IgG post-vacunación: Adecuados para 6 de los 10 serotipos evaluados\.\s*RESULTADO: Respuesta a antígenos polisacáridos parcial\./gi, "Vaccine response — Pneumococcus:\nPost-vaccination IgG titers: Adequate for 6 of 10 evaluated serotypes.\nRESULT: Partial polysaccharide antigen response."],

  // Ensayos funcionales
  [/\bProliferación Celular — PHA:\s*Índice de estimulación \(IE\): ([0-9\.]+) \(↓↓, VN: IE > 10\)\s*CD4\+ Ki67\+: ([0-9]+)% · CD8\+ Ki67\+: ([0-9]+)%/gi, "Cell Proliferation — PHA:\nStimulation Index (SI): $1 (↓↓, Ref: SI > 10)\nCD4+ Ki67+: $2% · CD8+ Ki67+: $3%"],
  [/\bProliferación — anti-CD3:\s*IE: ([0-9\.]+) \(normal, VN: > 10\)/gi, "Proliferation — anti-CD3:\nSI: $1 (normal, Ref: > 10)"],
  [/\bCitotoxicidad NK \(ratio 10:1\):\s*Actividad lítica: ([0-9]+)% \(VN: 20–50%\)/gi, "NK Cytotoxicity (10:1 ratio):\nLytic activity: $1% (Ref: 20–50%)"],
  [/\bVía del Interferón — STAT1:\s*FosfopSTAT1 tras IFN-γ \(30 min\): ([0-9]+)% \(normal, VN: > 50%\)\s*FosfopSTAT1 tras IFN-α: ([0-9]+)% \(normal\)/gi, "Interferon Pathway — STAT1:\nPhospho-STAT1 after IFN-γ (30 min): $1% (normal, Ref: > 50%)\nPhospho-STAT1 after IFN-α: $2% (normal)"],
  [/\bProliferación — PHA:\s*IE: 6\.2 \(↓ levemente, VN: > 10\)\. Interferido por la linfocitosis B dominante\.\s*CONCLUSIÓN: Función T proliferativa conservada con señal interferida\./gi, "Proliferation — PHA:\nSI: 6.2 (↓ slightly, Ref: > 10). Interfered by dominant B lymphocytosis.\nCONCLUSION: T proliferative function preserved with interfered signal."],
  [/\bCitotoxicidad NK \(10:1\):\s*Actividad lítica: 18% \(↓ leve, VN: 20–50%\)\s*CONCLUSIÓN: Función NK levemente disminuida\./gi, "NK Cytotoxicity (10:1):\nLytic activity: 18% (↓ slight, Ref: 20–50%)\nCONCLUSION: Mildly decreased NK function."],
  [/\bVía del Interferón — JAK1:\s*No se detecta fosfo-JAK1 tras estimulación con IFN-α\.\s*CONCLUSIÓN: Defecto en señalización JAK1 en contexto tumoral\. No necesariamente germinal\./gi, "Interferon Pathway — JAK1:\nNo phospho-JAK1 detected after IFN-α stimulation.\nCONCLUSION: JAK1 signaling defect in tumor context. Not necessarily germline."],
  [/\bProliferación — PHA:\s*IE: 4\.8 \(↓↓, VN: > 10\)\s*CONCLUSIÓN: Respuesta T reducida, compatible con disfunción de citoesqueleto de actina en WAS\./gi, "Proliferation — PHA:\nSI: 4.8 (↓↓, Ref: > 10)\nCONCLUSION: Reduced T response, compatible with actin cytoskeleton dysfunction in WAS."],
  [/\bCitotoxicidad NK \(10:1\): 12% \(↓↓, VN: 20–50%\)\s*CONCLUSIÓN: Función NK significativamente reducida\./gi, "NK Cytotoxicity (10:1): 12% (↓↓, Ref: 20–50%)\nCONCLUSION: Significantly reduced NK function."],
  [/\bDegranulación — CD107a \(NK\):\s*CD107a\+ post-activación: 8% \(↓↓, VN: > 20%\)\s*CONCLUSIÓN: Defecto de degranulación NK por disfunción del citoesqueleto de actina\./gi, "Degranulation — CD107a (NK):\nPost-activation CD107a+: 8% (↓↓, Ref: > 20%)\nCONCLUSION: NK degranulation defect due to actin cytoskeleton dysfunction."],
  [/\bCitoquinas — IFN-γ intracelular \(CD4\+\/PMA\+ionomicina\):\s*3\.2% IFN-γ\+ \(↓, VN: 10–25%\)\s*CONCLUSIÓN: Producción reducida\. Disfunción Th1\./gi, "Cytokines — Intracellular IFN-γ (CD4+/PMA+ionomycin):\n3.2% IFN-γ+ (↓, Ref: 10–25%)\nCONCLUSION: Reduced production. Th1 dysfunction."],
  [/\bVía del Interferón — STAT1:\s*Fosfo-STAT1 tras IFN-γ: 14% \(↓↓, VN: > 50%\)\s*Fosfo-STAT1 tras IFN-α: 11% \(↓↓\)\s*CONCLUSIÓN: Señalización por interferón REDUCIDA\. Defecto funcional en la vía JAK-STAT en contexto de WAS\./gi, "Interferon Pathway — STAT1:\nPhospho-STAT1 after IFN-γ: 14% (↓↓, Ref: > 50%)\nPhospho-STAT1 after IFN-α: 11% (↓↓)\nCONCLUSION: REDUCED interferon signaling. Functional defect in JAK-STAT pathway in WAS context."],
  [/\bProliferación Celular — PHA:\s*Índice de estimulación \(IE\): 15 \(normal, VN: IE > 10\)\.\s*CONCLUSIÓN: Respuesta mitogénica de células T conservada\./gi, "Cell Proliferation — PHA:\nStimulation Index (SI): 15 (normal, Ref: SI > 10).\nCONCLUSION: Preserved T-cell mitogenic response."],
  [/\bProliferación — anti-CD3:\s*IE: 12 \(normal, VN: > 10\)\.\s*CONCLUSIÓN: Activación y proliferación T vía TCR conservada\./gi, "Proliferation — anti-CD3:\nSI: 12 (normal, Ref: > 10).\nCONCLUSION: Preserved T-cell activation and proliferation via TCR."],
  [/\bCitotoxicidad NK \(ratio 10:1\):\s*Actividad lítica: 42% \(normal, VN: 20–50%\)\.\s*CONCLUSIÓN: Función citotóxica NK normal\./gi, "NK Cytotoxicity (10:1 ratio):\nLytic activity: 42% (normal, Ref: 20–50%).\nCONCLUSION: Normal NK cytotoxic function."],
  [/\bDegranulación NK \(CD107a\):\s*CD107a\+ post-activación: 25% \(normal, VN: > 20%\)\.\s*CONCLUSIÓN: Degranulación NK conservada\./gi, "NK Degranulation (CD107a):\nPost-activation CD107a+: 25% (normal, Ref: > 20%).\nCONCLUSION: Preserved NK degranulation."],

  // Interconsultas Médicas
  [/\bDermatología: Paciente refiere eccema leve transitorio en brazos\. Sin lesiones activas relevantes al examen físico\./gi, "Dermatology: Patient reports mild transient arm eczema. No active lesions of relevance on physical examination."],
  [/\bNeurología: Examen neurológico completo normal\. Sin alteraciones ni signos de organicidad\./gi, "Neurology: Complete neurological examination normal. No alterations or signs of organicity."],
  [/\bGastrointestinal: Sin síntomas de malabsorción ni diarrea crónica\. Examen físico abdominal normal\./gi, "Gastrointestinal: No symptoms of malabsorption or chronic diarrhea. Normal abdominal physical exam."],
  [/\bCardiología: Examen cardiovascular normal\. Ruidos cardíacos netos, normofrecuentes, sin soplos\./gi, "Cardiology: Normal cardiovascular exam. Clear heart sounds, regular rate and rhythm, no murmurs."],
  [/\bNeumonología: Evaluado por antecedentes de neumonías bacterianas recurrentes\. Radiografía de tórax previa muestra resolución completa de focos consolidativos\. Espirometría normal para la edad\. Sin evidencia de patología pulmonar crónica activa al momento\./gi, "Pulmonology: Evaluated for history of recurrent bacterial pneumonias. Prior chest X-ray shows complete resolution of consolidative foci. Normal spirometry for age. No evidence of active chronic pulmonary disease at present."],
  [/\bDermatología: No se observan lesiones cutáneas activas ni eccemas\./gi, "Dermatology: No active skin lesions or eczema observed."],
  [/\bNeurología: Examen neurológico sin particularidades\./gi, "Neurology: Neurological examination unremarkable."],
  [/\bGastrointestinal: Sin alteraciones en el ritmo evacuatorio, no se refiere dolor abdominal recurrente\./gi, "Gastrointestinal: No alterations in bowel habits, no recurrent abdominal pain reported."],
  [/\bCardiología: Soplo sistólico eyectivo funcional fisiológico\. ECG dentro de límites normales\./gi, "Cardiology: Physiological functional systolic ejection murmur. ECG within normal limits."],
  [/\bNeumonología: Sin síntomas respiratorios activos\. Examen físico de tórax normal\. Buena ventilación bilateral sin ruidos agregados ni signos de compromiso pulmonar en contexto de adenomegalias mediastínicas\./gi, "Pulmonology: No active respiratory symptoms. Normal chest physical examination. Good bilateral air entry without adventitious sounds or signs of pulmonary involvement in the context of mediastinal lymphadenopathy."],
  [/\bDermatología: Eccema seco generalizado con liquenificación en pliegues flexores \(codos, rodillas\) y cara\. Eritema y excoriaciones por rascado intenso\./gi, "Dermatology: Generalized dry eczema with lichenification in flexural creases (elbows, knees) and face. Erythema and excoriations from intense scratching."],
  [/\bNeurología: Examen neurológico normal\. Sin signos focales\./gi, "Neurology: Normal neurological examination. No focal signs."],
  [/\bGastrointestinal: Episodios intermitentes de diarrea con estrías de sangre \(proctocolitis\)\. Frecuencia de deposiciones aumentada\./gi, "Gastrointestinal: Intermittent episodes of blood-streaked diarrhea (proctocolitis). Increased stool frequency."],
  [/\bCardiología: Ruidos cardíacos normales, normofrecuentes, sin soplos\./gi, "Cardiology: Normal heart sounds, regular rate, no murmurs."],
  [/\bNeumonología: Paciente evaluada por neumonía activa reportada en tomografía\. Se constata buena mecánica respiratoria, saturación 97% al aire ambiente\. Se sugiere continuar tratamiento antibiótico actual y control evolutivo\./gi, "Pulmonology: Patient evaluated for active pneumonia reported on CT. Good respiratory mechanics noted, 97% saturation on room air. Suggest continuing current antibiotic regimen and clinical follow-up."],
  [/\bGastroenterología: Paciente evaluado por antecedente de Salmonellosis con fallo multiorgánico\. Coprocultivos de control negativos\. Actualmente sin diarrea, buena tolerancia alimentaria y curva de crecimiento y peso normales\./gi, "Gastroenterology: Patient evaluated for history of Salmonellosis with multiorgan failure. Follow-up stool cultures negative. Currently without diarrhea, good food tolerance, and normal growth and weight curves."],
  [/\bDermatología: Examen de piel normal, sin eccemas activos ni signos de dermatitis atópica severa\./gi, "Dermatology: Normal skin examination, without active eczema or signs of severe atopic dermatitis."],
  [/\bNeurología: Examen neurológico completo sin particularidades para la edad\./gi, "Neurology: Complete neurological examination unremarkable for age."],
  [/\bNeumonología: Paciente con antecedentes de broncoespasmo obstructivo recurrente \(BOR\)\. Actualmente clínicamente estable, bajo tratamiento preventivo con corticoides inhalados y rescates intermitentes con salbutamol\. Buena ventilación pulmonar sin sibilancias activas\./gi, "Pulmonology: Patient with history of recurrent obstructive bronchospasm (ROB). Currently clinically stable, on preventive inhaled corticosteroid therapy and intermittent salbutamol rescue. Good lung ventilation without active wheezing."],
  [/\bInfectología: Paciente en seguimiento por hipogammaglobulinemia transitoria de la infancia vs\. inmunodeficiencia humoral en estudio\. Actualmente bajo tratamiento sustitutivo con gammaglobulina humana y profilaxis antibiótica con trimetoprima-sulfametoxazol \(Bactrim\) con excelente evolución y sin nuevos eventos infecciosos\./gi, "Infectious Diseases: Patient in follow-up for transient hypogammaglobulinemia of infancy vs. humoral immunodeficiency under investigation. Currently on human immunoglobulin replacement therapy and antibiotic prophylaxis with trimethoprim-sulfamethoxazole (Bactrim) with excellent outcome and no new infectious events."],

  // Autoanticuerpos
  [/\bAnticuerpos Antinucleares \(ANA\): Negativo \(no reactivo\)\. \(No se observan títulos de autoanticuerpos circulantes\)\./gi, "Antinuclear Antibodies (ANA): Negative (non-reactive). (No circulating autoantibody titers observed)."],
  [/\bAnticuerpos anti-DNA de doble cadena: Negativo\./gi, "Anti-double-stranded DNA antibodies: Negative."],
  [/\bANA por IFI: Positivo \(título 1:160, patrón moteado\)\. Compatible con componente autoinmune secundario\./gi, "ANA by IFA: Positive (titer 1:160, speckled pattern). Compatible with secondary autoimmune component."],
  [/\banti-DNA de doble cadena: Negativo\./gi, "Anti-double-stranded DNA: Negative."],
  [/\bAnticuerpos Antinucleares \(ANA\): Negativo\./gi, "Antinuclear Antibodies (ANA): Negative."],
  [/\bAnticuerpos anti-DNA: Negativo\./gi, "Anti-DNA antibodies: Negative."],

  // Ecografía y Tomografía
  [/\bÓrganos abdominales normales, sin esplenomegalia ni hepatomegalia\. No se detecta líquido libre en cavidad peritoneal\./gi, "Normal abdominal organs, without splenomegaly or hepatomegaly. No free peritoneal fluid detected."],
  [/\bEcografía abdominal:\s*Se observa esplenomegalia marcada \(bazo de 18\.5 cm de longitud, VN: < 12 cm\)\. Hígado de tamaño y ecoestructura normal, sin lesiones focales\. Ausencia de líquido libre en cavidad abdominal\./gi, "Abdominal ultrasound:\nMarked splenomegaly observed (spleen length 18.5 cm, Ref: < 12 cm). Liver of normal size and echostructure, without focal lesions. Absence of free abdominal fluid."],
  [/\bEcografía abdominal:\s*Esplenomegalia moderada \(longitud del bazo 9\.8 cm\)\. Hígado y riñones normales sin particularidades\. No se evidencia líquido libre\./gi, "Abdominal ultrasound:\nModerate splenomegaly (spleen length 9.8 cm). Normal liver and kidneys without abnormalities. No free fluid evident."],
  [/\bEcografía abdominal:\s*Evidencia esplenomegalia leve persistente \(bazo de 8\.2 cm, límite superior para la edad\), sin hepatomegalia\./gi, "Abdominal ultrasound:\nEvidences persistent mild splenomegaly (spleen 8.2 cm, upper limit for age), without hepatomegaly."],
  [/\bTomografía computada de tórax:\s*Sin hallazgos patológicos relevantes\. Parénquima pulmonar bien ventilado, sin áreas de consolidación ni de enfermedad intersticial\./gi, "Chest computed tomography:\nNo relevant pathological findings. Well-ventilated lung parenchyma, without areas of consolidation or interstitial disease."],
  [/\bTomografía de tórax:\s*Presencia de múltiples adenomegalias mediastínicas e hiliares \(la mayor de 3\.2 cm\)\. Parénquima pulmonar libre de infiltrados\./gi, "Chest CT:\nPresence of multiple mediastinal and hilar lymphadenopathies (largest 3.2 cm). Lung parenchyma free of infiltrates."],
  [/\bTomografía de tórax:\s*Infiltrados alveolares difusos bilaterales en bases pulmonares, compatibles con proceso infeccioso activo \(neumonía bacteriana vs viral\)\. Sin signos de GLILD\./gi, "Chest CT:\nDiffuse bilateral alveolar infiltrates in lung bases, compatible with active infectious process (bacterial vs viral pneumonia). No signs of GLILD."],
  [/\bTomografía computada de tórax de alta resolución \(TCAR\):\s*Sin evidencia GLILD\./gi, "High-resolution chest computed tomography (HRCT):\nNo evidence of GLILD."],

  // Frases cortas y conectores al final
  [/\bEdad: (\d+) años y (\d+) meses\. Género: Masculino\./gi, "Age: $1 years and $2 months old. Gender: Male."],
  [/\bEdad: (\d+) años\. Género: Masculino\./gi, "Age: $1 years old. Gender: Male."],
  [/\bEdad: (\d+) años\. Género: Femenino\./gi, "Age: $1 years old. Gender: Female."],
  [/\b• Edad: (\d+) años y (\d+) meses/gi, "• Age: $1 years and $2 months old"],
  [/\b• Edad: (\d+) años/gi, "• Age: $1 years old"],
  [/\b• Género: Masculino/gi, "• Gender: Male"],
  [/\b• Género: Femenino/gi, "• Gender: Female"],
  [/\bMasculino\b/gi, "Male"],
  [/\bFemenino\b/gi, "Female"],
  [/\b(\d+) años y (\d+) meses\b/gi, "$1 years and $2 months old"],
  [/\b(\d+) años\b/gi, "$1 years old"],
  [/\b(\d+) meses\b/gi, "$1 months old"],
  [/\bPadre\b/gi, "Father"],
  [/\bMadre\b/gi, "Mother"],
  [/\bHermano\b/gi, "Brother"],
  [/\bHermana\b/gi, "Sister"],
  [/\bsano\b/gi, "healthy"],
  [/\bsana\b/gi, "healthy"],
  [/\bsanos\b/gi, "healthy"]
];

/**
 * Traduce una etiqueta o target médico (ej. "Antecedentes Familiares", "abuelos/tíos", "Masculino")
 */
function translateLabel(label) {
  if (!label || currentLang !== "en") return label;
  const key = String(label).trim().toLowerCase();
  return LABELS_DICTIONARY_EN[key] || label;
}

/**
 * Traduce un texto clínico en memoria si el idioma activo es inglés ('en').
 */
function translateMedicalText(text) {
  if (!text || currentLang !== "en") return text;
  let translated = String(text);
  for (const [regex, replacement] of MEDICAL_GLOSSARY_EN) {
    translated = translated.replace(regex, replacement);
  }
  return translated;
}

/**
 * Traduce una clave estática de la interfaz con soporte para placeholders {name}
 */
function t(key, params = {}) {
  const dict = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.es;
  let str = dict[key] || UI_TRANSLATIONS.es[key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
  }
  return str;
}

/**
 * Cambia el idioma activo y actualiza la interfaz
 */
function setLanguage(lang) {
  if (lang !== "es" && lang !== "en") lang = "es";
  currentLang = lang;
  localStorage.setItem("egc_lang", lang);
  document.documentElement.setAttribute("lang", lang);
  
  updateDOMTranslations();

  // Disparar evento para que exam.js / admin.js se enteren y re-rendericen sus vistas
  window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
}

function toggleLanguage() {
  setLanguage(currentLang === "es" ? "en" : "es");
}

/**
 * Aplica traducciones a los elementos con atributo data-i18n
 */
function updateDOMTranslations() {
  // Actualizar botones toggle
  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.innerHTML = currentLang === "es" 
      ? `<span>🇪🇸 ES</span>` 
      : `<span>🇬🇧 EN</span>`;
    btn.title = currentLang === "es" ? "Cambiar a Inglés (EN)" : "Switch to Spanish (ES)";
  });

  // Traducir todos los elementos marcados con data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (key) {
      el.innerHTML = t(key);
    }
  });

  // Traducir placeholders marcados con data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) {
      el.placeholder = t(key);
    }
  });
}

// Inicialización automática al cargar
document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("lang", currentLang);
  updateDOMTranslations();

  // Escuchar clics en botones de idioma
  document.querySelectorAll(".btn-lang-toggle").forEach(btn => {
    btn.addEventListener("click", toggleLanguage);
  });
});
