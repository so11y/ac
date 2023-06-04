import { AnimationController } from "../src/AnimationController";
import { ColorTween } from "../src/Tween";
import { Keyframes, Keyframe } from "../src/Keyframes";

// new Keyframe({ translateY: 0 }),
// new Keyframe({ height: 100 }),
// new Keyframe({ width: 100 }),
// new Keyframe({ backgroundColor: new ColorTween("#7c29b0") }),
// new Keyframe({ translateX: 100 }),
// new Keyframe({ translateY: 100 }),

export default () => {
  const div3 = document.querySelector("#div3")! as HTMLElement;
  div3.style.width = "10px";
  div3.style.height = "10px";
  div3.style.background = "#303939";

  const ac = new AnimationController(3000);

  new Keyframes(div3, [
    new Keyframe({ translateX: 50 },{
      // easing:"bounceInOut"
    }),
    new Keyframe({ translateY: 50,
      // width: 50, height: 50
     }),
    new Keyframe({
      translateX: 0,
      // borderRadius: 20,
      // backgroundColor: new ColorTween("#7c29b0"),
    },{
        // easing:"bounceIn"
    }),
    // new Keyframe({ translateY: 0,
    //   //  width: 10, height: 10
    //   }),
  ])
    .animate(ac)
    .builder((source) => {
      // source.width && (div3.style.width = `${source.width}px `);
      // source.height && (div3.style.height = `${source.height}px `);
      div3.style.translate = `${source.translateX || 0}px ${
        source.translateY || 0
      }px`;
      // div3.style.borderRadius = `${source.borderRadius || 0}px`;
      // div3.style.backgroundColor = source.backgroundColor;
    });

  document
    .querySelector("#button1")!
    .addEventListener("click", () => ac.play());
  document
    .querySelector("#button2")!
    .addEventListener("click", () => ac.paused());
  document
    .querySelector("#button3")!
    .addEventListener("click", () => ac.reverse());
};
