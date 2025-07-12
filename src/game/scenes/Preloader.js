import { Scene } from 'phaser';
import Colors from '../../constants/colors';

export class Preloader extends Scene {
    constructor() {
        super('Preloader');
    }
    preload() {
        const { width, height } = this.cameras.main;
        // Nền trắng
        this.cameras.main.setBackgroundColor(Colors.background);

        // Viền thanh loading
        const box = this.add.graphics();
        box.fillStyle(0x222222, 0.8);
        box.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

        // Thanh loading
        const bar = this.add.graphics();

        // Text phần trăm
        const percentText = this.add.text(width / 2, height / 2, '0%', {
            fontSize: '18px',
            fill: '#000'
        }).setOrigin(0.5);

        // Cập nhật khi loading tiến triển
        this.load.on('progress', (value) => {
            bar.clear();
            bar.fillStyle(0xffffff, 1);
            bar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
            percentText.setText(parseInt(value * 100) + '%');
        });

        // Khi loading xong
        this.load.on('complete', () => {
            bar.destroy();
            box.destroy();
            percentText.destroy();
        });
        // Tải file: bạn thay file thật bằng hình ảnh game bạn
        let listBearImage = ['BePinkTeddy', 'PinkTeddy', 'BrownTeddy']
        listBearImage.map(bear => {
            let i = 1
            while (i <= 25) {
                let nameImg = `${bear}-${i}`;
                let assets = `assets/${bear}/Split-${i}.png`
                this.load.image(nameImg, assets)
                i++;
            }
        })
        this.load.setPath('assets');
        this.load.image('BePinkTeddy-1', 'BePinkTeddy-1.png')
        this.load.image('BePinkTeddy-2', 'BePinkTeddy-2.png')
        this.load.image('BePinkTeddy-3', 'BePinkTeddy-3.png')
        this.load.image('BePinkTeddy-4', 'BePinkTeddy-4.png')
        this.load.image('BrownTeddy-1', 'BrownTeddy-1.png')
        this.load.image('BrownTeddy-2', 'BrownTeddy-2.png')
        this.load.image('BrownTeddy-3', 'BrownTeddy-3.png')
        this.load.image('BrownTeddy-4', 'BrownTeddy-4.png')
        this.load.image('PinkTeddy-1', 'PinkTeddy-1.png')
        this.load.image('PinkTeddy-2', 'PinkTeddy-2.png')
        this.load.image('PinkTeddy-3', 'PinkTeddy-3.png')
        this.load.image('PinkTeddy-4', 'PinkTeddy-4.png')
        this.load.image('PinkTeddy', 'PinkTeddy.png')
        this.load.image('BrownTeddy', 'BrownTeddy.png')
        this.load.image('BePinkTeddy', 'BePinkTeddy.png')
        this.load.image('star', 'star.png')
        this.load.image('flag', 'flag.png')
        this.load.image('cloud', 'cloud.png')
        this.load.image('cloud2', 'cloud-2.webp')
        this.load.image('bigPaintTeddy', 'bigPaintTeddy.webp')
        this.load.image('goBack', 'goBack.svg')
        this.load.image('handPoint', 'handPoint.svg')
        this.load.image('play', 'play.svg')
        this.load.image('playAgain', 'playAgain.png')
        this.load.image('heart', 'heart.png');
        this.load.image('puzzle', 'puzzle.png');
        this.load.image('backgroundGame', 'backgroundGame.png');
        // this.load.image('congratulation', 'congratulation.png');
        this.load.audio('bgSound', 'sounds/bgSound.mp3');
        this.load.audio('right', 'sounds/right.mp3');
        this.load.audio('wrong', 'sounds/wrong.mp3');
        this.load.audio('mouseClick', 'sounds/mouseClick.mp3');
    }

    create() {
        this.scene.start('SelectBear');
    }
}
