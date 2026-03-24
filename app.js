/* HSL-explorer lets you explore derivative colors based on an input color.
The generation of derivatives can be configured by changing the nr. of stops for
hues, saturation levels and lightness points with the inputs.
*/

// Set up references and variables
const originWheel = document.getElementById('origin-wheel');
const originLightnessSlider = document.getElementById('input-color-lightness');
const toneWheelBox = document.getElementById('tone-wheel-box');
const inputs = {
	hue: {
		checkbox: document.getElementById('enable-hue'),
		stops: document.getElementById('hue-stops'),
		decreaseBtn: document.getElementById('decrease-hue'),
		increaseBtn: document.getElementById('increase-hue')
	},
	saturation: {
		checkbox: document.getElementById('enable-saturation'),
		stops: document.getElementById('saturation-stops'),
		decreaseBtn: document.getElementById('decrease-saturation'),
		increaseBtn: document.getElementById('increase-saturation')
	},
	lightness: {
		checkbox: document.getElementById('enable-lightness'),
		stops: document.getElementById('lightness-stops'),
		decreaseBtn: document.getElementById('decrease-lightness'),
		increaseBtn: document.getElementById('increase-lightness')
	}
}

const dotRadius = 2;
let usercolor = {
	h: getRandomValues(0, 360)[0],
	s: getRandomValues(0, 1)[0],
	l: 0
};
let isDragging = false;

createColorDot(originWheel, usercolor);
const userColorDot = originWheel.querySelector('.circle');
const colors = {
	hues: [],
	saturationLevels: [],
	lightnessPoints: []
};

// get and render dot for usercolor on mouse selection
originWheel.addEventListener('mousedown', (e) => {
	isDragging = true;
	updateUserDot(e);
	generateColorComponents();
	render();
});

originWheel.addEventListener('mousemove', (e) => {
 	if (isDragging) {
		updateUserDot(e);
		generateColorComponents();
		render();
	}
});

document.addEventListener('mouseup', () => isDragging = false );

originLightnessSlider.addEventListener('input', () => {
	usercolor.l = parseFloat(originLightnessSlider.value);
	console.log(originLightnessSlider.value);
	updateToneWheel(originWheel, usercolor.l);
	updateColorDot(userColorDot, usercolor);
	generateColorComponents();
	render();
});

// Hook up configuring inputs
// Toggles
inputs.hue.checkbox.addEventListener('input', () => {
	generateColorComponents();
	render();
});
inputs.saturation.checkbox.addEventListener('input', () => {
	generateColorComponents();
	render();
});
inputs.lightness.checkbox.addEventListener('input', () => {
	generateColorComponents();
	render();
});

// Stops
// Hue 
inputs.hue.stops.addEventListener('blur', () => {
	setSpinNumber(inputs.hue.stops, inputs.hue.decreaseBtn, inputs.hue.increaseBtn, parseFloat(inputs.hue.stops.value));
	generateColorComponents();
	render();
})
inputs.hue.increaseBtn.addEventListener('mouseup', () => {
	changeSpinNumber(inputs.hue.stops, inputs.hue.decreaseBtn, inputs.hue.increaseBtn, 1);
	generateColorComponents();
	render();
});
inputs.hue.decreaseBtn.addEventListener('mouseup', () => {
	changeSpinNumber(inputs.hue.stops, inputs.hue.decreaseBtn, inputs.hue.increaseBtn, -1);
	generateColorComponents();
	render();
});

// Saturation
inputs.saturation.stops.addEventListener('blur', () => {
	setSpinNumber(inputs.saturation.stops, inputs.saturation.decreaseBtn, inputs.saturation.increaseBtn, parseFloat(inputs.saturation.stops.value));
	generateColorComponents();
	render();
})
inputs.saturation.increaseBtn.addEventListener('mouseup', () => {
	changeSpinNumber(inputs.saturation.stops, inputs.saturation.decreaseBtn, inputs.saturation.increaseBtn, 1);
	generateColorComponents();
	render();
});
inputs.saturation.decreaseBtn.addEventListener('mouseup', () => {
	changeSpinNumber(inputs.saturation.stops, inputs.saturation.decreaseBtn, inputs.saturation.increaseBtn, -1);
	generateColorComponents();
	render();
});

// Lightness
inputs.lightness.stops.addEventListener('blur', () => {
	setSpinNumber(inputs.lightness.stops, inputs.lightness.decreaseBtn, inputs.lightness.increaseBtn, parseFloat(inputs.lightness.stops.value));
	generateColorComponents();
	render();
})
inputs.lightness.increaseBtn.addEventListener('mouseup', () => {
	changeSpinNumber(inputs.lightness.stops, inputs.lightness.decreaseBtn, inputs.lightness.increaseBtn, 1);
	generateColorComponents();
	render();
});
inputs.lightness.decreaseBtn.addEventListener('mouseup', () => {
	changeSpinNumber(inputs.lightness.stops, inputs.lightness.decreaseBtn, inputs.lightness.increaseBtn, -1);
	generateColorComponents();
	render();
});

// Initial generation and render
generateColorComponents();
render();

// Functions
function changeSpinNumber(input, decrementer, incrementer, valueChange) {
	const currentValue = parseFloat(input.value);
	const targetValue = currentValue + valueChange;

	setSpinNumber(input, decrementer, incrementer, targetValue);
}

function setSpinNumber(input, decrementer, incrementer, targetValue) {
	const minValue = parseFloat(input.ariaValueMin);
	const maxValue = parseFloat(input.ariaValueMax);

	if (targetValue <= minValue) {
		input.value = minValue;
		decrementer.disabled = true;
		incrementer.disabled = false;
	}
	else if (targetValue >= maxValue) {
		input.value = maxValue;
		decrementer.disabled = false;
		incrementer.disabled = true;
	}
	else {
		input.value = targetValue;
		decrementer.disabled = false;
		incrementer.disabled = false;
	}
	input.ariaValueNow = input.value;
}

function updateUserDot(e) {
	const boundingBox = originWheel.getBoundingClientRect();
	const cartesianCoord = {
		x: getBipolarFromNormalizedRatio((e.clientX - boundingBox.left) / boundingBox.width),
		y: getBipolarFromNormalizedRatio(1 - ((e.clientY - boundingBox.top) / boundingBox.height))
	};
	const polarCoord = polarFromCartesian(cartesianCoord.x, cartesianCoord.y);
	usercolor.h = polarCoord.angle;
	usercolor.s = polarCoord.radius;
	updateColorDot(userColorDot, usercolor);
}

function createColorDot(parent, color) {
	const position = cartesianFromPolar(color.s, color.h);
	const dot = document.createElement('span');
	dot.classList.add('circle');
	dot.style.position = 'absolute';
	dot.style.zIndex = '2';
	dot.style.outline = '2px solid white';
	dot.style.outlineOffset = '-1px';
	updateColorDot(dot, color);
	parent.appendChild(dot);
}

function updateColorDot(dot, color) {
	const position = cartesianFromPolar(color.s, color.h);
	const cssHsl = getCssHsl(color);
	const dotSize = dotRadius * (1 - Math.abs(color.l)) *0.75 + dotRadius*0.25;
	
	dot.style.width = `${dotSize}rem`;
	dot.style.background = `hsl(${cssHsl.h} ${cssHsl.s} ${cssHsl.l})`;
	dot.style.left = `calc(50% + ${position.x} * 50% - ${dotSize}rem / 2)`;
	dot.style.bottom = `calc(50% + ${position.y} * 50% - ${dotSize}rem / 2)`;
}

function createToneWheel(container, lightness) {
	const toneWheel = document.createElement('span');
	toneWheel.classList.add('circle', 'tone-wheel');
	updateToneWheel(toneWheel, lightness);
	container.appendChild(toneWheel);
}

function updateToneWheel(toneWheel, lightness) {
	const lightnessCssValue = getPercentFromNormalizedBipolar(lightness);
	toneWheel.style.setProperty('--lightness', `${lightnessCssValue}`);
	toneWheel.style.width = `calc(var(--circle-radius)/2 + var(--circle-radius)/2 * (1 - ${Math.abs(lightness)}))`;
	toneWheel.dataset.lightness = lightness;
}

function generateColorComponents() {
	colors.hues = getHueShifts(usercolor.h, inputs.hue.checkbox.checked ? parseFloat(inputs.hue.stops.value) : 1);
	colors.saturationLevels = getSaturationLevels(usercolor.s, inputs.saturation.checkbox.checked ? parseFloat(inputs.saturation.stops.value) : 1);
	colors.lightnessPoints = getLightnessPoints(usercolor.l, inputs.lightness.checkbox.checked ? parseFloat(inputs.lightness.stops.value) : 1);
}

function getHueShifts(inputHue, stops) {
	const step = 360 / stops;
	const hues = [];
	for (let i = 0; i < stops; i++) {
		hues[i] = (inputHue + step * i) % 360;
	}
	return hues;
}

function getSaturationLevels(inputSaturation, saturationStops) {
	const scaledSaturation = inputSaturation * saturationStops;
	const saturationFraction = getRest(scaledSaturation);
	const saturationLevels = [];
	for(let i = 0; i < saturationStops; i++) {
		saturationLevels[i] = (i + saturationFraction) / saturationStops; 
	}
	return saturationLevels;
}

function getLightnessPoints(inputLightness, lightnessStops) {
	const lightnessFraction = getRest(getRatioFromNormalizedBipolar(inputLightness) * lightnessStops);
	const lightnessPoints = [];
	for(let i = 0; i < lightnessStops; i++) {
		const placementInStop = i > (lightnessStops / 2) ? lightnessFraction : 1 - lightnessFraction;
		lightnessPoints[i] = getBipolarFromNormalizedRatio((i + placementInStop) / lightnessStops);
	}
	return lightnessPoints;
}

function render() {
	let toneWheels = toneWheelBox.querySelectorAll('.tone-wheel');
	colors.lightnessPoints.forEach((l, i) => {
		if (i < toneWheels.length) {
			updateToneWheel(toneWheels[i], l);
		}
		else {
			createToneWheel(toneWheelBox, l);
		}
	});

	toneWheels = toneWheelBox.querySelectorAll('.tone-wheel');
	cleanUpToneWheels(toneWheels);
	toneWheels.forEach((wheel) => {
		renderColorDots(wheel);
	});
}

function renderColorDots(wheel) {
	let dots = wheel.querySelectorAll('.circle');
	const l = parseFloat(wheel.dataset.lightness);
	colors.saturationLevels.forEach((s, i) => {
		colors.hues.forEach((h, j) => {
			const k = colors.hues.length * i + j; 
			if (k < dots.length) {
				updateColorDot(dots[k], {h: h, s: s, l: l});
			}
			else {
				createColorDot(wheel, {h: h, s: s, l: l});
			}
		})
	});
	dots = wheel.querySelectorAll('.circle');
	cleanUpDots(dots);
}

function cleanUpToneWheels(toneWheels) {
	const difference = toneWheels.length - colors.lightnessPoints.length;
	if (difference > 0) {
		for(let i = colors.lightnessPoints.length; i < toneWheels.length; i++) {
			toneWheels[i].remove();
		}
	}
}

function cleanUpDots(dots) {
	const colorCount = colors.hues.length * colors.saturationLevels.length;
	const difference = dots.length - colorCount;
	if (difference > 0) {
		for(let i = colorCount; i < dots.length; i++) {
			dots[i].remove();
		}
	}
}

function getRandomValues(minValue, maxValue, count = 1, returnInteger = false) {
	const UINT_32_MAX = 4294967296;
	const array = new Uint32Array(count);
	const values = [];
	crypto.getRandomValues(array);
	
	const range = maxValue - minValue;
	for(let i = 0; i < count; i++) {
		const value = (array[i] / UINT_32_MAX) * range + minValue;
		values[i] = returnInteger ? Math.floor(value) : value;
	}
	return values;
}

function getCssHsl(color) {
	return {
		h: color.h,
		s: getPercentFromRatio(color.s),
		l: getPercentFromNormalizedBipolar(color.l)
	}
}

function cartesianFromPolar(r, a) {
	const radianAngle = a * (Math.PI / 180);
	return { x: r * Math.cos(radianAngle), y: r * Math.sin(radianAngle) }
}
function polarFromCartesian(x, y) {
	const r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	const a = Math.atan2(y, x) * (180 / Math.PI);
	return {radius: r, angle: a < 0 ? a + 360 : a};
}

function getRest(n) { return n % 1 }
function getRatioFromNormalizedBipolar(n) { return (n + 1) * 0.5 }
function getBipolarFromNormalizedRatio(n) { return n * 2 - 1 }

function getPercentFromRatio(n) { return n * 100 }
function getPercentFromNormalizedBipolar(n) { return (n + 1) * 50 }