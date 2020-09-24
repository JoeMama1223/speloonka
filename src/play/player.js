import * as types from './types';
import * as mu from './mutilz';
import BaseObject from './object';

import {
  v0Jump,
  gJump,
  hAccel,
  xFriction
} from './phy';

const JumpGraceTime = 4;
const DuckFriction = 0.1;
const MaxRun = 4;
const RunReduce = 0.3;
const RunAccel = 0.3;
const Gravity = 3;
const MaxFall = 4;
const FastMaxAccel = 0.2;
const JumpHBoost = 0.1;
const JumpSpeed = -10;
const LiftBoost = 0.3;

export default function Player(play, ctx) {

  let { e, g, a } = ctx;

  let cam = play.cam;

  let base = this.base = new BaseObject(this, play, ctx);
  let p = this.p = base.p;

  let pJump;
  let jBuffer;

  let jGrace;

  let wasGrounded;

  let isDead;

  let pdx,
      pdy;

  let landingTimer;

  let st = 0;
  let stOff = 0;

  const gFall = -gJump;
  
  let scalex,
      scaley;

  this.init = (x, y) => {
    base.init(x, y);

    isDead = false;

    scalex = 1;
    scaley = 1;

    landingTimer = 0;
    jGrace = 0;
    p.cbox = [2, 6, 10, 10];
  };

  this.canCollect = () => {
    return !isDead && wasGrounded;
  };

  this.wasGrounded = () => {
    wasGrounded = true;
  };

  const fLiftBoost = () => {
    
    return [0,0];

  };

  const killPlayer = () => {
    isDead = true;
    play.killPlayer(this);
  };

  this.update = () => {
    base.update();

    p.x = mu.clamp(p.x, 0, 512 - 16);

    let inputY = 0,
        inputX = 0,
        inputJ = 0;

    if (e.up) {
      inputY = -1;
    } else if (e.down) {
      inputY = 1;
    }
    if (e.left) {
      inputX = -1;
    } else if (e.right) {
      inputX = 1;
    }

    if (e.x) {
      inputJ = true && !pJump;
    }
    pJump = e.x;

    if (inputJ) {
      jBuffer = 8;
    } else if (jBuffer > 0) {
      jBuffer--;
    }

    let onGround = false;
    if (p.dy >= 0) {
      if (base.isSolid(0, 1)) {
        onGround = true;
      }
    }

    let maxDx = MaxRun;
    if (Math.abs(p.dx) > maxDx && Math.sign(p.dx) == inputX) {
      p.dx = mu.appr(p.dx, maxDx * inputX, RunReduce);
    } else {
      p.dx = mu.appr(p.dx, maxDx * inputX, RunAccel);
    }
    p.dx = mu.appr(p.dx, 0, DuckFriction);

    let maxFall = MaxFall;
    let mf = MaxFall;
    maxFall = mu.appr(maxFall, mf, FastMaxAccel);

    let maxDy = maxFall;
    p.dy = mu.appr(p.dy, maxDy, Gravity); 

    if (onGround) {
      jGrace = JumpGraceTime;
    } else if (jGrace > 0) {
      jGrace--;
    }

    if (jBuffer > 0) {
      if (jGrace > 0) {
      let liftBoost = fLiftBoost();
      p.dx += JumpHBoost * inputX;
      p.dy = JumpSpeed;
      p.dx += liftBoost[0];
      p.dy += liftBoost[1];
      }
    }


    cam.x = cam.x + (p.x - cam.x) * 0.1;
    cam.y = cam.y + (p.y - cam.y) * 0.1;
  };


  this.draw = () => {
    base.draw();
  };

}
