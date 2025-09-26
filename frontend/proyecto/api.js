// API client para leaderboard
// Cambia API_URL por la URL donde desplegues el backend (ej: https://mi-backend.onrender.com)
const API_URL = "https://REPLACE_WITH_YOUR_BACKEND_URL"; // <-- cambiar

async function fetchScores(limit = 10) {
  try {
    const res = await fetch(`${API_URL}/api/scores?limit=${limit}`);
    if (!res.ok) throw new Error("Error al solicitar scores");
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("fetchScores fallo, usando localStorage:", err.message);
    // fallback a localStorage
    const local = localStorage.getItem("runner_local_scores");
    return local ? JSON.parse(local) : [];
  }
}

async function postScore(entry) {
  // entry: { name, score, level, date }
  try {
    const res = await fetch(`${API_URL}/api/scores`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
    if (!res.ok) throw new Error("Error al guardar score en servidor");
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("postScore fallo, guardando en localStorage:", err.message);
    // fallback: guardar en localStorage
    const key = "runner_local_scores";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push(entry);
    // mantener solo top 50 localmente
    arr.sort((a,b)=> b.score - a.score);
    localStorage.setItem(key, JSON.stringify(arr.slice(0,50)));
    return { ok: false, fallback: true };
  }
}
