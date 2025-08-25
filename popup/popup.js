document.getElementById("loginBtn").addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "loginWithGithub" }, (response) => {
    if (response.success) {
      document.getElementById("loginBtn").classList.add("hidden");
      document.getElementById("profile").classList.remove("hidden");

      console.log("User Data: Response", response.user);
      console.log("User Repos: Response", response.repos);
      const user = response.user;
      const repos = response.repos;

      document.getElementById("avatar").src = user.avatar_url;
      document.getElementById("name").textContent = user.name || "No Name";
      document.getElementById("username").textContent = "@" + user.login;
      document.getElementById("bio").textContent = user.bio || "No bio available";
      document.getElementById("reposCount").textContent = user.public_repos;
      document.getElementById("followers").textContent = user.followers;
      document.getElementById("following").textContent = user.following;

      const repoList = document.getElementById("repoList");
      repoList.innerHTML = "";
      repos.forEach(repo => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a> ⭐${repo.stargazers_count} | ${repo.language || "N/A"}`;
        repoList.appendChild(li);
      });
    } else {
      alert("Login failed: " + response.error);
    }
  });
});
