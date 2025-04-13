const sentSound = new Audio("/sounds/sound2.mp3");
const receivedSound = new Audio("/sounds/sound1.mp3");

export const playSentSound = () => {
  sentSound.currentTime = 0; // Reset to the start
  sentSound.play().catch((error) => {
    console.error("Error playing sent sound:", error);
  });
};

export const playReceivedSound = () => {
  receivedSound.currentTime = 0; // Reset to the start
  receivedSound.play().catch((error) => {
    console.error("Error playing received sound:", error);
  });
};
