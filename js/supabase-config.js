// EGCinmuno-App — Configuración de Supabase
// REEMPLAZÁ ESTOS VALORES CON LOS DE TU PROYECTO DE SUPABASE

const SUPABASE_URL = "https://tuhtfjcndrzqsugjaxee.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1aHRmamNuZHJ6cXN1Z2pheGVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MzQ3OTYsImV4cCI6MjA5OTIxMDc5Nn0.b0zO0JwDCDqnpUtXh3UMAaRQwCYSNIsTuXssrJleFY8";

// Inicializar el cliente global de Supabase
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
