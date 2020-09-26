import * as mu from './mutilz';
import Section from './section';
import Factory from './factory';
import Mover from './mover';
import * as bs from './bounds';

export default function Ground(play, ctx) {

  let { g } = ctx;

  let section = new Section(ctx);
  this.section = section;

  let mover = new Mover(this);
  this.mover = mover;

  let factory = new Factory(this, ctx);
  let poolMap = factory.poolMap;

  let cam = {
    x: 0,
    y: 0
  };
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
    initObject(poolMap[1], 0, 0);
  }


  this.init = () => {
    load_level(0);
  };

  this.update = () => {
    objects.forEach(_ => _.update());
  };

  this.draw = () => {

    let camx = mu.clamp(cam.x - 160,
                        0, bs.pxWorldSizeX - bs.pxScreenSizeX);

    let camy = mu.clamp(cam.y - 90,
                        0, bs.pxWorldSizeY - bs.pxScreenSizeY);

    g.camera();
    g.fill('#1d2b53');
    g.fr(0,0,320,180);

    g.camera(camx,camy);

    section.draw(Math.floor(camx/8), Math.floor(camy/8), 41, 32);

    objects.forEach(_ => _.draw());
  };
  
}
