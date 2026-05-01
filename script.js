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
