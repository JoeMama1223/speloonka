export default function Assets(base, srcs) {
  function imageLoad(src, onLoad) {
    let img = new Image();
    img.onload = () => {
      onLoad(img);
    };
    img.src = base + '/' + src;
  };

  this.start = (onLoad) => {
    let i = 0;
    let res = {};

    const checkFinish = (src) => {
      i++;
      return img => {
        res[src] = img;

        if (--i === 0) {
          onLoad(res);
        }
      };
    };

    for (let src in srcs) {
      imageLoad(srcs[src], checkFinish(src));
    }
  };
}
