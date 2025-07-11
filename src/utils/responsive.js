export function centerText(scene, y, text, style = {}) {
  const { width } = scene.scale;

  const txt = scene.add.text(width / 2, y, text, style);
  txt.setOrigin(0.5, 0);

  return txt;
}
