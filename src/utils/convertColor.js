export function colorStringToHexNumber(colorStr) {
  if (typeof colorStr === 'string' && colorStr.startsWith('#')) {
    return parseInt(colorStr.slice(1), 16);
  }
  return colorStr; // Trả lại nguyên nếu đã là số
}
