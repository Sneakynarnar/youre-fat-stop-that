
let currentUser;
function populateTable(){
  fetch('http://localhost:8080/api/leaderboard', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
  console.log(data);
  
    const leaderboard = document.querySelector('#leaderboard');
    data.users.forEach((user, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><a href="http://localhost:8080/profile/${user.id}">${user.username}</td>
            <td>${user.total_minutes_done}</td>
            <td>${user.total_workouts}</td>
            <td>${user.minutes_today}</td>
            <td>${user.streak}</td>
            <td>${user.distance_travelled}</td>
            <td>${user.workouts_created}</td>
        `;
        
        if (user.id === currentUser.id) {
          row.classList.add('current-user');
        }
        leaderboard.appendChild(row);
    });
});
}


document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await fetch("http://localhost:8080/api/current_user").then((res) => res.json());
  console.log('currentUser', currentUser);
  
  document.querySelector("#nav-profile").src = currentUser.image;
  document.querySelector("#profilelink").href = `/profile/${currentUser.id}`;
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  }
  populateTable();
});