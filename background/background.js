const CLIENT_ID = "Ov23li1Qq7LgoorY6Own";
const CLIENT_SECRET = "b37f425da214bafd21100ee1090f74ebe781652f";
const REDIRECT_URI = chrome.identity.getRedirectURL();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "loginWithGithub") {
    startGithubLogin(sendResponse);
    return true; 
  }
});

function startGithubLogin(sendResponse) {
  const authURL = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=repo`;

  chrome.identity.launchWebAuthFlow(
    {
      url: authURL,
      interactive: true,
    },
    async (redirectURL) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        sendResponse({
          success: false,
          message: "Authentication failed",
          error: chrome.runtime.lastError,
        });
        return;
      }

      const urlParams = new URL(redirectURL);
      const code = urlParams.searchParams.get("code");
      console.log("GitHub code:", code);

      if (code) {
        try {
          const tokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded", 
                "Accept": "application/json", 
              },
              body: new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code,
                redirect_uri: REDIRECT_URI,
              }),
            }
          );

          const text = await tokenResponse.text();

          let tokenData = {};
          try {
            tokenData = JSON.parse(text);
          } catch (e) {
            console.error("Failed to parse JSON, got:", text);
          }

          console.log("Access Token Data:", tokenData);

          if (tokenData.access_token) {

            const userInfo = await fetch("https://api.github.com/user", {
              headers: {
                Authorization: `token ${tokenData.access_token}`,
              },
            });
            const user = await userInfo.json();

            console.log("GitHub User:", user);


            const userRepo = await fetch('https://api.github.com/user/repos?per_page=100', {
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
              }
            });
            const repos = await userRepo.json();

            console.log("User Repositories:", repos);
            sendResponse({ success: true, token: tokenData.access_token, repos, user });
          }

        }

        catch (err) {
          console.error("Token Error:", err);
          sendResponse({ success: false, error: err.message });
        }
      }
    }
  );
}
