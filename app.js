const videoElement = document.getElementById('webcam');
const canvasElement = document.getElementById('paintCanvas');
const ctx = canvasElement.getContext('2d');
const modeText = document.getElementById('mode-text');

// UI Elements
const colorPicker = document.getElementById('colorPicker');
const brushSize = document.getElementById('brushSize');
const clearBtn = document.getElementById('clearBtn');

// Drawing state tracker
let lastX = null;
let lastY = null;

// Clear canvas functionality
clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
});

// Process MediaPipe results
function onResults(results) {
    // If no hand is tracked, reset path vectors and return
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
        modeText.textContent = "No Hand Detected";
        modeText.style.color = "#ff2a5f";
        lastX = null;
        lastY = null;
        return;
    }

    const landmarks = results.multiHandLandmarks[0];

    // 1. Map tracking coordinates to index finger tip (Landmark 8)
    const indexTip = landmarks[8];
    const x = indexTip.x * canvasElement.width;
    const y = indexTip.y * canvasElement.height;

    // 2. Gesture Detection Logic
    const isIndexExtended = landmarks[8].y < landmarks[6].y;
    const isMiddleExtended = landmarks[12].y < landmarks[10].y;
    const isRingExtended = landmarks[16].y < landmarks[14].y;
    const isPinkyExtended = landmarks[20].y < landmarks[18].y;

    let currentMode = "Pause";

    if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
        currentMode = "Draw";
    } else if (isIndexExtended && isMiddleExtended && isRingExtended && isPinkyExtended) {
        currentMode = "Erase";
    } else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
        currentMode = "Pause";
    }

    // Update user status display
    modeText.textContent = currentMode;

    // 3. Execution of Drawing Actions
    if (currentMode === "Draw") {
        modeText.style.color = "#00ffca";
        
        ctx.beginPath();
        // Set up the Neon Glow effects using shadow properties
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = brushSize.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowBlur = brushSize.value * 1.5;
        ctx.shadowColor = colorPicker.value;

        if (lastX !== null && lastY !== null) {
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        
        lastX = x;
        lastY = y;

    } else if (currentMode === "Erase") {
        modeText.style.color = "#ffda00";
        
        // Canvas erasing config
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize.value * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Break drawing path continuity
        lastX = null;
        lastY = null;

    } else {
        // Pause mode or unhandled configuration
        modeText.style.color = "#999";
        lastX = null;
        lastY = null;
    }
}

// Initialize MediaPipe Hands object
const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7
});

hands.onResults(onResults);

// Instantiate camera utility via MediaPipe helpers
const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({ image: videoElement });
    },
    width: 800,
    height: 600
});

camera.start();
