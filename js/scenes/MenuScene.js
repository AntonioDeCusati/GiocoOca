class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        this.cameras.main.fadeIn(500);

        // Sfondo decorativo
        this.createBackground();

        // Titolo del menu
        const title = this.add.text(centerX, 100, '🎲 MENU PRINCIPALE 🎲', {
            fontSize: '48px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            color: '#FFD700',
            stroke: '#4a2800',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Animazione titolo
        this.tweens.add({
            targets: title,
            y: 110,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulsante Nuova Partita
        this.createButton(centerX, centerY - 40, '🎮  NUOVA PARTITA', () => {
            this.cameras.main.fadeOut(400, 0, 0, 0);
            this.time.delayedCall(400, () => {
                this.scene.start('PlayerSetupScene');
            });
        });

        // Pulsante Regole
        this.createButton(centerX, centerY + 60, '📜  REGOLE', () => {
            this.showRules();
        });

        // Pulsante Crediti
        this.createButton(centerX, centerY + 160, '👤  CREDITI', () => {
            this.showCredits();
        });

        // Decorazioni oche
        this.createGooseDecorations();

        // Dadi decorativi animati
        this.createAnimatedDice();
    }

    createBackground() {
        // Pattern di sfondo
        const graphics = this.add.graphics();
        
        // Griglia decorativa
        graphics.lineStyle(1, 0x4ECDC4, 0.1);
        for (let x = 0; x < this.cameras.main.width; x += 40) {
            graphics.lineBetween(x, 0, x, this.cameras.main.height);
        }
        for (let y = 0; y < this.cameras.main.height; y += 40) {
            graphics.lineBetween(0, y, this.cameras.main.width, y);
        }
    }

    createButton(x, y, text, callback) {
        const buttonWidth = 350;
        const buttonHeight = 70;

        // Container per il pulsante
        const container = this.add.container(x, y);

        // Sfondo pulsante
        const bg = this.add.graphics();
        bg.fillStyle(0x2d5a27, 1);
        bg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);
        bg.lineStyle(4, 0x4ECDC4, 1);
        bg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);

        // Testo pulsante
        const buttonText = this.add.text(0, 0, text, {
            fontSize: '26px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FFFFFF'
        }).setOrigin(0.5);

        container.add([bg, buttonText]);

        // Zona interattiva
        const hitArea = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0);
        hitArea.setInteractive({ useHandCursor: true });

        // Eventi hover
        hitArea.on('pointerover', () => {
            this.tweens.add({
                targets: container,
                scale: 1.08,
                duration: 150,
                ease: 'Back.easeOut'
            });
            bg.clear();
            bg.fillStyle(0x3d7a37, 1);
            bg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);
            bg.lineStyle(4, 0xFFD700, 1);
            bg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);
        });

        hitArea.on('pointerout', () => {
            this.tweens.add({
                targets: container,
                scale: 1,
                duration: 150,
                ease: 'Back.easeOut'
            });
            bg.clear();
            bg.fillStyle(0x2d5a27, 1);
            bg.fillRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);
            bg.lineStyle(4, 0x4ECDC4, 1);
            bg.strokeRoundedRect(-buttonWidth/2, -buttonHeight/2, buttonWidth, buttonHeight, 20);
        });

        hitArea.on('pointerdown', callback);

        return container;
    }

    createGooseDecorations() {
        // Oche decorative ai lati
        const goose1 = this.add.text(80, this.cameras.main.height - 150, '🦆', {
            fontSize: '80px'
        }).setAlpha(0.7);
        
        const goose2 = this.add.text(this.cameras.main.width - 130, this.cameras.main.height - 150, '🦆', {
            fontSize: '80px'
        }).setAlpha(0.7).setFlipX(true);

        // Animazione
        this.tweens.add({
            targets: [goose1, goose2],
            y: this.cameras.main.height - 160,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createAnimatedDice() {
        const diceEmoji = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        // Dado sinistro
        const dice1 = this.add.text(120, 200, '⚅', {
            fontSize: '60px'
        });
        
        // Dado destro
        const dice2 = this.add.text(this.cameras.main.width - 150, 200, '⚃', {
            fontSize: '60px'
        });

        // Animazione rotazione
        this.time.addEvent({
            delay: 500,
            callback: () => {
                dice1.setText(Phaser.Utils.Array.GetRandom(diceEmoji));
                dice2.setText(Phaser.Utils.Array.GetRandom(diceEmoji));
            },
            loop: true
        });

        this.tweens.add({
            targets: [dice1, dice2],
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    showRules() {
        // Overlay scuro
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.8
        ).setInteractive();

        // Pannello regole
        const panelWidth = 700;
        const panelHeight = 550;
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 1);
        panel.fillRoundedRect(
            (this.cameras.main.width - panelWidth) / 2,
            (this.cameras.main.height - panelHeight) / 2,
            panelWidth, panelHeight, 20
        );
        panel.lineStyle(4, 0xFFD700, 1);
        panel.strokeRoundedRect(
            (this.cameras.main.width - panelWidth) / 2,
            (this.cameras.main.height - panelHeight) / 2,
            panelWidth, panelHeight, 20
        );

        // Titolo regole
        const title = this.add.text(this.cameras.main.width / 2, 140, '📜 REGOLE DEL GIOCO', {
            fontSize: '32px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            color: '#FFD700'
        }).setOrigin(0.5);

        // Testo regole
        const rules = `
🎲 Ogni giocatore lancia il dado a turno

🦆 Si avanza del numero di caselle indicato dal dado

⭐ CASELLE SPECIALI:
   • Oca (🦆): Avanza ancora dello stesso numero
   • Ponte (🌉): Vai alla casella 12
   • Locanda (🏨): Stai fermo 1 turno
   • Pozzo (🕳️): Stai fermo 2 turni
   • Labirinto (🌀): Torna alla casella 30
   • Prigione (⛓️): Stai fermo 3 turni
   • Morte (💀): Torna alla partenza

🏆 Vince chi arriva per primo all'ultima casella
   con il numero esatto!
        `;

        const rulesText = this.add.text(this.cameras.main.width / 2, 380, rules, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#FFFFFF',
            lineSpacing: 8,
            align: 'left'
        }).setOrigin(0.5);

        // Pulsante chiudi
        const closeBtn = this.add.text(this.cameras.main.width / 2, 620, '❌ CHIUDI', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FF6B6B',
            backgroundColor: '#2d2d2d',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setColor('#FFFFFF'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#FF6B6B'));
        closeBtn.on('pointerdown', () => {
            overlay.destroy();
            panel.destroy();
            title.destroy();
            rulesText.destroy();
            closeBtn.destroy();
        });
    }

    showCredits() {
        // Overlay scuro
        const overlay = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000, 0.8
        ).setInteractive();

        // Pannello crediti
        const panelWidth = 500;
        const panelHeight = 300;
        const panel = this.add.graphics();
        panel.fillStyle(0x1a1a2e, 1);
        panel.fillRoundedRect(
            (this.cameras.main.width - panelWidth) / 2,
            (this.cameras.main.height - panelHeight) / 2,
            panelWidth, panelHeight, 20
        );
        panel.lineStyle(4, 0xFFD700, 1);
        panel.strokeRoundedRect(
            (this.cameras.main.width - panelWidth) / 2,
            (this.cameras.main.height - panelHeight) / 2,
            panelWidth, panelHeight, 20
        );

        // Testo crediti
        const creditsText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 - 30, 
            '🎮 GIOCO DELL\'OCA 🎮\n\n' +
            'Sviluppato con Phaser 3\n\n' +
            '© 2024 - Tutti i diritti riservati\n\n' +
            '🦆 Buon divertimento! 🦆', {
            fontSize: '22px',
            fontFamily: 'Georgia, serif',
            color: '#FFFFFF',
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);

        // Pulsante chiudi
        const closeBtn = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 110, '❌ CHIUDI', {
            fontSize: '24px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            color: '#FF6B6B',
            backgroundColor: '#2d2d2d',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        closeBtn.on('pointerover', () => closeBtn.setColor('#FFFFFF'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#FF6B6B'));
        closeBtn.on('pointerdown', () => {
            overlay.destroy();
            panel.destroy();
            creditsText.destroy();
            closeBtn.destroy();
        });
    }
}

