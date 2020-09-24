export default function Graphics(canvas, sprites) {

  let ctx = canvas.ctx;

  let cameraX = 0,
      cameraY = 0;

  this.fill = (color) => {
    ctx.fillStyle = color;
  };

  this.strokeStyle = (color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
  };

  this.clear = () => {
    ctx.clearRect(0, 0, 320, 180);
  };

  this.fr = (x, y, w, h) => {
    x = Math.floor(x - cameraX);
    y = Math.floor(y - cameraY);
    w = Math.floor(w);
    h = Math.floor(h);
    
    ctx.fillRect(x, y, w, h);
  };

  this.points = (points, xscale = 1, yscale = 1, baseY = 90) => {
    if (points.length < 1) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(points[0][0] * xscale, baseY - points[0][1] * yscale);
    for (let i = 1; i< points.length; i++) {
      ctx.lineTo(points[i][0] * xscale, baseY - points[i][1] * yscale);
    }
    ctx.stroke();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  this.camera = (x = 0, y = 0) => {
    cameraX = x;
    cameraY = y;
  };

  this.sspr = (sx, sy, sw, sh, dx, dy, dw = sw, dh = sh, flipx = false) => {

    dx = Math.floor(dx - cameraX);
    dy = Math.floor(dy - cameraY);


    if (flipx) {

      ctx.scale(-1, 1);
      dx *= -1;
      dx -= dw;
    }

    ctx.drawImage(sprites, 
                  sx,
                  sy,
                  sw,
                  sh,
                  dx,
                  dy,
                  dw, 
                  dh);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  // let palette = [
  //   0x000000,
  //   0x1d2b53,
  //   0x7e2553,
  //   0x008751,
  //   0xab5236,
  //   0x5f574f,
  //   0xc2c3c7,
  //   0xfff1e8,
  //   0xff004d,
  //   0xffa300,
  //   0xffec27,
  //   0x00e436,
  //   0x29adff,
  //   0x83769c,
  //   0xff77a8,
  //   0xffccaa
  // ];

}
