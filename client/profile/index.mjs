
const profileUrl = window.location.href; // Get the current URL
const urlObj = new URL(profileUrl); // Create a URL object
const user_id = urlObj.pathname.split('/')[2]; // Extract the user_id from the pathname

// Fetch the user's profile information
async function loadPage() {
  const data = await fetch(`http://localhost:8080/api/profile/${user_id}`).then(response => response.json())
      // Display the user's profile information on the page
  console.log('User:', data);
  console.log('image:', data.image);
  let streakfire = ''
  if (data.streak >= 100) {
  streakfire = '🔥🔥🔥'
  } else if (data.streak >= 50) {
    streakfire = '🔥🔥'
  } else if (data.streak > 0) {
    streakfire = '🔥'
  }
  const profileContainer = document.querySelector('#profile-container');
  profileContainer.innerHTML = `
    <div id="profileinfo">
    <h2 id="username">${data.username}</h2>
    <img id="pfp" src="${data.image}" alt="Profile picture">
    <p id = "Streak">${streakfire} Streak: ${data.streak}</p>
    <p id="totalworkscreated">Total workouts created: ${data.workoutsCreated}</p>
    <p id="totalminutesdone">Total minutes done: ${data.totalminutesdone}</p>
    <p id="totalworkoutsdone">Total workouts done: ${data.totalworkoutsdone}</p>
    <p id="workoutsToday" class>Minutes today: ${data.minutestoday}</p>
    <div id="profileinfo">

  `;
}


document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await fetch("http://localhost:8080/api/current_user").then((res) => res.json());
  
  document.querySelector("#nav-profile").src = currentUser.image;
  document.querySelector("#profilelink").href = `/profile/${currentUser.id}`;
});


loadPage();