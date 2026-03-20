originWheel = document.getElementById('origin-wheel');

const dotRadius = 2;

let usercolor = {
	h: getRandomValues(0, 360)[0],
	s: getRandomValues(0, 1)[0],
	l: getRandomValues(-1, 1)[0]
};

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
	console.log(position);
	const dot = document.createElement('span');
	dot.classList.add('circle');
	dot.style.width = `${dotRadius}rem`;
	dot.style.background = `hsl(${color.h} ${color.s*100} 50)`;
	dot.style.position = 'absolute';
	dot.style.left = `calc(50% + ${position.x} * 50% - ${dotRadius}rem/2)`;
	dot.style.bottom = `calc(50% + ${position.y} * 50% - ${dotRadius}rem/2)`;
	dot.style.zIndex = '2';
	dot.style.outline = '2px solid white';
	dot.style.outlineOffset = '-1px';
	parent.appendChild(dot);
}

function cartesianFromPolar(r, a) {
	const radianAngle = a * (Math.PI / 180);
	return { x: r * Math.cos(radianAngle), y: r * Math.sin(radianAngle) }
}
function getPositiveFromNormalizedBipolar(n) { return (n + 1) / 2 }
function getBipolarFromNormalizedPositive(n) { return n * 2 - 1 }

console.log(usercolor);
createColorDot(originWheel, usercolor);