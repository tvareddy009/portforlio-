// Navbar Hamburger Menu toggle
document
  .querySelector("[data-collapse-toggle]")
  ?.addEventListener("click", function () {
    const target = document.getElementById(this.getAttribute("aria-controls"));
    target.classList.toggle("hidden");
  });

// Fetch projects
async function fetchProjects() {
  try {
    const response = await fetch("/static/data/projects.json");
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const projects = await response.json();
    console.log("✅ Projects loaded:", projects);
    return projects;
  } catch (error) {
    console.error("❌ Failed to load projects.json:", error);
    return [];
  }
}

// Create one project card
function createProjectElement(project) {
  const div = document.createElement("div");
  div.className =
    "w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 p-4 flex flex-col items-start transition-transform hover:scale-[1.02]";

  const techTags = (project.tech || [])
    .map(
      (tag) =>
        `<span class='bg-blue-700 text-white text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-600'>${tag}</span>`
    )
    .join(" ");

  const buttons = `
    <div class="flex justify-start flex-wrap gap-2 mt-4">
      ${
        project.github
          ? `<a href="${project.github}" target="_blank" class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
              <i class="fa-brands fa-github mr-2"></i> GitHub
            </a>`
          : ""
      }
      ${
        project.demo
          ? `<a href="${project.demo}" target="_blank" class="text-white bg-[#2557D6] hover:bg-[#2557D6]/90 focus:ring-4 focus:ring-[#2557D6]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
              <i class="fa-solid fa-play mr-2"></i> Demo
            </a>`
          : ""
      }
    </div>
  `;

  div.innerHTML = `
    <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover rounded-lg mb-4">
    <h2 class="text-xl font-bold mb-2 text-gray-900 dark:text-white">${project.title}</h2>
    <p class="text-gray-700 dark:text-gray-400 mb-4">${project.description}</p>
    <div class="flex flex-wrap gap-2 mb-2">${techTags}</div>
    ${buttons}
  `;

  return div;
}

// Display all projects
function displayProjects(projects) {
  const container = document.getElementById("projects");
  if (!container) return;

  container.innerHTML = "";
  if (projects.length === 0) {
    container.innerHTML =
      "<p class='text-center text-gray-400'>No projects found.</p>";
    return;
  }

  projects.forEach((p) => container.appendChild(createProjectElement(p)));
}

// Main logic
async function main() {
  const projects = await fetchProjects();
  displayProjects(projects);

  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      const filtered = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
      displayProjects(filtered);
    });
  }
}

main();
