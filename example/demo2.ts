import { AnimationController } from "../src/AnimationController";
import { ColorTween, Tween } from "../src/Tween";

export default () => {
  const div1 = document.querySelector("#div1")! as HTMLElement;
  const div2 = document.querySelector("#div2")! as HTMLElement;
  const ac = new AnimationController(1000);
  new Tween(30, 100).animate(ac).builder((value) => {
    div1.style.width = `${value}px`;
    div1.style.height = `50px`;
    div1.style.backgroundColor = "red";
  });
  new Tween(
    [100, new ColorTween("#200531"), 0],
    [200, new ColorTween("#124618"), 60]
  )
    // .animate(ac)  然后把下面的 t1.then(t2); 删掉 可以一个控制器控制多个动画
    // .animate(new AnimationController(3000))
    .animate(ac)
    .builder((value) => {
      const [height, backgroundColor, marginLeft] = value;
      div2.style.width = `100px`;
      div2.style.height = `${height}px`;
      div2.style.marginLeft = `${marginLeft}px`;
      div2.style.backgroundColor = backgroundColor;
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
