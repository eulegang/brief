export { }

import * as record from "./record.js"

const body = document.querySelector("body");

const voice = document.getElementById("voice-btn");
const cancel = document.getElementById("cancel-btn");
const status = document.getElementById("status");
const transcript = document.getElementById("transcript") as HTMLTextAreaElement | null;

if (!body || !voice || !cancel || !status || !transcript) {
	throw new Error("failed to find controls");
}

window.addEventListener('start-record', () => {
	body.classList.add("recording");
})

window.addEventListener('end-record', () => {
	body.classList.remove("recording");
})


window.addEventListener('record-msg', (e: CustomEvent<MsgRecordEventDetail>) => {
	transcript.value = transcript.value + e.detail.msg;
})


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
