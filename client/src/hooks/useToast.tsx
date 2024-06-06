// Inspired by react-hot-toast library
import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

const actionTypes = {
	ADD_TOAST: "ADD_TOAST",
	UPDATE_TOAST: "UPDATE_TOAST",
	DISMISS_TOAST: "DISMISS_TOAST",
	REMOVE_TOAST: "REMOVE_TOAST",
};

let count = 0;

function genId() {
	count = (count + 1) % Number.MAX_SAFE_INTEGER;
	return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId: string) => {
	if (toastTimeouts.has(toastId)) {
		return;
	}

	const timeout = setTimeout(() => {
		toastTimeouts.delete(toastId);
		dispatch({
			type: "REMOVE_TOAST",
			toastId: toastId,
		});
	}, TOAST_REMOVE_DELAY);

	toastTimeouts.set(toastId, timeout);
};

export interface Toast {
	id: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	action: string;
}

export interface ToastAction {
	type: string;
	toast: Toast;
	toastId?: string;
}

export interface ToastState {
	toasts: (Toast | undefined)[];
}

export const reducer = (
	state: ToastState,
	action: ToastAction
): ToastState | undefined => {
	switch (action.type) {
		case "ADD_TOAST":
			return {
				...state,
				toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
			};

		case "UPDATE_TOAST":
			return {
				...state,
				toasts: state.toasts.map((t) =>
					t && t.id === action.toast?.id ? { ...t, ...action.toast } : t
				),
			};

		case "DISMISS_TOAST": {
			const { toastId } = action;

			// ! Side effects ! - This could be extracted into a dismissToast() action,
			// but I'll keep it here for simplicity
			if (toastId) {
				addToRemoveQueue(toastId);
			} else {
				state.toasts.forEach((toast) => {
					addToRemoveQueue(toast?.id || "");
				});
			}

			return {
				...state,
				toasts: state.toasts.map((t) =>
					t?.id === toastId || toastId === undefined
						? {
								...(t as Toast),
								open: false,
						  }
						: t
				),
			};
		}
		case "REMOVE_TOAST":
			if (action.toastId === undefined) {
				return {
					...state,
					toasts: [],
				};
			}
			return {
				...state,
				toasts: state.toasts.filter((t) => t?.id !== action.toastId),
			};
	}
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners: any = [];

let memoryState: { toasts: (Toast | undefined)[] } | ToastState = {
	toasts: [],
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dispatch(action: any) {
	memoryState = reducer(memoryState, action) || { toasts: [] };
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	listeners.forEach((listener: any) => {
		listener(memoryState);
	});
}

function toast({ ...props }) {
	const id = genId();

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const update = (props: any) =>
		dispatch({
			type: "UPDATE_TOAST",
			toast: { ...props, id },
		});
	const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

	dispatch({
		type: "ADD_TOAST",
		toast: {
			...props,
			id,
			open: true,
			onOpenChange: (open: boolean) => {
				if (!open) dismiss();
			},
		},
	});

	return {
		id: id,
		dismiss,
		update,
	};
}

function useToast() {
	const [state, setState] = React.useState(memoryState);

	React.useEffect(() => {
		listeners.push(setState);
		return () => {
			const index = listeners.indexOf(setState);
			if (index > -1) {
				listeners.splice(index, 1);
			}
		};
	}, [state]);

	return {
		...state,
		toast,
		dismiss: (toastId: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
	};
}

export { useToast, toast };
