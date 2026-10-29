export {};

declare global {
	interface StartRecordEventDetail { }
	interface EndRecordEventDetail { }
	interface ErrorRecordEventDetail { msg: string }
	interface MsgRecordEventDetail { msg: string }

	interface WindowEventMap {
		'record-start': CustomEvent<StartRecordEventDetail>;
		'record-end': CustomEvent<EndRecordEventDetail>;
		'record-error': CustomEvent<ErrorRecordEventDetail>;
		'record-msg': CustomEvent<MsgRecordEventDetail>;
	}
}
