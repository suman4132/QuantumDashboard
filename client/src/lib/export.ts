export async function exportToCSV() {
  try {
    const response = await fetch("/api/export/csv");
    if (!response.ok) throw new Error("Failed to export CSV");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "quantum_jobs.csv";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    throw new Error("Failed to export CSV");
  }
}

export async function exportToJSON() {
  try {
    const response = await fetch("/api/export/json");
    if (!response.ok) throw new Error("Failed to export JSON");
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = "quantum_jobs.json";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    throw new Error("Failed to export JSON");
  }
}
