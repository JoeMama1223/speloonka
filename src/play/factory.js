import * as types from './types';
import Pool from './pool';

export default function Factory(play, ctx) {

  let pPlayer = new Pool(() => {
    return new types.Player(play, ctx);
  });

  this.poolMap = {
    1: pPlayer
  };
}
