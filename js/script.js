import CustomRangeInput from "./CustomRangeInput.js";

const rangeInputWraper = [...document.querySelectorAll(".range-input-wraper")];
const colorDisplay = document.querySelector(".color-display");
const outputHsl = document.querySelector(".output-hsl");
const outputHex = document.querySelector(".output-hex");
const outputRgb = document.querySelector(".output-rgb");

function hslToHex(h, s, l) {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0"); // convert to Hex and prefix "0" if needed
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function hsl2rgb(h, s, l) {
  let a = s * Math.min(l, 1 - l);
  let f = (n, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return `rgb(${parseInt(f(0) * 255)}, ${parseInt(f(8) * 255)}, ${parseInt(
    f(4) * 255
  )})`;
}

let colorRangeInputH = new CustomRangeInput(
  rangeInputWraper[0],
  colorCallback,
  { max: 360, value: 222 }
);
let colorRangeInputS = new CustomRangeInput(
  rangeInputWraper[1],
  colorCallback,
  { max: 100, value: 22 }
);
let colorRangeInputL = new CustomRangeInput(
  rangeInputWraper[2],
  colorCallback,
  { max: 100, value: 22 }
);

let color = {
  h: 0,
  s: 0,
  l: 0,
};

function colorCallback(value, element) {
  color[element.dataset.hsl] = value;
  let hslValue = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  localStorage.setItem("colorStoredHSL", JSON.stringify(color));
  colorDisplay.style.backgroundColor = hslValue;
  outputHsl.textContent = hslValue;
  outputHex.textContent = hslToHex(color.h, color.s, color.l);
  outputRgb.textContent = hsl2rgb(color.h, color.s / 100, color.l / 100);
}
colorCallback(colorRangeInputH.value, colorRangeInputH.inputElem);
colorCallback(colorRangeInputS.value, colorRangeInputS.inputElem);
colorCallback(colorRangeInputL.value, colorRangeInputL.inputElem);

// copy
const messageWraper = document.querySelector(".message-wraper");
let messageVisible = false;
let messageTimeout;

const showMessage = (message) => {
  messageWraper.innerHTML = message;
  if (messageVisible) {
    clearTimeout(messageTimeout);
    messageTimeout = setTimeout(hideMessage, 2000);
    return;
  }
  messageWraper.classList.add("show-message");
  messageVisible = true;

  messageTimeout = setTimeout(hideMessage, 2000);
};

const hideMessage = () => {
  messageWraper.classList.remove("show-message");
  messageVisible = false;
};

const outputBoxes = [outputHex, outputHsl, outputRgb];
outputBoxes.forEach((outputBox) => {
  outputBox.addEventListener("click", (e) => {
    navigator.clipboard.writeText(outputBox.textContent);
    showMessage(`Copied ${outputBox.textContent}`);
  });
});

// storage functionality
let localColor = JSON.parse(localStorage.getItem("colorStoredHSL"));
