// Configurazione principale del gioco
const config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scene: [SplashScene, MenuScene, PlayerSetupScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Dati globali del gioco
const gameData = {
    players: [],
    currentPlayerIndex: 0,
    boardPath: []
};

// Inizializza il gioco
const game = new Phaser.Game(config);

