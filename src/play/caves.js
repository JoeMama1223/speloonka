import * as mu from './mutilz';
import Pool from './pool';
import * as types from './types';
import Map from './map';

let pxTileSize = 16;
let nbTiles = 32;
let pxWorldSize = pxTileSize * nbTiles;
let pxScreenSizeX = 320;
let pxScreenSizeY = 180;
let nbTilesInScreenX = pxScreenSizeX / pxTileSize;
let nbTilesInScreenY = pxScreenSizeY / pxTileSize;

export default function Caves(play, ctx) {

  let { g, e } = ctx;

  let map = this.map = new Map(g);

  let objects = [];

  let pPlayer = new Pool(() =>{
    return new types.Player(this, ctx);
  });

  const poolMap = {
    0: pPlayer
  };

  function checkObject(obj, type, x, y) {
    return collideObject(obj, type, x, y) !== null;
  }

  function collideObject(obj, type, x, y) {
    let cbox = obj.base.absCbox();
    cbox[0] += x;
    cbox[1] += y;

    for (let other of objects) {
      if (other !== null && 
          other instanceof type &&
          other !== obj &&
          other.p.collideable) {
        
        let cbox2 = other.base.absCbox();

        if (mu.boxIntersects(cbox, cbox2)) {
          return other;
        }
      }
    }
    return null;
  }

  function smoke(x, y) {
    // initObject(pSplash, x, y, 1);
  }

  this.killPlayer = p => {
    return;
    for (let i = 0; i < 4; i++) {
      initObject(pSplash, p.p.x, p.p.y);
    }

    a.sfx(4);
    bgatm.off();
    destroyObject(p);
    initDelay = 30;
    shake();
    play.die();
  };

  this.smoke = smoke;
  this.checkObject = checkObject;
  this.collideObject = collideObject;

  let cam = this.cam = {
    x: 0,
    y: 0,
    shake: 0,
    shakex: 0,
    shakey: 0,
    viewoffy: 0,
  };

  let t = 0;

  function initCamera() {
    cam.shake = 0;
    cam.shakex = 0;
    cam.shakey = 0;
  }

  function initObject(pool, x, y, arg) {
    let res = pool.acquire(_ => 
      _.init(x, y, arg));

    res._pool = pool;

    objects.push(res);
    return res;
  }

  function destroyObject(obj) {
    obj._pool.release(obj);
    objects.splice(objects.indexOf(obj), 1);
  };

  this.init = (level) => {

    map.level(level);

    for (let obj of objects) {
      obj._pool.release(obj);
    }

    objects = [];


    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        let s = map.mget(i, j);
        if (poolMap[s]) {
          initObject(poolMap[s], i * 16, j * 16);
        }
      }
    }

  };

  this.update = () => {
    for (let obj of objects) {
      obj.update();
    }

  };


  this.draw = () => {
    let camx = mu.clamp(cam.x - 160, 
                        0,
                        pxWorldSize - pxScreenSizeX),
        camy = mu.clamp(cam.y + cam.viewoffy - 90,
                        0,
                        pxWorldSize - pxScreenSizeY);

    g.camera(camx + cam.shakex, camy + cam.shakey);

    map.draw(Math.floor(camx / 16),
             Math.floor(camy / 16),
             nbTilesInScreenX + 1, 
             nbTilesInScreenY + 1);

    for (let obj of objects) {
      obj.draw();
    }
  };
  
}
