const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

let active: SpeechRecognition | null = null;

export function start() {
	if (!SpeechRecognition || active) return;
	console.debug("start recording");

	const inst = new SpeechRecognition();

	inst.continuous = true;
	active = inst


	inst.onstart = () => {
		dispatchStart()
	};

	inst.onend = () => {
		dispatchEnd()
		active = null;
	};

	inst.onresult = (event) => {
		const parts: string[] = []
		for (let i = 0; i < event.results.length; i++) {
			parts.push(event.results[i][0].transcript.trim())
		}
		const words = parts.filter(Boolean).join(' ')

		dispatchMsg(words);
	}

	inst.onerror = (event) => {
		dispatchErr(`Speech recognition error: ${event.error}.`)
	}

	try {
		inst.start();
	} catch (err) {
		active = null
		dispatchErr(`Could not start microphone: ${err instanceof Error ? err.message : String(err)}`)
	}
}

export function end() {
	if (!active) return;

	console.debug("end recording");

	active.stop();
}

function dispatchStart() {
	window.dispatchEvent(new CustomEvent('record-start', {
		detail: {}
	}));
}

function dispatchEnd() {
	window.dispatchEvent(new CustomEvent('record-end', {
		detail: {}
	}));
}


function dispatchErr(msg: string) {
	window.dispatchEvent(new CustomEvent('record-error', {
		detail: { msg }
	}));
}

function dispatchMsg(msg: string) {
	window.dispatchEvent(new CustomEvent('record-msg', {
		detail: { msg }
	}));
}
