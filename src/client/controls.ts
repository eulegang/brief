export { }

import * as record from "./record.js"

const body = document.querySelector("body");

const voice = getId<HTMLButtonElement>("voice-btn");
const cancel = getId<HTMLButtonElement>("cancel-btn");
const clear = getId<HTMLButtonElement>("clear-btn");
const status = getId<HTMLElement>("status");
const transcript = getId<HTMLButtonElement>("transcript");

if (!body) {
	throw new Error("failed to find controls");
}

window.addEventListener('start-record', () => {
	body.classList.add("recording");
})

window.addEventListener('end-record', () => {
	body.classList.remove("recording");
})

const textSlots: string[] = [];
window.addEventListener('record-msg', (e) => {
	textSlots.push(e.detail.msg);
	recalcTranscript();
})

function recalcTranscript() {
	clear.disabled = textSlots.length === 0;
	transcript.value = textSlots.join("\n\n");
}

clear.addEventListener('click', () => {
	textSlots.length = 0;
	recalcTranscript();
});

voice.addEventListener("pointerdown", (e) => {
	e.preventDefault();

	record.start();
});

window.addEventListener('pointerup', (e) => {
	e.preventDefault();

	record.end();
})

window.addEventListener('pointercancel', (e) => {
	e.preventDefault();

	record.end();
})


let heldKey: string | null = null
window.addEventListener("keydown", (e) => {
	if (e.key !== ' ' && e.key !== 'Enter') return
	e.preventDefault()
	if (e.repeat) return
	record.start();
	heldKey = e.key
})

window.addEventListener('keyup', (event) => {
	if (event.key === heldKey) record.end();
})

function getId<T extends HTMLElement>(id: string): T {
	const element = document.getElementById(id);

	if (!element) {
		throw new Error(`failed to find "#${id}"`);
	}

	return element as T;
}
