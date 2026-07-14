import fs from "fs";

const payCss = fs.readFileSync(
  "C:/Users/Ziya/Desktop/zia-pay/app/globals.css",
  "utf8",
);
const nfcCssPath = "C:/Users/Ziya/Desktop/zia-nfc/app/globals.css";
const nfcCss = fs.readFileSync(nfcCssPath, "utf8");

if (nfcCss.includes("/* === Zia Pay landing utilities === */")) {
  console.log("Pay CSS already present");
  process.exit(0);
}

// Extract utility block from section-label through delay-300 / pulse-soft start
const start = payCss.indexOf(".section-label {");
const endMarker = "@keyframes pulse-soft";
const end = payCss.indexOf(endMarker);
if (start < 0 || end < 0) {
  console.error("Could not find CSS markers", { start, end });
  process.exit(1);
}

const block = payCss.slice(start, end).trim();

// Also inject CSS variables if missing
const vars = `
/* === Zia Pay landing utilities === */
:root {
  --brand: #29aeee;
  --shadow-teal-aura: 0 18px 45px rgba(14, 165, 233, 0.28);
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
}

`;

const out = nfcCss.trimEnd() + "\n\n" + vars + block + "\n";
fs.writeFileSync(nfcCssPath, out, "utf8");
console.log("Appended pay CSS utilities, new length", out.length);
