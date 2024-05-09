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
      `
      workoutRoutinesContainer.appendChild(workoutRoutineElement);
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

});