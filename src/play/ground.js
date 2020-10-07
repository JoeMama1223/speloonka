import * as mu from './mutilz';
import Section from './section';
import Factory from './factory';
import Mover from './mover';

import * as bs from './bounds';

export default function Ground(play, ctx) {

  let { g } = ctx;

  let section = new Section(ctx);
  let map = this.map = section.map;

  let transitionMap = -1;

  this.checkEdge = box => {
    let changeMapI = section.checkEdge(box);

    if (changeMapI !== -1) {
      section.map(changeMapI);
      return true;
    }
    return false;
  };

  let mover = new Mover(this);

  let factory = new Factory(this, ctx);
  let poolMap = factory.poolMap;

  let cam = {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  };

  this.section = section;
  this.mover = mover;
  this.cam = cam;

  let objects = [];

  function initObject(pool, x, y, arg) {
    let res = pool.acquire(_ => 
      _.init(x, y, arg));

    res._pool = pool;

    objects.push(res);

    return res;
  }

  function load_level(level) {
    initObject(poolMap[1], 10, 10);
  }


  this.init = () => {
    load_level(0);
  };

  this.update = () => {
    objects.forEach(_ => _.update());

    cam.x = mu.lerp(cam.x, cam.targetX);
    cam.y = mu.lerp(cam.y, cam.targetY);
  };

  this.draw = () => {

    let _map = map();

    let camx,
        camy;

    camx = mu.clamp(cam.x - bs.pxScreenSizeXHalf,
                    _map.targetRoom.minX,
                    _map.targetRoom.maxX - bs.pxScreenSizeX);

    camy = mu.clamp(cam.y - bs.pxScreenSizeYHalf,
                    _map.targetRoom.minY,
                    _map.targetRoom.maxY - bs.pxScreenSizeY);

    g.camera();
    g.fill('#1d2b53');
    g.fr(0,0,320,180);

    g.camera(camx,camy);

    _map.draw(camx,
              camy,
              bs.pxScreenSizeX,
              bs.pxScreenSizeY);

    objects.forEach(_ => _.draw());
  };
  
}
