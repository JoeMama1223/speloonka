import * as mu from './mutilz';
import DMover from './dmover';

export default function Player(play, ctx) {

  let { g, e } = ctx;

  let dm = new DMover();
  let cam = play.cam;
  let mover = play.mover;

  let p = {
    tX: 0,
    tY: 0,
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    remx: 0,
    remy: 0,
    cbox: [-6,-6,12,12],
    sw: 12,
    sh: 12,
    jBuffer: 0,
    jGrace: 0,
    stateX: dm.fStandX,
    stateY: dm.fStandY,
    onEdgeX: (p) => {
      p.tX = 0;
      p.stateX = dm.fStandX;
    }
  };

  let pJump;
  let pChange;


  this.init = () => {
  };

  this.update = () => {
    let inputC = 0;

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

    if (e.c) {
      inputC = true && !pChange;
    }
    pChange = e.c;

    if (inputC) {
      mutateParams();
    }

    if (inputJ) {
      p.jBuffer = 8;
    } else if (p.jBuffer > 0) {
      p.jBuffer--;
    }

    p.inputX = inputX;
    p.inputY = inputY;
    p.inputJ = e.x;

    p.onGround = 
      mover.isSolid(p, 0, 1);

    if (p.onGround) {
      p.jGrace = 8;
    } else if (p.jGrace > 0) {
      p.jGrace--;
    }

    mover.clampX(p);
    mover.moveX(p);
    mover.moveY(p);

    p.stateX(p);
    p.stateY(p);

    p.sw = mu.lerp(p.sw, 12);
    p.sh = mu.lerp(p.sh, 12);

    p.flipx = p.dx < 0 ? true : p.dx == 0 ? p.flipx : false;


    cam.x = mu.lerp(cam.x, p.x);
    cam.y = mu.lerp(cam.y, p.y);

    

  };

  const colorMap = [
    '#29adff',
    '#ff004d',
    '#ff004d',
    '#fff1e8',
  ];

  this.draw = () => {
    g.fill(colorMap[p.si]);
    g.fr(p.x-p.sw/2,p.y-p.sh/2,p.sw,p.sh);

    // g.sspr(p.si * 24,0,24,24,p.x-5,p.y-8,24,24,p.flipx);
  };
  
}
