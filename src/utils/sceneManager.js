export class SceneManager {
  constructor(scene) {
    this.scene = scene;
  }

  // Hàm chuyển cảnh với hiệu ứng fade out
  transitionWithFade(sceneName, data = {}, duration = 1000) {
    this.scene.cameras.main.fadeOut(duration, 0, 0, 0);

    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.scene.start(sceneName, data);
      this.scene.cameras.main.fadeIn(duration, 0, 0, 0); // fade in vào scene mới
    });
  }

  // Hàm chuyển cảnh với hiệu ứng fade và thời gian tùy chỉnh
  fadeAndStart(sceneName, data = {}, duration = 1000) {
    this.scene.cameras.main.fadeOut(duration, 0, 0, 0);

    this.scene.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.scene.start(sceneName, data);
    });
  }

  // Hàm chuyển cảnh theo chiều slide (giả lập)
  slideTransition(sceneName, data = {}, duration = 1000, direction = 'left') {
    // Giả lập hiệu ứng slide bằng tween
    const camera = this.scene.cameras.main;

    this.scene.tweens.add({
      targets: camera,
      x: direction === 'left' ? -camera.width : camera.width,
      duration: duration,
      onComplete: () => {
        this.scene.scene.start(sceneName, data);
        camera.x = 0; // Reset camera position
      },
    });
  }
}
