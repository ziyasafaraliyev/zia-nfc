import fs from "fs";
import path from "path";

function walk(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

const roots = ["components/pay", "app/pay", "lib/demo-data.ts"];
const files = [];
for (const r of roots) {
  if (!fs.existsSync(r)) continue;
  if (fs.statSync(r).isDirectory()) files.push(...walk(r));
  else files.push(r);
}

const replacements = [
  [/@\/components\/demo\//g, "@/components/pay/demo/"],
  [
    /@\/components\/(Navbar|Hero|MobileShowcase|HowItWorks|Demo|Features|ValueProp|TimeSaved|Pricing|FAQ|CTA|Footer|PhoneFrame|PhoneMenuScreen)/g,
    "@/components/pay/$1",
  ],
  [/href="\/demo\//g, 'href="/pay/demo/'],
  [/href='\/demo\//g, "href='/pay/demo/"],
  [/href="\/about"/g, 'href="/pay/about"'],
  [/href="\/privacy-policy"/g, 'href="/pay/privacy-policy"'],
  [/redirect\("\/demo\//g, 'redirect("/pay/demo/'],
  [/src="\/logo\.png"/g, 'src="/logo-pay.png"'],
  [/href: "\/demo\//g, 'href: "/pay/demo/'],
  // about page anchor to pay landing
  [/href="\/#/g, 'href="/pay/#'],
];

for (const f of files) {
  let c = fs.readFileSync(f, "utf8");
  if (c.charCodeAt(0) === 0xfeff) c = c.slice(1);
  let next = c;
  for (const [re, to] of replacements) next = next.replace(re, to);

  const norm = f.replace(/\\/g, "/");
  if (norm.endsWith("components/pay/Navbar.tsx")) {
    // Brand link should open Zia Pay home, not NFC home
    next = next.replace(
      /(<Link\s+href=")\/("[\s\S]*?Zia Pay)/,
      "$1/pay$2",
    );
    // fallback simple first href="/"
    next = next.replace('href="/"', 'href="/pay"');
  }
  if (norm.endsWith("components/pay/Footer.tsx")) {
    next = next.replace('href="/"', 'href="/pay"');
  }

  if (next !== c) {
    fs.writeFileSync(f, next, "utf8");
    console.log("updated", f);
  } else {
    console.log("unchanged", f);
  }
}
