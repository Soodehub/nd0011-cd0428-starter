// Main script

document.addEventListener("DOMContentLoaded", () => {
  console.log("JS connected successfully!");

  // -------------------------------
  // utils
  // -------------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => root.querySelectorAll(sel);

  const resolveImage = (path, fallback) => {
    if (!path || !path.trim()) return fallback;
    return path.startsWith("../") ? `./starter/${path.slice(3)}` : path;
  };

  // -------------------------------
  // 1) About Me
  // -------------------------------
  fetch("./starter/data/aboutMeData.json")
    .then((res) => res.json())
    .then((data) => {
      const about = $("#aboutMe");
      if (!about) return;

      const aboutText = data.about?.trim() || "No bio provided.";
      let headshotSrc =
        data.headshot?.trim() || "./starter/images/card_placeholder_bg.webp";
      if (headshotSrc.startsWith("../")) {
        headshotSrc = `./starter/${headshotSrc.slice(3)}`;
      }

      const p = document.createElement("p");
      p.textContent = aboutText;

      const img = document.createElement("img");
      img.src = headshotSrc;
      img.alt = "Headshot";
      img.loading = "lazy";
      img.decoding = "async";

      const headshotBox = document.createElement("div");
      headshotBox.className = "headshotContainer";
      headshotBox.appendChild(img);

      about.replaceChildren(p, headshotBox);
    })
    .catch((err) => console.error("AboutMe fetch error:", err));

  // -------------------------------
  // 2) Projects (cards + spotlight + arrows)
  // -------------------------------
  fetch("./starter/data/projectsData.json")
    .then((res) => res.json())
    .then((projects) => {
      if (!Array.isArray(projects)) {
        console.error("Invalid projects data");
        return;
      }

      const listEl = $("#projectList");
      const spotlightEl = $("#projectSpotlight");
      const spotlightTitlesEl = $("#spotlightTitles");
      if (!listEl || !spotlightEl || !spotlightTitlesEl) {
        console.error("Project DOM elements missing");
        return;
      }

      const renderSpotlight = (project) => {
        const bg = resolveImage(
          project.spotlight_image,
          "./starter/images/spotlight_placeholder_bg.webp"
        );
        spotlightEl.style.backgroundImage = `url('${bg}')`;

        const title = document.createElement("h3");
        title.textContent = project.project_name || "Untitled Project";

        const desc = document.createElement("p");
        desc.textContent =
          project.long_description || "No description available.";

        const link = document.createElement("a");
        link.href = project.url || "#";
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "Click here to see more...";

        spotlightTitlesEl.replaceChildren(title, desc, link);
      };

      const frag = document.createDocumentFragment();

      projects.forEach((p) => {
        const card = document.createElement("div");
        card.className = "projectCard";
        if (p.project_id) card.id = String(p.project_id);

        const cardBg = resolveImage(
          p.card_image,
          "./starter/images/card_placeholder_bg.webp"
        );
        card.style.backgroundImage = `url('${cardBg}')`;

        const h4 = document.createElement("h4");
        h4.textContent = p.project_name || "Untitled Project";

        const teaser = document.createElement("p");
        teaser.textContent = p.short_description || "No teaser available.";

        card.append(h4, teaser);
        card.addEventListener("click", () => renderSpotlight(p));
        frag.appendChild(card);
      });

      listEl.replaceChildren(frag);

      if (projects.length > 0) renderSpotlight(projects[0]);

      // arrows (mobile: horizontal, desktop: vertical)
      const arrows = $("#projectNavArrows");
      const left = arrows?.querySelector(".arrow-left");
      const right = arrows?.querySelector(".arrow-right");
      const STEP = 220;
      const mq = window.matchMedia("(min-width: 900px)");

      const scrollList = (dir) => {
        if (mq.matches) {
          listEl.scrollBy({ top: dir * STEP, behavior: "smooth" });
        } else {
          listEl.scrollBy({ left: dir * STEP, behavior: "smooth" });
        }
      };

      left?.addEventListener("click", () => scrollList(-1));
      right?.addEventListener("click", () => scrollList(1));
    })
    .catch((err) => console.error("Projects fetch error:", err));

  // -------------------------------
  // 3) Contact form validation
  // -------------------------------
  const form = $("#formSection");
  const emailInput = $("#contactEmail");
  const msgInput = $("#contactMessage");
  const emailErr = $("#emailError");
  const msgErr = $("#messageError");
  const counter = $("#charactersLeft");

  const ILLEGAL = /[^a-zA-Z0-9@._-]/;
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const MAX = 300;

  const setError = (el, msg) => {
    el.textContent = msg;
    el.classList.add("error");
  };
  const clearError = (el) => {
    el.textContent = "";
    el.classList.remove("error");
  };

  // live counter
  if (msgInput && counter) {
    const updateCount = () => {
      const len = msgInput.value.length;
      counter.textContent = `Characters: ${len}/${MAX}`;
      if (len > MAX) {
        counter.classList.add("error");
      } else {
        counter.classList.remove("error");
      }
    };
    msgInput.addEventListener("input", updateCount);
    updateCount();
  }

  // submit handler
  form?.addEventListener("submit", (e) => {
    e.preventDefault();

    let ok = true;
    const email = emailInput?.value?.trim() || "";
    const msg = msgInput?.value || "";

    clearError(emailErr);
    clearError(msgErr);

    // email checks
    if (!email) {
      setError(emailErr, "Email is required.");
      ok = false;
    } else if (ILLEGAL.test(email)) {
      setError(emailErr, "Email contains illegal characters.");
      ok = false;
    } else if (!EMAIL.test(email)) {
      setError(emailErr, "Please enter a valid email address.");
      ok = false;
    }

    // message checks
    if (!msg.trim()) {
      setError(msgErr, "Message is required.");
      ok = false;
    } else if (ILLEGAL.test(msg)) {
      setError(msgErr, "Message contains illegal characters.");
      ok = false;
    } else if (msg.length > MAX) {
      setError(msgErr, `Message must be at most ${MAX} characters.`);
      ok = false;
    }

    if (!ok) return;

    alert("Form submitted successfully. Validation passed!");
    form.reset();
    // reset counter after reset
    if (counter) {
      counter.textContent = `Characters: 0/${MAX}`;
      counter.classList.remove("error");
    }
  });
});
