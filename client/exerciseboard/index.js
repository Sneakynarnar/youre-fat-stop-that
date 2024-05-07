// Fetch workout routines from the server
fetch('https://localhost:8080/workout-routines')
  .then(response => response.json())
  .then(data => {
    // Display workout routines on the page
    const workoutRoutinesContainer = document.getElementById('workout-routines-container');
    data.forEach(workoutRoutine => {
      const workoutRoutineElement = document.createElement('div');
      workoutRoutineElement.innerHTML= `
        <h2>${workoutRoutine.name}</h2>
        <p>${workoutRoutine.description}</p>
        <a href="/exercise/${workoutRoutine.id}">View workout routine</a>
      `
      workoutRoutinesContainer.appendChild(workoutRoutineElement);
    });
  })
  .catch(error => {
    console.error('Error fetching workout routines:', error);
  });