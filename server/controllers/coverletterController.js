const OpenAI = require("openai").default;
const Profile = require("../models/Profile.js");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const formatDate = (date) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(date).toLocaleDateString(undefined, options);
};

exports.generateCoverLetter = async (req, res) => {
  try {
    const userId = req.user.id;
    const { jobDescription = "", jobUrl = "" } = req.body;

    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Format experience and projects
    const experienceSummary = (profile.experience || []).map((exp) => ({
      title: exp.title,
      company: exp.company,
      description: exp.description || "",
      bullets: exp.bullets || [],
    }));

    const projectsSummary = (profile.projects || []).map((proj) => ({
      name: proj.name,
      description: proj.description || "",
      bullets: proj.bullets || [],
    }));

    const today = formatDate(new Date());

    const messages = [
      {
        role: "system",
        content: `You are a helpful assistant that writes tailored, professional cover letters.`,
      },
      {
        role: "user",
        content: `
Write a compelling one-page cover letter for this job. Tailor it based on the user's experience and projects.

Include the following at the top of the letter:
- Full name
- Email
- Phone
- LinkedIn
- Date (today's date)

Start the letter with: "Dear Hiring Manager,"

Return only the cover letter in plain text, no markdown or code formatting.

Job Description:
${jobDescription || "(none provided)"}

Job URL:
${jobUrl || "(none provided)"}

User Info:
Full Name: ${profile.fullName}
Email: ${profile.email}
Phone: ${profile.phone}
LinkedIn: ${profile.linkedin}
Date: ${today}

User's Experience:
${JSON.stringify(experienceSummary, null, 2)}

User's Projects:
${JSON.stringify(projectsSummary, null, 2)}
        `.trim(),
      },
    ];

    console.log("Sending messages to OpenAI:", messages);

    const chat = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const coverLetter = chat.choices[0]?.message?.content?.trim();
    if (!coverLetter) {
      return res.status(500).json({ message: "Failed to generate cover letter." });
    }

    return res.status(200).json({
      success: true,
      coverLetterText: coverLetter,
    });

  } catch (err) {
    console.error("Cover letter generation error:", err);
    res.status(500).json({
      message: "Cover letter generation failed",
      details: err.message,
    });
  }
};
