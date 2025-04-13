let audioContext: AudioContext | null = null;
let sentBuffer: AudioBuffer | null = null;
let receivedBuffer: AudioBuffer | null = null;
let hasInteracted = false;

// Initialize audio context on user interaction
export const initAudio = () => {
  if (audioContext) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    hasInteracted = true;
    loadSounds();
  } catch (error) {
    console.warn('Web Audio API not supported:', error);
  }
};

// Load sound files
const loadSounds = async () => {
  if (!audioContext) return;

  try {
    // Load sent sound
    const sentResponse = await fetch('/sounds/sent.mp3');
    const sentData = await sentResponse.arrayBuffer();
    sentBuffer = await audioContext.decodeAudioData(sentData);

    // Load received sound
    const receivedResponse = await fetch('/sounds/received.mp3');
    const receivedData = await receivedResponse.arrayBuffer();
    receivedBuffer = await audioContext.decodeAudioData(receivedData);
  } catch (error) {
    console.warn('Error loading sounds:', error);
  }
};

const playSound = async (buffer: AudioBuffer | null) => {
  if (!audioContext || !buffer || !hasInteracted) return;

  try {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.warn('Error playing sound:', error);
  }
};

export const playSentSound = () => playSound(sentBuffer);
export const playReceivedSound = () => playSound(receivedBuffer);
