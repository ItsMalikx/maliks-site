const GITHUB_CONFIG = {
  owner: "itsmalikx", // Your GitHub username
  repo: "whosmalikx-personal-website", // The name of your repository for whosmalikx.com
  filePath: "privacy.html", // The path to the file you want to track
  branch: "main" // The branch the file is on (usually "main" or "master")
};

(async () => {
  const container = document.getElementById("revision-date-container");
  if (!container) return;

  // Build the necessary URLs
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

    // Format the date into "Month Day, Year at H:MM AM/PM"
    const formattedDate = new Intl.DateTimeFormat("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(commitDate);

    // Create the clickable link
    const link = document.createElement("a");
    link.href = historyUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = formattedDate.replace(",", " at"); // Replace the comma after the year
    link.style.textDecoration = 'underline';
    link.style.textUnderlineOffset = '3px';

    // Update the DOM
    container.innerHTML = "Revision Date: ";
    container.appendChild(link);

  } catch (error) {
    console.error("Failed to fetch dynamic revision date:", error);
    // Fallback text in case of an error
    container.textContent = "Could not load latest revision date.";
  }
})();