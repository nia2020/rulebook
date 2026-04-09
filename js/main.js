(function () {
  const tocBtn = document.getElementById("btn-toc");
  const overlay = document.getElementById("toc-overlay");
  const tocClose = document.getElementById("toc-close");
  const tocList = document.getElementById("toc-list");
  const sections = document.querySelectorAll("main section[id]");
  const brand = document.querySelector(".brand");
  const motionReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const desktopMq = window.matchMedia("(min-width: 1024px)");

  function isDesktop() {
    return desktopMq.matches;
  }

  function scrollMotion() {
    return motionReduce.matches ? "auto" : "smooth";
  }

  function scrollToTarget(target) {
    if (!target) return;
    target.scrollIntoView({
      behavior: scrollMotion(),
      block: "start",
      inline: "nearest",
    });
  }

  function setLocationHash(id) {
    if (!id) return;
    const next = "#" + id;
    if (location.hash === next) return;
    history.pushState(null, "", next);
  }

  function openToc() {
    if (!overlay || !tocBtn) return;
    overlay.classList.remove("toc-overlay--collapsed");
    document.body.classList.remove("toc-sidebar-collapsed");
    if (isDesktop()) {
      overlay.classList.remove("is-open");
    } else {
      overlay.classList.add("is-open");
    }
    overlay.setAttribute("aria-hidden", "false");
    tocBtn.setAttribute("aria-expanded", "true");
  }

  function closeToc() {
    if (!overlay || !tocBtn) return;
    if (isDesktop()) {
      overlay.classList.add("toc-overlay--collapsed");
      document.body.classList.add("toc-sidebar-collapsed");
      overlay.classList.remove("is-open");
    } else {
      overlay.classList.remove("is-open");
      document.body.classList.remove("toc-sidebar-collapsed");
    }
    overlay.setAttribute("aria-hidden", "true");
    tocBtn.setAttribute("aria-expanded", "false");
  }

  function buildToc() {
    if (!tocList) return;
    tocList.innerHTML = "";

    const coverLi = document.createElement("li");
    const coverA = document.createElement("a");
    coverA.href = "#cover";
    coverA.textContent = "表紙";
    coverLi.appendChild(coverA);
    tocList.appendChild(coverLi);

    sections.forEach((section) => {
      const h2 = section.querySelector("h2");
      if (!h2) return;
      const id = section.id;
      const text = h2.textContent.trim();
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#" + id;
      a.textContent = text;
      li.appendChild(a);
      tocList.appendChild(li);
    });
  }

  if (tocList) {
    tocList.addEventListener("click", function (e) {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      e.preventDefault();
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        setLocationHash(id);
        scrollToTarget(target);
      }
      if (!isDesktop()) closeToc();
    });
  }

  if (brand) {
    brand.addEventListener("click", function (e) {
      e.preventDefault();
      const cover = document.getElementById("cover");
      if (cover) {
        setLocationHash("cover");
        scrollToTarget(cover);
      }
    });
  }

  function scrollToHashFromLocation() {
    const id = location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (target) scrollToTarget(target);
  }

  window.addEventListener("hashchange", scrollToHashFromLocation);
  window.addEventListener("popstate", scrollToHashFromLocation);

  if (tocBtn) tocBtn.addEventListener("click", openToc);
  if (tocClose) tocClose.addEventListener("click", closeToc);
  if (overlay) {
    overlay.addEventListener("click", function (e) {
      if (!isDesktop() && e.target === overlay) closeToc();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeToc();
  });

  function onLayoutModeChange() {
    if (!overlay || !tocBtn) return;
    if (isDesktop()) {
      overlay.classList.remove("toc-overlay--collapsed");
      document.body.classList.remove("toc-sidebar-collapsed");
      openToc();
    } else {
      overlay.classList.remove("toc-overlay--collapsed");
      overlay.classList.remove("is-open");
      document.body.classList.remove("toc-sidebar-collapsed");
      overlay.setAttribute("aria-hidden", "true");
      tocBtn.setAttribute("aria-expanded", "false");
    }
  }

  desktopMq.addEventListener("change", onLayoutModeChange);

  buildToc();

  window.addEventListener("load", scrollToHashFromLocation);

  if (isDesktop()) openToc();
})();
