import fs from "fs";

const nfc = fs.readFileSync(
  "C:/Users/Ziya/Desktop/zia-nfc/components/pay/Hero.tsx",
  "utf8",
);
const nav = fs.readFileSync(
  "C:/Users/Ziya/Desktop/zia-nfc/components/pay/Navbar.tsx",
  "utf8",
);
const demo = fs.readFileSync(
  "C:/Users/Ziya/Desktop/zia-nfc/lib/demo-data.ts",
  "utf8",
);

console.log("hero demo hrefs:", nfc.match(/href="[^"]+"/g));
console.log("nav brand:", nav.match(/href="\/pay"/g));
console.log("nav logos:", nav.match(/src="[^"]+"/g));
console.log("demo-data hrefs:", demo.match(/href: "[^"]+"/g));
console.log("any remaining /demo/ without pay:", (nfc + nav + demo).match(/[^/]\/demo\//g));
