let pathCoordinates = [];
let path;
let exercising = false;
const exerciseInfo = document.querySelector('#exerciseInfo');
const exerciseDistance = document.querySelector('#exerciseDistance');
const exerciseTime = document.querySelector('#exerciseTime');
const exerciseType = document.querySelector('#exerciseType');
const exerciseCalories = document.querySelector('#exerciseCalories');
const startExerciseButton = document.querySelector('#startExercise');
const endExerciseButton = document.querySelector('#endExercise');
const statusText = document.querySelector('#statusText')
const walkCalorieRate = 0.05;
const bikeCalorieRate = 0.1;
const runCalorieRate = 0.2;
let active = false;
let rate = walkCalorieRate;
let exerciseTimer;
let elapsedTime = 0;
startExerciseButton.addEventListener('click', startExercise);
document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await fetch("http://localhost:8080/api/current_user").then((res) => res.json());
  document.querySelector("#nav-profile").src = currentUser.image;
  document.querySelector("#profilelink").href = `/profile/${currentUser.id}`;
});
function setupGeoMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      let user_location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      const map_parameters = { center: user_location, zoom: 15,  mapId: 'dontthinkthismatters'};
      const map = new google.maps.Map(document.querySelector('#map'), map_parameters);
      new google.maps.marker.AdvancedMarkerElement({ position: user_location, map: map});
      path = new google.maps.Polyline({
        path: pathCoordinates,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
      });
      path.setMap(map)
      navigator.geolocation.watchPosition((position) => {
        let newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // Add the new position to the path
        if (exercising) {
          updateExerciseStats(newPosition);
          
        }
        map.setCenter(newPosition);
        });
      });
    } else {
      handleLocationError(true, map.getCenter());
    };
}
    
function updateExerciseStats(newPosition) {
  pathCoordinates.push(newPosition);
    console.log('pathCoordinates', pathCoordinates);
    path.setPath(pathCoordinates);
    let distanceTravelled = calculateDistanceTravelled(pathCoordinates);
    const unit = (distanceTravelled > 1000) ? 'km' : 'm';
    distanceTravelled = (unit === 'km') ? distanceTravelled / 1000 : distanceTravelled;
    exerciseDistance.innerHTML = Math.floor(distanceTravelled) + unit;
    exerciseCalories.innerHTML = Math.floor(distanceTravelled * rate) + 'kcal';
}

function formatSeconds(seconds) {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let remainingSeconds = seconds % 60;
  
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${hours}:${minutes}:${remainingSeconds}`;
}
async function startExercise() {
  console.log('start exercise');
  if (!active) {
  active = true;
  statusText.classList.add('in-progress')
  statusText.classList.remove('completed')
  exerciseInfo.classList.remove('hidden');
  statusText.textContent = 'Fat extermination in progress...'
  startExerciseButton.textContent = 'End Exercise';
  const selectedExerciseType = document.querySelector('input[name="exerciseType"]:checked').value;
  if (selectedExerciseType === 'walk') {
    rate = walkCalorieRate;
  } else if (selectedExerciseType === 'bike') {
    rate = bikeCalorieRate;
  } else if (selectedExerciseType === 'run') {
    rate = runCalorieRate;
  } else { // default to walk
    rate = walkCalorieRate;
  }
  exerciseType.innerHTML = selectedExerciseType;

  exerciseDistance.innerHTML = '0M';
  exercising = true;
  pathCoordinates = [];
  path.setPath(pathCoordinates);
  exerciseTimer = setInterval(() => {
    elapsedTime++;
    exerciseTime.innerHTML = formatSeconds(elapsedTime);
  }, 1000);
  } else {
    active = false;
    await endExercise();
  }
}

async function endExercise() {
  startExerciseButton.textContent = 'Start Exercise';
  statusText.classList.remove('in-progress')
  statusText.classList.add('completed')
  statusText.textContent = 'Fat extermination complete!';
  console.log('end exercise');
  exercising = false;
  clearInterval(exerciseTimer);
  setTimeout(() => {
    exerciseInfo.classList.add('hidden')
  }, 10000)
  

  fetch('http://localhost:8080/api/outside-exercise-completion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      distance: calculateDistanceTravelled(pathCoordinates),
      time: elapsedTime,
      calories: calculateDistanceTravelled(pathCoordinates) * rate,
      type: document.querySelector('input[name="exerciseType"]:checked').value
    })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  elapsedTime = 0;
}

function handleLocationError(browserHasGeolocation, pos) { 
  let infoWindow = new google.maps.InfoWindow({map: map});
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
}

function calculateDistanceTravelled(path) {
  let totalDistance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    totalDistance += haversineDistance(path[i], path[i + 1]);
  }
  return totalDistance;

}

// https://community.esri.com/t5/coordinate-reference-systems-blog/distance-on-a-sphere-the-haversine-formula/ba-p/902128
function haversineDistance(coord1, coord2) { // haversine used to be a defined trignometric function but was dropped in because it was equal to sin^2(x/2)

  const R = 6371000  // radius of Earth in meters
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const lon1 = coord1.lng;
  const lat1 = coord1.lat;
  const lon2 = coord2.lng;
  const lat2 = coord2.lat;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);
  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}