import { AnimationController } from "./AnimationController";
import { ColorTween, Tween } from "./Tween";
const button1 = document.createElement("button");
const button2 = document.createElement("button");
const button3 = document.createElement("button");
const div = document.createElement("div");
const div2 = document.createElement("div");
div.style.backgroundColor = "red";
button1.textContent = "开始";
button2.textContent = "暂停";
button3.textContent = "反转";
document.body.append(button1, button2, button3, div, div2);

const ac = new AnimationController(1000);
const t1 = new Tween(30, 100).animate(ac).builder((value) => {
  div.style.width = `${value}px`;
  div.style.height = `50px`;
  div.style.backgroundColor = "red";
});

// {height: 100,},{height: 200,}
const t2 = new Tween(
  [100, new ColorTween("#200531")],
  [200, new ColorTween("#124618")]
)
  .animate(new AnimationController(3000))
  .builder((value) => {
    const [height, backgroundColor] = value;
    div2.style.width = `100px`;
    div2.style.height = `${height}px`;
    div2.style.backgroundColor = backgroundColor;
  });

t1.then(t2);

button1.addEventListener("click", () => ac.play());
button2.addEventListener("click", () => ac.paused());
button3.addEventListener("click", () => ac.reverse());
