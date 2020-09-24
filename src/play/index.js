import Ground from './ground';
import Graph from './graph';
import Board from './board';
import Transition from './transition';
import EndGame from './endgame';
import Intro from './intro';
import Caves from './caves';

export default function Play(ctx) {

  let { g, e, a } = ctx;

  let particles;

  let scene;

  let timer = 0;
  let caves = new Caves(this, ctx);
  let transition = new Transition(this, ctx);
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
    timer++;

    transition.update();
    scene.update();
  };

  this.draw = () => {
    g.clear();

    scene.draw();
    transition.draw();
  };
  
}
