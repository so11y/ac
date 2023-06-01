import { AnimationController } from "./AnimationController";
import { ScrollTween } from "./ScrollTween";
import { ColorTween, Tween } from "./Tween";

const div1 = document.querySelector("#div1")! as HTMLElement;
const div2 = document.querySelector("#div2")! as HTMLElement;
const div3 = document.querySelector("#div3")! as HTMLElement;
const div4 = document.querySelector("#div4")! as HTMLElement;
const div5 = document.querySelector("#div5")! as HTMLElement;
const ac = new AnimationController(1000);
const t1 = new Tween(30, 100).animate(ac).builder((value) => {
  div1.style.width = `${value}px`;
  div1.style.height = `50px`;
  div1.style.backgroundColor = "red";
});

// {height: 100,},{height: 200,}
const t2 = new Tween(
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

new Tween(0, 1239599).animate(ac).builder((value) => {
  div3.textContent = Number(value.toFixed(0)).toLocaleString();
});

const s1 = ScrollTween.form(
  {
    x: -window.innerWidth * 1,
    color: new ColorTween("#7c29b0"),
  },
  {
    target: "#div4",
    duration: 1000,
    easing: "bounceOut",
  }
).builder((value) => {
  console.log(value.x);
  div4.style.translate = `${value.x}px 0px`;
  div4.style.color = value.color;
});

const s2 = ScrollTween.form(
  {
    x: window.innerWidth * 1,
    color: new ColorTween("#7c29b0"),
  },
  {
    target: "#div5",
    duration: 1000,
    easing: "bounceOut",
  }
).builder((value) => {
  console.log(value.x);
  div5.style.translate = `${value.x}px 0px`;
  div5.style.color = value.color;
});

s1.then(s2)

document.querySelector("#button1")!.addEventListener("click", () => ac.play());
document
  .querySelector("#button2")!
  .addEventListener("click", () => ac.paused());
document
  .querySelector("#button3")!
  .addEventListener("click", () => ac.reverse());
