const fs = require("fs");

function fixInputs(filePath) {
  let content = fs.readFileSync(filePath, "utf-8");
  
  // Replace value={...} with value={... || ""} ONLY if it is an input or textarea
  // Actually, standard regex substitute:
  content = content.replace(/value=\{([a-zA-Z0-9_.[\]]+)\}/g, "value={$1 || \"\"}");
  
  fs.writeFileSync(filePath, content);
}

["src/components/AdminPanel.tsx", "src/components/ApplyPage.tsx", "src/components/ContactPage.tsx"].forEach(f => fixInputs(f));
console.log("Done");
