export function isMap(value){
  return Object.prototype.toString.call(value) === '[object Map]';
}
export function isPlainObject(value){
  return Object.prototype.toString.call(value) === '[object Object]';
}