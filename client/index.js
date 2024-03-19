function startGoogleSignIn() {
  gapi.load("auth2", () => {
    gapi.auth2.init({
      client_id:
        "1095458705262-mio8ft9ok4o2oevda94alaeqe0vdkp7t.apps.googleusercontent.com",
      cookie_policy: "none",
      redirect_uri: "http://localhost:8080/dashboard",
      origin: "http://localhost:8080/",
      ux_mode: "redirect",
    });
  });
}

async function googleSignIn() {
  const user = await gapi.auth2.getAuthInstance().signIn();
  const idToken = user.getAuthResponse().id_token;
  // Send the ID token to your server for verification
  const response = await fetch("http://localhost:3000/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  console.log(`Server response: ${response.json}`);
}
