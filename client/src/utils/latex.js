import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { execFile } from "child_process";



const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
function escapeLatex(str) {
  return str
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}")
    .replace(/\\/g, "\\textbackslash{}");
}

async function generateResume(userData) {
  return new Promise((resolve, reject) => {
    const templateDir = path.join(__dirname, "../templates/jake");
    const resumeId = uuidv4();
    const outputDir = path.join(__dirname, "../resumes", resumeId);

    fs.mkdirSync(outputDir, { recursive: true });

    // 1. Copy LaTeX template files to outputDir
    const filesToCopy = ["resume.tex", "resume.cls"];
    filesToCopy.forEach(file => {
      const src = path.join(templateDir, file);
      const dest = path.join(outputDir, file);
      if (!fs.existsSync(src)) {
        return reject(new Error(`Missing template file: ${file}`));
      }
      fs.copyFileSync(src, dest);
    });

    // 2. Insert user data into resume.tex
    const texPath = path.join(outputDir, "resume.tex");
    let texContent = fs.readFileSync(texPath, "utf8");

    // Replace placeholders in .tex file with actual user data
    texContent = texContent
      .replace("{{name}}", escapeLatex(userData.name || "John Doe"))
      .replace("{{email}}", escapeLatex(userData.email || "john@example.com"))
      .replace("{{phone}}", escapeLatex(userData.phone || "123-456-7890"))
      .replace("{{education}}", userData.education?.map(ed => {
        return `\\resumeSubheading{${escapeLatex(ed.school)}}{${escapeLatex(ed.dates)}}{${escapeLatex(ed.degree)}}{${escapeLatex(ed.location)}}`;
      }).join("\n") || "")
      .replace("{{skills}}", userData.skills?.join(" \\textbullet{} ") || "")
      .replace("{{experience}}", userData.experience?.map(exp => {
        const bullets = exp.bullets.map(b => `\\item ${escapeLatex(b)}`).join("\n");
        return `\\resumeSubheading{${escapeLatex(exp.title)}}{${escapeLatex(exp.dates || "")}}{${escapeLatex(exp.company)}}{${escapeLatex(exp.location || "")}}\n\\resumeItemListStart\n${bullets}\n\\resumeItemListEnd`;
      }).join("\n\n") || "");

    fs.writeFileSync(texPath, texContent);

    // 3. Compile LaTeX to PDF using pdflatex
    const cmd = "pdflatex";
    const args = ["-interaction=nonstopmode", "resume.tex"];

    execFile(cmd, args, { cwd: outputDir }, (err, stdout, stderr) => {
      if (err) {
        console.error("LaTeX compile error:", stderr);
        return reject(err);
      }

      const pdfPath = path.join(outputDir, "resume.pdf");
      if (!fs.existsSync(pdfPath)) {
        return reject(new Error("PDF not generated"));
      }

      resolve({ path: pdfPath, id: resumeId });
    });
  });
}

export default generateResume;
