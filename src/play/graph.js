import * as mu from './mutilz';

export default function Graph(play, ctx) {

  let { g, e } = ctx;

  let xs = [],
      ys = [],
      dxs = [],
      dys = [];

  function fLinear(a, b) {
    return x => {
      return a*x + b;
    };
  }

  function fConstant(c) {
    return x => c;
  }

  function fSin(freq, amplitude) {
    return x => 
    Math.sin(x / 100 * freq * Math.PI * 2) * amplitude;
  }

  function fAccess(arr) {
    return x => arr[x];
  }

  let DecayD = -8,
      AttackD = 20,
      ReleaseD = -90,
      AttackT = 3,
      DecayT = 4,
      SustainT = 2,
      DDD = 10;

  function mutateParams() {
    AttackD = 10 + Math.floor(Math.random() * 20);
    ReleaseD = -10;
    SustainT = 2 + Math.random() * 2;
    DecayT = 4 + Math.random() * 2;
  }

  function pfRelease(p) {
    p.sRt++;

    p.dy = mu.appr(p.dy, ReleaseD, DDD);

    p.y += p.dy;
  }

  function pfSustain(p) {
    p.sSt++;


    if (p.sSt >= SustainT) {
      p.sRt = 0;
      p.state = pfRelease;
    }
  }

  function pfDecay(p) {
    p.sDt++;

    p.dy = mu.appr(p.dy, DecayD, DDD);

    p.y += p.dy;

    if (p.sDt >= DecayT) {
      p.sSt = 0;
      p.state = pfSustain;
    }
  }

  function pfAttack(p) {
    p.sAt++;

    p.dy = mu.appr(p.dy, AttackD, DDD);

    p.y += p.dy;

    if (p.sAt >= AttackT) {
      p.sDt = 0;
      p.state = pfDecay;
    }
  }

  function pfStand(p) {
    p.t++;

    if (p.t >= 2) {
      p.sAt = 0;
      p.state = pfAttack;
    }
  }

  function pfAttackX(p) {
    p.tX++;

    p.dx = mu.appr(p.dx, AttackD, DDD);

    p.x += p.dx;
  }

  function pfStillX(p) {
    p.tX++;

    if (p.tX >= 2) {
      p.tX = 0;
      p.stateX = pfAttackX;
    }
  }

  function simStats() {
    let stats = {
      x: [],
      y: [],
      dx: [],
      dy: []
    };

    let p = {
      tX: 0,
      t: 0,
      sAt: 0,
      sDt: 0,
      sSt: 0,
      sRt: 0,
      x: 40,
      y: 0,
      dx: 0,
      dy: 0,
      state: pfStand,
      stateX: pfStillX
    };

    for (let i = 0; i <= 100; i++) {

      p.state(p);
      p.stateX(p);

      if (p.x > 300) {
        p.x = 300;
        p.dx = 0;
      }

      if (p.y < -10) {
        p.y = -10;
        p.dy = 0;
      }

      stats.x.push(p.x);
      stats.y.push(p.y);
      stats.dx.push(p.dx);
      stats.dy.push(p.dy);
    }

    return stats;
  }

  function generate(ff) {
    let res = [];
    for (let i = 0; i <= 100; i++) {
      res.push([i, ff(i)]);
    }
    return res;
  }

  let drawT;

  this.init = () => {
    drawT = 0;

    let stats = simStats();
    xs = generate(fAccess(stats.x));
    ys = generate(fAccess(stats.y));
    dxs = generate(fAccess(stats.dx));
    dys = generate(fAccess(stats.dy));
  };

  let pJump,
      pChange;

  this.update = () => {
    let inputJ,
        inputC;

    if (e.x) {
      inputJ = true && !pJump;
    }
    pJump = e.x;
    if (e.c) {
      inputC = true && !pChange;
    }
    pChange = e.c;

    drawT++;
    drawT %= xs.length;

    if (inputC) {
      drawT = 0;
    }

    if (inputJ) {
      mutateParams();
      let stats = simStats();
      xs = generate(fAccess(stats.x));
      ys = generate(fAccess(stats.y));
      dxs = generate(fAccess(stats.dx));
      dys = generate(fAccess(stats.dy));
    }
  };

  this.draw = () => {
    g.strokeStyle('#1d2b53');
    g.points(xs, 3.2, 0.4);
    g.strokeStyle('#7e2553');
    g.points(ys, 3.2, 0.4, 160);
    g.strokeStyle('#008751');
    g.points(dxs, 3.2, 0.4);
    g.strokeStyle('#ab5236');
    g.points(dys, 3.2, 0.4);

    g.fr(xs[(drawT+1)%xs.length][1],160-ys[(drawT+1)%xs.length][1],10,10);
    g.fr(xs[(drawT+2)%xs.length][1],160-ys[(drawT+2)%xs.length][1],10,10);
    g.fr(xs[(drawT+3)%xs.length][1],160-ys[(drawT+3)%xs.length][1],10,10);
    g.fr(xs[drawT][1],160-ys[drawT][1],10,10);
  };
  
}
