import { Boot } from './scenes/Boot';
import { Game } from './scenes/Game';
import { GameOver } from './scenes/GameOver';
import { SelectBear } from './scenes/SelectBear';
import Phaser from 'phaser';
import { Preloader } from './scenes/Preloader';
import Colors from '../constants/colors';

// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 768,
    height: 1024,
    parent: 'game-container',
    backgroundColor: Colors.background,
    scene: [
        Boot,
        Preloader,
        SelectBear,
        Game,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 768,
        height: 1024
    }
};

const StartGame = (parent) => {

    return new Phaser.Game({ ...config, parent });

}

export default StartGame;
