const playSound = (soundUrl: string) => {
	const audio = new Audio(soundUrl);
	audio.play().catch((error) => {
		console.error("Error playing sound:", error);
	});
};

export const playSentSound = () => {
	playSound("/sounds/sound2.mp3");
};

export const playReceivedSound = () => {
	playSound("/sounds/sound1.mp3");
};
