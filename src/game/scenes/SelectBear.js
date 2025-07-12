import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Colors from '../../constants/colors'
import { isPlainObject } from '../../utils/typeCheck';
import { colorStringToHexNumber } from '../../utils/convertColor'
import { animateCloud, shake, animateSpin } from '../../utils/effects'
import { SceneManager } from '../../utils/sceneManager';

export class SelectBear extends Scene {
    logoTween;

    constructor() {
        super('SelectBear');
        this.sceneManager = new SceneManager(this);
    }

    create() {
        // const bgSound = this.sound.add('bgSound', { loop: true, volume: 0.5 });
        const bgSound = this.sound.get('bgSound');

        if (!bgSound) {
            this.sound.add('bgSound', { loop: true, volume: 0.5 }).play();
        } else if (!bgSound.isPlaying) {
            bgSound.play();
        }

        const bigPaintTeddy = this.add.image(385, 550, 'bigPaintTeddy').setScale(1);
        const cloud = this.add.image(641, 115, 'cloud').setName('cloud').setScale(0.5);
        const cloud2 = this.add.image(140, 115, 'cloud').setName('cloud2').setScale(0.5);

        const bear1 = this.add.image(165, 550, 'BePinkTeddy').setName('BePinkTeddy').setAlpha(0).setScale(0.5);
        const bear2 = this.add.image(385, 685, 'BrownTeddy').setName('BrownTeddy').setAlpha(0).setScale(0.5);
        const bear3 = this.add.image(605, 550, 'PinkTeddy').setName('PinkTeddy').setAlpha(0).setScale(0.5);
        const puzzle = this.add.image(630, 875, 'puzzle').setName('puzzle').setAlpha(1).setScale(0.15);

        this.createLogoBearWithBorder([bear1, bear2, bear3])
        this.showBounceEffect([bear1, bear2, bear3], 200);
        this.cameras.main.setBackgroundColor(Colors.background);
        this.add.text(400, 100, 'LICERIA', {
            fontFamily: 'Arial Black', fontSize: 58, color: Colors.textOrange,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);
        this.add.text(400, 923, 'Time to play', {
            fontFamily: 'Arial Black', fontSize: 38, color: Colors.textOrange,
            align: 'center'
        }).setDepth(100).setOrigin(0.5);

        animateCloud(this, cloud2);
        animateCloud(this, cloud);
        animateSpin(this, puzzle);

        [bear1, bear2, bear3].forEach((bear, id) => {
            bear.setInteractive()
            bear.on('pointerdown', () => {
                shake(this, bear);
                this.sceneManager.fadeAndStart("Game", { selectedBear: bear.name, bgSound }, 500)
            });

            bear.on('pointerover', () => {
                this.input.manager.canvas.style.cursor = 'pointer';
                this.tweens.add({
                    targets: bear,
                    scale: 0.5,
                    ease: 'Sine.easeInOut',
                    duration: 200,
                    ease: 'Power2'
                });
            });

            bear.on('pointerout', () => {
                this.input.manager.canvas.style.cursor = 'default';
                this.tweens.add({
                    targets: bear,
                    scale: 0.4,
                    ease: 'Sine.easeInOut',
                    duration: 200,
                    ease: 'Power2'
                });
            });
        })


        EventBus.emit('current-scene-ready', this);
    }

    changeScene() {
        if (this.logoTween) {
            this.logoTween.stop();
            this.logoTween = null;
        }
        this.scene.start('Game');
    }

    moveLogo(reactCallback) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            }
            else {
                this.logoTween.play();
            }
        }
        else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 750, duration: 3000, ease: 'Back.easeInOut' },
                y: { value: 80, duration: 1500, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    if (reactCallback) {
                        reactCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y)
                        });
                    }
                }
            });
        }
    }

    showBounceEffect(objects, delayStep = 0) {
        objects.forEach((obj, index) => {
            this.tweens.add({
                targets: obj,
                scale: 0.4,
                alpha: 1,
                ease: 'Bounce.out',
                duration: 800,
                delay: index * delayStep
            });
        });
    }

    createLogoBearWithBorder(bears) {
        if (isPlainObject(bears)) {
            bears = Object.values(bears);
        }

        bears.map((bear) => {
            const x = bear.x;
            const y = bear.y;

            bear.setPosition(0, 0);

            const container = this.add.container(x, y);
            const border = this.add.graphics();
            border.lineStyle(4, colorStringToHexNumber(Colors.primary));
            border.fillStyle(0xffffff);
            border.fillCircle(0, 0, 120);
            border.strokeCircle(0, 0, 120);
            container.add([border, bear]);

            return container;
        });
    }
}
