export function showGrid(scene){
  const graphics = scene.add.graphics();
  
  // Màu lưới thường và màu trục trung tâm
  const normalColor = Phaser.Display.Color.HexStringToColor('#d9d9d9').color;
  const centerColor = Phaser.Display.Color.HexStringToColor('#ff0000').color; // màu đỏ
  
  const width = 768;
  const height = 1024;
  const spacing = 10;
  
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);
  
  // Vẽ các đường dọc
  for (let x = 0; x <= width; x += spacing) {
    const isCenter = Math.abs(x - centerX) < spacing / 2;
    graphics.lineStyle(1, isCenter ? centerColor : normalColor);
    graphics.lineBetween(x, 0, x, height);
  }
  
  // Vẽ các đường ngang
  for (let y = 0; y <= height; y += spacing) {
    const isCenter = Math.abs(y - centerY) < spacing / 2;
    graphics.lineStyle(1, isCenter ? centerColor : normalColor);
    graphics.lineBetween(0, y, width, y);
  }
}