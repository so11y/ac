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

  const ac = new AnimationController(2000);

  new Keyframes(div3, [
    new Keyframe({ width: 100 }),
    new Keyframe({
      height: 100,
      // width: 50, height: 50
    }),
    // new Keyframe({
    //   width: 10,
    // }),
  ])
    .animate(ac)
    .builder((source) => {
      source.width && (div3.style.width = `${source.width}px `);
      source.height && (div3.style.height = `${source.height}px `);
      // div3.style.translate = `${source.translateX || 0}px ${
      //   source.translateY || 0
      // }px`;
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
  document
    .querySelector("#button4")!
    .addEventListener("click", () => ac.reStart());
};
