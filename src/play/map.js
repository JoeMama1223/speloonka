import levels from './levels';
import sprites from './sprites';

export default function Map(ctx) {

  let { g } = ctx;

  let l = 0;

  this.level = _l => {
    l = _l;
  };

  this.fget = (x, y, f) => {
    let s = sprites[this.mget(x, y)];
    return s && (s[2] & f) === f;
  };

  this.mget = (x, y) => {
    return levels[l][y * 40 + x];
  };

  this.solidAt = (x, y, w, h, f = 1) => {
    for (let i = Math.max(0, Math.floor(x / 8));
         i <= Math.min(39, (x + w - 1) / 8); i++) {
      for (let j = Math.max(0, Math.floor(y / 8));
           j <= Math.min(31, (y + h - 1) / 8); j++) {
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
