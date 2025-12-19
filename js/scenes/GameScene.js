class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
        this.cellSize = 32;
        this.boardOffsetX = 50;
        this.boardOffsetY = 50;
        this.isRolling = false;
        this.diceValue = 1;
        this.playerTokens = [];
        this.cells = [];
    }

    create() {
        this.cameras.main.fadeIn(500);
        
        // Crea il percorso del tabellone basato sull'immagine
        this.createBoardPath();
        
        // Disegna il tabellone
        this.drawBoard();
        
        // Crea i token dei giocatori
        this.createPlayerTokens();
        
        // UI laterale
        this.createUI();
        
        // Inizializza il turno
        this.updateTurnDisplay();
    }

    createBoardPath() {
        // Percorso basato sull'immagine: spirale che parte dal basso a sinistra
        // Le coordinate sono basate sulla griglia dell'immagine
        const path = [];
        
        // Riga inferiore (da sinistra a destra) - celle 0-18
        for (let x = 0; x <= 18; x++) {
            path.push({ x: x, y: 10 });
        }
        
        // Colonna destra (dal basso verso l'alto) - celle 19-28
        for (let y = 9; y >= 0; y--) {
            path.push({ x: 18, y: y });
        }
        
        // Riga superiore (da destra a sinistra) - celle 29-47
        for (let x = 17; x >= 0; x--) {
            path.push({ x: x, y: 0 });
        }
        
        // Colonna sinistra (dall'alto verso il basso) - celle 48-55
        for (let y = 1; y <= 8; y++) {
            path.push({ x: 0, y: y });
        }
        
        // Seconda riga dal basso (da sinistra a destra) - celle 56-63
        for (let x = 1; x <= 8; x++) {
            path.push({ x: x, y: 8 });
        }
        
        // Colonna centrale destra verso l'alto - celle 64-70
        for (let y = 7; y >= 2; y--) {
            path.push({ x: 8, y: y });
        }
        
        // Riga centrale superiore - celle 71-75
        for (let x = 7; x >= 3; x--) {
            path.push({ x: x, y: 2 });
        }
        
        // Colonna centrale sinistra verso il basso - celle 76-79
        for (let y = 3; y <= 6; y++) {
            path.push({ x: 3, y: y });
        }
        
        // Riga verso il centro - celle 80-83
        for (let x = 4; x <= 6; x++) {
            path.push({ x: x, y: 6 });
        }
        
        // Verso l'arrivo - celle 84-89
        for (let y = 5; y >= 4; y--) {
            path.push({ x: 6, y: y });
        }
        path.push({ x: 5, y: 4 }); // Cella 90 - ARRIVO!
        
        gameData.boardPath = path;
        this.totalCells = path.length;
        
        // Definisci le caselle speciali
        this.specialCells = {
            // Oche - avanza ancora dello stesso numero
            5: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            9: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            14: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            18: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            23: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            27: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            32: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            36: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            41: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            45: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            50: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            54: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            59: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            63: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            68: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            72: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            77: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            81: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            86: { type: 'goose', name: 'Oca', emoji: '🦆', effect: 'moveAgain' },
            
            // Ponte - vai alla casella 12
            6: { type: 'bridge', name: 'Ponte', emoji: '🌉', effect: 'goto', target: 12 },
            
            // Locanda - stai fermo 1 turno
            19: { type: 'inn', name: 'Locanda', emoji: '🏨', effect: 'skip', turns: 1 },
            
            // Pozzo - stai fermo 2 turni
            31: { type: 'well', name: 'Pozzo', emoji: '🕳️', effect: 'skip', turns: 2 },
            
            // Labirinto - torna alla casella 30
            42: { type: 'maze', name: 'Labirinto', emoji: '🌀', effect: 'goto', target: 30 },
            
            // Prigione - stai fermo 3 turni
            52: { type: 'prison', name: 'Prigione', emoji: '⛓️', effect: 'skip', turns: 3 },
            
            // Morte - torna alla partenza
            58: { type: 'death', name: 'Morte', emoji: '💀', effect: 'goto', target: 0 }
        };
    }

    drawBoard() {
        // Sfondo del tabellone
        const boardBg = this.add.graphics();
        boardBg.fillStyle(0x808080, 1);
        boardBg.fillRect(this.boardOffsetX - 10, this.boardOffsetY - 10, 630, 380);

        // Disegna ogni cella del percorso
        gameData.boardPath.forEach((cell, index) => {
            const x = this.boardOffsetX + cell.x * this.cellSize;
            const y = this.boardOffsetY + cell.y * this.cellSize;
            
            // Colore cella
            let cellColor = 0xFF00FF; // Magenta come nell'immagine
            
            // Colori speciali per celle speciali
            if (this.specialCells[index]) {
                const special = this.specialCells[index];
                switch (special.type) {
                    case 'goose': cellColor = 0xFFFF00; break; // Giallo
                    case 'bridge': cellColor = 0x8B4513; break; // Marrone
                    case 'inn': cellColor = 0x00CED1; break; // Turchese
                    case 'well': cellColor = 0x4169E1; break; // Blu
                    case 'maze': cellColor = 0x9932CC; break; // Viola
                    case 'prison': cellColor = 0x696969; break; // Grigio
                    case 'death': cellColor = 0x000000; break; // Nero
                }
            }
            
            // Cella finale (arrivo)
            if (index === this.totalCells - 1) {
                cellColor = 0xFFD700; // Oro
            }
            
            // Cella iniziale
            if (index === 0) {
                cellColor = 0x00FF00; // Verde
            }

            // Disegna la cella
            const graphics = this.add.graphics();
            graphics.fillStyle(cellColor, 1);
            graphics.fillRect(x, y, this.cellSize - 2, this.cellSize - 2);
            graphics.lineStyle(1, 0x000000, 0.5);
            graphics.strokeRect(x, y, this.cellSize - 2, this.cellSize - 2);

            // Numero cella
            const numText = this.add.text(x + this.cellSize/2 - 1, y + this.cellSize/2 - 1, index.toString(), {
                fontSize: '10px',
                fontFamily: 'Arial',
                color: cellColor === 0x000000 ? '#FFFFFF' : '#000000'
            }).setOrigin(0.5);

            // Emoji per celle speciali
            if (this.specialCells[index]) {
                this.add.text(x + this.cellSize - 5, y + 3, this.specialCells[index].emoji, {
                    fontSize: '12px'
                }).setOrigin(1, 0);
            }

            // Salva riferimento cella
            this.cells.push({ x, y, index });
        });

        // Legenda
        this.createLegend();
    }

    createLegend() {
        const legendX = 720;
        const legendY = 380;
        
        this.add.text(legendX, legendY, '📋 LEGENDA:', {
            fontSize: '16px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFD700'
        });

        const items = [
            { emoji: '🟢', text: 'Partenza' },
            { emoji: '🦆', text: 'Oca (avanza ancora)' },
            { emoji: '🌉', text: 'Ponte (vai a 12)' },
            { emoji: '🏨', text: 'Locanda (1 turno)' },
            { emoji: '🕳️', text: 'Pozzo (2 turni)' },
            { emoji: '🌀', text: 'Labirinto (vai a 30)' },
            { emoji: '⛓️', text: 'Prigione (3 turni)' },
            { emoji: '💀', text: 'Morte (torna a 0)' },
            { emoji: '🏆', text: 'Arrivo' }
        ];

        items.forEach((item, i) => {
            this.add.text(legendX, legendY + 25 + i * 22, `${item.emoji} ${item.text}`, {
                fontSize: '13px',
                fontFamily: 'Arial',
                color: '#FFFFFF'
            });
        });
    }

    createPlayerTokens() {
        this.playerTokens = [];
        
        gameData.players.forEach((player, index) => {
            // Posizione iniziale (cella 0)
            const startCell = gameData.boardPath[0];
            const x = this.boardOffsetX + startCell.x * this.cellSize + this.cellSize/2;
            const y = this.boardOffsetY + startCell.y * this.cellSize + this.cellSize/2;
            
            // Offset per non sovrapporre i token
            const offsetX = (index % 2) * 12 - 6;
            const offsetY = Math.floor(index / 2) * 12 - 6;
            
            const token = this.add.text(x + offsetX, y + offsetY, player.emoji, {
                fontSize: '20px'
            }).setOrigin(0.5);
            
            // Aggiungi ombra/bordo
            token.setStroke('#000000', 3);
            
            this.playerTokens.push(token);
        });
    }

    createUI() {
        const uiX = 720;
        
        // Pannello info turno
        const panelBg = this.add.graphics();
        panelBg.fillStyle(0x1a1a2e, 0.9);
        panelBg.fillRoundedRect(uiX - 20, 30, 300, 320, 15);
        panelBg.lineStyle(3, 0x4ECDC4, 1);
        panelBg.strokeRoundedRect(uiX - 20, 30, 300, 320, 15);

        // Titolo turno
        this.add.text(uiX + 130, 50, '🎮 TURNO', {
            fontSize: '24px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);

        // Nome giocatore corrente
        this.currentPlayerText = this.add.text(uiX + 130, 90, '', {
            fontSize: '22px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        // Stato giocatore
        this.playerStatusText = this.add.text(uiX + 130, 120, '', {
            fontSize: '16px',
            fontFamily: 'Arial',
            color: '#95E1D3'
        }).setOrigin(0.5);

        // Area dado
        this.createDiceArea(uiX + 130, 200);

        // Pulsante lancia dado
        this.createRollButton(uiX + 130, 300);

        // Lista giocatori
        this.createPlayerList(uiX, 580);
        
        // Pulsante menu
        this.createMenuButton(uiX + 130, 720);
    }

    createDiceArea(x, y) {
        // Sfondo dado
        const diceBg = this.add.graphics();
        diceBg.fillStyle(0x2d2d2d, 1);
        diceBg.fillRoundedRect(x - 50, y - 50, 100, 100, 15);

        // Dado
        this.diceText = this.add.text(x, y, '🎲', {
            fontSize: '60px'
        }).setOrigin(0.5);

        // Risultato dado
        this.diceResultText = this.add.text(x, y + 70, '', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);
    }

    createRollButton(x, y) {
        const buttonWidth = 200;
        const buttonHeight = 50;

        this.rollButtonContainer = this.add.container(x, y);

        const bg = this.add.graphics();
        bg.fillStyle(0xFF6B6B, 1);
        bg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 15);

        const text = this.add.text(0, 0, '🎲 LANCIA DADO', {
            fontSize: '20px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        this.rollButtonContainer.add([bg, text]);
        this.rollButtonBg = bg;
        this.rollButtonText = text;

        const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0)
            .setInteractive({ useHandCursor: true });

        hitArea.on('pointerover', () => {
            if (!this.isRolling) {
                this.tweens.add({
                    targets: this.rollButtonContainer,
                    scale: 1.1,
                    duration: 100
                });
            }
        });

        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: this.rollButtonContainer,
                scale: 1,
                duration: 100
            });
        });

        hitArea.on('pointerdown', () => {
            if (!this.isRolling) {
                this.rollDice();
            }
        });

        this.rollButtonHitArea = hitArea;
    }

    createPlayerList(x, y) {
        this.add.text(x + 130, y, '👥 GIOCATORI', {
            fontSize: '18px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);

        this.playerListTexts = [];

        gameData.players.forEach((player, index) => {
            const text = this.add.text(x, y + 30 + index * 30, 
                `${player.emoji} ${player.name}: Casella 0`, {
                fontSize: '16px',
                fontFamily: 'Arial',
                color: player.color
            });
            this.playerListTexts.push(text);
        });
    }

    createMenuButton(x, y) {
        const btn = this.add.text(x, y, '🏠 Menu Principale', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#4ECDC4',
            backgroundColor: '#2d2d2d',
            padding: { x: 15, y: 8 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#FFFFFF'));
        btn.on('pointerout', () => btn.setColor('#4ECDC4'));
        btn.on('pointerdown', () => {
            this.cameras.main.fadeOut(400);
            this.time.delayedCall(400, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    updateTurnDisplay() {
        const player = gameData.players[gameData.currentPlayerIndex];
        this.currentPlayerText.setText(`${player.emoji} ${player.name}`);
        this.currentPlayerText.setColor(player.color);

        if (player.skipTurns > 0) {
            this.playerStatusText.setText(`⏳ Turni da saltare: ${player.skipTurns}`);
            this.rollButtonText.setText('⏭️ SALTA TURNO');
        } else {
            this.playerStatusText.setText(`📍 Posizione: Casella ${player.position}`);
            this.rollButtonText.setText('🎲 LANCIA DADO');
        }
    }

    rollDice() {
        const player = gameData.players[gameData.currentPlayerIndex];

        // Se il giocatore deve saltare turni
        if (player.skipTurns > 0) {
            player.skipTurns--;
            this.showMessage(`${player.name} salta il turno!\nTurni rimanenti: ${player.skipTurns}`, () => {
                this.nextTurn();
            });
            return;
        }

        this.isRolling = true;

        // Animazione dado
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        let rollCount = 0;
        const maxRolls = 15;

        const rollInterval = this.time.addEvent({
            delay: 80,
            callback: () => {
                this.diceText.setText(Phaser.Utils.Array.GetRandom(diceEmojis));
                
                // Animazione shake
                this.tweens.add({
                    targets: this.diceText,
                    x: this.diceText.x + Phaser.Math.Between(-5, 5),
                    y: this.diceText.y + Phaser.Math.Between(-5, 5),
                    duration: 50,
                    yoyo: true
                });

                rollCount++;
                if (rollCount >= maxRolls) {
                    rollInterval.remove();
                    this.finishRoll();
                }
            },
            loop: true
        });
    }

    finishRoll() {
        // Risultato finale
        this.diceValue = Phaser.Math.Between(1, 6);
        const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        this.diceText.setText(diceEmojis[this.diceValue - 1]);
        this.diceResultText.setText(`Hai fatto: ${this.diceValue}`);

        // Animazione risultato
        this.tweens.add({
            targets: this.diceText,
            scale: { from: 1, to: 1.3 },
            duration: 200,
            yoyo: true,
            onComplete: () => {
                this.movePlayer(this.diceValue);
            }
        });
    }

    movePlayer(steps) {
        const player = gameData.players[gameData.currentPlayerIndex];
        const token = this.playerTokens[gameData.currentPlayerIndex];
        
        let newPosition = player.position + steps;
        
        // Controllo arrivo esatto
        if (newPosition > this.totalCells - 1) {
            // Rimbalza indietro
            const excess = newPosition - (this.totalCells - 1);
            newPosition = this.totalCells - 1 - excess;
            this.showMessage(`Devi arrivare con il numero esatto!\nTorni indietro alla casella ${newPosition}`);
        }
        
        if (newPosition < 0) newPosition = 0;

        // Animazione movimento passo per passo
        this.animateMovement(player, token, player.position, newPosition, steps);
    }

    animateMovement(player, token, fromPos, toPos, originalSteps) {
        const direction = toPos > fromPos ? 1 : -1;
        let currentPos = fromPos;

        const moveStep = () => {
            if (currentPos === toPos) {
                // Movimento completato
                player.position = toPos;
                this.updatePlayerList();
                this.checkSpecialCell(player, token, originalSteps);
                return;
            }

            currentPos += direction;
            const cell = gameData.boardPath[currentPos];
            const x = this.boardOffsetX + cell.x * this.cellSize + this.cellSize/2;
            const y = this.boardOffsetY + cell.y * this.cellSize + this.cellSize/2;

            // Offset per giocatore
            const index = gameData.currentPlayerIndex;
            const offsetX = (index % 2) * 12 - 6;
            const offsetY = Math.floor(index / 2) * 12 - 6;

            this.tweens.add({
                targets: token,
                x: x + offsetX,
                y: y + offsetY,
                duration: 150,
                ease: 'Power2',
                onComplete: moveStep
            });
        };

        moveStep();
    }

    checkSpecialCell(player, token, originalSteps) {
        const special = this.specialCells[player.position];

        // Controlla vittoria
        if (player.position === this.totalCells - 1) {
            this.showVictory(player);
            return;
        }

        if (!special) {
            this.isRolling = false;
            this.time.delayedCall(500, () => this.nextTurn());
            return;
        }

        // Gestisci effetti speciali
        switch (special.effect) {
            case 'moveAgain':
                this.showMessage(`${special.emoji} ${special.name}!\nAvanzi ancora di ${originalSteps}!`, () => {
                    const newPos = Math.min(player.position + originalSteps, this.totalCells - 1);
                    this.animateMovement(player, token, player.position, newPos, originalSteps);
                });
                break;

            case 'goto':
                this.showMessage(`${special.emoji} ${special.name}!\nVai alla casella ${special.target}`, () => {
                    this.animateMovement(player, token, player.position, special.target, originalSteps);
                });
                break;

            case 'skip':
                player.skipTurns = special.turns;
                this.showMessage(`${special.emoji} ${special.name}!\nStai fermo per ${special.turns} turno/i`, () => {
                    this.isRolling = false;
                    this.nextTurn();
                });
                break;

            default:
                this.isRolling = false;
                this.time.delayedCall(500, () => this.nextTurn());
        }
    }

    updatePlayerList() {
        gameData.players.forEach((player, index) => {
            let status = `${player.emoji} ${player.name}: Casella ${player.position}`;
            if (player.skipTurns > 0) {
                status += ` (⏳${player.skipTurns})`;
            }
            this.playerListTexts[index].setText(status);
        });
    }

    nextTurn() {
        gameData.currentPlayerIndex = (gameData.currentPlayerIndex + 1) % gameData.players.length;
        this.updateTurnDisplay();
        this.diceResultText.setText('');
    }

    showMessage(text, callback) {
        // Overlay
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.7
        );

        // Pannello messaggio
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 1);
        panel.fillRoundedRect(
            this.cameras.main.width / 2 - 200,
            this.cameras.main.height / 2 - 80,
            400, 160, 20
        );
        panel.lineStyle(4, 0xFFD700, 1);
        panel.strokeRoundedRect(
            this.cameras.main.width / 2 - 200,
            this.cameras.main.height / 2 - 80,
            400, 160, 20
        );

        const messageText = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 20,
            text,
            {
                fontSize: '22px',
                fontFamily: 'Arial',
                color: '#FFFFFF',
                align: 'center',
                lineSpacing: 8
            }
        ).setOrigin(0.5);

        const okBtn = this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 + 50,
            '✓ OK',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#4ECDC4',
                backgroundColor: '#2d2d2d',
                padding: { x: 30, y: 10 }
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        okBtn.on('pointerover', () => okBtn.setColor('#FFFFFF'));
        okBtn.on('pointerout', () => okBtn.setColor('#4ECDC4'));
        okBtn.on('pointerdown', () => {
            overlay.destroy();
            panel.destroy();
            messageText.destroy();
            okBtn.destroy();
            if (callback) callback();
        });
    }

    showVictory(winner) {
        // Overlay celebrativo
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.85
        );

        // Coriandoli
        for (let i = 0; i < 50; i++) {
            const confetti = this.add.text(
                Phaser.Math.Between(0, this.cameras.main.width),
                -50,
                Phaser.Utils.Array.GetRandom(['🎉', '🎊', '✨', '⭐', '🌟']),
                { fontSize: Phaser.Math.Between(20, 40) + 'px' }
            );

            this.tweens.add({
                targets: confetti,
                y: this.cameras.main.height + 50,
                x: confetti.x + Phaser.Math.Between(-100, 100),
                angle: Phaser.Math.Between(0, 360),
                duration: Phaser.Math.Between(2000, 4000),
                delay: Phaser.Math.Between(0, 1000)
            });
        }

        // Pannello vittoria
        const panel = this.add.graphics();
        panel.fillStyle(0x2d5a27, 1);
        panel.fillRoundedRect(
            this.cameras.main.width / 2 - 250,
            this.cameras.main.height / 2 - 150,
            500, 300, 25
        );
        panel.lineStyle(6, 0xFFD700, 1);
        panel.strokeRoundedRect(
            this.cameras.main.width / 2 - 250,
            this.cameras.main.height / 2 - 150,
            500, 300, 25
        );

        // Trofeo
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 100, '🏆', {
            fontSize: '80px'
        }).setOrigin(0.5);

        // Messaggio vittoria
        this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 
            `${winner.emoji} ${winner.name}\nHA VINTO!`, {
            fontSize: '36px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            color: '#FFD700',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Pulsante nuova partita
        const newGameBtn = this.add.text(
            this.cameras.main.width / 2 - 120,
            this.cameras.main.height / 2 + 100,
            '🔄 Nuova Partita',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#FFFFFF',
                backgroundColor: '#4ECDC4',
                padding: { x: 15, y: 10 }
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        newGameBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => {
                this.scene.start('PlayerSetupScene');
            });
        });

        // Pulsante menu
        const menuBtn = this.add.text(
            this.cameras.main.width / 2 + 120,
            this.cameras.main.height / 2 + 100,
            '🏠 Menu',
            {
                fontSize: '20px',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                color: '#FFFFFF',
                backgroundColor: '#FF6B6B',
                padding: { x: 15, y: 10 }
            }
        ).setOrigin(0.5).setInteractive({ useHandCursor: true });

        menuBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500);
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene');
            });
        });
    }
}

