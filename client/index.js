const script = document.createElement('script');
script.src = 'https://accounts.google.com/gsi/client';

// Add an event listener for the load event
script.addEventListener('load', () => {
  google.accounts.id.initialize({
    client_id: "1095458705262-leaqpa0lr006bfvcctid1l5t34oefaad.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    auto_select: false 
  });
  const buttonContainer = document.querySelector('.g_id_signin');
  buttonContainer.setAttribute('data-scope', 'email profile');
  google.accounts.id.renderButton(
    buttonContainer, 
    { theme: 'outline', size: 'large' }  
  );
});

// Append the script element to the body
document.body.appendChild(script);

async function handleCredentialResponse(response) {
  console.log('signing in with google');  
  const idToken = response.credential;
  
  // Decode the ID token
  const payload = JSON.parse(atob(idToken.split('.')[1]));
  
  // Extract the user's email and profile information
  const email = payload.email;
  const name = payload.name;
  const imageUrl = payload.picture;
  
  // Send the ID token and profile information to your server for verification
  const res = await fetch("http://localhost:8080/api/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken, email, name, imageUrl }),
  });
  const data = await res.json();
  console.log(data);
  window.location.href = "http://localhost:8080/dashboard";  
}