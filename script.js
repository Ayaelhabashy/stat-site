// ===============================
// Z-SCORE
// ===============================
function calculateZ() {
  const meanVal = parseFloat(document.getElementById("mean").value);
  const std = parseFloat(document.getElementById("std").value);
  const value = parseFloat(document.getElementById("value").value);

  if (isNaN(meanVal) || isNaN(std) || isNaN(value)) {
    document.getElementById("result").innerText = "Please fill all fields.";
    return;
  }

  if (std === 0) {
    document.getElementById("result").innerText = "Standard deviation cannot be 0.";
    return;
  }

  const z = (value - meanVal) / std;
  document.getElementById("result").innerText = "Z-score: " + z.toFixed(4);
}

// ===============================
// HELPERS (ONLY ONCE, GLOBAL)
// ===============================
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

// ===============================
// ANOVA
// ===============================
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
}

// ===============================
// INDEPENDENT T-TEST
// ===============================
function runIndependentT() {

  const g1 = parseGroup("g1");
  const g2 = parseGroup("g2");

  const n1 = g1.length;
  const n2 = g2.length;

  const m1 = mean(g1);
  const m2 = mean(g2);

  const v1 = variance(g1, m1) / (n1 - 1);
  const v2 = variance(g2, m2) / (n2 - 1);

  const t = (m1 - m2) / Math.sqrt(v1/n1 + v2/n2);

  const df = Math.pow(v1/n1 + v2/n2, 2) /
    ((Math.pow(v1/n1,2)/(n1-1)) + (Math.pow(v2/n2,2)/(n2-1)));

  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  document.getElementById("result").innerHTML = `
    <h3>Independent T-Test</h3>
    t = ${t.toFixed(4)}<br>
    df = ${df.toFixed(2)}<br>
    p-value = ${p.toFixed(6)}
  `;
}

// ===============================
// PAIRED T-TEST
// ===============================
function runPairedT() {

  const before = parseGroup("before");
  const after = parseGroup("after");

  if (before.length !== after.length) {
    document.getElementById("result").innerText =
      "Groups must have the same number of values.";
    return;
  }

  const differences = before.map((x, i) => x - after[i]);

  const n = differences.length;
  const md = mean(differences);

  const sd = Math.sqrt(
    differences.reduce((sum, x) => sum + Math.pow(x - md, 2), 0) / (n - 1)
  );

  const t = md / (sd / Math.sqrt(n));
  const df = n - 1;

  const p = 2 * (1 - jStat.studentt.cdf(Math.abs(t), df));

  document.getElementById("result").innerHTML = `
    <h3>Paired T-Test</h3>
    t = ${t.toFixed(4)}<br>
    df = ${df}<br>
    p-value = ${p.toFixed(6)}
  `;
}
