import { readFileSync, writeFileSync } from "fs";

function fixFile(filePath: string) {
  let content = readFileSync(filePath, "utf-8");

  // Admin panel specific cases
  let oldContent;
  do {
    oldContent = content;
    
    content = content.replace(/value=\{\$1 \|\| ""\}\s*onChange=\{\(e\) => set([A-Za-z0-9_]+)\(e\.target\.value\)\}/, (match, p1) => {
      let varName = p1.charAt(0).toLowerCase() + p1.slice(1);
      return `value={${varName} || ""} onChange={(e) => set${p1}(e.target.value)}`;
    });

    content = content.replace(/value=\{\$1 \|\| ""\}\s*onChange=\{\(e\) => update([A-Za-z0-9_]+)\(([a-zA-Z0-9_\.]+),\s*"([a-zA-Z0-9_]+)",/g, (match, p1, p2, p3) => {
      // p1 is "TeamMember", p2 is "member.id", p3 is "name"
      // p2 can be "designer.id", "partner.id", etc.
      let listVar = p2.split('.')[0]; // "member"
      return `value={${listVar}.${p3} || ""} onChange={(e) => update${p1}(${p2}, "${p3}",`;
    });

    content = content.replace(/value=\{\$1 \|\| ""\}\s*onChange=\{\(val\) => update([A-Za-z0-9_]+)\(([a-zA-Z0-9_\.]+),\s*"([a-zA-Z0-9_]+)",/g, (match, p1, p2, p3) => {
      let listVar = p2.split('.')[0];
      return `value={${listVar}.${p3} || ""} onChange={(val) => update${p1}(${p2}, "${p3}",`;
    });
    
    // For specific ones without update Function
    // updateMediaLink(day.id, link.id, "label"
    content = content.replace(/value=\{\$1 \|\| ""\}\s*onChange=\{\(e\) => updateMediaLink\(([a-zA-Z0-9_\.]+),\s*([a-zA-Z0-9_\.]+),\s*"([a-zA-Z0-9_]+)",/g, (match, p1, p2, p3) => {
      let listVar = p2.split('.')[0]; // link
      return `value={${listVar}.${p3} || ""} onChange={(e) => updateMediaLink(${p1}, ${p2}, "${p3}",`;
    });

  } while (oldContent !== content);

  // Remaining instances in Contact, Apply, Admin
  content = content.replace(/value=\{\$1 \|\| ""\}\s*onChange=\{e => set([A-Za-z0-9_]+)\(e\.target\.value\)\}/g, (match, p1) => {
      let varName = p1.charAt(0).toLowerCase() + p1.slice(1);
      return `value={${varName} || ""} onChange={e => set${p1}(e.target.value)}`;
  });

  content = content.replace(/value=\{\$1 \|\| ""\}\s*onChange=\{e=>set([A-Za-z0-9_]+)\(e\.target\.value\)\}/g, (match, p1) => {
      let varName = p1.charAt(0).toLowerCase() + p1.slice(1);
      return `value={${varName} || ""} onChange={e=>set${p1}(e.target.value)}`;
  });

  writeFileSync(filePath, content);
}

["src/components/AdminPanel.tsx", "src/components/ApplyPage.tsx", "src/components/ContactPage.tsx"].forEach(f => fixFile(f));
console.log("Fixed!");
