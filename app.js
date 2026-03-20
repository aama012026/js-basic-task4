const originWheel = document.getElementById('origin-wheel');
const toneWheelBox = document.getElementById('tone-wheel-box');

const dotRadius = 2;

let hueStops = 3;
let saturationStops = 2;
let lightnessStops = 3;

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

originWheel.addEventListener('mousedown', (e) => {
	isDragging = true;
	updateUserDot(e);	
});

originWheel.addEventListener('mousemove', (e) => {
 	if (isDragging) {
		updateUserDot(e);
	}
});

document.addEventListener('mouseup', () => isDragging = false );

function updateUserDot(e) {
	const boundingBox = originWheel.getBoundingClientRect();
	const cartesianCoord = {
		x: getBipolarFromNormalizedPositive((e.clientX - boundingBox.left) / boundingBox.width),
		y: getBipolarFromNormalizedPositive(1 - ((e.clientY - boundingBox.top) / boundingBox.height))
	};
	const polarCoord = polarFromCartesian(cartesianCoord.x, cartesianCoord.y);
	usercolor.h = polarCoord.angle;
	usercolor.s = polarCoord.radius;
	moveColorDot(userColorDot, usercolor);
}

function generateColors() {
	colors.hues = getHueShifts(usercolor.h, hueStops);
	colors.saturationLevels = getSaturationLevels(usercolor.s, saturationStops);
	colors.lightnessPoints = getLightnessPoints(usercolor.l, lightnessStops);
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
	const lightnessFraction = getRest(getPositiveFromNormalizedBipolar(inputLightness) * lightnessStops);
	const lightnessPoints = [];
	for(let i = 0; i < lightnessStops; i++) {
		const placementInStop = i > (lightnessStops / 2) ? lightnessFraction : 1 - lightnessFraction;
		lightnessPoints[i] = getBipolarFromNormalizedPositive((i + placementInStop) / lightnessStops);
	}
	return lightnessPoints;
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

function createColorDot(parent, color) {
	const position = cartesianFromPolar(color.s, color.h);
	const dot = document.createElement('span');
	dot.classList.add('circle');
	dot.style.width = `${dotRadius}rem`;
	dot.style.background = `hsl(${color.h} ${color.s*100} ${getPositiveFromNormalizedBipolar(color.l)*100})`;
	dot.style.position = 'absolute';
	dot.style.left = `calc(50% + ${position.x} * 50% - ${dotRadius}rem/2)`;
	dot.style.bottom = `calc(50% + ${position.y} * 50% - ${dotRadius}rem/2)`;
	dot.style.zIndex = '2';
	dot.style.outline = '2px solid white';
	dot.style.outlineOffset = '-1px';
	parent.appendChild(dot);
}

function moveColorDot(element, color) {
	const position = cartesianFromPolar(color.s, color.h);
	element.style.background = `hsl(${color.h} ${color.s * 100} ${getPositiveFromNormalizedBipolar(color.l) * 100})`;
	element.style.left = `calc(50% + ${position.x} * 50% - ${dotRadius}rem/2)`;
	element.style.bottom = `calc(50% + ${position.y} * 50% - ${dotRadius}rem/2)`;
}

function createToneWheel(container, lightness) {
	const toneWheel = document.createElement('span');
	const lightnessCssValue = getPositiveFromNormalizedBipolar(lightness) * 100;
	toneWheel.style.setProperty('--lightness', `${lightnessCssValue}`);
	toneWheel.classList.add('circle', 'tone-wheel');
	toneWheel.style.width = `calc(var(--circle-radius) * (1 - ${Math.abs(lightness)})`;
	toneWheel.dataset.lightness = lightness;
	container.appendChild(toneWheel);
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

function getRest(n) { return n < 1 ? n : n % Math.floor(n) }
function getPositiveFromNormalizedBipolar(n) { return (n + 1) * 0.5 }
function getBipolarFromNormalizedPositive(n) { return n * 2 - 1 }

console.log(usercolor);
generateColors();
console.log(colors);

colors.lightnessPoints.forEach((l) => {
	createToneWheel(toneWheelBox, l);
});
toneWheelBox.querySelectorAll('.tone-wheel').forEach((wheel) => {
	colors.saturationLevels.forEach((s) => {
		console.log(wheel.dataset.lightness);
		colors.hues.forEach((h) => createColorDot(wheel, {h: h, s: s, l: wheel.dataset.lightness}));
	});
});