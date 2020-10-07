import sprites from './sprites';
import * as bs from './bounds';
import * as mu from './mutilz';

export default function Map(ctx, level, mb) {

  let { g } = ctx;

  this.mb = mb;
  this.targetRoom = {
    minX: mb[0] * bs.pxTileSize,
    maxX: (mb[0] + mb[2]) * bs.pxTileSize,
    minY: mb[1] * bs.pxTileSize,
    maxY: (mb[1] + mb[3]) * bs.pxTileSize
  };

  this.check = (m2, box) => {
    box = box.map(_ => _/=8);
    let r1 = mu.boxIntersectRatio(mb, box),
        r2 = mu.boxIntersectRatio(m2.mb, box);

    return r1 < r2;
  };

  this.fget = (x, y, f) => {
    let s = sprites[this.mget(x, y)];
    return s && (s[2] & f) === f;
  };

  this.mget = (x, y) => {
    x -= mb[0];
    y -= mb[1];
    return level[y * 40 + x];
  };

  this.solidAt = (x, y, w, h, f = 1) => {
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (this.fget
            (Math.floor((x + i) / 8), 
             Math.floor((y + j) / 8), f)) {
          return true;
        }
      }
    }
    return false;
  };

  this.draw = (x, y, w, h, f = 1) => {

    x = Math.floor(x/8);
    y = Math.floor(y/8);
    w = Math.ceil(w/8);
    h = Math.ceil(h/8);

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
