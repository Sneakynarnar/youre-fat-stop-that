const script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';

// Add an event listener for the load event
script.addEventListener('load', () => {
  google.accounts.id.initialize({
    client_id: "1095458705262-leaqpa0lr006bfvcctid1l5t34oefaad.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.querySelector('.g_id_signin'),
    { theme: 'outline', size: 'large' }  // customize the button appearance
  );
});

// Append the script element to the body
document.body.appendChild(script);
async function handleCredentialResponse(response) {
  console.log('signing in with google');  
  const idToken = response.credential;
  // Send the ID token to your server for verification
  const res = await fetch("http://localhost:8080/api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });
  const data = await res.json();
  console.log(data);
  window.location.href = "http://localhost:8080/dashboard";  
}

// async function main() {
//   const response = await fetch("http://localhost:8080/api/verify", {
//   method: "POST",
//   credentials: "include",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ dummy: "data" }),
//   });
//   const data = await response.json();
//   console.log('data', data);

  
// }

// main();