# Recycle Rush - Arcade Edition 🕹️

An educational arcade-style recycling game that teaches proper waste sorting while providing an engaging gaming experience.

## 🎮 Game Features

• **6 Recycling Categories:** Plastic, Paper, Glass, Metal, Organic, and Trash

• **Arcade Aesthetics:** Retro neon colors, scanlines, and classic arcade sounds

• **Drag & Drop Gameplay:** Intuitive item sorting mechanics

• **Scoring System:** 1 point per correctly sorted item

• **Celebration System:** Cheers every 10 correctly sorted items

• **High Score Tracking:** Persistent local storage of best scores

• **5-Minute Timer:** Fast-paced gameplay sessions

• **5 Lives System:** Forgiving gameplay for learning

• **Responsive Design:** Works on desktop and mobile devices

## 🖥️ System Requirements

### Minimum Hardware
• **RAM:** 2GB minimum (4GB recommended)

• **Storage:** 50MB free space

• **Display:** 1024x768 resolution minimum (1920x1080 recommended)

• **Input:** Mouse or touchscreen for drag-and-drop

### Software Requirements

#### Web Browser (Required)
• **Chrome:** Version 60+ (recommended)

• **Firefox:** Version 55+

• **Safari:** Version 11+

• **Edge:** Version 79+

• **Mobile:** iOS Safari 11+, Chrome Mobile 60+

#### Web Server (for local hosting)
Choose one of the following:
• **Python 3.x** (for python3 -m http.server)

• **Node.js** (for npx serve)

• **Apache/Nginx** (for production)

• Any local web server

### Browser Features Required
• HTML5 Canvas support

• JavaScript ES6+ support

• Web Audio API (for sound effects)

• Local Storage (for high score persistence)

• CSS3 (for animations and effects)

• Touch Events (for mobile devices)

## 📁 File Structure
```
recycling-game/
├── index.html          # Main game page (2KB)
├── game.js            # Game logic (15KB)
├── styles.css         # Arcade styling (8KB)
└── README.md          # This file
```

Total Size: ~25KB (very lightweight!)

## 🚀 Installation & Setup

### Option 1: Local Development Server (Recommended)

1. Download all game files to a folder
2. Navigate to the game directory:
  bash
   cd /path/to/recycling-game
   
3. Start a local web server:
  bash
   # Using Python 3
   python3 -m http.server 8000
   
   # OR using Node.js
   npx serve
   
4. Open your browser and go to:
  
   http://localhost:8000
   
5. Play the game!

### Option 2: Static Web Hosting

Deploy to any of these free hosting services:

• **GitHub Pages**

• **Netlify**

• **Vercel**

• **Firebase Hosting**

Simply upload the files and access via the provided URL.

### Option 3: Traditional Web Server

Upload files to any web server - no server-side processing required.

## 📱 Platform Compatibility

### Desktop Support
• **Windows 10/11** (Chrome, Firefox, Edge)

• **macOS 10.14+** (Safari, Chrome, Firefox)

• **Linux** (Chrome, Firefox)

### Mobile Support
• **iOS 11+** (Safari, Chrome)

• **Android 7+** (Chrome, Firefox)

• Responsive design adapts to all screen sizes

## 🌐 Network Requirements

### Local Play

• **No internet required** once files are downloaded

• **Offline capable** - runs entirely in browser

• **No external dependencies**

### Online Hosting

• **Bandwidth:** Minimal (< 1MB total download)

• **CDN:** Optional but recommended for global access

## ⚡ Performance

### Optimal Performance
• **60 FPS** gameplay on modern devices

• **Smooth animations** with Canvas rendering

• **Efficient particle system**

• **Optimized** for 1000x600 canvas resolution

### Minimum Performance
• **30 FPS** on older devices

• **Graceful degradation** on slower hardware

• **Touch-friendly** interface for mobile

## 🛡️ Privacy & Security

• **No external dependencies** - completely self-contained

• **No data collection** - privacy-friendly

• **Local storage only** - high scores saved locally

• **No server communication** - fully client-side

• **Safe for all ages** - educational content

## 🎯 How to Play

1. Click PLAY to start the game
2. Drag falling items to the correct recycling bins
3. Match items to their proper categories:
   • 🥤 Plastic: Bottles, containers, bags
   • 📄 Paper: Newspapers, books, cardboard
   • 🍶 Glass: Bottles, jars, containers
   • 🥫 Metal: Cans, tools, hardware
   • 🍎 Organic: Food scraps, compostables
   • 🗑️ Trash: Non-recyclable items
4. Score 1 point for each correctly sorted item
5. Avoid losing all 5 lives
6. Beat the 5-minute timer!

## 🏆 Scoring System

• **+1 point** for each correctly sorted item
• **Celebration** every 10 correctly sorted items
• **Level up** every 50 points
• **High score** tracking with local storage
• **Lives system** for learning-friendly gameplay

## 🔧 Troubleshooting

### Game Won't Load
• Ensure you're using a supported browser
• Check that all 3 files are in the same directory
• Verify you're accessing via HTTP (not file://)

### Performance Issues
• Close other browser tabs
• Update your browser to the latest version
• Try a different browser (Chrome recommended)

### Mobile Issues
• Ensure touch events are enabled
• Try landscape orientation for better experience
• Clear browser cache if needed

## 🤝 Contributing

This is an educational project. Feel free to:
• Modify the code for learning purposes
• Add new features or item types
• Improve the arcade aesthetics
• Translate to other languages

## 📄 License

Educational use - feel free to learn from and modify the code!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━


Ready to save the planet one item at a time? 🌍♻️

Start playing and learn proper recycling while having fun with this retro arcade experience!
