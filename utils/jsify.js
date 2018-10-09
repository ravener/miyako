function array(num, end) {
  const res = [];
  for(; num <= end; num++) res.push(num);
  return res;
}

const transformers = {
  arrowFn: (a, b) => `((${a}) => ${b}())`,
  fn: (a) => `(${a})`,
  dot: (a) => `.${a}`,
  arrowFnArg: (a, b, c) => `((${a}) => ${b}(${c}))`,
  ternary: (a, b, c) => `(${a} ? ${b}() : ${c}())`
};

function recurse(fn, filter) {
  const val = fn();
  if(!filter(val)) return recurse(fn, filter);
  return val;
}

function finalize(arr) {
  if(!arr.length) return [];
  // .prop on empty context makes no sense
  if(arr[0].startsWith(".")) arr[0] = arr[0].slice(1);
  // Terminate the expression
  arr.push(";");
  return arr;
}

const random = a => a[~~(Math.random() * a.length)];

function jsify(str) {
  const arr = str.split(" ");
  const res = [];
  const dieIndexes = [];
  for(let x = 0; x < arr.length; x++) {
    if(dieIndexes.includes(x)) continue;
    const w = recurse(() => transformers[random(Object.keys(transformers))], (fn) => fn.length > arr.slice(x).length ? false : true);
    const e = arr[x];
    if(w.length >= 2) dieIndexes.push(...array(x, x + w.length - 1));
    res.push(w(e, arr[x + 1], arr[x + 2]));
  }
  return finalize(res).join("");
}

module.exports = jsify;
