function calculateZ() {
  const mean = parseFloat(document.getElementById("mean").value);
  const std = parseFloat(document.getElementById("std").value);
  const value = parseFloat(document.getElementById("value").value);

  if (isNaN(mean) || isNaN(std) || isNaN(value)) {
    document.getElementById("result").innerText = "Please fill all fields.";
    return;
  }

  if (std === 0) {
    document.getElementById("result").innerText = "Standard deviation cannot be 0.";
    return;
  }

  const z = (value - mean) / std;

  document.getElementById("result").innerText = "Z-score: " + z.toFixed(4);
}

function parseGroup(id) {
  return document.getElementById(id).value
    .split(",")
    .map(x => parseFloat(x.trim()))
    .filter(x => !isNaN(x));
}

function mean(arr) {
  return arr.reduce((a,b) => a + b, 0) / arr.length;
}

function variance(arr, m) {
  return arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0);
}

function runANOVA() {
  const g1 = parseGroup("g1");
  const g2 = parseGroup("g2");
  const g3 = parseGroup("g3");

  const groups = [g1, g2, g3];

  // overall mean
  const all = groups.flat();
  const grandMean = mean(all);

  // between-group variation
  let ssBetween = 0;
  let ssWithin = 0;
  let totalN = 0;

  groups.forEach(g => {
    const m = mean(g);
    ssBetween += g.length * Math.pow(m - grandMean, 2);
    ssWithin += variance(g, m);
    totalN += g.length;
  });

  const dfBetween = groups.length - 1;
  const dfWithin = totalN - groups.length;

  const msBetween = ssBetween / dfBetween;
  const msWithin = ssWithin / dfWithin;

  const F = msBetween / msWithin;

  document.getElementById("result").innerText =
    "F-statistic: " + F.toFixed(4);
}
