try {
  const theme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", theme);
} catch (e) {
  console.error("Failed to access localStorage:", e);
}
