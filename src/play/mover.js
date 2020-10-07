import * as mu from './mutilz';
import * as bs from './bounds';

export default function Mover(play) {

  let map = play.map;

  const absCbox = this.absCbox = p => {
    let cbox = p.cbox;
    return [
      p.x + cbox[0],
      p.y + cbox[1],
      cbox[2],
      cbox[3]];
  };

  const isSolid = this.isSolid = (p, ox, oy) => {
    let cbox = absCbox(p);
    return map()
      .solidAt(cbox[0] + ox,
               cbox[1] + oy,
               cbox[2],
               cbox[3]);
  };

  this.checkEdgeY = (p) => {
    let { minY, maxY } = map().targetRoom;
    let cbox = absCbox(p);

    if (cbox[1] < minY) {
      p.onEdgeY(p, minY - p.cbox[1]);
    }
    if (cbox[1]+cbox[3] > maxY) {
      p.onEdgeY(p, maxY - p.cbox[1] - p.cbox[3]);
    }
  };

  this.checkEdgeX = (p) => {
    let { minX, maxX } = map().targetRoom;
    let cbox = absCbox(p);

    if (cbox[0] < minX) {
      p.onEdgeX(p, minX - p.cbox[0]);
    }
    if (cbox[0] + cbox[2] > maxX) {
      p.onEdgeX(p, maxX - p.cbox[0] - p.cbox[2]);
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
