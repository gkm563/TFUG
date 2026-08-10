// ============================================================================
// MAIN GAME CLASS
// ============================================================================

class HillClimbGame {
    constructor() {
        // Canvas setup
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // menu, playing, paused, gameover
        this.selectedCar = 'jeep';
        this.selectedTheme = 'earth';
        this.selectedDifficulty = 'easy';
        
        // Game objects
        this.car = null;
        this.terrain = [];
        this.coins = [];
        this.fuelCans = [];
        
        // Game variables
        this.coinsCollected = 0;
        this.distance = 0;
        this.score = 0;
        this.flips = 0;
        this.airTime = 0;
        this.isInAir = false;
        
        // Camera
        this.cameraX = 0;
        this.cameraY = 0;
        
        // Physics constants
        this.GRAVITY = {
            earth: 0.5,
            moon: 0.08
        };
        
        // Car configurations
        this.carConfigs = {
            jeep: {
                width: 60,
                height: 30,
                color: '#4CAF50',
                maxSpeed: 12,
                acceleration: 0.2,
                brakePower: 0.3,
                reverseSpeed: -3,
                fuelConsumption: 0.1,
                weight: 1.0,
                suspension: 0.1
            },
            bike: {
                width: 40,
                height: 20,
                color: '#2196F3',
                maxSpeed: 15,
                acceleration: 0.3,
                brakePower: 0.2,
                reverseSpeed: -2,
                fuelConsumption: 0.15,
                weight: 0.6,
                suspension: 0.05
            },
            monster: {
                width: 80,
                height: 40,
                color: '#FF9800',
                maxSpeed: 8,
                acceleration: 0.15,
                brakePower: 0.4,
                reverseSpeed: -1,
                fuelConsumption: 0.2,
                weight: 1.5,
                suspension: 0.15
            }
        };
        
        // Difficulty settings
        this.difficultySettings = {
            easy: { roughness: 20, maxSlope: 30, fuelMultiplier: 0.7 },
            medium: { roughness: 35, maxSlope: 45, fuelMultiplier: 1.0 },
            hard: { roughness: 50, maxSlope: 60, fuelMultiplier: 1.3 }
        };
        
        // Initialize game
        this.init();
    }
    
    // ============================================================================
    // INITIALIZATION
    // ============================================================================
    
    init() {
        this.resizeCanvas();
        this.setupEventListeners();
        this.setupSelectionUI();
        this.generateInitialTerrain();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.groundY = this.canvas.height * 0.7;
    }
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Keyboard controls
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        
        // Game buttons
        document.getElementById('startGame').addEventListener('click', () => this.startGame());
        document.getElementById('btnPause').addEventListener('click', () => this.togglePause());
        document.getElementById('btnResume').addEventListener('click', () => this.resumeGame());
        document.getElementById('btnRestart').addEventListener('click', () => this.restartGame());
        document.getElementById('btnRestartFromPause').addEventListener('click', () => this.restartGame());
        document.getElementById('btnMenu').addEventListener('click', () => this.quitToMenu());
        document.getElementById('btnQuitToMenu').addEventListener('click', () => this.quitToMenu());
        document.getElementById('btnPlayAgain').addEventListener('click', () => this.restartGame());
        document.getElementById('btnBackToMenu').addEventListener('click', () => this.quitToMenu());
        
        // Touch controls
        document.getElementById('btnLeft').addEventListener('touchstart', () => this.keys.left = true);
        document.getElementById('btnLeft').addEventListener('touchend', () => this.keys.left = false);
        document.getElementById('btnRight').addEventListener('touchstart', () => this.keys.right = true);
        document.getElementById('btnRight').addEventListener('touchend', () => this.keys.right = false);
        
        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }
    
    setupSelectionUI() {
        // Car selection
        document.querySelectorAll('.car-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.car-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.selectedCar = option.dataset.car;
            });
        });
        
        // Theme selection
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.selectedTheme = option.dataset.theme;
            });
        });
        
        // Difficulty selection
        document.querySelectorAll('.difficulty-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.difficulty-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
                this.selectedDifficulty = option.dataset.difficulty;
            });
        });
    }
    
    // ============================================================================
    // INPUT HANDLING
    // ============================================================================
    
    handleKeyDown(e) {
        if (!this.keys) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'd':
                this.keys.right = true;
                break;
            case 'ArrowLeft':
            case 'a':
                this.keys.left = true;
                break;
            case ' ':
                if (this.gameState === 'playing') {
                    this.togglePause();
                }
                break;
            case 'Escape':
                this.togglePause();
                break;
        }
    }
    
    handleKeyUp(e) {
        if (!this.keys) return;
        
        switch(e.key) {
            case 'ArrowRight':
            case 'd':
                this.keys.right = false;
                break;
            case 'ArrowLeft':
            case 'a':
                this.keys.left = false;
                break;
        }
    }
    
    // ============================================================================
    // GAME STATE MANAGEMENT
    // ============================================================================
    
    startGame() {
        // Reset game state
        this.coinsCollected = 0;
        this.distance = 0;
        this.score = 0;
        this.flips = 0;
        this.airTime = 0;
        
        // Create car
        const config = this.carConfigs[this.selectedCar];
        this.car = {
            x: 100,
            y: 0,
            width: config.width,
            height: config.height,
            color: config.color,
            vx: 0,
            vy: 0,
            rotation: 0,
            fuel: 100,
            wheelsOnGround: 2,
            lastRotation: 0,
            config: config
        };
        
        // Initialize keys object
        this.keys = {
            left: false,
            right: false
        };
        
        // Generate terrain
        this.generateInitialTerrain();
        
        // Generate initial coins and fuel cans
        this.generateCoins(50);
        this.generateFuelCans(10);
        
        // Position car on ground
        this.car.y = this.getGroundHeight(this.car.x) - this.car.height;
        
        // Set game state
        this.gameState = 'playing';
        
        // Switch screens
        document.getElementById('startScreen').classList.remove('active');
        document.getElementById('gameContainer').classList.add('active');
        
        // Start game loop
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseScreen').style.display = 'flex';
        } else if (this.gameState === 'paused') {
            this.resumeGame();
        }
    }
    
    resumeGame() {
        this.gameState = 'playing';
        document.getElementById('pauseScreen').style.display = 'none';
        this.lastTime = performance.now();
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    restartGame() {
        // Close all screens
        document.getElementById('pauseScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Start new game
        this.startGame();
    }
    
    quitToMenu() {
        // Close all screens
        document.getElementById('gameContainer').classList.remove('active');
        document.getElementById('pauseScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'none';
        
        // Show start screen
        document.getElementById('startScreen').classList.add('active');
        this.gameState = 'menu';
    }
    
    gameOver() {
        this.gameState = 'gameover';
        
        // Update final stats
        document.getElementById('finalDistance').textContent = `${Math.floor(this.distance)}m`;
        document.getElementById('finalCoins').textContent = this.coinsCollected;
        document.getElementById('finalScore').textContent = Math.floor(this.score);
        
        // Show game over screen
        document.getElementById('gameOverScreen').style.display = 'flex';
    }
    
    // ============================================================================
    // TERRAIN GENERATION
    // ============================================================================
    
    generateInitialTerrain() {
        this.terrain = [];
        const difficulty = this.difficultySettings[this.selectedDifficulty];
        
        // Generate smooth starting area
        for (let i = 0; i < 50; i++) {
            this.terrain.push({
                x: i * 20,
                y: this.groundY
            });
        }
        
        // Generate random terrain
        for (let i = 50; i < 1000; i++) {
            const lastPoint = this.terrain[this.terrain.length - 1];
            const angle = Math.random() * Math.PI * 2;
            const heightChange = Math.sin(angle) * difficulty.roughness;
            
            // Limit slope based on difficulty
            const maxHeightChange = Math.tan(difficulty.maxSlope * Math.PI / 180) * 20;
            const clampedChange = Math.max(-maxHeightChange, Math.min(maxHeightChange, heightChange));
            
            this.terrain.push({
                x: lastPoint.x + 20,
                y: Math.max(100, Math.min(this.canvas.height - 100, lastPoint.y + clampedChange))
            });
        }
    }
    
    getGroundHeight(x) {
        // Find segment containing x
        for (let i = 0; i < this.terrain.length - 1; i++) {
            if (x >= this.terrain[i].x && x <= this.terrain[i + 1].x) {
                // Linear interpolation between points
                const t = (x - this.terrain[i].x) / (this.terrain[i + 1].x - this.terrain[i].x);
                return this.terrain[i].y * (1 - t) + this.terrain[i + 1].y * t;
            }
        }
        
        // Extend last segment if needed
        if (x > this.terrain[this.terrain.length - 1].x) {
            const lastSegment = this.terrain.length - 2;
            const t = (x - this.terrain[lastSegment].x) / (this.terrain[lastSegment + 1].x - this.terrain[lastSegment].x);
            return this.terrain[lastSegment].y * (1 - t) + this.terrain[lastSegment + 1].y * t;
        }
        
        return this.groundY;
    }
    
    getGroundAngle(x) {
        const epsilon = 1; // Small offset to calculate derivative
        const y1 = this.getGroundHeight(x - epsilon);
        const y2 = this.getGroundHeight(x + epsilon);
        return Math.atan2(y2 - y1, 2 * epsilon);
    }
    
    // ============================================================================
    // OBJECT GENERATION
    // ============================================================================
    
    generateCoins(count) {
        this.coins = [];
        for (let i = 0; i < count; i++) {
            const x = 200 + Math.random() * 2000;
            const y = this.getGroundHeight(x) - 50;
            this.coins.push({ x, y, collected: false });
        }
    }
    
    generateFuelCans(count) {
        this.fuelCans = [];
        for (let i = 0; i < count; i++) {
            const x = 500 + Math.random() * 3000;
            const y = this.getGroundHeight(x) - 40;
            this.fuelCans.push({ x, y, collected: false });
        }
    }
    
    // ============================================================================
    // PHYSICS ENGINE
    // ============================================================================
    
    updatePhysics(deltaTime) {
        if (!this.car) return;
        
        const car = this.car;
        const dt = deltaTime / 16; // Normalize to ~60fps
        
        // Apply gravity based on theme
        const gravity = this.GRAVITY[this.selectedTheme] * car.config.weight;
        car.vy += gravity;
        
        // Check if car is on ground
        const frontWheelX = car.x + car.width / 2;
        const rearWheelX = car.x - car.width / 2;
        const frontWheelY = car.y + car.height / 2;
        const rearWheelY = car.y - car.height / 2;
        
        const frontGroundHeight = this.getGroundHeight(frontWheelX);
        const rearGroundHeight = this.getGroundHeight(rearWheelX);
        
        const frontOnGround = frontWheelY >= frontGroundHeight - 5;
        const rearOnGround = rearWheelY >= rearGroundHeight - 5;
        car.wheelsOnGround = (frontOnGround ? 1 : 0) + (rearOnGround ? 1 : 0);
        
        // Handle input
        if (car.wheelsOnGround > 0) {
            if (this.keys.right) {
                // Accelerate forward
                car.vx += car.config.acceleration * dt;
                car.vx = Math.min(car.vx, car.config.maxSpeed);
                car.fuel -= car.config.fuelConsumption * this.difficultySettings[this.selectedDifficulty].fuelMultiplier * dt;
            } else if (this.keys.left) {
                if (car.vx > 0) {
                    // Brake
                    car.vx -= car.config.brakePower * dt;
                    car.vx = Math.max(0, car.vx);
                } else {
                    // Reverse
                    car.vx -= car.config.acceleration * 0.5 * dt;
                    car.vx = Math.max(car.vx, car.config.reverseSpeed);
                }
                car.fuel -= car.config.fuelConsumption * 0.3 * dt;
            } else {
                // Friction
                car.vx *= 0.98;
            }
        }
        
        // Update position
        car.x += car.vx * dt;
        car.y += car.vy * dt;
        
        // Ground collision and suspension
        if (car.wheelsOnGround > 0) {
            const groundHeight = this.getGroundHeight(car.x);
            const groundAngle = this.getGroundAngle(car.x);
            
            // Push car up if penetrating ground
            if (car.y + car.height / 2 > groundHeight) {
                const penetration = car.y + car.height / 2 - groundHeight;
                car.y -= penetration * car.config.suspension;
                car.vy = -car.vy * 0.3; // Damping
                
                // Align car with ground slope
                const targetRotation = groundAngle;
                const rotationDiff = targetRotation - car.rotation;
                car.rotation += rotationDiff * 0.1; // Smooth rotation
            }
            
            // Apply ground friction
            car.vx *= 0.99;
        }
        
        // Air resistance
        car.vx *= 0.995;
        
        // Limit rotation
        car.rotation = Math.max(-Math.PI, Math.min(Math.PI, car.rotation));
        
        // Check for flips
        if (Math.abs(car.rotation - car.lastRotation) > Math.PI * 0.8) {
            this.flips++;
            this.score += 100 * this.flips;
        }
        car.lastRotation = car.rotation;
        
        // Check if car is in air
        if (car.wheelsOnGround === 0) {
            if (!this.isInAir) {
                this.isInAir = true;
                this.airTime = 0;
            }
            this.airTime += deltaTime;
            this.score += this.airTime * 0.1;
        } else {
            if (this.isInAir && this.airTime > 1000) {
                this.score += this.airTime * 0.2; // Bonus for long air time
            }
            this.isInAir = false;
        }
        
        // Check game over conditions
        if (Math.abs(car.rotation) > Math.PI * 0.9) {
            // Car flipped over
            setTimeout(() => this.gameOver(), 1000);
        }
        
        // Fuel check
        car.fuel = Math.max(0, car.fuel);
        if (car.fuel <= 0) {
            setTimeout(() => this.gameOver(), 1000);
        }
        
        // Update distance and score
        this.distance += Math.abs(car.vx) * dt * 0.1;
        this.score += Math.abs(car.vx) * dt * 0.01;
    }
    
    // ============================================================================
    // COLLISION DETECTION
    // ============================================================================
    
    checkCollisions() {
        if (!this.car) return;
        
        const car = this.car;
        
        // Check coin collection
        this.coins = this.coins.filter(coin => {
            if (!coin.collected) {
                const dx = coin.x - (car.x + this.cameraX);
                const dy = coin.y - (car.y + this.cameraY);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 30) {
                    this.coinsCollected++;
                    this.score += 50;
                    return false;
                }
            }
            return true;
        });
        
        // Check fuel can collection
        this.fuelCans = this.fuelCans.filter(fuelCan => {
            if (!fuelCan.collected) {
                const dx = fuelCan.x - (car.x + this.cameraX);
                const dy = fuelCan.y - (car.y + this.cameraY);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 40) {
                    car.fuel = Math.min(100, car.fuel + 30);
                    return false;
                }
            }
            return true;
        });
    }
    
    // ============================================================================
    // CAMERA SYSTEM
    // ============================================================================
    
    updateCamera() {
        if (!this.car) return;
        
        // Smooth camera follow
        const targetX = this.car.x - this.canvas.width / 2;
        const targetY = this.car.y - this.canvas.height / 2;
        
        this.cameraX += (targetX - this.cameraX) * 0.1;
        this.cameraY += (targetY - this.cameraY) * 0.1;
        
        // Clamp camera to prevent showing outside world
        this.cameraX = Math.max(0, this.cameraX);
    }
    
    // ============================================================================
    // RENDERING
    // ============================================================================
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context for camera transformation
        this.ctx.save();
        this.ctx.translate(-this.cameraX, -this.cameraY);
        
        // Draw terrain
        this.drawTerrain();
        
        // Draw coins
        this.drawCoins();
        
        // Draw fuel cans
        this.drawFuelCans();
        
        // Draw car
        this.drawCar();
        
        this.ctx.restore();
        
        // Update UI
        this.updateUI();
    }
    
    drawTerrain() {
        this.ctx.beginPath();
        this.ctx.moveTo(this.terrain[0].x, this.terrain[0].y);
        
        for (let i = 1; i < this.terrain.length; i++) {
            this.ctx.lineTo(this.terrain[i].x, this.terrain[i].y);
        }
        
        // Complete the ground shape
        this.ctx.lineTo(this.terrain[this.terrain.length - 1].x, this.canvas.height);
        this.ctx.lineTo(this.terrain[0].x, this.canvas.height);
        this.ctx.closePath();
        
        // Ground gradient
        const gradient = this.ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
        gradient.addColorStop(0, '#8B4513');
        gradient.addColorStop(1, '#654321');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
        
        // Ground outline
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawCar() {
        if (!this.car) return;
        
        const car = this.car;
        
        this.ctx.save();
        this.ctx.translate(car.x, car.y);
        this.ctx.rotate(car.rotation);
        
        // Car body
        this.ctx.fillStyle = car.color;
        this.ctx.fillRect(-car.width / 2, -car.height / 2, car.width, car.height);
        
        // Car details
        this.ctx.fillStyle = '#222';
        this.ctx.fillRect(-car.width / 4, -car.height / 4, car.width / 2, car.height / 2);
        
        // Wheels
        this.ctx.fillStyle = '#000';
        const wheelRadius = car.height / 3;
        
        // Front wheel
        this.ctx.beginPath();
        this.ctx.arc(car.width / 2 - 5, car.height / 2 - 5, wheelRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rear wheel
        this.ctx.beginPath();
        this.ctx.arc(-car.width / 2 + 5, car.height / 2 - 5, wheelRadius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }
    
    drawCoins() {
        this.coins.forEach(coin => {
            if (!coin.collected) {
                this.ctx.save();
                this.ctx.translate(coin.x, coin.y);
                
                // Animate coin rotation
                const rotation = Date.now() * 0.01;
                this.ctx.rotate(rotation);
                
                // Coin body
                this.ctx.fillStyle = '#FFD700';
                this.ctx.beginPath();
                this.ctx.arc(0, 0, 15, 0, Math.PI * 2);
                this.ctx.fill();
                
                // Coin shine
                this.ctx.fillStyle = '#FFF';
                this.ctx.beginPath();
                this.ctx.arc(5, -5, 5, 0, Math.PI * 2);
                this.ctx.fill();
                
                this.ctx.restore();
            }
        });
    }
    
    drawFuelCans() {
        this.fuelCans.forEach(fuelCan => {
            if (!fuelCan.collected) {
                this.ctx.save();
                this.ctx.translate(fuelCan.x, fuelCan.y);
                
                // Fuel can body
                this.ctx.fillStyle = '#C00';
                this.ctx.fillRect(-10, -20, 20, 40);
                
                // Fuel can details
                this.ctx.fillStyle = '#FFF';
                this.ctx.fillRect(-8, -18, 16, 10);
                
                // Fuel can label
                this.ctx.fillStyle = '#FFF';
                this.ctx.font = 'bold 12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText('FUEL', 0, 5);
                
                this.ctx.restore();
            }
        });
    }
    
    updateUI() {
        // Update counters
        document.getElementById('coinCounter').textContent = this.coinsCollected;
        document.getElementById('distanceCounter').textContent = `${Math.floor(this.distance)}m`;
        document.getElementById('speedCounter').textContent = `${Math.abs(Math.floor(this.car?.vx * 10 || 0))} km/h`;
        
        // Update fuel bar
        const fuelFill = document.getElementById('fuelFill');
        if (fuelFill && this.car) {
            fuelFill.style.width = `${this.car.fuel}%`;
            
            // Change color based on fuel level
            if (this.car.fuel > 50) {
                fuelFill.style.background = 'linear-gradient(90deg, #00b4db, #00db4a)';
            } else if (this.car.fuel > 20) {
                fuelFill.style.background = 'linear-gradient(90deg, #ff9500, #ff5e00)';
            } else {
                fuelFill.style.background = 'linear-gradient(90deg, #ff0000, #ff5e00)';
            }
        }
    }
    
    // ============================================================================
    // GAME LOOP
    // ============================================================================
    
    gameLoop(currentTime) {
        if (this.gameState !== 'playing') return;
        
        // Calculate delta time
        const deltaTime = currentTime - (this.lastTime || currentTime);
        this.lastTime = currentTime;
        
        // Update game state
        this.updatePhysics(deltaTime);
        this.checkCollisions();
        this.updateCamera();
        
        // Render
        this.render();
        
        // Continue game loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// ============================================================================
// GAME INITIALIZATION
// ============================================================================

// Start the game when page loads
window.addEventListener('load', () => {
    const game = new HillClimbGame();
    window.game = game; // Make game accessible from console for debugging
});