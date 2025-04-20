let audioContext: AudioContext | null = null;
let sentBuffer: AudioBuffer | null = null;
let hasInteracted = false;
let sound: HTMLAudioElement;
let notificationSound: HTMLAudioElement;

// Initialize audio context on user interaction
export const initAudio = () => {
  if (!sound) {
    sound = new Audio("/sounds/sound2.mp3");
    sound.load();
  }

  if (!notificationSound) {
    notificationSound = new Audio("/sounds/sound1.mp3");
    notificationSound.load();
  }

  if (audioContext) {
    
    return;
  }

  try {
    audioContext = new (window.AudioContext ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitAudioContext)();
    hasInteracted = true;

    loadSounds();
  } catch (error) {
    console.error("Web Audio API not supported:", error);
  }
};

// Load sound files
const loadSounds = async () => {
  if (!audioContext) {
    console.error("Cannot load sounds: Audio context not initialized");
    return;
  }

  try {
    const sentResponse = await fetch("/sounds/sound2.mp3");

    const sentData = await sentResponse.arrayBuffer();
    sentBuffer = await audioContext.decodeAudioData(sentData);
  } catch (error) {
    console.error("Error loading sounds:", error);
  }
};

const playSound = async (buffer: AudioBuffer | null) => {
  if (!audioContext) {
    console.error("Cannot play sound: Audio context not initialized");
    return;
  }
  if (!buffer) {
    console.error("Cannot play sound: Buffer not loaded");
    return;
  }
  if (!hasInteracted) {
    console.error("Cannot play sound: No user interaction yet");
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error("Error playing sound:", error);
  }
};

export const playSentSound = () => {
  playSound(sentBuffer);
};

export const playReceivedSound = async () => {
  try {
    if (!sound) initAudio();
    await sound.play();
  } catch (error) {
    console.warn("Error playing notification sound:", error);
  }
};

export const playMessageSound = async () => {
  try {
    if (!notificationSound) initAudio();
    await notificationSound.play();
  } catch (error) {
    console.warn("Error playing notification sound:", error);
  }
};
