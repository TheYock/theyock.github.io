async function loadProjectPhotos() {
  // GitHub Pages does not provide directory listings. Use its public repository API.
  if (location.hostname !== "theyock.github.io") return;
  const projects = [...document.querySelectorAll("[data-project-gallery]")].map((gallery) => gallery.dataset.projectGallery);
  await Promise.all(projects.map(async (key) => {
    try {
      const response = await fetch(`https://api.github.com/repos/theyock/theyock.github.io/contents/images/${key}`);
      if (!response.ok) return; // Keep the generated local list if the API is unavailable.
      const files = await response.json();
      if (!Array.isArray(files)) return;
      window.projectPhotos[key] = files
        .filter((file) => file.type === "file" && /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file.name))
        .map((file) => file.name)
        .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
    } catch { /* Offline: use the generated list. */ }
  }));
}

loadProjectPhotos().then(() => document.querySelectorAll("[data-project-gallery]").forEach((gallery) => {
  const key = gallery.dataset.projectGallery;
  const entries = window.projectPhotos?.[key] || [];
  if (!entries.length) return;

  const photos = entries.map((entry) => typeof entry === "string" ? { file: entry } : entry);
  const title = gallery.closest(".project-card").querySelector("h3").textContent;
  let current = 0;
  gallery.replaceChildren();
  gallery.setAttribute("role", "region");
  gallery.setAttribute("aria-label", `${title} photos`);
  gallery.setAttribute("aria-roledescription", "carousel");

  const figure = document.createElement("figure");
  const media = document.createElement("div");
  media.className = "project-photo-frame";
  const img = document.createElement("img");
  img.loading = "lazy";
  img.decoding = "async";
  const error = document.createElement("span");
  error.className = "project-photo-error";
  error.textContent = "Photo unavailable";
  error.hidden = true;
  img.addEventListener("error", () => { img.hidden = true; error.hidden = false; });
  img.addEventListener("load", () => { img.hidden = false; error.hidden = true; });
  media.append(img, error);
  const caption = document.createElement("figcaption");
  figure.append(media, caption);
  gallery.append(figure);

  const controls = document.createElement("div");
  controls.className = "project-photo-controls";
  const status = document.createElement("span");
  status.setAttribute("aria-live", "polite");
  status.setAttribute("aria-atomic", "true");
  function button(text, label, offset) {
    const element = document.createElement("button");
    element.type = "button";
    element.textContent = text;
    element.setAttribute("aria-label", label);
    element.addEventListener("click", () => show(current + offset));
    return element;
  }
  controls.append(button("←", "Previous photo", -1), status, button("→", "Next photo", 1));
  controls.hidden = photos.length < 2;
  gallery.append(controls);
  gallery.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    show(current + (event.key === "ArrowLeft" ? -1 : 1));
  });
  function show(index) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    img.hidden = false;
    error.hidden = true;
    img.alt = photo.caption || `${title} — photo ${current + 1}`;
    img.src = `images/${key}/${encodeURIComponent(photo.file)}`;
    caption.textContent = photo.caption || "";
    caption.hidden = !photo.caption;
    status.textContent = `${current + 1} / ${photos.length}`;
  }
  show(0);
}));
