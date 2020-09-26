import * as mu from './mutilz';
import levels from './levels';
import sprites from './sprites';
import Map from './map';

let zero = levels[0];

let _section = [
  zero, [0, 32, 40, 32],
  zero, [0, 32, 40, 32],
  zero, [0, 64, 40, 32],
  zero, [0, 96, 40, 32]
];

export default function Section(ctx) {

  let section = _section.map((_, i) => {
    return i % 2 == 0 ? new Map(_) : _;
  });

  let { g } = ctx;

  let mapInBounds = (x, y) => {
    let pbox = [x, y, 8, 8];
    for (let i = 0; i < 4; i++) {
      let map = section[i * 2],
          cbox = section[i * 2 + 1];

      if (mu.boxIntersects(cbox, pbox)) {
        return map;
      }
    }
    return null;
  };

  this.mget = (x, y) => {
    let map = mapInBounds(x, y);
    return map && map.mget(x, y);
  };

  this.fget = (x, y, f) => {
    let s = sprites[this.mget(x, y)];
    return s && (s[2] & f) === f;
  };

  this.solidAt = (x, y, w, h, f = 1) => {
    for (let i = Math.max(0, Math.floor(x / 8));
         i <= Math.min(40 * 4 - 1, (x + w - 1) / 8); i++) {
      for (let j = Math.max(0, Math.floor(y / 8));
           j <= Math.min(32 * 4 - 1, (y + h - 1) / 8); j++) {
        if (this.fget(i, j, f)) {
          return true;
        }
      }
    }
    return false;
  };

  this.draw = (x, y, w, h, f = 1) => {
    g.fill('#008751');
    g.strokeStyle('#00e436', 2);

    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        let s = this.mget(x + i, y + j);
        if (s === undefined) continue;
        if (this.fget(x + i, y + j, f)) {
          s = sprites[s];
          if (!s) continue;
          g.fr((x+i)*8,
          (y+j)*8,8,8);

          g.strokeRect((x+i)*8+1,
                       (y+j)*8+1,6,6);
        }
      }
    }    
  };  
}
