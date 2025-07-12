import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import Colors from '../../constants/colors'
import { SceneManager } from '../../utils/sceneManager';
import { centerText } from '../../utils/responsive'
import { scaleBounce } from '../../utils/effects'

export class Game extends Scene {
    constructor() {
        super('Game');
        this.sceneManager = new SceneManager(this);
    }
    init(data) {
        // this.selectedBear = "PinkTeddy";
        this.selectedBear = data.selectedBear;
        this.dataBearsTarget = {}
        this.piecesBear = this.generateTeddyData(25);
        this.totalPieces = 25;
        this.completedPieces = 0;
        this.pieceScale = 0.5;
        this.textBodyStyle = { fontFamily: 'Arial Black', fontSize: 30, color: Colors.textOrange, background: Colors.black, align: 'center' }
    }
    create() {
        const soundRight = this.sound.add('right', { loop: false, volume: 1 })
        const soundWrong = this.sound.add('wrong', { loop: false, volume: 1 })
        this.pieces = [];
        const bigPaintTeddy = this.add.image(385, 550, 'backgroundGame').setScale(1.55).setOrigin(0.5, 0.39);
        const back = this.add.image(100, this.scale.height * 0.07, "goBack").setName("goBack").setScale(0.3);
        centerText(this, 250, "YOUR SCORE", this.textTitleStyle)
        this.showHeart()
        back.setInteractive().on('pointerdown', () => {
            this.scene.start('SelectBear');
        })
        const container1 = this.showBearInContainer(this.selectedBear, 'original', this.scale.width * 0.25, this.scale.height * 0.5, 280);
        const container2 = this.showBearInContainer(this.selectedBear, 'shadow', this.scale.width * 0.75, this.scale.height * 0.5, 280);
        const bearImages = container1.bearImages;
        bearImages.forEach((piece, i) => {
            piece.setInteractive({ cursor: 'pointer' });
            this.input.setDraggable(piece);
            piece.idName = piece.name;
            const posTargetLocal = this.dataBearsTarget[`${piece.idName}`]?.local;
            const posTargetWorld = this.dataBearsTarget[`${piece.idName}`]?.world;

            if (!posTargetWorld && !posTargetLocal) return;

            piece.correctWorldX = posTargetLocal[0];
            piece.correctWorldY = posTargetLocal[1];
            piece.snapped = false;
            this.pieces.push(piece);

        });
        this.input.on('dragstart', (pointer, gameObject) => {
            if (gameObject.snapped) {
                gameObject.snapped = false;
                this.completedPieces = Math.max(this.completedPieces - 1, 0);
                this.updateProgressBar();
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.setPosition(dragX, dragY);
        });
        this.input.on('dragend', (pointer, gameObject) => {
            const worldPoint = gameObject.getWorldTransformMatrix().transformPoint(0, 0);
            const container2Matrix = container2.getWorldTransformMatrix();
            const local = container2Matrix.applyInverse(worldPoint.x, worldPoint.y);
            container2.add(gameObject);
            gameObject.setPosition(local.x, local.y);
            const id = gameObject.idName;
            const dx = Math.abs(gameObject.x - gameObject.correctWorldX);
            const dy = Math.abs(gameObject.y - gameObject.correctWorldY);

            if (dx < 50 && dy < 50) {
                soundRight.play();
                gameObject.setDepth(10);
                gameObject.setPosition(gameObject.correctWorldX, gameObject.correctWorldY);
                scaleBounce(this, gameObject, 400, this.pieceScale + 0.1, this.pieceScale);
                gameObject.snapped = true;
                gameObject.disableInteractive();
                this.completedPieces++;
                this.checkPuzzleComplete();
                this.updateProgressBar();
            } else {
                soundWrong.play();
                if (this.lives > 0) {
                    if (this.isGameObjectInContainer(gameObject.x, gameObject.y, container2)) {
                        this.lives--;
                        const lostHeart = this.hearts[this.lives];
                        lostHeart.setTint(0x555555).setAlpha(0.4);
                    }
                }

                if (this.lives <= 0) {
                    this.sceneManager.fadeAndStart('GameOver', { score: this.completedPieces}, 500);
                }
                container1.add(gameObject);
                gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
                this.tweens.add({
                    targets: gameObject,
                    x: gameObject.x + 10,
                    duration: 50,
                    yoyo: true,
                    repeat: 3,
                    onComplete: () => {
                        gameObject.setPosition(gameObject.input.dragStartX, gameObject.input.dragStartY);
                    }
                });

            }
        });

        this.showProcessBar()
        this.updateProgressBar();
        EventBus.emit('current-scene-ready', this);
    }

    isGameObjectInContainer(worldX, worldY, container) {
        const bounds = container.getBounds();
        console.log({ worldX, boundsX: bounds.width, worldY, boundsY: bounds.height });
        return (
            worldX <= bounds.width / 2 &&
            worldX >= -bounds.width / 2 &&
            worldY <= bounds.height / 2 &&
            worldY >= -bounds.height / 2
        );
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    getGridPositionById(id, pieceSize = 140, cols = 2) {
        const row = Math.floor(id / cols);
        const col = id % cols;
        const x = col * pieceSize + pieceSize / 2;
        const y = row * pieceSize + pieceSize / 2;
        return { x, y };
    }

    showBear(nameBear, typeBearDisplay) {
        const images = [];
        if (typeBearDisplay == 'shadow') {
            const bearImage = this.add
                .image(0, 0, nameBear)
                .setAlpha(0.1)
                .setTint(0x333333)
                .setBlendMode(Phaser.BlendModes.COLOR_DODGE).setName(nameBear);
            images.push(bearImage);
        } else {
            let idx = 1
            for (let row = 0; row < 5; row++) {
                for (let col = 0; col < 5; col++) {
                    let imgKey = `${nameBear}-${idx}`
                    let name = `[${row}, ${col}]`
                    const bearImage = this.add.image(0, 0, imgKey).setName(name);
                    images.push(bearImage);
                    idx++
                }
            }
        }
        return images;
    }

    addImagesInContainer(scene, images, typeBearDisplay, centerX = 200, centerY = 200, containerSize = 400) {
        const container = scene.add.container(centerX, centerY);
        const halfW = containerSize / 2;
        const halfH = containerSize / 2;
        const halfSize = containerSize / 2;
        const cols = 5;
        const cellSize = containerSize / cols;
        const padding = 0
        if (typeBearDisplay == 'original') {
            const scale = this.setScaleImage()
            this.pieceScale = scale;
            this.shuffleArray(images).forEach((img, index) => {
                const row = Math.floor(index / cols);
                const col = index % cols;

                const x = -halfSize + col * cellSize + cellSize / 2;
                const y = -halfSize + row * cellSize + cellSize / 2;
                img.setPosition(x, y);
                img.setOrigin(0.5);
                img.setScale(scale);
                container.add(img);
            });
        } else {
            const scale = this.getUniformScale(500, 500, 280)
            images[0].setPosition(0, 0).setScale(scale);
            container.add(images);

            const grid = scene.add.graphics();
            grid.lineStyle(1, 0x999999, 1);
            container.addAt(grid, 0);
            const cols = 5;
            const rows = 5;
            const cellSize = containerSize / cols;
            const startX = -containerSize / 2;
            const startY = -containerSize / 2;

            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    const localX = startX + col * cellSize + cellSize / 2;
                    const localY = startY + row * cellSize + cellSize / 2;

                    const world = container.getWorldTransformMatrix().transformPoint(localX, localY);
                    this.dataBearsTarget[`[${row}, ${col}]`] = {
                        local: [localX, localY],
                        world: [Math.round(world.x), Math.round(world.y)]
                    };
                }

                const y = startY + row * cellSize;
                grid.lineBetween(startX, y, startX + containerSize, y);
            }

            for (let col = 0; col <= cols; col++) {
                const x = startX + col * cellSize;
                grid.lineBetween(x, startY, x, startY + containerSize);
            }
        }

        const border = scene.add.graphics();
        border.lineStyle(4, 0x000000, 1);
        border.strokeRect(-halfW - padding, -halfH - padding, containerSize + padding * 2, containerSize + padding * 2);
        container.addAt(border, 0); // border dưới cùng

        return container;
    }

    setScaleImage(originalImageSize = 250, cols = 5, rows = 5, padding = 0, containerSize = 280) {
        const availableWidth = containerSize - (padding * (cols - 1));
        const availableHeight = containerSize - (padding * (rows - 1));
        const cellSize = Math.min(availableWidth / cols, availableHeight / rows);
        const scale = cellSize / originalImageSize;

        return scale;
    }
    getUniformScale(imageWidth, imageHeight, containerSize) {
        const scaleX = containerSize / imageWidth;
        const scaleY = containerSize / imageHeight;
        return Math.min(scaleX, scaleY);
    }

    showBearInContainer(nameBear, typeBearDisplay = 'original', centerX = 400, centerY = 300, size = 250) {
        const bearImages = this.showBear(nameBear, typeBearDisplay);
        const container = this.addImagesInContainer(this, bearImages, typeBearDisplay, centerX, centerY, size);

        container.bearImages = bearImages;

        return container;
    }

    checkPuzzleComplete() {
        const done = this.pieces.every(piece => piece.snapped);
        if (done) {
            this.time.delayedCall(300, () => {
                this.sceneManager.fadeAndStart("GameOver", { score: this.completedPieces }, 500)
            });
        }
    }

    changeScene() {
        this.scene.start('GameOver', { score: this.completedPieces });
    }

    generateTeddyData(totalSplits) {
        const splits = Array.from({ length: totalSplits }, (_, i) => `Split-${i + 1}`);
        return splits;
    }
    updateProgressBar() {
        if (this.completedPieces < 0) {
            this.time.delayedCall(300, () => {
                this.sceneManager.fadeAndStart("GameOver", { score: this.completedPieces }, 500)
            });
        }
        const percentage = Phaser.Math.Clamp(this.completedPieces / this.totalPieces, 0, 1);

        const maxWidth = this.scale.width * 0.75;
        const barWidth = maxWidth * percentage;

        this.progressBar.clear();
        this.progressBar.fillStyle(0xe95d38, 1);
        this.progressBar.fillRect(this.scale.width * 0.125, this.scale.height * 0.20, barWidth, 20);

        const border = this.add.graphics();
        border.lineStyle(2, 0xD1D1D1, 1);
        border.strokeRect(this.scale.width * 0.125, this.scale.height * 0.20, maxWidth, 20);

        console.log({ "this.completedPieces": this.completedPieces })
    }
    showHeart() {
        const numHearts = 5;
        const spacing = 20;
        const centerX = this.scale.width / 2;
        const y = this.scale.height * 0.15;

        const heartTexture = this.textures.get('heart');
        const frame = heartTexture.getSourceImage();
        const heartWidth = frame.width;
        const scale = 1;

        const scaledHeartWidth = heartWidth * scale;
        const totalWidth = numHearts * scaledHeartWidth + (numHearts - 1) * spacing;
        const startX = centerX - totalWidth / 2;

        this.hearts = [];
        this.lives = numHearts;

        for (let i = 0; i < numHearts; i++) {
            const x = startX + i * (scaledHeartWidth + spacing);
            const heart = this.add.image(x, y, 'heart')
                .setScale(scale)
                .setTint(0xff0000)
                .setOrigin(0, 0.5);
            this.hearts.push(heart);
        }
    }
    showProcessBar() {
        this.progressBarBorder = this.add.graphics();
        this.progressBarBorder.strokeRect(this.scale.width * 0.25, this.scale.height * 0.20, 400, 20);
        this.progressBar = this.add.graphics();
    }
}

