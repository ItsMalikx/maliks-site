// --- CONFIGURATION ---
// IMPORTANT: Replace these values with your actual GitHub repository details.
const GITHUB_CONFIG = {
  owner: "itsmalikx", // Your GitHub username
  repo: "maliks-website", // The name of your repository (e.g., whosmalikx.com)
  filePath: "privacy.html", // The path to the file you want to track
  branch: "main" // The branch the file is on
};
// --------------------

(async () => {
  const container = document.getElementById("revision-date-container");
  if (!container) return;

  // Build the necessary URLs for API and Commit History
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

    // Format the date into "Month Day, Year" (e.g., March 29, 2026)
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(commitDate);

    // Create the clickable link that points to the commit history
    const link = document.createElement("a");
    link.href = historyUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = formattedDate;
    
    // Styling the link to look like your other site links
    link.style.textDecoration = 'underline';
    link.style.textUnderlineOffset = '3px';
    link.style.color = 'inherit';

    // Update the HTML content: "Revision Date: [Link]"
    container.innerHTML = "Last Revised: ";
    container.appendChild(link);

  } catch (error) {
    console.error("Failed to fetch dynamic revision date:", error);
    // Fallback: If the API fails, it displays nothing or a simple error message
    container.textContent = "Latest Revision Date unavailable.";
  }
})();