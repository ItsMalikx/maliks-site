const GITHUB_CONFIG = {
  owner: "itsmalikx", // GitHub username
  repo: "maliks-website", // Repo name (e.g., maliks-website)
  filePath: "privacy.html", // File path to track
  branch: "main" // File branch
};
// --------------------

(async () => {
  const container = document.getElementById("revision-date-container");
  if (!container) return;

  const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/commits?path=${GITHUB_CONFIG.filePath}&page=1&per_page=1`;
  const historyUrl = `https://github.com/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/commits/${GITHUB_CONFIG.branch}/${GITHUB_CONFIG.filePath}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status}`);
    }

    const commits = await response.json();
    if (!commits || commits.length === 0) {
      throw new Error("No commits found for this file path.");
    }

    const latestCommit = commits[0];
    const commitDate = new Date(latestCommit.commit.author.date);

    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(commitDate);

    const link = document.createElement("a");
    link.href = historyUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = formattedDate;
    
    link.style.textDecoration = 'underline';
    link.style.textUnderlineOffset = '3px';
    link.style.color = 'inherit';

    container.innerHTML = "Last Revised: ";
    container.appendChild(link);

  } catch (error) {
    console.error("Failed to fetch dynamic revision date:", error);
    container.textContent = "Latest Revision Date unavailable.";
  }
})();