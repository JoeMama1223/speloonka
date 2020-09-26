import * as mu from './mutilz';
import * as bs from './bounds';

export default function Mover(play) {

  let section = play.section;

  const absCbox = p => {
    let cbox = p.cbox;
    return [
      p.x + cbox[0],
      p.y + cbox[1],
      cbox[2],
      cbox[3]];
  };

  const isSolid = this.isSolid = (p, ox, oy) => {
    let cbox = absCbox(p);
    return section
      .solidAt(cbox[0] + ox,
               cbox[1] + oy,
               cbox[2],
               cbox[3]);
  };

  this.clampX = (p) => {
    if (p.x < 0) {
      p.onEdgeX(p);
      p.x = 0;
    }
    if (p.x > bs.pxWorldSizeX) {
      p.onEdgeX(p);
      p.x = bs.pxWorldSizeX;
    }
  };

  this.moveX = (p) => {
    p.remx += p.dx;
    let amount = Math.floor(p.remx);
    p.remx -= amount;

    let step = Math.sign(amount);
    for (let i = 0; i < Math.abs(amount); i++) {
      if (!isSolid(p, step, 0)) {
        p.x += step;
      } else {
        p.dx = 0;
        break;
      }
    }
  };

  this.moveY = (p) => {
    p.remy += p.dy;
    let amount = Math.floor(p.remy);
    p.remy -= amount;

    let step = Math.sign(amount);
    for (let i = 0; i < Math.abs(amount); i++) {
      if (!isSolid(p, 0, step)) {
        p.y += step;
      } else {
        p.dy = 0;
        break;
      }
    }
  };
}
