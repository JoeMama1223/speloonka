import levels from './levels';
import sprites from './sprites';
import Map from './map';

let zero = levels[0];
let one = levels[1];

let _ls = [zero,zero,zero,zero];
let _bs = [
  [0, 0, 40, 32],
  [40, 0, 40, 32],
  [0, 64, 40, 32],
  [0, 96, 40, 32]
];

export default function Section(ctx) {

  let ls = _ls.map((_, i) => new Map(ctx, _, _bs[i]));

  let i = 0;
  this.map = (_i) => {
    if (_i || _i === 0) {
      i = _i;
    }
    return ls[i];
  };

  this.checkEdge = (box) => {
    let m = this.map();

    for (let j = 0; j < ls.length; j++) {
      if (i === j) continue;
      let m2 = ls[j];
      if (m.check(m2, box)) {
        return j;
      }
    }
    return -1;
  };

}
