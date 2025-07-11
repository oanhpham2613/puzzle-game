// 1. Fade in
export function fadeIn(scene, target, duration = 500, delay = 0) {
  return scene.tweens.add({
    targets: target,
    alpha: 1,
    duration,
    delay,
    ease: 'Power2'
  });
}

// 2. Fade out
export function fadeOut(scene, target, duration = 500, delay = 0) {
  return scene.tweens.add({
    targets: target,
    alpha: 0,
    duration,
    delay,
    ease: 'Power2'
  });
}

// 3. Scale in (zoom từ nhỏ)
export function scaleIn(scene, target, duration = 500, delay = 0, fromScale = 0) {
  target.setScale(fromScale);
  return scene.tweens.add({
    targets: target,
    scale: 1,
    duration,
    delay,
    ease: 'Back.Out'
  });
}

// 4. Scale out (thu nhỏ biến mất)
export function scaleOut(scene, target, duration = 500, delay = 0) {
  return scene.tweens.add({
    targets: target,
    scale: 0,
    duration,
    delay,
    ease: 'Back.In'
  });
}

// 5. Bounce (nảy lên và xuống)
export function bounce(scene, target, bounceHeight = 30, duration = 400) {
  return scene.tweens.add({
    targets: target,
    y: `-=${bounceHeight}`,
    yoyo: true,
    repeat: 1,
    ease: 'Sine.easeInOut',
    duration
  });
}

// 6. Shake (rung nhẹ)
export function shake(scene, target, strength = 5, repeat = 3, duration = 80) {
  console.log({ "shake": scene.tweens });
  return scene.tweens.add({
    targets: target,
    x: `+=${strength}`,
    yoyo: true,
    repeat,
    duration,
    ease: 'Sine.easeInOut'
  });
}

// 7. Flash (nhấp nháy nhanh)
export function flash(scene, target, repeat = 2, duration = 100) {
  return scene.tweens.add({
    targets: target,
    alpha: 0,
    yoyo: true,
    repeat,
    duration
  });
}

// 8. Move to (dịch đến vị trí mới)
export function moveTo(scene, target, x, y, duration = 500, ease = 'Power2') {
  return scene.tweens.add({
    targets: target,
    x,
    y,
    duration,
    ease
  });
}

// 9. Float (lên xuống nhẹ – lặp vô hạn)
export function floatLoop(scene, target, range = 10, duration = 1000) {
  return scene.tweens.add({
    targets: target,
    y: target.y - range,
    yoyo: true,
    repeat: -1,
    ease: 'Sine.easeInOut',
    duration
  });
}

// 10. Appear & fade (hiện ra – chờ – biến mất)
export function appearAndFade(scene, target, duration = 800, stay = 500) {
  return scene.tweens.add.timeline({
    targets: target,
    tweens: [
      { alpha: 1, duration: duration },
      { alpha: 1, duration: stay },
      { alpha: 0, duration: duration }
    ]
  });
}

export function animateCloud(scene, target) {
  return scene.tweens.chain({
    targets: target,
    tweens: [
      {
        x: target.x + 30,
        duration: 3000,
        ease: 'Sine.easeInOut'
      },
      {
        x: target.x - 30,
        duration: 3000,
        ease: 'Sine.easeInOut'
      }
    ],
    loop: -1,
    yoyo: true,
    paused: false
  });
}

export function animateSpin(scene, target) {
  return scene.tweens.add({
    targets: target,
    angle: 360,  
    duration: 1000, 
    ease: 'Sine.easeOut',
    repeat: -1, 
    repeatDelay: 1000
  });
}


