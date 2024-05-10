// Fetch workout routines from the server

fetch('http://localhost:8080/api/communityworkoutroutines')
  .then(response => response.json())
  .then(data => {
    // Display workout routines on the page
    console.log('Workout routines:', data);
    
    const workoutRoutinesContainer = document.querySelector('#workout-routines-container');
    data.forEach(workoutRoutine => {
      const workoutRoutineElement = document.createElement('div');
      workoutRoutineElement.innerHTML= `
        <h2>${workoutRoutine.workout_name}</h2>
        <p>${workoutRoutine.description}</p>
        <p>Made by <a href="/profile/${workoutRoutine.account_id}">${workoutRoutine.username}</a></p>
        <a href="/exercise?routine=${workoutRoutine.workout_id}">View workout routine</a>
        <button id=${workoutRoutine.workout_id} class="copy">Copy workout routine link</button>
      `
      workoutRoutinesContainer.appendChild(workoutRoutineElement);
    });
  })
  .then(() => {
    document.querySelectorAll(".copy").forEach(button => {
      console.log('button:', button);
      
      button.addEventListener('click', async (event) => {
        const currentButton = event.currentTarget;
        console.log('copying workout routine link');
        navigator.clipboard.writeText('http://localhost:8080/exercise?routine=' + event.currentTarget.id);
        currentButton.textContent = 'Copied!';
        setTimeout(() => {
          currentButton.textContent = 'Copy workout routine link';
        }, 3000);
      });
    });
  })
  .catch(error => {
    console.error('Error fetching workout routines:', error);
  });

document.addEventListener("DOMContentLoaded", async () => {
  const currentUser = await fetch("http://localhost:8080/api/current_user").then((res) => res.json());
  document.querySelector("title").textContent = `Welcome, ${currentUser.username}`;
  document.querySelector("#nav-profile").src = currentUser.image;
  document.querySelector("#profilelink").href = `/profile/${currentUser.id}`;
  console.log(document.querySelectorAll(".copy"));
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  }

});