import { AnimationController } from "../src/AnimationController";
import { Tween } from "../src/Tween";

export default () => {
  const div1 = document.querySelector("#div1")! as HTMLElement;
  const ac = new AnimationController(3000);

  new Tween(30, 500, {
    easing: "bounceOut",
  })
    .animate(ac)
    .builder((value) => {
      div1.style.width = `${value}px`;
      div1.style.height = `50px`;
      div1.style.backgroundColor = "red";
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
