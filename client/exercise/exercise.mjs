
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
const currentWorkout = {};
const currentWorkoutArr = [];
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
    if (averageTime > 59){
      let averageMinutes = Math.floor(averageTime / 60);
      averageMinutes = averageMinutes == 1 ? `${averageMinutes} minute` : `${averageMinutes} minutes` ;
      let averageSeconds = averageTime % 60;
      averageSeconds = averageSeconds == 1 ? `${averageSeconds} second` : `${averageSeconds} seconds`;
      averageTime = `${averageMinutes} and ${averageSeconds}`;
    } else {
      averageTime = `${averageTime} seconds`;
    };
    timeLength.textContent = `This will take around ${averageTime} to complete`; 
    timeLength.data = averageTime;
    if (exerciseInput.value >= 0) {
      confirmExercise.disabled = false;
    } else {
      
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
  let averageTime = timeLength.data;
  duplicateExerciseCard.textContent = `${currentExerciseCard.textContent} for ${averageTime}`;
  console.log(duplicateExerciseCard);
  duplicateExerciseCard.id = exerciseIndex++ // adding an id to the exercise card eg. 0
  exerciseRoutine.appendChild(duplicateExerciseCard);
  currentWorkoutArr.push([currentExerciseCard.textContent, averageTime]);
});
startAndUpload.addEventListener('click', () => {
  changeScreenTo(2);
});



main()