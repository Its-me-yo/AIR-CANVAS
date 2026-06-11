# GlowDraw AI (Neon Air Canvas)

A lightweight browser app that lets you draw in the air using your webcam. It uses MediaPipe's hand tracking model to detect gestures in real-time and renders a glowing, neon trail on a dark canvas. No extensions or external installations required.

## Features
* Zero Touch: Track your hand and paint entirely through mid-air gestures.
* Neon Aesthetic: High-intensity glow effects tailored dynamically to your choice of color.
* Responsive Layout: Live webcam preview mirrored automatically for natural hand-eye coordination.
* Custom Control Panel: Fine-tune color profiles and brush sizing parameters on the fly.

## Gestures
* ☝️ Draw Mode: Extend only your index finger.
* 🖐️ Erase Mode: Show an open palm to wipe away specific parts of your drawing.
* ✊ Pause Mode: Close your fist to stop drawing, allowing you to move your hand around without marking the canvas.

## Project Structure

├── index.html       # DOM layout and MediaPipe CDN references
├── style.css        # Layout structure, theme colors, and camera mirroring
└── app.js           # Gesture detection logic and canvas rendering pipeline
