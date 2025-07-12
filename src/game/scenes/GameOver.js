import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Colors from '../../constants/colors'
import { centerText } from '../../utils/responsive'
import { showGrid } from '../../utils/grid'
import { SceneManager } from '../../utils/sceneManager';

export class GameOver extends Scene {
    constructor() {
        super('GameOver');
        this.sceneManager = new SceneManager(this);
    }
    init(data) {
        this.score = data.score || 0;
        this.width = this.scale.width;
        this.height = this.scale.height;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.textTitleStyle = { fontFamily: 'Arial Black', fontSize: 48, color: Colors.textOrange, align: 'center' }
        this.textBodyStyle = { fontFamily: 'Arial Black', fontSize: 24, color: Colors.textOrange, align: 'center' }
    }
    create() {
        this.cameras.main.setBackgroundColor(Colors.background);
        const bigPaintTeddy = this.add.image(385, 550, 'bigPaintTeddy').setScale(1);
        const star = this.add.image(this.width * 0.5, this.height * 0.5, "star").setName("star").setScale(0.1);
        const particles = this.add.particles('star');

        // const congratulation = this.add.image(385, 550, 'congratulation').setScale(1);
        centerText(this, 480, "Game over", this.textTitleStyle)
        // const playAgainIcon = this.add.image(0, 0, "playAgain").setName("playAgain").setScale(0.25);
        const yourScore = centerText(this, 560, `Your Score: ${this.score * 4}`, this.textBodyStyle)
        const playAgain = centerText(this, 0, "Play Again", this.textBodyStyle)
        const discover = centerText(this, 0, "Discover More", this.textBodyStyle)

        const btnPlayAgain = this.createContainer(this, playAgain, (this.centerX - this.centerX / 2), this.scale.height * 0.65);
        const btnDiscover = this.createContainer(this, discover, (this.centerX + this.centerX / 2), this.scale.height * 0.65);
        // showGrid(this)
        btnPlayAgain.setInteractive().on('pointerdown', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
            this.sceneManager.fadeAndStart("SelectBear", 500)
        })
        const emitter = this.add.particles(
            this.centerX / 2, this.centerY / 2,
            "star",
            {
                scale: 0.08,
                lifespan: 5000,
                quantity: 10,
                speed: 100,
                on: false,
                frequency: -1
            }
        );

        emitter.explode(40, this.centerX / 2, this.centerY / 2);

        this.time.delayedCall(500, () => {
            emitter.explode(40, this.centerX / 2, this.centerY / 2);
        });

        this.time.delayedCall(1000, () => {
            emitter.explode(40, this.centerX / 2, this.centerY / 2);
        });

        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        this.scene.start('MainMenu');
    }

    createContainer(scene, children, centerX = 400, centerY = 300, padding = 20) {
        const container = scene.add.container(centerX, centerY);
        if (children.length > 1) {
            const bounds = children[0].getBounds();
            console.log(bounds);
            const positions = [
                { x: 0, y: 0 }, // top-left
                { x: 100, y: 0 },  // top-right
            ];

            children.forEach((img, index) => {
                const pos = positions[index];
                img.setPosition(pos.x, pos.y);
                img.setOrigin(0.5);
                container.add(img);
            });
        } else {
            children.setPosition(0, 0);
            container.add(children);
        }

        const bounds = container.getBounds();
        const border = scene.add.graphics();
        border.lineStyle(4, 0x000000, 1);
        border.strokeRect(bounds.x - padding, bounds.y - padding, bounds.width + padding * 2, bounds.height + padding * 2);
        container.setSize(bounds.width + padding * 2, bounds.height + padding * 2);

        return container;
    }
}
