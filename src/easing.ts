function linear(k: number) {
  return k;
}

function quadraticIn(k: number) {
  return k * k;
}

function quadraticOut(k: number) {
  return k * (2 - k);
}

function quadraticInOut(k: number) {
  if ((k *= 2) < 1) {
    return 0.5 * k * k;
  }
  return -0.5 * (--k * (k - 2) - 1);
}

function cubicIn(k: number) {
  return k * k * k;
}

function cubicOut(k: number) {
  return --k * k * k + 1;
}

function cubicInOut(k: number) {
  if ((k *= 2) < 1) {
    return 0.5 * k * k * k;
  }
  return 0.5 * ((k -= 2) * k * k + 2);
}

function quarticIn(k: number) {
  return k * k * k * k;
}

function quarticOut(k: number) {
  return 1 - k * k * k * k;
}

function quarticInOut(k: number) {
  if ((k *= 2) < 1) {
    return 0.5 * k * k * k * k;
  }

  return -0.5 * ((k -= 2) * k * k * k - 2);
}

function quinticIn(k: number) {
  return k * k * k * k * k;
}

function quinticOut(k: number) {
  return --k * k * k * k * k + 1;
}

function quinticInOut(k: number) {
  if ((k *= 2) < 1) {
    return 0.5 * k * k * k * k * k;
  }

  return 0.5 * ((k -= 2) * k * k * k * k + 2);
}

function exponentialIn(k: number) {
  return k === 0 ? 0 : Math.pow(1024, k - 1);
}

function exponentialOut(k: number) {
  return k === 1 ? 1 : 1 - Math.pow(2, -10 * k);
}

function elasticIn(k: number) {
  let s;
  let a = 0.1;
  let p = 0.4;
  if (k === 0) return 0;
  if (k === 1) return 1;
  if (!p) {
    p = 0.3;
  }
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(1 / a);
  }
  return -(
    a *
    Math.pow(2, 10 * (k -= 1)) *
    Math.sin(((k - s) * (2 * Math.PI)) / p)
  );
}

function elasticOut(k: number) {
  let s;
  let a = 0.1;
  let p = 0.4;
  if (k === 0) return 0;
  if (k === 1) return 1;
  if (!p) {
    p = 0.3;
  }
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(1 / a);
  }
  return a * Math.pow(2, -10 * k) * Math.sin(((k - s) * (2 * Math.PI)) / p) + 1;
}

function elasticInOut(k: number) {
  let s;
  let a = 0.1;
  let p = 0.4;
  if (k === 0) return 0;
  if (k === 1) return 1;
  if (!p) {
    p = 0.3;
  }
  if (!a || a < 1) {
    a = 1;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(1 / a);
  }
  if ((k *= 2) < 1) {
    return (
      -0.5 *
      (a * Math.pow(2, 10 * (k -= 1)) * Math.sin(((k - s) * (2 * Math.PI)) / p))
    );
  }
  return (
    a *
      Math.pow(2, -10 * (k -= 1)) *
      Math.sin(((k - s) * (2 * Math.PI)) / p) *
      0.5 +
    1
  );
}

function backIn(k: number) {
  const s = 1.70158;
  return k * k * ((s + 1) * k - s);
}

function backOut(k: number) {
  const s = 1.70158;
  return (k = k - 1) * k * ((s + 1) * k + s) + 1;
}

function backInOut(k: number) {
  const s = 1.70158 * 1.525;
  if ((k *= 2) < 1) {
    return 0.5 * (k * k * ((s + 1) * k - s));
  }
  return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
}

function bounceIn(k: number) {
  return 1 - bounceOut(1 - k);
}

function bounceOut(k: number) {
  if ((k /= 1) < 1 / 2.75) {
    return 7.5625 * k * k;
  } else if (k < 2 / 2.75) {
    return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;
  } else if (k < 2.5 / 2.75) {
    return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;
  }

  return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
}

function bounceInOut(k: number) {
  if (k < 0.5) {
    return bounceIn(k * 2) * 0.5;
  }
  return bounceOut(k * 2 - 1) * 0.5 + 0.5;
}

export {
  linear,
  quadraticIn,
  quadraticOut,
  quadraticInOut,
  cubicIn,
  cubicOut,
  cubicInOut,
  quarticIn,
  quarticOut,
  quarticInOut,
  elasticIn,
  elasticOut,
  elasticInOut,
  backIn,
  backOut,
  backInOut,
  bounceIn,
  bounceOut,
  bounceInOut,
  exponentialIn,
  exponentialOut,
  quinticIn,
  quinticOut,
  quinticInOut,
};
