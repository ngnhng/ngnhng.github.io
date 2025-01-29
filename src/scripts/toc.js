function addIntersectionObserver() {
  const observer = new IntersectionObserver((sections) => {
    sections.forEach((section) => {
      const id = section.target.getAttribute("id");

      // Get the link to this section's heading
      const link = document.querySelector(`nav.toc li a[href="#${id}"]`);
      if (!link) return;

      // Add/remove the .active class based on whether the
      // section is visible
      const addRemove = section.intersectionRatio > 0 ? "add" : "remove";
      link.classList[addRemove]("active");
    });
  });

  // Observe all the sections of the article
  document.querySelectorAll("article h2").forEach((section) => {
    observer.observe(section);
  });
}
document.addEventListener("DOMContentLoaded", addIntersectionObserver);
