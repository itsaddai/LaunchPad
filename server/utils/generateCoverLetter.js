import express from "express";
import OpenAI from "openai";

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });



router.post("/", async (req, res) => {
  /* ---------- 2. Validate & sanitise ---------- */
  const parse = schema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.format() });
  }
  const { position, company, jobDesc, experience, tone } = parse.data;

  /* ---------- 3. Craft system + user messages ---------- */
  const systemPrompt = `
You are an expert career coach and copywriter.
Write concise, convincing cover letters that sound human, 
reflect the candidate's real experience, and match the job ad.`;


  const userPrompt = `
Write a ${toneMap[tone]} one‑page cover letter for the following role.

### Role
- Position: ${position}
- Company:  ${company}

${jobDesc ? `### Job Description\n${jobDesc}` : ""}

### Candidate Experience
${experience}

### Instructions
- Hook the reader in the first sentence.
- Pull 2‑3 achievements from the experience that align with the role.
- Keep it under 350 words.
- Finish with a short, forward‑looking closing sentence.
`;

  try {
    /* ---------- 4. Call OpenAI ---------- */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",          // or gpt‑4o
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user",   content: userPrompt }
      ],
    });

    const coverLetter = completion.choices[0].message.content?.trim() || "";

    /* ---------- 5. Return ---------- */
    res.json({ coverLetter });
  } catch (err) {
    console.error("OpenAI error:", err);
    res.status(500).json({ error: "Failed to generate cover letter. Try again." });
  }
});

export default router;
