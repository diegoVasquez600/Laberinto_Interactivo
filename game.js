// Game Configuration
const CONFIG = {
    WIDTH: 1000,
    HEIGHT: 700,
    FPS: 60,
    PLAYER_SIZE: 26,
    PLAYER_SPEED: 4,
    STATION_SIZE: 28,
    WALL: 10
};

// Colors
const COLORS = {
    WHITE: '#FFFFFF',
    BLACK: '#000000',
    BLUE: '#3d78b2',
    GREEN: '#4CAF50',
    RED: '#bf3b30',
    YELLOW: '#f2c94c',
    GRAY: '#7d6a4e',
    PATH: '#90b86b',
    ROOM: '#f2e7cb',
    WALL: '#9a7449'
};

const STATION_CONTENT = [
    {
        id: 'centro',
        label: 'C',
        title: 'Cuadro central',
        question: '¿Qué son problemas perversos?',
        response: 'Son desafíos complejos y mal definidos, típicos de sistemas sociales, donde hay información confusa y múltiples personas con opiniones diferentes. Se llaman "perversos" porque son engañosos y difíciles de manejar, ya que las soluciones que se proponen a menudo terminan empeorando la situación inicial.'
    },
    {
        id: 'izquierda',
        label: 'I',
        title: 'Cuadro izquierda',
        question: '¿Por qué algunos problemas de diseño no tienen una solución clara?',
        response: 'Porque involucran muchas personas, opiniones, contextos y factores sociales que cambian constantemente.'
    },
    {
        id: 'derecha',
        label: 'D',
        title: 'Cuadro derecha',
        question: 'Características',
        response: [
            'No existe una única forma de definir un problema, ya que cada manera de explicarlo sugiere una solución diferente.',
            'Las soluciones no son correctas o incorrectas, sino que se consideran buenas o malas dependiendo del contexto y de a quién afecten.',
            'Cada solución que se intenta aplicar a un problema perverso genera nuevas consecuencias en cadena que son difíciles de predecir y pueden ser permanentes.',
            'Cada problema perverso es único, por lo que las soluciones de un problema no se pueden copiar y pegar para resolver otro.',
            'Un problema perverso a menudo es solo un síntoma de otro problema más grande y complejo que está oculto.'
        ]
    },
    {
        id: 'cuadro4',
        label: '4',
        title: 'Cuadro 4',
        question: '¿Qué pasa cuando intentamos resolver un problema perverso?',
        response: 'Cada solución puede mejorar algo, pero también puede crear nuevos problemas.'
    },
    {
        id: 'cuadro5',
        label: '5',
        title: 'Cuadro 5',
        question: '¿Cómo diseñar una red social que sea atractiva pero que no genere adicción?',
        response: 'Es un problema perverso porque las redes sociales buscan que las personas pasen tiempo en ellas, pero demasiado uso puede afectar la salud mental.'
    },
    {
        id: 'cuadro6',
        label: '6',
        title: 'Cuadro 6',
        question: '¿Por qué los diseñadores deben analizar el contexto?',
        response: 'Porque las necesidades, la cultura y el entorno influyen en cómo funciona una solución.'
    },
    {
        id: 'cuadro7',
        label: '7',
        title: 'Cuadro 7',
        question: 'Entonces… ¿cuál es el mejor diseño?',
        response: 'No existe una única respuesta. En los problemas perversos se deben probar diferentes soluciones y buscar un equilibrio.'
    },
    {
        id: 'salida1',
        label: 'A',
        title: 'Salida 1',
        question: '¿Limitar el tiempo que una persona pasa en la aplicación ayudaría?',
        response: 'Podría ayudar a controlar el uso, pero muchas personas podrían ignorar o desactivar el límite.'
    },
    {
        id: 'salida2',
        label: 'B',
        title: 'Salida 2',
        question: '¿Eliminar notificaciones constantes reduciría la adicción?',
        response: 'Podría disminuir la necesidad de revisar la app todo el tiempo, pero también haría que la plataforma sea menos atractiva.'
    },
    {
        id: 'salida3',
        label: 'C',
        title: 'Salida 3',
        question: '¿Diseñar la aplicación con recordatorios de descanso funcionaría?',
        response: 'Podría ayudar a que las personas usen la red de forma más consciente, pero no todos seguirían la recomendación.'
    },
    {
        id: 'salida4',
        label: 'D',
        title: 'Salida 4',
        question: '¿Mostrar contenido más positivo y educativo sería la solución?',
        response: 'Podría mejorar la experiencia de los usuarios, pero también depende de los algoritmos y de lo que las personas comparten.'
    }
];

// Game State
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.player = new Player(488, 636);
        this.boardImage = new Image();
        this.boardImageLoaded = false;
        this.layout = this.createLayout();
        this.walls = this.createMaze();
        this.stations = this.createStations();
        this.keys = {};
        this.currentStation = null;
        this.nearbyStation = null;
        this.dialogMode = null;
        this.gameWon = false;
        
        this.setupEventListeners();
        this.setupTouchControls();
        this.setupBoardImage();
        this.updateStatus();
        this.gameLoop();
    }

    setupBoardImage() {
        this.boardImage.onload = () => {
            this.boardImageLoaded = true;
        };

        this.boardImage.onerror = () => {
            this.boardImageLoaded = false;
        };

        this.boardImage.src = 'assets/maze-board.png';
    }

    createLayout() {
        return {
            salida1: { x: 60, y: 85, w: 180, h: 120, roomLabel: 'Salida 1' },
            cuadro5: { x: 270, y: 85, w: 180, h: 120, roomLabel: 'Cuadro 5' },
            cuadro4: { x: 480, y: 85, w: 180, h: 120, roomLabel: 'Cuadro 4' },
            salida2: { x: 690, y: 85, w: 180, h: 120, roomLabel: 'Salida 2' },

            izquierda: { x: 105, y: 290, w: 235, h: 120, roomLabel: 'Cuadro izquierda' },
            centro: { x: 380, y: 290, w: 235, h: 120, roomLabel: 'Cuadro central' },
            derecha: { x: 655, y: 290, w: 235, h: 120, roomLabel: 'Cuadro derecha' },

            salida4: { x: 60, y: 495, w: 180, h: 120, roomLabel: 'Salida 4' },
            cuadro6: { x: 270, y: 495, w: 180, h: 120, roomLabel: 'Cuadro 6' },
            cuadro7: { x: 480, y: 495, w: 180, h: 120, roomLabel: 'Cuadro 7' },
            salida3: { x: 690, y: 495, w: 180, h: 120, roomLabel: 'Salida 3' }
        };
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key === ' ' || e.key === 'Spacebar') {
                e.preventDefault();
                this.checkStationInteraction();
            }
            
            if (e.key === 'Enter' && this.dialogMode === 'question') {
                this.openResponseDialog();
            }
            
            if (e.key === 'Escape') {
                this.closeDialog();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Button listeners
        document.getElementById('openResponseBtn').addEventListener('click', () => this.openResponseDialog());
        document.getElementById('closeQuestionBtn').addEventListener('click', () => this.closeDialog());
        document.getElementById('markReadBtn').addEventListener('click', () => this.markCurrentAsVisited());
        document.getElementById('closeResponseBtn').addEventListener('click', () => this.markCurrentAsVisited());
        document.getElementById('restartBtn').addEventListener('click', () => this.restart());
    }

    setupTouchControls() {
        const controls = document.getElementById('mobileControls');
        if (!controls) return;

        const handleStart = (key) => {
            this.keys[key] = true;
            if (key === 'space') {
                this.checkStationInteraction();
            }
        };

        const handleEnd = (key) => {
            this.keys[key] = false;
        };

        controls.querySelectorAll('.control-btn').forEach((button) => {
            const key = button.dataset.key;

            button.addEventListener('touchstart', (event) => {
                event.preventDefault();
                handleStart(key);
            }, { passive: false });

            button.addEventListener('touchend', (event) => {
                event.preventDefault();
                handleEnd(key);
            }, { passive: false });

            button.addEventListener('mousedown', () => handleStart(key));
            button.addEventListener('mouseup', () => handleEnd(key));
            button.addEventListener('mouseleave', () => handleEnd(key));
        });
    }
    
    createMaze() {
        const walls = [];
        const W = CONFIG.WIDTH;
        const H = CONFIG.HEIGHT;
        const T = CONFIG.WALL;

        const addSegment = (x, y, w, h) => walls.push({ x, y, w, h });
        const addRoom = (x, y, w, h, doors = {}) => {
            const gap = 74;

            if (doors.top) {
                const start = x + (w - gap) / 2;
                addSegment(x, y, start - x, T);
                addSegment(start + gap, y, x + w - (start + gap), T);
            } else {
                addSegment(x, y, w, T);
            }

            if (doors.bottom) {
                const start = x + (w - gap) / 2;
                addSegment(x, y + h - T, start - x, T);
                addSegment(start + gap, y + h - T, x + w - (start + gap), T);
            } else {
                addSegment(x, y + h - T, w, T);
            }

            if (doors.left) {
                const start = y + (h - gap) / 2;
                addSegment(x, y, T, start - y);
                addSegment(x, start + gap, T, y + h - (start + gap));
            } else {
                addSegment(x, y, T, h);
            }

            if (doors.right) {
                const start = y + (h - gap) / 2;
                addSegment(x + w - T, y, T, start - y);
                addSegment(x + w - T, start + gap, T, y + h - (start + gap));
            } else {
                addSegment(x + w - T, y, T, h);
            }
        };
        
        // Outer walls
        addSegment(0, 0, W, T);
        addSegment(0, 0, T, H);
        addSegment(0, H - T, W, T);
        addSegment(W - T, 0, T, H);

        addRoom(60, 85, 180, 120, { bottom: true, right: true });
        addRoom(270, 85, 180, 120, { bottom: true, left: true, right: true });
        addRoom(480, 85, 180, 120, { bottom: true, left: true, right: true });
        addRoom(690, 85, 180, 120, { bottom: true, left: true });

        addRoom(105, 290, 235, 120, { top: true, bottom: true, right: true });
        addRoom(380, 290, 235, 120, { top: true, bottom: true, left: true, right: true });
        addRoom(655, 290, 235, 120, { top: true, bottom: true, left: true });

        addRoom(60, 495, 180, 120, { top: true, right: true });
        addRoom(270, 495, 180, 120, { top: true, left: true, right: true });
        addRoom(480, 495, 180, 120, { top: true, left: true, right: true });
        addRoom(690, 495, 180, 120, { top: true, left: true });

        addSegment(333, 205, T, 85);
        addSegment(548, 205, T, 85);
        addSegment(448, 410, T, 85);
        addSegment(552, 410, T, 85);
        
        return walls;
    }
    
    createStations() {
        return STATION_CONTENT.map(content => {
            const room = this.layout[content.id];
            const pos = {
                x: room.x + room.w / 2 - CONFIG.STATION_SIZE / 2,
                y: room.y + room.h / 2 - CONFIG.STATION_SIZE / 2
            };
            return new Station(pos.x, pos.y, content);
        });
    }
    
    checkStationInteraction() {
        const nearby = this.getNearbyStation(95);
        if (nearby) {
            this.currentStation = nearby;
            this.showQuestionDialog(nearby);
            return;
        }

        for (const station of this.stations) {
            if (this.checkCollision(this.player, station)) {
                this.currentStation = station;
                this.showQuestionDialog(station);
                return;
            }
        }
    }
    
    showQuestionDialog(station) {
        document.getElementById('questionTitle').textContent = station.title;
        document.getElementById('questionText').textContent = station.question;
        document.getElementById('questionDialog').classList.remove('hidden');
        this.dialogMode = 'question';
    }

    openResponseDialog() {
        if (!this.currentStation) return;

        document.getElementById('questionDialog').classList.add('hidden');
        this.renderResponse(this.currentStation);
        document.getElementById('responseDialog').classList.remove('hidden');
        this.dialogMode = 'response';
    }

    renderResponse(station) {
        const responseContainer = document.getElementById('responseText');

        if (Array.isArray(station.response)) {
            const items = station.response.map(item => `<li>${item}</li>`).join('');
            responseContainer.innerHTML = `<ul>${items}</ul>`;
            return;
        }

        responseContainer.textContent = station.response;
    }
    
    closeDialog() {
        document.getElementById('questionDialog').classList.add('hidden');
        document.getElementById('responseDialog').classList.add('hidden');
        this.dialogMode = null;
        this.currentStation = null;
    }

    markCurrentAsVisited() {
        if (!this.currentStation) return;

        this.currentStation.activated = true;
        this.closeDialog();
        this.checkWinCondition();
    }
    
    checkWinCondition() {
        const allActivated = this.stations.every(s => s.activated);
        if (allActivated && !this.gameWon) {
            this.gameWon = true;
            setTimeout(() => {
                document.getElementById('winDialog').classList.remove('hidden');
            }, 500);
        }
        this.updateStatus();
    }
    
    updateStatus() {
        const completed = this.stations.filter(s => s.activated).length;
        document.getElementById('completed').textContent = completed;
    }
    
    restart() {
        document.getElementById('winDialog').classList.add('hidden');
        this.player = new Player(488, 636);
        this.stations.forEach(s => {
            s.activated = false;
        });
        this.gameWon = false;
        this.updateStatus();
    }
    
    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.size &&
               rect1.x + rect1.size > rect2.x &&
               rect1.y < rect2.y + rect2.size &&
               rect1.y + rect1.size > rect2.y;
    }
    
    update() {
        if (document.getElementById('questionDialog').classList.contains('hidden') && document.getElementById('responseDialog').classList.contains('hidden')) {
            let dx = 0, dy = 0;
            
            if (this.keys['arrowleft'] || this.keys['a']) dx -= CONFIG.PLAYER_SPEED;
            if (this.keys['arrowright'] || this.keys['d']) dx += CONFIG.PLAYER_SPEED;
            if (this.keys['arrowup'] || this.keys['w']) dy -= CONFIG.PLAYER_SPEED;
            if (this.keys['arrowdown'] || this.keys['s']) dy += CONFIG.PLAYER_SPEED;
            
            this.player.move(dx, dy, this.walls);
        }

        this.nearbyStation = this.getNearbyStation(95);
        this.updateNearbyPrompt();
    }

    getNearbyStation(maxDistance) {
        const playerCenterX = this.player.x + this.player.size / 2;
        const playerCenterY = this.player.y + this.player.size / 2;

        let candidate = null;
        let bestDistance = Number.MAX_VALUE;

        for (const station of this.stations) {
            const stationCenterX = station.x + station.size / 2;
            const stationCenterY = station.y + station.size / 2;
            const dx = playerCenterX - stationCenterX;
            const dy = playerCenterY - stationCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= maxDistance && distance < bestDistance) {
                candidate = station;
                bestDistance = distance;
            }
        }

        return candidate;
    }

    updateNearbyPrompt() {
        const prompt = document.getElementById('nearbyPrompt');
        if (!prompt) return;

        if (this.nearbyStation) {
            prompt.textContent = `Pregunta activa: ${this.nearbyStation.question} (presiona ESPACIO)`;
            return;
        }

        prompt.textContent = 'Acércate a un cuadro para ver su pregunta.';
    }
    
    draw() {
        this.drawBoardBackground();
        
        // Draw walls
        this.ctx.fillStyle = COLORS.WALL;
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
        });
        
        // Draw stations
        this.stations.forEach(station => station.draw(this.ctx));
        
        // Draw player
        this.player.draw(this.ctx);
    }

    drawBoardBackground() {
        if (this.boardImageLoaded) {
            this.ctx.drawImage(this.boardImage, 0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
            return;
        }

        this.ctx.fillStyle = COLORS.PATH;
        this.ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);
        this.drawRooms();
    }

    drawRooms() {
        const rooms = Object.values(this.layout);

        this.ctx.fillStyle = '#f2e7cb';
        rooms.forEach(room => {
            this.ctx.fillRect(room.x + 8, room.y + 8, room.w - 16, room.h - 16);
            this.ctx.fillStyle = '#fbf8f0';
            const labelW = Math.min(148, room.w - 30);
            const labelX = room.x + (room.w - labelW) / 2;
            const labelY = room.y + 18;
            this.ctx.fillRect(labelX, labelY, labelW, 34);
            this.ctx.strokeStyle = '#d9c8a7';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(labelX, labelY, labelW, 34);
            this.ctx.fillStyle = '#3a2e20';
            this.ctx.font = 'bold 16px Georgia';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(room.roomLabel, room.x + room.w / 2, labelY + 17);
            this.ctx.fillStyle = '#f2e7cb';
        });

        this.ctx.fillStyle = '#7a5a35';
        this.ctx.font = 'bold 40px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('INICIO', 500, 680);

        this.ctx.font = 'bold 36px Arial';
        this.ctx.fillStyle = '#b03b48';
        this.ctx.fillText('SALIDA A', 170, 58);
        this.ctx.fillStyle = '#3f69a6';
        this.ctx.fillText('SALIDA B', 830, 58);
        this.ctx.fillStyle = '#c48d2b';
        this.ctx.fillText('SALIDA C', 830, 678);
        this.ctx.fillStyle = '#a84552';
        this.ctx.fillText('SALIDA D', 170, 678);

        this.ctx.textAlign = 'start';
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.PLAYER_SIZE;
        this.color = COLORS.BLUE;
    }
    
    move(dx, dy, walls) {
        const nextX = this.x + dx;
        const nextY = this.y + dy;

        const withinBoundsX = nextX >= 0 && nextX + this.size <= CONFIG.WIDTH;
        const withinBoundsY = nextY >= 0 && nextY + this.size <= CONFIG.HEIGHT;

        if (withinBoundsX) {
            const rectX = { x: nextX, y: this.y, w: this.size, h: this.size };
            const blockedX = walls.some(wall => this.checkRectCollision(rectX, wall));
            if (!blockedX) {
                this.x = nextX;
            }
        }

        if (withinBoundsY) {
            const rectY = { x: this.x, y: nextY, w: this.size, h: this.size };
            const blockedY = walls.some(wall => this.checkRectCollision(rectY, wall));
            if (!blockedY) {
                this.y = nextY;
            }
        }
    }
    
    checkRectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.w &&
               rect1.x + rect1.w > rect2.x &&
               rect1.y < rect2.y + rect2.h &&
               rect1.y + rect1.h > rect2.y;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Station {
    constructor(x, y, content) {
        this.x = x;
        this.y = y;
        this.size = CONFIG.STATION_SIZE;
        this.title = content.title;
        this.question = content.question;
        this.response = content.response;
        this.label = content.label;
        this.id = content.id;
        this.activated = false;
    }
    
    draw(ctx) {
        const color = this.activated ? '#6f9d4b' : '#e7c64f';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#4b3a24';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#4b3a24';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.label, this.x + this.size / 2, this.y + this.size / 2);
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new Game();
    document.getElementById('total').textContent = String(STATION_CONTENT.length);
    document.getElementById('completed').textContent = '0';
});
