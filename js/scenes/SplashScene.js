class SplashScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SplashScene' });
    }

    create() {
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;

        // Sfondo con gradiente animato
        this.createAnimatedBackground();

        // Oca decorativa
        this.createGooseDecoration(centerX, centerY - 80);

        // Titolo principale con effetto glow
        const title = this.add.text(centerX, centerY + 60, '🎲 GIOCO DELL\'OCA 🎲', {
            fontSize: '56px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'bold',
            color: '#FFD700',
            stroke: '#8B4513',
            strokeThickness: 8,
            shadow: {
                offsetX: 4,
                offsetY: 4,
                color: '#000',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);

        // Sottotitolo
        const subtitle = this.add.text(centerX, centerY + 130, 'Un classico gioco da tavolo', {
            fontSize: '24px',
            fontFamily: 'Georgia, serif',
            fontStyle: 'italic',
            color: '#E8D5B7'
        }).setOrigin(0.5).setAlpha(0);

        // Testo "Clicca per iniziare"
        const startText = this.add.text(centerX, centerY + 220, '✨ Clicca per iniziare ✨', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#4ECDC4'
        }).setOrigin(0.5).setAlpha(0);

        // Animazioni di entrata
        this.tweens.add({
            targets: title,
            alpha: 1,
            y: centerY + 40,
            duration: 1500,
            ease: 'Back.easeOut'
        });

        this.tweens.add({
            targets: subtitle,
            alpha: 1,
            duration: 1000,
            delay: 800,
            ease: 'Power2'
        });

        this.tweens.add({
            targets: startText,
            alpha: 1,
            duration: 1000,
            delay: 1500,
            ease: 'Power2',
            onComplete: () => {
                // Pulsazione del testo "Clicca per iniziare"
                this.tweens.add({
                    targets: startText,
                    alpha: 0.5,
                    scale: 1.1,
                    duration: 800,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });

        // Click per passare al menu
        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene');
            });
        });

        // Particelle decorative
        this.createParticles();
    }

    createAnimatedBackground() {
        // Cerchi decorativi animati
        const colors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x95E1D3];
        
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(50, this.cameras.main.width - 50);
            const y = Phaser.Math.Between(50, this.cameras.main.height - 50);
            const radius = Phaser.Math.Between(20, 60);
            const color = Phaser.Utils.Array.GetRandom(colors);
            
            const circle = this.add.circle(x, y, radius, color, 0.1);
            
            this.tweens.add({
                targets: circle,
                scale: { from: 0.8, to: 1.3 },
                alpha: { from: 0.05, to: 0.15 },
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createGooseDecoration(x, y) {
        // Oca stilizzata con forme geometriche
        const gooseContainer = this.add.container(x, y);
        
        // Corpo dell'oca
        const body = this.add.ellipse(0, 30, 80, 100, 0xFFFFFF);
        const neck = this.add.ellipse(25, -20, 25, 60, 0xFFFFFF);
        const head = this.add.circle(35, -60, 25, 0xFFFFFF);
        const beak = this.add.triangle(60, -60, 0, -8, 25, 0, 0, 8, 0xFFA500);
        const eye = this.add.circle(42, -65, 5, 0x000000);
        const wing = this.add.ellipse(-10, 20, 50, 40, 0xE8E8E8);
        
        gooseContainer.add([body, wing, neck, head, beak, eye]);
        gooseContainer.setScale(0).setAlpha(0);
        
        // Animazione entrata oca
        this.tweens.add({
            targets: gooseContainer,
            scale: 1,
            alpha: 1,
            duration: 1200,
            delay: 300,
            ease: 'Back.easeOut'
        });
        
        // Animazione ondeggiamento
        this.tweens.add({
            targets: gooseContainer,
            angle: { from: -5, to: 5 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            delay: 1500
        });
    }

    createParticles() {
        // Stelle decorative
        const stars = ['✦', '✧', '★', '☆', '✴'];
        
        for (let i = 0; i < 20; i++) {
            const star = this.add.text(
                Phaser.Math.Between(0, this.cameras.main.width),
                Phaser.Math.Between(0, this.cameras.main.height),
                Phaser.Utils.Array.GetRandom(stars),
                {
                    fontSize: Phaser.Math.Between(12, 24) + 'px',
                    color: '#FFD700'
                }
            ).setAlpha(0);
            
            this.tweens.add({
                targets: star,
                alpha: { from: 0, to: 0.6 },
                y: star.y - 50,
                duration: Phaser.Math.Between(2000, 4000),
                delay: Phaser.Math.Between(0, 3000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
}

