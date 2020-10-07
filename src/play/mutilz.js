export const maybe = (max) => {
  return Math.random() < max;
};

export const rndInt = (max) => {
  return Math.floor(Math.random() * max);
};

export const between = (min, max) => {
  return min + rndInt(max - min);
};

export const lerp = (value, target, factor = 0.1) =>{
  return value + (target - value) * factor;
};

export const appr = (value, target, accel) => {
  if (value < target) {
    return Math.min(value + accel, target);
  } else if (value > target) {
    return Math.max(value - accel, target);
  }
  return target;
};

export const clamp = (value, min, max) => {
  return value < min ? min : 
    value > max ? max : 
    value;
};

export const boxIntersects = (a, b) => {
  return a[0] + a[2] > b[0] &&
    a[1] + a[3] > b[1] &&
    a[0] < b[0] + b[2] &&
    a[1] < b[1] + b[3];
};

export const boxIntersectRatio = (a, b) => {

  let xa1 = a[0],
      xa2 = a[0]+a[2],
      ya1 = a[1],
      ya2 = a[1]+a[3],
      xb1 = b[0],
      xb2 = b[0]+b[2],
      yb1 = b[1],
      yb2 = b[1]+b[3];

  let sa = a[2]*a[3];

  let si = Math.max(0,
                    Math.min(xa2, xb2) -
                    Math.max(xa1, xb1))*
      Math.max(0, Math.min(ya2, yb2)-
               Math.max(ya1, yb1));

  return si / sa;
};
