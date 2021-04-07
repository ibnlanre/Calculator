const space = document.getElementById("space");
const floor = document.getElementById("floor");
const sym = document.getElementById("sym");

function insert(value) {
  if (floor.innerText == "0") floor.innerText = value;
  else floor.innerText += value;
}

const change = (fn) => {
  switch (fn) {
    case "^2":
      return "**2";
    case "÷":
      return "/";
    case "×":
      return "*";
    case "+":
      return "+";
    case "-":
      return "-";
    default:
      return "";
  }
};

function trunc(decimal, n = 8) {
  let x = decimal + "";
  return x.lastIndexOf(".") >= 0
    ? parseFloat(x.substr(0, x.lastIndexOf(".") + (n + 1)))
    : decimal;
}

function sign(fn, use) {
  const last = space.innerText;
  const factor = sym.innerText;
  const next = floor.innerText;

  const check = () => {
    switch (fn) {
      case "1/x": {
        const err = "Cannot divide by 0";
        return [`1/(${next})`, err];
      }
      case "%":
        return [`(${next})/100`];
      case "√":
        return [`√(${next})`];
      case "±": {
        const _ = next.startsWith("-");
        return [_ ? next.slice(1) : "-" + next];
      }
    }
  };

  const noUse = (cond = false) => {
    if (cond) {
      if (fn == "=") {
        space.innerText = sym.innerText = "";
        floor.innerText = last;
      } else {
        space.innerText = next;
        floor.innerText = 0;
        sym.innerText = fn;
      }
    } else {
      if (last && factor) {
        space.innerText = trunc(eval(last + change(factor) + next));
      } else {
        space.innerText += next;
      }
      floor.innerText = 0;
      sym.innerText = fn;
    }
  };

  try {
    if (!use) {
      if (factor == "=") noUse(true);
      else if (floor.innerText || fn == "=") noUse();
    } else {
      let [value, err] = check();
      if ((fn = "±")) {
        floor.innerText = value;
      } else {
        space.innerText =
          factor && factor !== "=" ? last + change(factor) + value : value;
        floor.innerText = !+next
          ? err || 0
          : trunc(eval(value.replace("√", "Math.sqrt")));
        sym.innerText = "=";
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function cls(all = false) {
  if (all) {
    const disp = [space, floor, sym];
    disp.forEach((e) => {
      e.innerText = "";
    });
  } else floor.innerText = floor.innerText.slice(0, -1);
  if (!floor.innerText) floor.innerText = 0;
}
