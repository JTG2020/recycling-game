class RecyclingGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.level = 1;
        this.lives = 5; // Increased from 3 to 5
        this.gameRunning = false; // Changed to false - game starts paused
        this.gameStarted = false; // Track if game has been started
        this.items = [];
        this.particles = [];
        this.draggedItem = null;
        this.mousePos = { x: 0, y: 0 };
        this.gameTime = 300; // 5 minutes in seconds (increased from 120)
        this.timeRemaining = this.gameTime;
        this.correctlySorted = 0; // Track correctly sorted items for cheers
        this.highScore = this.loadHighScore();
        
        // Game items with their properties
        this.itemTypes = {
            plastic: {
                items: ['🥤', '🍼', '🧴', '🛍️'],
                color: '#FF6B6B',
                bin: 'plastic'
            },
            paper: {
                items: ['📰', '📄', '📦', '📚'],
                color: '#4ECDC4',
                bin: 'paper'
            },
            glass: {
                items: ['🍶', '🍷', '🥛', '🫙'],
                color: '#45B7D1',
                bin: 'glass'
            },
            metal: {
                items: ['🥫', '🔧', '⚙️', '🔩'],
                color: '#96CEB4',
                bin: 'metal'
            },
            organic: {
                items: ['🍎', '🍌', '🥕', '🥬'],
                color: '#FECA57',
                bin: 'organic'
            },
            trash: {
                items: ['🔋', '💡', '🧸', '👟', '🖊️', '📱'],
                color: '#8B4513',
                bin: 'trash'
            }
        };
        
        this.binPositions = {
            plastic: { x: 240, y: 520, width: 80, height: 100 },
            paper: { x: 335, y: 520, width: 80, height: 100 },
            glass: { x: 430, y: 520, width: 80, height: 100 },
            metal: { x: 525, y: 520, width: 80, height: 100 },
            organic: { x: 620, y: 520, width: 80, height: 100 },
            trash: { x: 715, y: 520, width: 80, height: 100 }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.gameLoop(); // Start the game loop but game won't run until started
    }
    
    startGame() {
        this.gameStarted = true;
        this.gameRunning = true;
        this.startTimer();
        this.spawnItem();
        document.getElementById('playBtn').style.display = 'none';
        document.getElementById('endBtn').style.display = 'inline-block';
    }
    
    endGame() {
        this.gameRunning = false;
        this.gameStarted = false;
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        // Save high score if achieved
        this.saveHighScore();
        
        // Show end game modal
        document.getElementById('gameOverReason').textContent = 'Game ended by player';
        document.getElementById('finalScore').textContent = this.score;
        
        const isNewHighScore = this.score > 0 && this.score === this.highScore;
        if (isNewHighScore) {
            document.getElementById('newHighScore').style.display = 'block';
        } else {
            document.getElementById('newHighScore').style.display = 'none';
        }
        
        document.getElementById('gameOverModal').classList.remove('hidden');
        document.getElementById('playBtn').style.display = 'inline-block';
        document.getElementById('endBtn').style.display = 'none';
    }
    
    startTimer() {
        this.gameTimer = setInterval(() => {
            if (this.gameRunning && this.gameStarted) {
                this.timeRemaining--;
                this.updateUI();
                
                if (this.timeRemaining <= 0) {
                    this.gameOver();
                }
            }
        }, 1000);
    }
    
    setupEventListeners() {
        // Mouse events
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        
        // Touch events for mobile
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
        
        // Game control buttons
        document.getElementById('playBtn').addEventListener('click', () => this.startGame());
        document.getElementById('endBtn').addEventListener('click', () => this.endGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }
    
    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }
    
    getTouchPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.touches[0].clientX - rect.left,
            y: e.touches[0].clientY - rect.top
        };
    }
    
    handleMouseDown(e) {
        this.mousePos = this.getMousePos(e);
        this.checkItemGrab();
    }
    
    handleMouseMove(e) {
        this.mousePos = this.getMousePos(e);
    }
    
    handleMouseUp(e) {
        if (this.draggedItem) {
            this.checkBinDrop();
            // Reset item properties if not dropped in bin
            if (this.draggedItem) {
                this.draggedItem.isDragged = false;
                this.draggedItem.speed = 1 + (this.level * 0.3);
            }
            this.draggedItem = null;
        }
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        this.mousePos = this.getTouchPos(e);
        this.checkItemGrab();
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        this.mousePos = this.getTouchPos(e);
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        if (this.draggedItem) {
            this.checkBinDrop();
            // Reset item properties if not dropped in bin
            if (this.draggedItem) {
                this.draggedItem.isDragged = false;
                this.draggedItem.speed = 1 + (this.level * 0.3);
            }
            this.draggedItem = null;
        }
    }
    
    checkItemGrab() {
        // Check items from top to bottom (most recently spawned first)
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            const distance = Math.sqrt(
                Math.pow(this.mousePos.x - item.x, 2) + 
                Math.pow(this.mousePos.y - item.y, 2)
            );
            
            // Increased grab radius for better user experience
            if (distance < 40) {
                this.draggedItem = item;
                item.isDragged = true;
                // Stop the item from falling while being dragged
                item.speed = 0;
                break;
            }
        }
    }
    
    checkBinDrop() {
        let droppedInBin = false;
        
        for (let binType in this.binPositions) {
            const bin = this.binPositions[binType];
            
            if (this.mousePos.x >= bin.x && 
                this.mousePos.x <= bin.x + bin.width &&
                this.mousePos.y >= bin.y && 
                this.mousePos.y <= bin.y + bin.height) {
                
                this.handleBinDrop(binType);
                droppedInBin = true;
                return;
            }
        }
        
        // If not dropped in any bin, item resumes falling
        if (!droppedInBin && this.draggedItem) {
            this.draggedItem.isDragged = false;
            this.draggedItem.speed = 1 + (this.level * 0.3);
        }
    }
    
    handleBinDrop(binType) {
        if (this.draggedItem.type === binType) {
            // Correct bin!
            this.score += 1; // Changed from 10 * this.level to 1
            this.correctlySorted++;
            this.createParticles(this.mousePos.x, this.mousePos.y, '#00FF00');
            this.playSound('correct');
            
            // Show success feedback
            this.showFeedback('Correct! +1', '#00FF00');
            
            // Check for cheer milestone (every 10 correctly sorted items)
            this.checkCheerMilestone();
        } else {
            // Wrong bin!
            this.lives--;
            this.createParticles(this.mousePos.x, this.mousePos.y, '#FF0000');
            this.playSound('wrong');
            
            // Show error feedback
            this.showFeedback('Wrong bin! -1 life', '#FF0000');
        }
        
        // Remove the item
        this.items = this.items.filter(item => item !== this.draggedItem);
        
        // Update UI immediately
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver();
        }
    }
    
    checkCheerMilestone() {
        // Cheer every 10 correctly sorted items
        if (this.correctlySorted > 0 && this.correctlySorted % 10 === 0) {
            this.showCheer();
        }
    }
    
    showCheer() {
        const cheers = [
            `>>> ${this.correctlySorted} ITEMS SORTED! <<<`,
            `*** ${this.correctlySorted} CORRECT! AWESOME! ***`,
            `+++ ${this.correctlySorted} ITEMS! WELL DONE! +++`,
            `=== ${this.correctlySorted} SORTED! FANTASTIC! ===`,
            `>>> ${this.correctlySorted} ITEMS! KEEP IT UP! <<<`,
            `*** ${this.correctlySorted} CORRECT! AMAZING! ***`,
            `+++ ${this.correctlySorted} ITEMS! EXCELLENT! +++`,
            `=== ${this.correctlySorted} SORTED! PERFECT! ===`
        ];
        
        const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
        
        // Create arcade-style cheer element
        const cheer = document.createElement('div');
        cheer.textContent = randomCheer;
        cheer.style.position = 'absolute';
        cheer.style.color = '#ffff00';
        cheer.style.fontSize = '28px';
        cheer.style.fontWeight = 'bold';
        cheer.style.fontFamily = 'Courier New, monospace';
        cheer.style.pointerEvents = 'none';
        cheer.style.zIndex = '1000';
        cheer.style.left = '50%';
        cheer.style.top = '25%';
        cheer.style.transform = 'translateX(-50%)';
        cheer.style.textShadow = '0 0 20px #ffff00, 0 0 30px #ffff00, 0 0 40px #ffff00';
        cheer.style.transition = 'all 2s ease-out';
        cheer.style.letterSpacing = '2px';
        cheer.style.border = '3px solid #ffff00';
        cheer.style.padding = '10px 20px';
        cheer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        cheer.style.borderRadius = '10px';
        
        document.body.appendChild(cheer);
        
        // Animate the cheer with arcade-style effects
        setTimeout(() => {
            cheer.style.transform = 'translateX(-50%) translateY(-100px) scale(1.3)';
            cheer.style.opacity = '0';
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            if (document.body.contains(cheer)) {
                document.body.removeChild(cheer);
            }
        }, 2100);
        
        // Create enhanced celebration particles
        this.createParticles(this.canvas.width / 2, 200, '#ffff00');
        this.createParticles(this.canvas.width / 2 - 50, 180, '#ff00ff');
        this.createParticles(this.canvas.width / 2 + 50, 180, '#00ffff');
        this.createParticles(this.canvas.width / 2 - 100, 160, '#00ff00');
        this.createParticles(this.canvas.width / 2 + 100, 160, '#ff6600');
    }
    
    showFeedback(text, color) {
        // Create arcade-style floating text feedback
        const feedback = document.createElement('div');
        feedback.textContent = text;
        feedback.style.position = 'absolute';
        feedback.style.color = color;
        feedback.style.fontSize = '22px';
        feedback.style.fontWeight = 'bold';
        feedback.style.fontFamily = 'Courier New, monospace';
        feedback.style.pointerEvents = 'none';
        feedback.style.zIndex = '1000';
        feedback.style.left = this.mousePos.x + 'px';
        feedback.style.top = this.mousePos.y + 'px';
        feedback.style.transition = 'all 1s ease-out';
        feedback.style.textShadow = `0 0 15px ${color}, 0 0 25px ${color}`;
        feedback.style.letterSpacing = '1px';
        feedback.style.textTransform = 'uppercase';
        
        document.body.appendChild(feedback);
        
        // Animate the feedback with arcade-style movement
        setTimeout(() => {
            feedback.style.transform = 'translateY(-80px) scale(1.2)';
            feedback.style.opacity = '0';
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            if (document.body.contains(feedback)) {
                document.body.removeChild(feedback);
            }
        }, 1100);
    }
    
    spawnItem() {
        if (!this.gameRunning || !this.gameStarted) return;
        
        const types = Object.keys(this.itemTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        const typeData = this.itemTypes[randomType];
        const randomItem = typeData.items[Math.floor(Math.random() * typeData.items.length)];
        
        const item = {
            x: Math.random() * (this.canvas.width - 60) + 30,
            y: -30,
            type: randomType,
            emoji: randomItem,
            speed: 1 + (this.level * 0.3),
            isDragged: false,
            rotation: 0
        };
        
        this.items.push(item);
        
        // Schedule next item spawn
        const spawnDelay = Math.max(1000 - (this.level * 100), 300);
        setTimeout(() => this.spawnItem(), spawnDelay);
    }
    
    updateItems() {
        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];
            
            if (item === this.draggedItem) {
                // Follow mouse/touch
                item.x = this.mousePos.x;
                item.y = this.mousePos.y;
                item.isDragged = true;
            } else {
                // Fall down
                item.y += item.speed;
                item.rotation += 0.05;
            }
            
            // Remove items that fall off screen
            if (item.y > this.canvas.height + 50 && !item.isDragged) {
                this.items.splice(i, 1);
                if (!item.isDragged) {
                    this.lives--;
                    this.updateUI();
                    if (this.lives <= 0) {
                        this.gameOver();
                    }
                }
            }
        }
    }
    
    createParticles(x, y, color) {
        for (let i = 0; i < 10; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 30,
                color: color
            });
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw() {
        // Clear canvas with dark arcade background
        this.ctx.fillStyle = '#000033';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Add starfield effect
        this.drawStarfield();
        
        // Draw bins on canvas
        this.drawBins();
        
        // If game hasn't started, show start message
        if (!this.gameStarted) {
            // Arcade-style welcome screen
            this.ctx.fillStyle = '#00ffff';
            this.ctx.font = 'bold 36px Courier New';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#00ffff';
            this.ctx.shadowBlur = 20;
            this.ctx.fillText('>>> RECYCLE RUSH <<<', this.canvas.width / 2, this.canvas.height / 2 - 80);
            
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 24px Courier New';
            this.ctx.shadowColor = '#ffff00';
            this.ctx.shadowBlur = 15;
            this.ctx.fillText('PRESS PLAY TO START', this.canvas.width / 2, this.canvas.height / 2 - 20);
            
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '18px Courier New';
            this.ctx.shadowColor = '#00ff00';
            this.ctx.shadowBlur = 10;
            this.ctx.fillText('DRAG ITEMS TO CORRECT BINS', this.canvas.width / 2, this.canvas.height / 2 + 20);
            this.ctx.fillText('SCORE POINTS AND SAVE THE PLANET!', this.canvas.width / 2, this.canvas.height / 2 + 50);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
            return;
        }
        
        // Draw items with glow effects
        for (let item of this.items) {
            this.ctx.save();
            this.ctx.translate(item.x, item.y);
            this.ctx.rotate(item.rotation);
            
            // Add glow effect to items
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 15;
            this.ctx.font = '40px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(item.emoji, 0, 15);
            
            this.ctx.restore();
            
            // Draw enhanced glow effect for dragged item
            if (item === this.draggedItem) {
                this.ctx.beginPath();
                this.ctx.arc(item.x, item.y, 35, 0, Math.PI * 2);
                this.ctx.strokeStyle = '#ffff00';
                this.ctx.shadowColor = '#ffff00';
                this.ctx.shadowBlur = 25;
                this.ctx.lineWidth = 4;
                this.ctx.stroke();
            }
        }
        
        // Draw enhanced particles
        for (let particle of this.particles) {
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10;
            this.ctx.globalAlpha = particle.life / 30;
            this.ctx.fillRect(particle.x, particle.y, 6, 6);
            this.ctx.globalAlpha = 1;
        }
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
    
    drawStarfield() {
        // Create moving starfield background
        if (!this.stars) {
            this.stars = [];
            for (let i = 0; i < 100; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    speed: Math.random() * 2 + 0.5,
                    brightness: Math.random()
                });
            }
        }
        
        for (let star of this.stars) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.fillRect(star.x, star.y, 1, 1);
            
            // Move stars
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        }
    }
    
    drawBins() {
        const binColors = {
            plastic: '#ff0066',
            paper: '#00ff66',
            glass: '#0066ff',
            metal: '#ffff00',
            organic: '#ff6600',
            trash: '#8800ff'
        };
        
        const binLabels = {
            plastic: 'PLASTIC',
            paper: 'PAPER',
            glass: 'GLASS',
            metal: 'METAL',
            organic: 'ORGANIC',
            trash: 'TRASH'
        };
        
        const binIcons = {
            plastic: '🥤',
            paper: '📄',
            glass: '🍶',
            metal: '🥫',
            organic: '🍎',
            trash: '🗑️'
        };
        
        for (let binType in this.binPositions) {
            const bin = this.binPositions[binType];
            
            // Draw neon glow effect
            this.ctx.shadowColor = binColors[binType];
            this.ctx.shadowBlur = 20;
            
            // Draw bin background with gradient effect
            const gradient = this.ctx.createLinearGradient(bin.x, bin.y, bin.x, bin.y + bin.height);
            gradient.addColorStop(0, binColors[binType]);
            gradient.addColorStop(1, this.darkenColor(binColors[binType], 0.4));
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(bin.x, bin.y, bin.width, bin.height);
            
            // Draw neon border
            this.ctx.strokeStyle = binColors[binType];
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(bin.x, bin.y, bin.width, bin.height);
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
            
            // Draw bin icon at the top with glow
            this.ctx.font = '24px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.fillText(binIcons[binType], bin.x + bin.width/2, bin.y + 25);
            
            // Draw bin label in the middle with neon effect
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 9px Courier New';
            this.ctx.strokeStyle = '#000000';
            this.ctx.lineWidth = 2;
            this.ctx.shadowColor = binColors[binType];
            this.ctx.shadowBlur = 5;
            this.ctx.strokeText(binLabels[binType], bin.x + bin.width/2, bin.y + 50);
            this.ctx.fillText(binLabels[binType], bin.x + bin.width/2, bin.y + 50);
            
            // Draw recycling symbol at the bottom (except for trash)
            this.ctx.font = '20px Arial';
            this.ctx.fillStyle = '#ffffff';
            this.ctx.shadowColor = '#ffffff';
            this.ctx.shadowBlur = 8;
            if (binType === 'trash') {
                this.ctx.fillText('🚮', bin.x + bin.width/2, bin.y + 80);
            } else {
                this.ctx.fillText('♻️', bin.x + bin.width/2, bin.y + 80);
            }
            
            // Reset shadow
            this.ctx.shadowBlur = 0;
        }
    }
    
    loadHighScore() {
        const saved = localStorage.getItem('recyclingGameHighScore');
        return saved ? parseInt(saved) : 0;
    }
    
    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('recyclingGameHighScore', this.highScore.toString());
            return true; // New high score achieved
        }
        return false;
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = '❤️'.repeat(this.lives);
        document.getElementById('highScore').textContent = this.highScore;
        
        // Format time as MM:SS
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('time').textContent = timeString;
        
        // Level up every 50 points (since scoring is now 1 point per item)
        const newLevel = Math.floor(this.score / 50) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            this.createParticles(this.canvas.width / 2, this.canvas.height / 2, '#FFD700');
        }
    }
    
    playSound(type) {
        // Enhanced arcade-style audio feedback using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            // Arcade success sound - ascending notes
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
            oscillator.frequency.setValueAtTime(554.37, audioContext.currentTime + 0.1); // C#5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
            oscillator.type = 'square'; // Classic arcade sound
        } else {
            // Arcade error sound - descending buzz
            oscillator.frequency.setValueAtTime(200, audioContext.currentTime); // Lower frequency
            oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.2);
            oscillator.type = 'sawtooth'; // Harsh error sound
        }
        
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.4);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gameStarted = false;
        clearInterval(this.gameTimer);
        
        // Check for new high score
        const isNewHighScore = this.saveHighScore();
        
        let reason = '';
        if (this.timeRemaining <= 0) {
            reason = 'Time\'s up!';
        } else if (this.lives <= 0) {
            reason = 'No lives left!';
        }
        
        document.getElementById('gameOverReason').textContent = reason;
        document.getElementById('finalScore').textContent = this.score;
        
        if (isNewHighScore) {
            document.getElementById('newHighScore').style.display = 'block';
        } else {
            document.getElementById('newHighScore').style.display = 'none';
        }
        
        document.getElementById('gameOverModal').classList.remove('hidden');
        document.getElementById('playBtn').style.display = 'inline-block';
        document.getElementById('endBtn').style.display = 'none';
    }
    
    // Helper function to darken colors for gradient effect
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.floor(255 * amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.floor(255 * amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.floor(255 * amount));
        
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    restart() {
        this.score = 0;
        this.level = 1;
        this.lives = 5; // Reset to 5 lives
        this.gameRunning = false;
        this.gameStarted = false;
        this.items = [];
        this.particles = [];
        this.draggedItem = null;
        this.timeRemaining = this.gameTime;
        this.correctlySorted = 0; // Reset correctly sorted counter
        
        // Clear existing timer
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        
        document.getElementById('gameOverModal').classList.add('hidden');
        document.getElementById('playBtn').style.display = 'inline-block';
        document.getElementById('endBtn').style.display = 'none';
        this.updateUI();
    }
    
    gameLoop() {
        if (this.gameRunning && this.gameStarted) {
            this.updateItems();
            this.updateParticles();
            
            // Ensure UI is always up to date
            this.updateUI();
        }
        
        // Always draw (even when not running to show start screen)
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when page loads
window.addEventListener('load', () => {
    new RecyclingGame();
});
