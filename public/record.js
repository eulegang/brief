const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let active = null;
export function start() {
    if (!SpeechRecognition || active)
        return;
    console.log("start recording");
    const inst = new SpeechRecognition();
    inst.continuous = true;
    active = inst;
    inst.onstart = () => {
        dispatchStart();
    };
    inst.onend = () => {
        dispatchEnd();
        active = null;
    };
    inst.onresult = (event) => {
        console.log("event", event);
        const parts = [];
        for (let i = 0; i < event.results.length; i++) {
            parts.push(event.results[i][0].transcript.trim());
        }
        const words = parts.filter(Boolean).join(' ');
        console.log("processed", words);
        dispatchMsg(words);
    };
    inst.onerror = (event) => {
        dispatchErr(`Speech recognition error: ${event.error}.`);
    };
    try {
        inst.start();
    }
    catch (err) {
        active = null;
        dispatchErr(`Could not start microphone: ${err instanceof Error ? err.message : String(err)}`);
    }
}
export function end() {
    if (!active)
        return;
    console.log("end recording");
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
function dispatchErr(msg) {
    window.dispatchEvent(new CustomEvent('record-error', {
        detail: { msg }
    }));
}
function dispatchMsg(msg) {
    window.dispatchEvent(new CustomEvent('record-msg', {
        detail: { msg }
    }));
}
