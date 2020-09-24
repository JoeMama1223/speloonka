import * as mu from './mutilz';

let DecayDX = 2,
    AttackDX = 3,
    ReleaseDX = 2,
    DecayDY = 4,
    AttackDY = 6,
    ReleaseDY = 6,
    AttackT = 8,
    DecayT = 4,
    SustainT = 8,
    ReleaseT = 6;

function mutateParams() {
  DecayDY = mu.between(6, 16);
  ReleaseDY = mu.between(1, 4);
  AttackDY = mu.between(6, 12);
  console.log(`AttackDY: ${AttackDY}`);
}

function fReleaseY(p) {
  p.tY++;

  p.dy = mu.lerp(p.dy, ReleaseDY, 1/ReleaseT);

  p.y += p.dy;

  p.si = 3;

  if (p.tY >= ReleaseT) {
    p.tY = 0;
    p.stateY = fStandY;
  }
}

function fSustainY(p) {
  p.tY++;

  p.y += p.dy;

  p.si = 3;

  if (p.tY >= SustainT || !p.inputJ) {
    p.tY = 0;
    p.stateY = fReleaseY;
  }
}

function fDecayY(p) {
  p.tY++;

  p.dy = mu.lerp(p.dy, -DecayDX, 1/DecayT);

  p.y += p.dy;

  p.si = 3;

  if (p.tY >= DecayT) {
    p.tY = 0;
    p.stateY = fSustainY;
  }
}

function fAttackY(p) {
  p.tY++;

  p.dy = mu.lerp(p.dy, -AttackDY, 1/AttackT);

  p.y += p.dy;

  p.sw *= 0.8;
  p.sh *= 1.04;

  p.si = 1 + Math.floor(p.tY / AttackT);

  if (!p.inputJ) {
    p.tY = 0;
    p.stateY = fReleaseY;
  }
  
  if (p.tY >= AttackT) {
    p.tY = 0;
    p.stateY = fDecayY;
  }
}

function fStandY(p) {

  p.tY++;

  p.dy = mu.lerp(p.dy, AttackDY);

  p.y += p.dy;

  p.si = 0;

  if (p.jBuffer > 0 && p.jGrace > 0) {
    p.tY = 0;
    p.stateY = fAttackY;
  }
}

function fSustainX(p) {
  p.tX++;

  p.x += p.dx;

  let reverse = Math.sign(p.inputX) !== Math.sign(p.dx);

  if (p.tX >= SustainT || reverse) {
    p.tX = 0;
    p.stateX = fStandX;
  }
}

function fDecayX(p) {
  p.tX++;

  p.dx = mu.lerp(p.dx, DecayDX * p.inputX, 1/DecayT);

  p.x += p.dx;
 
  if (p.tX >= DecayT) {
    p.tX = 0;
    p.stateX = fSustainX;
  }
}

function fAttackX(p) {
  p.tX++;

  p.dx = mu.lerp(p.dx, AttackDX * p.inputX, 1/AttackT);

  p.x += p.dx;

  if (p.tX >= AttackT) {
    p.tX = 0;
    p.stateX = fDecayX;
  }
}

function fStandX(p) {

  p.tX++;

  p.dx = mu.lerp(p.dx, 0, 0.2);

  p.x += p.dx;

  
  if (p.inputX !== 0) {
    p.tX = 0;
    p.stateX = fAttackX;
  }
}

export default function Ground(play, ctx) {

  let { g, e } = ctx;

  let p = {
    tX: 0,
    tY: 0,
    x: 0,
    y: 170,
    dx: 0,
    dy: 0,
    sw: 16,
    sh: 16,
    jBuffer: 0,
    jGrace: 0,
    stateX: fStandX,
    stateY: fStandY,
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

    if (p.onGround) {
      p.jGrace = 8;
    } else if (p.jGrace > 0) {
      p.jGrace--;
    }

    p.stateX(p);
    p.stateY(p);

    p.sw = mu.lerp(p.sw, 16);
    p.sh = mu.lerp(p.sh, 16);

    p.flipx = p.dx < 0 ? true : p.dx == 0 ? p.flipx : false;

    if (p.x < 0) {
      p.x = 0;
      p.dx = 0;
      p.stateX = fStandX;
    }
    if (p.x > 304) {
      p.x = 304;
      p.dx = 0;
      p.stateX = fStandX;
    }

    if (p.y < 0) {
      p.y = 0;
      p.dy = 0;
    }
    if (p.y > 164) {
      p.onGround = true;
      p.y = 164;
      p.dy = 0;
    } else {
      p.onGround = false;
    }

  };

  const colorMap = [
    '#29adff',
    '#ff004d',
    '#ff004d',
    '#fff1e8',
  ];

  this.draw = () => {
    g.fill('#1d2b53');
    g.fr(0,0,320,180);

    g.fill(colorMap[p.si]);
    g.fr(p.x-p.sw/2,p.y-p.sh/2,p.sw,p.sh);

    // g.sspr(p.si * 24,0,24,24,p.x-5,p.y-8,24,24,p.flipx);
  };
  
}
