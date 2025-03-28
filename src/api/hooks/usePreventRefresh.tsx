import { useEffect } from "react";

const usePreventRefresh = (enabled: boolean = true) => {
	useEffect(() => {
		if (!enabled) return;

		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			event.preventDefault();
			event.returnValue = "";
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [enabled]);
};

export default usePreventRefresh;
