interface StartRecordEventDetail { }
interface EndRecordEventDetail { }
interface ErrorRecordEventDetail { msg: string }
interface MsgRecordEventDetail { msg: string }

declare global {
	interface CustomEventMap {
		'record-start': CustomEvent<StartRecordEventDetail>;
		'record-end': CustomEvent<EndRecordEventDetail>;
		'record-error': CustomEvent<ErrorRecordEventDetail>;
		'record-msg': CustomEvent<MsgRecordEventDetail>;
	}

	// Ensure addEventListener/removeEventListener recognize the map on window/document
	interface Window {
		addEventListener<K extends keyof CustomEventMap>(
			type: K,
			listener: (this: Window, ev: CustomEventMap[K]) => any,
			options?: boolean | AddEventListenerOptions
		): void;
		dispatchEvent<K extends keyof CustomEventMap>(ev: CustomEventMap[K]): boolean;
	}
}
