export default class CustomRangeInput {
  constructor(inputElem, callback, options = {}) {
    this.inputElem = inputElem;
    this.min = options.min || 0;
    this.max = options.max || 100;
    this.rangeValue = options.value || this.min;
    this.returnInt = options.returnInt || true;
    this.callback = callback || (() => {});

    this.inputElem.classList.add("range-input-element");
    createRangeInputHTML.call(this);
    eventListenersForInput.call(this);
  }

  get value() {
    return this.rangeValue;
  }

  set value(value) {
    this.rangeValue = value;
    this.rangeWidth.style.setProperty(
      "--range-track-covered",
      (value * 100) / (this.max - this.min) + "%"
    );
  }
}

function createRangeInputHTML() {
  this.rangeWraper = createDivOfClass("range-wraper");
  this.rangeTrack = createDivOfClass("range-track");
  this.rangeWidth = createDivOfClass("range-width");
  this.rangeDot = createDivOfClass("range-dot");
  this.rangeTrack.append(this.rangeWidth);
  this.rangeWraper.append(this.rangeTrack);
  this.rangeWidth.append(this.rangeDot);
  this.inputElem.append(this.rangeWraper);
  this.rangeWraper.style.setProperty(
    "--range-track-covered",
    parseFloat(((this.rangeValue - this.min) * 100) / (this.max - this.min)) +
      "%"
  );
}

function createDivOfClass(className) {
  const newDiv = document.createElement("div");
  newDiv.classList.add(className);
  return newDiv;
}

function eventListenersForInput() {
  this.rangeTrackRect = this.rangeTrack.getBoundingClientRect();
  function rangeAction(e) {
    e.preventDefault();
    if (e.x < this.rangeTrackRect.x) {
      this.rangeProgress = 0;
      this.value = this.min;
    } else if (e.x > this.rangeTrackRect.x + this.rangeTrackRect.width) {
      this.value = this.max;
      this.rangeProgress = 100;
    } else {
      this.rangeProgress = parseFloat(
        ((e.x - this.rangeTrackRect.x) * 100) / this.rangeTrackRect.width
      );

      let currentValue =
        ((this.max - this.min) * this.rangeProgress) / 100 + this.min;
      if (this.returnInt) {
        this.value = parseInt(currentValue);
      } else {
        this.value = parseFloat(currentValue);
      }
    }
    this.rangeWidth.style.setProperty(
      "--range-track-covered",
      this.rangeProgress + "%"
    );
    this.callback(this.value, this.inputElem);
  }

  const rangeClick = (e) => {
    rangeAction.call(this, e);
  };

  const rangeMouseDown = (e) => {
    this.isMouseDown = true;
    rangeAction.call(this, e);
  };

  const rangeMouseMove = (e) => {
    if (this.isMouseDown) {
      rangeAction.call(this, e);
    }
  };

  const rangeMouseUp = () => {
    this.isMouseDown = false;
  };

  // this.rangeWraper.addEventListener("click", rangeClick);
  this.rangeWraper.addEventListener("mousedown", rangeMouseDown);
  document.addEventListener("mousemove", rangeMouseMove);
  document.addEventListener("mouseup", rangeMouseUp);

  const rangeTouchStart = (e) => {
    this.isTouchDown = true;
    rangeAction.call(this, { x: e.changedTouches[0].clientX });
  };

  const rangeTouchMove = (e) => {
    if (this.isTouchDown) {
      rangeAction.call(this, { x: e.changedTouches[0].clientX });
    }
  };

  const rangeTouchEnd = (e) => {
    if (this.isTouchDown) {
      this.isTouchDown = false;
    }
  };

  this.rangeWraper.addEventListener("touchstart", rangeTouchStart);
  document.addEventListener("touchmove", rangeTouchMove);
  document.addEventListener("touchend", rangeTouchEnd);
  document.addEventListener("touchcancel", rangeTouchEnd);

  window.addEventListener("resize", () => {
    this.rangeTrackRect = this.rangeTrack.getBoundingClientRect();
  });
}
