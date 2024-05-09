
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
const start = document.querySelector('#start');
const backButton = document.querySelector('#backbutton');
const routineTime = document.querySelector('#routinetime');
const cancelExercise = document.querySelector('#cancel-exercise-modal');
const startExerciseButton = document.querySelector('#startexercise');
const workoutComplete = document.querySelector('#workoutcomplete');
const exercise = document.querySelector('#exercise');
const backToDashboardButton = document.querySelector('#backtodashboard');
const workoutAgainButton = document.querySelector('#workoutagain');
const pausePlayButton = document.querySelector('#pauseplay');
const stopExerciseButton = document.querySelector('#stopexercise');
const completetitle = document.querySelector('#completetitle');
const completeMessage = document.querySelector('#completemessage');
const uploadCheckBox = document.querySelector('#upload');
const exerciseRoutineDesc = document.querySelector('#exerciseroutinedesc');
const uploadUi = document.querySelectorAll('.uploadroutine')
const currentWorkoutName = document.querySelector('#workoutname');
const exerciseRoutineName = document.querySelector('#exerciseroutinename');
const currentWorkout = {};
let timer1, timer2;
let currentWorkoutArr = [];
let restAmount = 10;
let totalTimeLeft = 0;
let workoutTimeLeft = 0;
let exerciseIndex = 0;
let exerciseData;
let currentExerciseCard;
let currentUser;

const urlParams = new URLSearchParams(window.location.search);
const routine = urlParams.get('routine');
// Use the extracted parameters as needed
document.addEventListener('DOMContentLoaded', async () => {
  currentUser = await fetch('http://localhost:8080/api/current_user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  currentUser = await currentUser.json();
  console.log('currentUser: ', currentUser);
  
});
async function main() {
  if (routine) {
    const response = await fetch(`http://localhost:8080/api/getworkoutroutine/${routine}`, {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
      }
    });
    const routineData = await response.json();
    loadRoutine(routineData);
  }
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
  console.log('currentWorkoutArr: ', currentWorkoutArr);
  
  return currentWorkoutArr.reduce((acc, curr) => { return acc + Number(curr[1]) + restAmount}, 0) - restAmount;
}
function updateTotalTime() {
  const totalTime = getTotalTime();
  const formattedTime = formatSeconds(totalTime);
  if (totalTime === 0) {
    routineTime.textContent = '';
    return;
  }
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
  exerciseInput.value = '1'
  timeLength.textContent = '';
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
  screens[screen-1].classList.add('active');
}
function startExerciseRoutineCreation() {
  exerciseIndex = 0;
  currentWorkoutArr = [];
  const phases = document.querySelectorAll('.subscreen'); // all subscrens will be the phases of creating a routine
  document.querySelector('#workoutname').textContent = exerciseRoutineName.value
  phases.item(0).classList.remove("active"); 
  phases.item(1).classList.add("active"); // changing phases
  console.log(phases);
  currentWorkout[exerciseName.value] = []; // current workout creation.
}
addButton.addEventListener('click', () => {
  changeScreenTo(2);
});
confirmWorkoutName.addEventListener('click', startExerciseRoutineCreation);

confirmExercise.addEventListener('click', (ev) => {
  const duplicateExerciseCard = currentExerciseCard.cloneNode(true);
  let averageTime = formatSeconds(timeLength.data);
  duplicateExerciseCard.textContent = `${currentExerciseCard.textContent} for ${averageTime}`;
  duplicateExerciseCard.id = exerciseIndex++ // adding an id to the exercise card eg. 0
  exerciseRoutine.appendChild(duplicateExerciseCard);
  currentWorkoutArr.push([currentExerciseCard.textContent, timeLength.data]);
  exerciseInput.value = '1';
  updateTotalTime();
});

function regroupArray(arr) {
  let regroupedArr = [];
  let currentExercise = [];
  for (let i = 0; i < arr.length; i++) {
    if (i % 2 === 0) {
      currentExercise = [arr[i]];
    } else {
      currentExercise.push(arr[i]);
      regroupedArr.push(currentExercise);
    }
  }
  return regroupedArr;

}
function loadRoutine(routineData) {

  uploadUi.forEach((element) => element.classList.add('hidden'));
  document.querySelector('#workoutname').textContent = routineData.workout_name;
  console.log('routineData: ', routineData);
  exerciseName.value = routineData.workout_name;
  exerciseRoutineDesc.value = routineData.description;
  console.log('routineWorkout: ', routineData.workoutroutine);
  currentWorkoutArr = routineData.workoutroutine.split(',');
  console.log('currentWorkoutArr: ', currentWorkoutArr);
  currentWorkoutArr = regroupArray(currentWorkoutArr);
  
  currentWorkoutArr.forEach((exercise) => {
    const exerciseCard = document.createElement('div');
    exerciseCard.textContent = `${exercise[0]} for ${formatSeconds(exercise[1])}`;
    exerciseCard.classList.add('exercise-panel');
    exerciseRoutine.appendChild(exerciseCard);
  });

  changeScreenTo(2);
  const phases = document.querySelectorAll('.subscreen');
  phases.item(0).classList.remove("active"); 
  phases.item(1).classList.add("active"); // changing phases
  updateTotalTime();
}


start.addEventListener('click', async () => {
  changeScreenTo(3);
  if (uploadCheckBox.checked) {
    const response = await fetch ('http://localhost:8080/api/uploadworkoutroutine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workoutName: exerciseName.value,
        accountId: currentUser.id,
        workout: currentWorkoutArr,
        description: exerciseRoutineDesc.value
      }),
    });
  await response.json()
  console.log('response: ', response);
    
  }
});
cancelExercise.addEventListener('click', () => {
  exerciseIntensity.close();
});

startExerciseButton.addEventListener('click', () => {
  changeScreenTo(4);
  startExercise();
});

stopExerciseButton.addEventListener('click', stopExercise);

workoutAgainButton.addEventListener('click', () => {
  exerciseRoutine.innerHTML = '';
  routineTime.textContent = '';
  currentWorkoutArr = [];
  changeScreenTo(1);
});

backToDashboardButton.addEventListener('click', () => {
  window.location.href = 'http://localhost:8080/dashboard';
});

backButton.addEventListener('click', () => {
  window.location.href = 'http://localhost:8080/exercise';
});

async function startExercise() {

  let paused = false;
  workoutComplete.classList.add('hidden');
  const currentExerciseContainer = document.querySelector('#exercise');
  let totalSecondsPassed = 0;
  const exerciseTimer = document.querySelector('.timer1');
  const workoutTimer = document.querySelector('.timer2');
  const buttons = document.querySelector('#buttons');
  const totalTime = getTotalTime() - 1;
  buttons.classList.remove('hidden');
  totalTimeLeft = totalTime + currentWorkoutArr.length;
  let rested = true;
  async function workoutTimerFunc() {
    totalSecondsPassed++
    if (workoutTimeLeft <= 0 && rested) { 
    workout = currentWorkoutArr.shift();
    workoutTimeLeft = workout[1];
    workoutTimer.textContent = formatSeconds(workoutTimeLeft);
    exercise.textContent = workout[0];
    rested = false;
    } else if (workoutTimeLeft <= 0) {
      workoutTimeLeft = restAmount-1;
      currentExerciseContainer.textContent = "Rest!";
      workoutTimer.textContent = formatSeconds(workoutTimeLeft);
      rested = true;
    } else {
      workoutTimeLeft--;
      workoutTimer.textContent = formatSeconds(workoutTimeLeft);
    }
  if (currentWorkoutArr.length === 0 && workoutTimeLeft <= 0) {
    clearInterval(timer2);
    workoutTimer.textContent = 'Workout Complete!';
    completetitle.textContent = 'You did alright, I guess...';
    completeMessage.textContent = "You are 1 step closer to stopping your fatness."
    const response = await fetch('http://localhost:8080/api/workoutcompletion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {time: totalTime}
    });

    const data = await response.json();
    console.log('response: ', data);
    
    
    workoutComplete.classList.remove('hidden');
    buttons.classList.add('hidden');
    return;
  }
  }
  function exerciseTimerFunc() {
    exerciseTimer.textContent = formatSeconds(totalTimeLeft);
    if (totalTimeLeft <= 0) {
      clearInterval(timer1);
      }
      totalTimeLeft--;
    }

  pausePlayButton.addEventListener('click', () => {
    if (paused) {
      paused = false;
      pausePlayButton.textContent = 'Pause';
      timer1 = setInterval(() => {
        exerciseTimerFunc();
      }, 1000);
      timer2 = setInterval(() => {
        workoutTimerFunc();
      }, 1000);
    } else {
      paused = true;
      pausePlayButton.textContent = 'Play';
      clearInterval(timer1);
      clearInterval(timer2);
    }
  });
  timer1 = setInterval(() => {
    exerciseTimerFunc();
  }, 1000);
  timer2 = setInterval(() => {
    workoutTimerFunc();
  }, 1000);
}

function stopExercise() {
  clearInterval(timer1);
  clearInterval(timer2);
  completetitle.textContent = 'Imagine quitting, smh';
  completeMessage.textContent = 'You stopped the workout early? You are a disgrace to your family. You think you can just stop a workout and get away with it? You are a coward and a fool. You will never be able to show your face in public again. You are a failure. You are a disgrace. You wonder why your wife left you? It is because you are a quitter and you quit.';
  workoutComplete.classList.remove('hidden');
  buttons.classList.add('hidden');
  uploadUi.forEach((element) => element.classList.remove('hidden'));
}

main()