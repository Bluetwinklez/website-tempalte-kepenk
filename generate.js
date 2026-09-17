// Statik site üretici. Bağımlılık yok — sadece Node fs/path.
// Kullanım: node generate.js  (constants.json'u okur, public/ klasörünü üretir)
const fs = require("fs");
const path = require("path");

const root = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(root, "constants.json"), "utf8"));
data.whatsappMessageEncoded = encodeURIComponent(data.whatsappMessage);

function render(template, vars) {
  return template.replace(/{{(\w+)}}/g, (_, key) => {
    if (!(key in vars)) throw new Error(`Eksik placeholder: ${key}`);
    return vars[key];
  });
}

const publicDir = path.join(root, "public");
const bolgelerDir = path.join(publicDir, "bolgeler");
fs.rmSync(publicDir, { recursive: true, force: true });
fs.mkdirSync(bolgelerDir, { recursive: true });

// Ana sayfa
const regionChips = data.regions
  .map((r) => `<a class="chip" href="/bolgeler/${r.slug}.html">${r.name}</a>`)
  .join("\n      ");
const indexTpl = fs.readFileSync(path.join(root, "templates", "index.html"), "utf8");
fs.writeFileSync(
  path.join(publicDir, "index.html"),
  render(indexTpl, { ...data, regionChips })
);

// Bölge sayfaları
const regionTpl = fs.readFileSync(path.join(root, "templates", "region.html"), "utf8");
for (const region of data.regions) {
  const html = render(regionTpl, { ...data, regionName: region.name });
  fs.writeFileSync(path.join(bolgelerDir, `${region.slug}.html`), html);
}

// Paylaşılan statikler
fs.copyFileSync(path.join(root, "style.css"), path.join(publicDir, "style.css"));
fs.copyFileSync(path.join(root, "script.js"), path.join(publicDir, "script.js"));

console.log(`Üretildi: index.html + ${data.regions.length} bölge sayfası -> public/`);
