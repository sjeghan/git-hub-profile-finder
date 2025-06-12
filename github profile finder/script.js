async function getUser() {
  const username = document.getElementById("username").value.trim();
  const profileDiv = document.getElementById("profile");

  if (!username) {
    profileDiv.innerHTML = "<p>Please enter a username.</p>";
    return;
  }

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) throw new Error("User not found");

    const user = await userRes.json();

    const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const repos = await repoRes.json();

    const joinedDate = new Date(user.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    profileDiv.innerHTML = `
      <img src="${user.avatar_url}" alt="Avatar" />
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || "No bio available."}</p>
      <p><strong>Joined:</strong> ${joinedDate}</p>
      <a href="${user.html_url}" target="_blank">View Profile</a>
      <div class="stats">
        <div><strong>${user.followers}</strong><br/>Followers</div>
        <div><strong>${user.following}</strong><br/>Following</div>
        <div><strong>${user.public_repos}</strong><br/>Repos</div>
      </div>
      <div class="repo-list">
        <h3>Recent Repos:</h3>
        ${repos.map(repo => `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`).join("")}
      </div>
    `;
  } catch (error) {
    profileDiv.innerHTML = "<p>User not found or error occurred.</p>";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
