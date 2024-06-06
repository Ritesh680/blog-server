import { useToast } from "@/hooks/useToast";
import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from ".";

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map((props, index) => {
				return (
					<Toast key={props?.id || index} {...props} altText="">
						<div className="grid gap-1">
							{props?.title && (
								<ToastTitle altText="">{props.title}</ToastTitle>
							)}
							{props?.description && (
								<ToastDescription altText="">
									{props.description}
								</ToastDescription>
							)}
						</div>
						{props?.action}
						<ToastClose altText="" />
					</Toast>
				);
			})}
			<ToastViewport altText="" />
		</ToastProvider>
	);
}
