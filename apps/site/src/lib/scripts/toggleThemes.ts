function toggleThemes(): void {
  const themeToggle = document.querySelector<HTMLInputElement>(".theme-controller");

  if (!themeToggle) {
    document.documentElement.setAttribute("data-theme", "dark");
    return localStorage.setItem("theme", "dark");
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "cmyk") {
    document.documentElement.setAttribute("data-theme", "cmyk");
    themeToggle.checked = true;
  } else if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.checked = false;
  } else {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    themeToggle.checked = prefersDark;
    document.documentElement.setAttribute(
      "data-theme",
      prefersDark ? "cmyk" : "dark"
    );
  }

  themeToggle.addEventListener("change", (e) => {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      document.documentElement.setAttribute("data-theme", "cmyk");
      localStorage.setItem("theme", "cmyk");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
}
