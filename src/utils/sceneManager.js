export class SceneManager {
  constructor(scene) {
    this.scene = scene;
  }

  transitionWithFade(sceneName, data = {}, duration = 1000, callback = () => { }) {
    callback();
    this.scene.cameras.main.fadeOut(duration, 0, 0, 0);

    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.scene.start(sceneName, data);
      this.scene.cameras.main.fadeIn(duration, 0, 0, 0);
    });
  }

  fadeAndStart(sceneName, data = {}, duration = 1000, callback = () => { }) {
    callback();

    this.scene.cameras.main.fadeOut(duration, 0, 0, 0);

    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.scene.start(sceneName, data);
    });
  }
}
