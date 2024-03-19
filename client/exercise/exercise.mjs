const buttons = document.querySelectorAll(".button");
const startExercise = document.querySelectorAll(".start");
const startTimerButton = document.querySelector(".timerButton");

const activeExercises = {};
/**
 * Fetch data from the server
 */
async function fetchData() { 
  const exersises = await fetch("127.0.0.1:8080/api/excersise", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    }
  });
}
function select(e) {
  for (const elem of document.querySelectorAll(".activity-detail")) {
    elem.classList.add("unselected"); // adds unselected to all activity details
  }
  const type = Array.from(e.currentTarget.classList); // makes an array of the classList
  type.splice(type.indexOf("button"), 1); 
  const detail = document.querySelector(`.${type[0]}.activity-detail`);
  detail.classList.remove("unselected");
}

function start(e) {
  const screens = document.querySelectorAll(".screen");
  screens.item(0).classList.remove("active");
  screens.item(1).classList.add("active");
}

function addListeners() {
  for (const button of buttons) {
    button.addEventListener("click", select);
  }
  for (const button of startExercise) {
    button.addEventListener("click", start);
  }
  startTimerButton.addEventListener("click", () => {
    startExersiseTimer("timer1", 15, 3);
  });
}

async function startExersiseTimer(timerID, seconds=60, exersises) {
  if (activeExercises[timerID] !== undefined) {
    return
  }
  activeExercises[timerID] = { seconds: seconds };
  activeExercises[timerID]["elem"] = document.querySelector(`.${timerID}`);
  activeExercises[timerID]["interval"] = setInterval(count, 1000, timerID);
}

async function count(timerID) {
  console.log(activeExercises);
  activeExercises[timerID]["seconds"] -= 1;
  activeExercises[timerID]["elem"].textContent = activeExercises[timerID]["seconds"]
    activeExercises[timerID]["seconds"];
  if (activeExercises[timerID]["seconds"] === 0) {
    clearTimeout(activeExercises[timerID]["interval"]);
    delete activeExercises[timerID];
    console.log("Finshed");
  }
}
fetchData();
addListeners();
