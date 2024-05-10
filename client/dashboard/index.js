const meter = document.querySelector("#minutestoday");
const test = document.querySelector("#test");
const startButton = document.querySelector("#startButton");
const circle = document.querySelector("#a");
const text = document.querySelectorAll(".progress-text");
const outsideActivity = document.querySelector("#outsideActivity");
const radius = circle.r.baseVal.value; // readius of the SVG circle metres
const circumference = radius * 2 * Math.PI; // gets the circumference of the metres
let currentUser;
// let meters =[circle, circle2, circle3];
/**
 * Main procedure
 */

document.addEventListener("DOMContentLoaded", async () => {
  currentUser = await fetch("http://localhost:8080/api/current_user").then((res) => res.json());
  
  document.querySelector("#nav-profile").src = currentUser.image;
  document.querySelector("#profilelink").href = `/profile/${currentUser.id}`;
  for (c of [circle]) {
    console.log('c: ', c);
    
    c.style.strokeDasharray = `${circumference} ${circumference}`;
    c.style.strokeDashoffset = circumference;
    setProgress(c, 0);
  }
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(err => {
        console.log('Service Worker registration failed:', err);
      });
  }
  setMeters();
});
/**
 * Procedure for the event listeners to the input
 */
function setMeters() {
  console.log('currentUser.minutestoday: ', currentUser.minutes_today);
  setProgress(circle, currentUser.minutes_today / 30 * 100);
  if (currentUser.minutes_today == undefined) {
    text.item(0).textContent = "0/30 min";
    return;
  } else {
    text.item(0).textContent = Math.floor(currentUser.minutes_today) +  "/30 min"; // TODO: protect against NaN
  }
}
/** Sets progress of the circle meter
 * @param {HTMLElement} meter SVG Circle meter element
 * @param {Number} percent Percentage completed
 */
function setProgress(meter, percent) {
  console.log('percent: ', percent);
  
  const offset = circumference - (percent) / 100 * circumference;
  meter.style.strokeDashoffset = offset;
  // How much to offset the dashes in the css which correlates to how "complete" the circle is
}

test.addEventListener("input", () => {
  setProgress(circle, test.value / 30 * 100);
  text.item(0).textContent = test.value + " min";
});

startButton.addEventListener("click", () => {
  window.location.href = "/exercise";
});
outsideActivity.addEventListener("click", () => {
  window.location.href = "/exercise/outside-activity";
});
