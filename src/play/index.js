import Ground from './ground';
import Graph from './graph';



export default function Play(ctx) {

  let { g, e, a } = ctx;

  let particles;

  let scene;

  let timer = 0;
  let graph = new Graph(this, ctx);
  let ground = new Ground(this, ctx);

  //g.fill('#fff1e8');
  g.fill('#1d2b53');

  let stats = {};

  this.init = () => {
    scene = graph;
    graph.init();

    scene = ground;
    ground.init();
  };

  this.update = () => {
    scene.update();
  };

  this.draw = () => {
    scene.draw();
  };
  
}
