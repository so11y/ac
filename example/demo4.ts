import { AnimationController } from "../src/AnimationController";
import { Tween } from "../src/Tween";

export default () => {
  const div3 = document.querySelector("#div3")! as HTMLElement;
  const ac = new AnimationController(1000);
  new Tween(0, 1239599).animate(ac).builder((value) => {
    div3.textContent = Number(value.toFixed(0)).toLocaleString();
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
