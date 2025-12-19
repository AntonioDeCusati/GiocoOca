class PlayerSetupScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayerSetupScene' });
        this.playerCount = 2;
        this.playerNames = ['Giocatore 1', 'Giocatore 2', 'Giocatore 3', 'Giocatore 4'];
        this.nameInputs = [];
        this.playerColors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'];
        this.playerEmojis = ['🔴', '🔵', '🟡', '🟢'];
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        this.cameras.main.fadeIn(500);

        // Sfondo decorativo
        this.createBackground();

        // Titolo
        this.add.text(centerX, 50, '👥 CONFIGURA GIOCATORI', {
            fontSize: '40px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            color: '#FFD700',
            stroke: '#4a2800',
            strokeThickness: 5
        }).setOrigin(0.5);

        // Selettore numero giocatori
        this.createPlayerCountSelector(centerX, 130);

        // Container per i campi nome
        this.nameFieldsContainer = this.add.container(0, 0);
        this.updateNameFields();

        // Pulsante Inizia Partita
        this.createStartButton(centerX, 650);

        // Pulsante Indietro
        this.createBackButton(100, 700);
    }

    createBackground() {
        // Pattern decorativo
        const graphics = this.add.graphics();
        
        for (let i = 0; i < 30; i++) {
            const x = Phaser.Math.Between(0, this.cameras.main.width);
            const y = Phaser.Math.Between(0, this.cameras.main.height);
            graphics.fillStyle(Phaser.Utils.Array.GetRandom([0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x95E1D3]), 0.1);
            graphics.fillCircle(x, y, Phaser.Math.Between(10, 40));
        }
    }

    createPlayerCountSelector(x, y) {
        // Label
        this.add.text(x, y, 'Numero di giocatori:', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Pulsanti -/+
        const buttonStyle = {
            fontSize: '36px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF',
            backgroundColor: '#2d5a27',
            padding: { x: 15, y: 5 }
        };

        // Pulsante -
        const minusBtn = this.add.text(x - 100, y + 50, '−', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Display numero
        this.countDisplay = this.add.text(x, y + 50, this.playerCount.toString(), {
            fontSize: '40px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);

        // Pulsante +
        const plusBtn = this.add.text(x + 100, y + 50, '+', buttonStyle)
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true });

        // Eventi
        minusBtn.on('pointerover', () => minusBtn.setStyle({ backgroundColor: '#3d7a37' }));
        minusBtn.on('pointerout', () => minusBtn.setStyle({ backgroundColor: '#2d5a27' }));
        minusBtn.on('pointerdown', () => {
            if (this.playerCount > 2) {
                this.playerCount--;
                this.countDisplay.setText(this.playerCount.toString());
                this.updateNameFields();
            }
        });

        plusBtn.on('pointerover', () => plusBtn.setStyle({ backgroundColor: '#3d7a37' }));
        plusBtn.on('pointerout', () => plusBtn.setStyle({ backgroundColor: '#2d5a27' }));
        plusBtn.on('pointerdown', () => {
            if (this.playerCount < 4) {
                this.playerCount++;
                this.countDisplay.setText(this.playerCount.toString());
                this.updateNameFields();
            }
        });
    }

    updateNameFields() {
        // Pulisci campi esistenti
        this.nameFieldsContainer.removeAll(true);
        this.nameInputs = [];

        const centerX = this.cameras.main.width / 2;
        const startY = 250;
        const spacing = 90;

        for (let i = 0; i < this.playerCount; i++) {
            const y = startY + (i * spacing);
            
            // Container per ogni giocatore
            const playerContainer = this.add.container(centerX, y);
            
            // Sfondo campo
            const bg = this.add.graphics();
            bg.fillStyle(0x2d2d2d, 0.8);
            bg.fillRoundedRect(-250, -30, 500, 60, 15);
            bg.lineStyle(3, parseInt(this.playerColors[i].replace('#', '0x')), 1);
            bg.strokeRoundedRect(-250, -30, 500, 60, 15);

            // Emoji giocatore
            const emoji = this.add.text(-220, 0, this.playerEmojis[i], {
                fontSize: '30px'
            }).setOrigin(0.5);

            // Label
            const label = this.add.text(-180, 0, `Giocatore ${i + 1}:`, {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: this.playerColors[i]
            }).setOrigin(0, 0.5);

            // Campo input simulato (cliccabile)
            const inputBg = this.add.graphics();
            inputBg.fillStyle(0x1a1a1a, 1);
            inputBg.fillRoundedRect(-50, -20, 280, 40, 10);

            const inputText = this.add.text(-40, 0, this.playerNames[i], {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#FFFFFF'
            }).setOrigin(0, 0.5);

            // Cursore lampeggiante
            const cursor = this.add.text(inputText.x + inputText.width + 5, 0, '|', {
                fontSize: '18px',
                fontFamily: 'Arial',
                color: '#4ECDC4'
            }).setOrigin(0, 0.5).setAlpha(0);

            // Zona interattiva per l'input
            const inputZone = this.add.rectangle(65, 0, 280, 40, 0x000000, 0)
                .setInteractive({ useHandCursor: true });

            // Salva riferimento
            this.nameInputs.push({
                index: i,
                text: inputText,
                cursor: cursor,
                zone: inputZone,
                active: false
            });

            // Click per attivare input
            inputZone.on('pointerdown', () => {
                this.activateInput(i);
            });

            playerContainer.add([bg, emoji, label, inputBg, inputText, cursor, inputZone]);
            this.nameFieldsContainer.add(playerContainer);
        }

        // Listener tastiera globale
        if (!this.keyboardListenerAdded) {
            this.input.keyboard.on('keydown', (event) => {
                this.handleKeyInput(event);
            });
            this.keyboardListenerAdded = true;
        }
    }

    activateInput(index) {
        // Disattiva tutti gli input
        this.nameInputs.forEach((input, i) => {
            input.active = false;
            input.cursor.setAlpha(0);
            if (input.cursorTween) {
                input.cursorTween.stop();
            }
        });

        // Attiva l'input selezionato
        const input = this.nameInputs[index];
        input.active = true;
        input.cursor.setAlpha(1);
        
        // Animazione cursore
        input.cursorTween = this.tweens.add({
            targets: input.cursor,
            alpha: { from: 1, to: 0 },
            duration: 500,
            yoyo: true,
            repeat: -1
        });
    }

    handleKeyInput(event) {
        const activeInput = this.nameInputs.find(input => input.active);
        if (!activeInput) return;

        const index = activeInput.index;
        let currentName = this.playerNames[index];

        if (event.keyCode === 8) { // Backspace
            currentName = currentName.slice(0, -1);
        } else if (event.keyCode === 13) { // Enter
            activeInput.active = false;
            activeInput.cursor.setAlpha(0);
            if (activeInput.cursorTween) {
                activeInput.cursorTween.stop();
            }
        } else if (event.key.length === 1 && currentName.length < 15) {
            currentName += event.key;
        }

        this.playerNames[index] = currentName;
        activeInput.text.setText(currentName || `Giocatore ${index + 1}`);
        activeInput.cursor.x = activeInput.text.x + activeInput.text.width + 5;
    }

    createStartButton(x, y) {
        const buttonWidth = 300;
        const buttonHeight = 70;

        const container = this.add.container(x, y);

        // Sfondo pulsante
        const bg = this.add.graphics();
        bg.fillStyle(0xFFD700, 1);
        bg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);
        bg.lineStyle(4, 0x8B4513, 1);
        bg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);

        // Testo
        const text = this.add.text(0, 0, '🎲 INIZIA PARTITA', {
            fontSize: '26px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#1a1a2e'
        }).setOrigin(0.5);

        container.add([bg, text]);

        // Zona interattiva
        const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        // Animazione hover
        hitArea.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scale: 1.1,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 150,
                ease: 'Back.easeOut'
            });
        });

        hitArea.on('pointerdown', () => {
            this.startGame();
        });
    }

    createBackButton(x, y) {
        const backBtn = this.add.text(x, y, '← Indietro', {
            fontSize: '22px',
            fontFamily: 'Arial',
            color: '#4ECDC4'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        backBtn.on('pointerover', () => backBtn.setColor('#FFFFFF'));
        backBtn.on('pointerout', () => backBtn.setColor('#4ECDC4'));
        backBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    startGame() {
        // Prepara i dati dei giocatori
        gameData.players = [];
        for (let i = 0; i < this.playerCount; i++) {
            gameData.players.push({
                name: this.playerNames[i] || `Giocatore ${i + 1}`,
                color: this.playerColors[i],
                emoji: this.playerEmojis[i],
                position: 0,
                skipTurns: 0
            });
        }
        gameData.currentPlayerIndex = 0;

        // Transizione alla scena di gioco
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start('GameScene');
        });
    }
}

