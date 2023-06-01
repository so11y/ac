import { ColorTween } from "../src/Tween";
import { ScrollTween } from "../src/ScrollTween";

export default () => {
  const div4 = document.querySelector("#div4")! as HTMLElement;
  const div5 = document.querySelector("#div5")! as HTMLElement;
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
    div5.style.translate = `${value.x}px 0px`;
    div5.style.color = value.color;
  });

  s1.then(s2);
};
