const meter1 = document.querySelector("#activities");
const meter2 = document.querySelector("#minutes");
const meter3 = document.querySelector("#calories");
const startButton = document.querySelector("#startButton");
const range = document.querySelector(".testslider");
const range2 = document.querySelector(".testslider2");
const range3 = document.querySelector(".testslider3");
const circle = document.querySelector("#a");
const circle2 = document.querySelector("#b");
const circle3 = document.querySelector("#c");
const text = document.querySelectorAll(".progress-text");
const outsideActivity = document.querySelector("#outsideActivity");
const radius = circle.r.baseVal.value; // readius of the SVG circle metres
const circumference = radius * 2 * Math.PI; // gets the circumference of the metres
/**
 * Main procedure
 */
function main() {
  addListeners()
  for (c of [circle, circle2, circle3]) {
    c.style.strokeDasharray = `${circumference} ${circumference}`;
    c.style.strokeDashoffset = circumference;
    setProgress(c, 0);
  }
}

/**
 * Procedure for the event listeners to the input
 */
function addListeners() {
  range.addEventListener("input", () => {
    setProgress(circle, range.value);
    text.item(0).textContent = range.value + "%";
  });
  range2.addEventListener("input", () => {
    setProgress(circle2, range2.value);
    text.item(1).textContent = range2.value + "%";
  });

  range3.addEventListener("input", () => {
    setProgress(circle3, range3.value);
    text.item(2).textContent = range3.value + "%";
  });

  startButton.addEventListener("click", () => {
    console.log("/exercise")
    window.location.href = "/exercise";
  });
  outsideActivity.addEventListener("click", () => {
    console.log("/exercise")
    window.location.href = "/exercise/outside";
  }
  for (r of [range, range2, range3]) {
    r.dispatchEvent(new Event("input"));
  }
}
/** Sets progress of the circle meter
 * @param {HTMLElement} meter SVG Circle meter element
 * @param {Number} percent Percentage completed
 */
function setProgress(meter, percent) {
  const offset = circumference - (percent / 100) * circumference;
  meter.style.strokeDashoffset = offset;
  // How much to offset the dashes in the css which correlates to how "complete" the circle is
}

main();
