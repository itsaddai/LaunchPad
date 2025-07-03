// ---------------------------------------------------------------------------
// Generates a Jake‑style PDF resume using Mustache + Tectonic (ESM friendly)
// ---------------------------------------------------------------------------

import { promises as fs } from "fs";
import path from "path";
import mustache from "mustache";
import { execFile } from "child_process";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import process from "node:process"; 

// ESM doesn’t give __dirname; we create it:
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Path to tectonic binary installed by pnpm
const tectonicBin =
  process.platform === "win32"
    ? path.join(__dirname, "..", "..", "node_modules", ".bin", "tectonic.cmd")
    : path.join(__dirname, "..", "..", "node_modules", ".bin", "tectonic");

/** @typedef {import("../models/Profile.js").IProfile} IProfile */

/**
 * Compile a PDF resume.
 * @param {Object} params
 * @param {IProfile} params.profile   User profile from Mongo
 * @param {string[]} params.bullets   GPT‑tailored bullets
 * @param {string} params.jobUrl      Original job posting URL
 * @returns {Promise<string>}         Public URL to the PDF
 */
export async function generateResume({ profile, bullets, jobUrl }) {
  /* 1. Prepare data for Mustache template ------------------------ */
  const data = {
    name:      profile.fullName,
    email:     profile.email,
    phone:     profile.phone,
    location:  profile.location,
    summary:   profile.summary,
    skills:    profile.skills,

    experience: profile.experience.map((ex) => ({
      position:  ex.title,
      company:   ex.company,
      duration: `${new Date(ex.startDate).getFullYear()}–${
        ex.endDate ? new Date(ex.endDate).getFullYear() : "Present"
      }`,
      bullets,
    })),

    education: profile.education.map((ed) => ({
      degree:  ed.degree,
      school:  ed.school,
      startYear: new Date(ed.startDate).getFullYear(),
      endYear:   ed.endDate ? new Date(ed.endDate).getFullYear() : "Present",
    })),

    jobUrl,
  };

  /* 2. Render LaTeX template ------------------------------------- */
  const templatesDir = path.join(__dirname, "..", "templates", "jake");
  const texTemplate  = await fs.readFile(
    path.join(templatesDir, "main.tex"),
    "utf8"
  );
  const renderedTex = mustache.render(texTemplate, data);

  /* 3. Create output folder & copy support files ----------------- */
  const id     = uuidv4();
  const outDir = path.join(__dirname, "..", "resumes", id);
  await fs.mkdir(outDir, { recursive: true });

  // copy resume.cls + fontawesome.sty
  for (const f of ["resume.cls", "fontawesome.sty"]) {
    await fs.copyFile(
      path.join(templatesDir, f),
      path.join(outDir, f)
    );
  }

  const texPath = path.join(outDir, "resume.tex");
  await fs.writeFile(texPath, renderedTex, "utf8");

  /* 4. Compile with tectonic ------------------------------------- */
  await new Promise((resolve, reject) => {
    execFile(
      tectonicBin,
      [texPath, "--outdir", outDir, "--synctex", "false"],
      (err, stdout, stderr) => {
        if (err) {
          console.error("Tectonic error:", stderr);
          return reject(err);
        }
        console.log("Tectonic output:", stdout);
        resolve();
      }
    );
  });

  /* 5. Return public URL ----------------------------------------- */
  return `/resumes/${id}/resume.pdf`;
}
