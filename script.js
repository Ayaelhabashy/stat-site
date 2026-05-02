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
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function variance(arr, m) {
  return arr.reduce((sum, x) => sum + Math.pow(x - m, 2), 0);
}

function runANOVA() {

  const groups = [
    parseGroup("g1"),
    parseGroup("g2"),
    parseGroup("g3")
  ];

  const all = groups.flat();
  const grandMean = mean(all);

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

  // 🔥 p-value (F distribution)
  const pValue = 1 - jStat.centralF.cdf(F, dfBetween, dfWithin);

 const ssTotal = ssBetween + ssWithin;
const dfTotal = dfBetween + dfWithin;

document.getElementById("result").innerHTML = `
  <h3>ANOVA Table</h3>

  <table border="1" style="margin:auto; border-collapse: collapse;">
    <tr>
      <th>Source</th>
      <th>SS</th>
      <th>df</th>
      <th>MS</th>
      <th>F</th>
      <th>p-value</th>
    </tr>

    <tr>
      <td>Between</td>
      <td>${ssBetween.toFixed(4)}</td>
      <td>${dfBetween}</td>
      <td>${msBetween.toFixed(4)}</td>
      <td>${F.toFixed(4)}</td>
      <td>${pValue.toFixed(6)}</td>
    </tr>

    <tr>
      <td>Within</td>
      <td>${ssWithin.toFixed(4)}</td>
      <td>${dfWithin}</td>
      <td>${msWithin.toFixed(4)}</td>
      <td>-</td>
      <td>-</td>
    </tr>

    <tr>
      <td>Total</td>
      <td>${ssTotal.toFixed(4)}</td>
      <td>${dfTotal}</td>
      <td>-</td>
      <td>-</td>
      <td>-</td>
    </tr>
  </table>
`;
