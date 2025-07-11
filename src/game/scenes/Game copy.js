import { EventBus } from '../EventBus';
import { Scene } from 'phaser';
import { showGrid } from '../../utils/grid'
import { SceneManager } from '../../utils/sceneManager';

export class Game extends Scene {
    constructor() {
        super('Game');
        this.sceneManager = new SceneManager(this);
    }
    init(data) {
        this.selectedBear = "PinkTeddy";
        // this.selectedBear = data.selectedBear;
        this.dataBearsTarget = {
            "PinkTeddy": [
                { id: 1, name: "PinkTeddy-1", x: 326, y: -58 },
                { id: 2, name: "PinkTeddy-2", x: 442, y: -58 },
                { id: 3, name: "PinkTeddy-3", x: 326, y: 58 },
                { id: 4, name: "PinkTeddy-4", x: 442, y: 58 }
            ],
            "BrownTeddy": [
                { id: 1, name: "BrownTeddy-1", x: 326, y: -58 },
                { id: 2, name: "BrownTeddy-2", x: 442, y: -58 },
                { id: 3, name: "BrownTeddy-3", x: 326, y: 58 },
                { id: 4, name: "BrownTeddy-4", x: 442, y: 58 }
            ],
            "BePinkTeddy": [
                { id: 1, name: "BePinkTeddy-1", x: 326, y: -58 },
                { id: 2, name: "BePinkTeddy-2", x: 442, y: -58 },
                { id: 3, name: "BePinkTeddy-3", x: 326, y: 58 },
                { id: 4, name: "BePinkTeddy-4", x: 442, y: 58 }
            ],
        }
        this.dataBearsShadow = {
            "PinkTeddy": [
                { id: 1, name: "PinkTeddy-1", x: 450, y: 465 },
                { id: 2, name: "PinkTeddy-2", x: 553, y: 440 },
                { id: 3, name: "PinkTeddy-3", x: 469, y: 561 },
                { id: 4, name: "PinkTeddy-4", x: 570, y: 542 }
            ],
            "BrownTeddy": [
                { id: 1, name: "BrownTeddy-1", x: 450, y: 465 },
                { id: 2, name: "BrownTeddy-2", x: 537, y: 444 },
                { id: 3, name: "BrownTeddy-3", x: 467, y: 566 },
                { id: 4, name: "BrownTeddy-4", x: 569, y: 547 }
            ],
            "BePinkTeddy": [
                { id: 1, name: "BePinkTeddy-1", x: 450, y: 465 },
                { id: 2, name: "BePinkTeddy-2", x: 552, y: 447 },
                { id: 3, name: "BePinkTeddy-3", x: 469, y: 567 },
                { id: 4, name: "BePinkTeddy-4", x: 571, y: 550 }
            ],
        }
        this.dataBears = {
            "PinkTeddy": [
                { id: 1, name: "PinkTeddy-1", x: 175, y: 465 },
                { id: 2, name: "PinkTeddy-2", x: 20, y: 475 },
                { id: 3, name: "PinkTeddy-3", x: 20, y: 561 },
                { id: 4, name: "PinkTeddy-4", x: 20, y: 542 }
            ],
            "BrownTeddy": [
                { id: 1, name: "BrownTeddy-1", x: 20, y: 465 },
                { id: 2, name: "BrownTeddy-2", x: 20, y: 465 },
                { id: 3, name: "BrownTeddy-3", x: 20, y: 465 },
                { id: 4, name: "BrownTeddy-4", x: 20, y: 465 }
            ],
            "BePinkTeddy": [
                { id: 1, name: "BePinkTeddy-1", x: 20, y: 465 },
                { id: 2, name: "BePinkTeddy-2", x: 20, y: 465 },
                { id: 3, name: "BePinkTeddy-3", x: 20, y: 465 },
                { id: 4, name: "BePinkTeddy-4", x: 20, y: 465 }
            ],
        }
        this.piecesBear = this.generateTeddyData(25);

    }
    create() {
        this.pieces = [];
        // showGrid(this)
        const back = this.add.image(100, 220, "goBack").setName("goBack").setScale(0.3);
        back.setInteractive().on('pointerdown', () => {
            this.scene.start('SelectBear');
        })
        const bearImages = this.showBearInContainer(this.selectedBear, '', this.scale.width * 0.25, this.scale.height / 2);
        // this.showBearInContainer(this.selectedBear, 'shadow', this.scale.width * 0.75, this.scale.height / 2);
        // bearImages.forEach((piece, i) => {
        //     piece.setInteractive();
        //     this.input.setDraggable(piece);
        //     const foundObject = this.dataBearsTarget[this.selectedBear].find(item => Object.values(item)[0] === piece.name);
        //     piece.correctX = foundObject?.x;
        //     piece.correctY = foundObject?.y;
        //     piece.snapped = false;
        //     this.pieces.push(piece);
        //     this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
        //         gameObject.setPosition(dragX, dragY);
        //     });

        //     this.input.on('dragend', (pointer, gameObject) => {
        //         console.log({ gameObject });
        //         const dx = Math.abs(gameObject.x - gameObject.correctX);
        //         const dy = Math.abs(gameObject.y - gameObject.correctY);
        //         if (dx < 50 && dy < 50) {
        //             gameObject.setPosition(gameObject.correctX, gameObject.correctY);
        //             gameObject.snapped = true;
        //             this.checkPuzzleComplete();
        //         } else {
        //             this.tweens.add({
        //                 targets: gameObject,
        //                 x: gameObject.x + 10,
        //                 duration: 50,
        //                 yoyo: true,
        //                 repeat: 3,
        //                 onComplete: () => {
        //                     gameObject.setPosition(
        //                         gameObject.input.dragStartX,
        //                         gameObject.input.dragStartY
        //                     );
        //                 }
        //             });
        //         }
        //     });
        // });

        EventBus.emit('current-scene-ready', this);
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    showBear(name, bearType = "") {
        // let dataBear =
        //     bearType === "shadow" && name !== ""
        //         ? this.dataBearsShadow[name]
        //         : this.shuffleArray(this.dataBears[name]);

        const images = [];

        this.piecesBear?.forEach((value) => {
            let id = Number(value.split('-')[1])
            let name = `${this.selectedBear}-${id}`
            const bearImage =
                bearType === "shadow"
                    ? this.add
                        .image(0, 0, name)
                        .setScale(0.2)
                        .setAlpha(0.1)
                        .setTint(0x000000)
                        .setBlendMode(Phaser.BlendModes.COLOR_DODGE).setName(id)
                    : this.add.image(0, 0, name).setScale(0.2).setName(id);

            images.push(bearImage);
        });

        return images;
    }

    addImagesInContainer(scene, images, centerX = 400, centerY = 300, containerSize = 350) {
        const container = scene.add.container(centerX, centerY);

        const halfW = containerSize / 2;
        const halfH = containerSize / 2;

        const positions = [
            { x: -halfW / 2.5, y: -halfH / 2.5 }, // top-left
            { x: halfW / 2.5, y: -halfH / 2.5 },  // top-right
            { x: -halfW / 2.5, y: halfH / 2.5 },  // bottom-left
            { x: halfW / 2.5, y: halfH / 2.5 }    // bottom-right
        ];

        images.forEach((img, index) => {
            const pos = positions[index];
            img.setPosition(pos.x, pos.y);
            img.setOrigin(0.5);
            container.add(img);
        });


        // Vẽ border bao quanh container
        const border = scene.add.graphics();
        border.lineStyle(4, 0x000000, 1);
        border.strokeRect(-halfW, -halfH, containerSize, containerSize);
        container.addAt(border, 0); // border dưới cùng

        return container;
    }

    showBearInContainer(name, bearType = "", centerX = 400, centerY = 300, size = 290) {
        const bearImages = this.showBear(name, bearType);         // ⬅ mảng hình ảnh
        this.addImagesInContainer(this, bearImages, centerX, centerY, size);
        return bearImages; // ⬅ TRẢ VỀ danh sách ảnh
    }

    checkPuzzleComplete() {
        const done = this.pieces.every(piece => piece.snapped);
        if (done) {
            this.time.delayedCall(300, () => {
                this.sceneManager.fadeAndStart("GameOver", 500)
            });
        }
    }

    changeScene() {
        this.scene.start('GameOver');
    }

    generateTeddyData(totalSplits) {
        const splits = Array.from({ length: totalSplits }, (_, i) => `Split-${i + 1}`);
        return splits;
    }

}

