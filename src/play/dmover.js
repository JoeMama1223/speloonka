import * as mu from './mutilz';

export default function DMover() {

  let DecayDX = 1,
      AttackDX = 2,
      SustainDX = 1.5,
      ReleaseDX = 1,
      DecayDY = 4,
      StandDY = 3,
      AttackDY = 6,
      ReleaseDY = 6,
      AttackT = 2,
      DecayT = 3,
      SustainT = 6,
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

    p.si = 3;

    if (p.tY >= ReleaseT) {
      p.tY = 0;
      p.stateY = fStandY;
    }
  }

  function fSustainY(p) {
    p.tY++;

    p.si = 3;

    if (p.tY >= SustainT || !p.inputJ) {
      p.tY = 0;
      p.stateY = fReleaseY;
    }
  }

  function fDecayY(p) {
    p.tY++;

    p.dy = mu.lerp(p.dy, -DecayDX, 1/DecayT);

    p.si = 3;

    if (p.tY >= DecayT) {
      p.tY = 0;
      p.stateY = fSustainY;
    }
  }

  function fAttackY(p) {
    p.tY++;

    p.dy = mu.lerp(p.dy, -AttackDY, 1/AttackT);

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

    p.dy = mu.lerp(p.dy, StandDY);

    p.si = 0;

    if (p.jBuffer > 0 && p.jGrace > 0) {
      p.tY = 0;
      p.stateY = fAttackY;
    }
  }

  function fSustainX(p) {
    p.tX++;

    p.dx = mu.lerp(p.dx, SustainDX * p.inputX);

    let reverse = Math.sign(p.inputX) !== Math.sign(p.dx);

    if (reverse) {
      p.tX = 0;
      p.stateX = fStandX;
    }
  }

  function fDecayX(p) {
    p.tX++;

    p.dx = mu.lerp(p.dx, DecayDX * p.inputX, 1/DecayT);
    
    if (p.tX >= DecayT) {
      p.tX = 0;
      p.stateX = fSustainX;
    }
  }

  function fAttackX(p) {
    p.tX++;

    p.dx = mu.lerp(p.dx, AttackDX * p.inputX, 1/AttackT);

    if (p.tX >= AttackT) {
      p.tX = 0;
      p.stateX = fDecayX;
    }
  }

  function fStandX(p) {

    p.tX++;

    p.dx = mu.lerp(p.dx, 0, 0.2);
    
    if (p.inputX !== 0) {
      p.tX = 0;
      p.stateX = fAttackX;
    }
  }


  this.fStandX = fStandX;
  this.fAttackX = fAttackX;
  this.fDecayX = fDecayX;
  this.fSustainX = fSustainX;

  this.fStandY = fStandY;
  this.fAttackY = fAttackY;
  this.fDecayY = fDecayY;
  this.fSustainY = fSustainY;
  this.fReleaseY = fReleaseY;

}
