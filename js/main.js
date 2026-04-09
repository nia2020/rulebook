(function () {
  const tocBtn = document.getElementById("btn-toc");
  const overlay = document.getElementById("toc-overlay");
  const tocClose = document.getElementById("toc-close");
  const tocList = document.getElementById("toc-list");
  const sections = document.querySelectorAll("main section[id]");
  const brand = document.querySelector(".brand");
  const motionReduce = window.matchMedia("(prefers-reduced-motion: reduce)");

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
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    tocBtn.setAttribute("aria-expanded", "true");
  }

  function closeToc() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    tocBtn.setAttribute("aria-expanded", "false");
  }

  function buildToc() {
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
    closeToc();
  });

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

  tocBtn.addEventListener("click", openToc);
  tocClose.addEventListener("click", closeToc);
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) closeToc();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeToc();
  });

  buildToc();

  window.addEventListener("load", scrollToHashFromLocation);
})();
