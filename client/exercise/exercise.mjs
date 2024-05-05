
const panelContainer = document.querySelector("#panelcontainer");
const addButton = document.querySelector('.addbutton');
const screens = document.querySelectorAll('.screen');
const exerciseName = document.querySelector('#exerciseroutinename');
const confirmWorkoutName = document.querySelector('#confirmworkoutname');
const exerciseOptions = document.querySelector('#exerciseoptions')
const exerciseRoutine = document.querySelector('#exerciseroutine');
const exerciseInput = document.querySelector('#exercise-details-input');
const exerciseDetails = document.querySelector('#exercise-details-label');
const exerciseAverageTime = document.querySelector('#timelength');
const exerciseIntensity = document.querySelector('#exercise-intensity');
const confirmExercise = document.querySelector('#confirm-exercise-modal');
const timeLength = document.querySelector('#timelength');
const uploadWorkout = document.querySelector('#uploadworkout');
const startAndUpload = document.querySelector('#startandupload');
const backButton = document.querySelector('#backbutton');
const routineTime = document.querySelector('#routinetime');
const currentWorkout = {};
let currentWorkoutArr = [];
let restAmount = 10;
let totalTimeLeft = 0;
let workoutTimeLeft = 0;
let exerciseIndex = 0;
let exerciseData;
let currentExerciseCard;
async function main() {
  confirmExercise.addEventListener('click', () => {
    exerciseIntensity.close();
  });
  const response = await fetch('http://localhost:8080/api/workouts', {
    method: 'GET',  
    }
  );
  exerciseData = await response.json();
  buildWorkoutMenu(exerciseData);
}
/**
 * @param {number} seconds
 * @returns {string}
 */
function formatSeconds(seconds) {
  let minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds = remainingSeconds == 1 ? `${remainingSeconds} second` : `${remainingSeconds} seconds`;
  const formattedMinutes = minutes == 1 ? `${minutes} minute` : `${minutes} minutes`;
  return `${formattedMinutes} and ${formattedSeconds}`;
}

function getTotalTime() {
  return currentWorkoutArr.reduce((acc, curr) => { return acc + curr[1] + restAmount}, 0);
}
function updateTotalTime() {
  const totalTime = getTotalTime();
  const formattedTime = formatSeconds(totalTime);
  routineTime.textContent = `Total time: ${formattedTime}`;
}
function appendExercisetoRoutine(e) {
  exerciseInput.removeEventListener('input', () => {});
  currentExerciseCard = e.currentTarget;
  const exerciseIntensity = document.querySelector('#exercise-intensity');
  exerciseIntensity.showModal();
  const specificExercise = exerciseData[e.currentTarget.parentElement.id]['activities'][e.currentTarget.id];
  let averageTime;
  console.log(exerciseData);
  const isReps = Object.keys(specificExercise).indexOf('base_reps') !== -1;
  if (isReps) {
    exerciseDetails.textContent = 'How many reps would you like to do?';
  } else {
    exerciseDetails.textContent = 'How long would you like to do this exercise?';
  }
  exerciseInput.addEventListener('input', () => {
    if (isReps) {
      averageTime = specificExercise['base_reps'] * exerciseInput.value;
    } else {
      averageTime = exerciseInput.value;
    }
    timeLength.data = averageTime;
    const formattedSeconds = formatSeconds(averageTime);
    timeLength.textContent = `This exercise will take approximately ${formattedSeconds} to complete.`;
    if (exerciseInput.value >= 0) {
      confirmExercise.disabled = false;
    } else {
      confirmExercise.disabled = true;
    }
  });
}

function buildWorkoutMenu(exerciseData) {
  let exerciseCategoryContainer;
  let exerciseCategoryTitle;
  let exerciseCategory;
  for (const [workoutCategory, categoryData] of Object.entries(exerciseData)) {
    exerciseCategoryContainer = document.createElement('div');
    exerciseCategory = document.createElement('div');
    exerciseCategory.id = workoutCategory;
    exerciseCategory.classList.add('exercise-category');
    exerciseCategoryTitle = document.createElement('h2');
    exerciseCategoryTitle.innerText = categoryData.name;
    exerciseCategoryContainer.appendChild(exerciseCategoryTitle);
    exerciseCategoryContainer.appendChild(exerciseCategory);
    for (const [workoutName, workoutData] of Object.entries(categoryData.activities)) {
      newOption = document.createElement('div');
      newOption.id = workoutName;
      newText = document.createElement('p');
      newText.classList.add('exercise-name-text');
      newOption.classList.add('exercise-panel');
      newOption.textContent = workoutData.name;
      newOption.addEventListener('click', appendExercisetoRoutine);
      exerciseCategory.appendChild(newOption);
    }
  exerciseOptions.appendChild(exerciseCategoryContainer);
  }
}
function changeScreenTo(screen) {
  const activeScreen = document.querySelector('.screen.active');
  activeScreen.classList.remove('active');
  screens[screen].classList.add('active');
}
function startExerciseRoutineCreation() {
  exerciseIndex = 0;
  currentWorkoutArr = [];
  const phases = document.querySelectorAll('.subscreen'); // all subscrens will be the phases of creating a routine
  phases.item(0).classList.remove("active"); 
  phases.item(1).classList.add("active"); // changing phases
  console.log(phases);
  currentWorkout[exerciseName.value] = []; // current workout creation.
}
addButton.addEventListener('click', () => {
  changeScreenTo(1);
});
confirmWorkoutName.addEventListener('click', startExerciseRoutineCreation);

confirmExercise.addEventListener('click', (ev) => {
  // const existingCard =
  const duplicateExerciseCard = currentExerciseCard.cloneNode(true);
  let averageTime = formatSeconds(timeLength.data);
  duplicateExerciseCard.textContent = `${currentExerciseCard.textContent} for ${averageTime}`;
  duplicateExerciseCard.id = exerciseIndex++ // adding an id to the exercise card eg. 0
  exerciseRoutine.appendChild(duplicateExerciseCard);
  currentWorkoutArr.push([currentExerciseCard.textContent, timeLength.data]);
  exerciseInput.value = '';
  updateTotalTime();
});
startAndUpload.addEventListener('click', () => {
  changeScreenTo(2);
  startExercise()
});


function startExercise() {
  const currentExerciseContainer = document.querySelector('#exercise');
  let totalSecondsPassed = 0;
  const exerciseTimer = document.querySelector('.timer1');
  const workoutTimer = document.querySelector('.timer2');
  totalTimeLeft = getTotalTime();
  const timer = setInterval(() => {
    totalTimeLeft--;
    exerciseTimer.textContent = formatSeconds(totalTimeLeft);
    if (totalTimeLeft <= 0) {
      clearInterval(timer);
      exerciseCard.remove();
    }
  }, 1000);
  let rested = true;
  const timer2 = setInterval(() => {
    totalSecondsPassed++
    if (workoutTimeLeft <= 0 && rested) { 
    workout = currentWorkoutArr.shift();
    workoutTimeLeft = workout[1];
    console.log('workoutTimeLeft: ', workoutTimeLeft);
    console.log('workout: ', workout);
    workoutTimer.textContent = formatSeconds(workoutTimeLeft);
    exercise.textContent = workout[0];
    rested = false;
    } else if (workoutTimeLeft <= 0) {
      workoutTimeLeft = restAmount;
      currentExerciseContainer.textContent = "Rest!";
      rested = true;
    } else {
      workoutTimeLeft--;
      workoutTimer.textContent = formatSeconds(workoutTimeLeft);
    }
  if (currentWorkoutArr.length === 0 && workoutTimeLeft <= 0) {
    clearInterval(timer2);
    workoutTimer.textContent = 'Workout Complete!';
    console.log('totalSecondsPassed: ', totalSecondsPassed);
    
    return;
  }
  }, 1000);
}



main()