const { OpenAIApi } = require("openai");
const Profile = require("../models/Profile");
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


exports.generateResume = async (req, res) => {
  const userId = req.user.id;
  const { jobDescription } = req.body;

  try {
    const profile = await Profile.findOne({ user: userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    const prompt = `You're a resume/career expert. Based on the given profile and job description, generate tailored resume bullet points for each work experience and project.

Job Description:
${jobDescription}

User Profile:
Full Name: ${profile.fullName}
Title: ${profile.title}
Summary: ${profile.summary}
Skills: ${profile.skills}
Education: ${profile.education}
Experience: ${JSON.stringify(profile.experience, null, 2)}
Projects: ${JSON.stringify(profile.projects, null, 2)}

Output a JSON object of bullet points under each experience/project.`;

    const response = await openai.responses.create({
      model: "gpt-4.1-nano-2025-04-14",
      input: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    try {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo", // or whatever you're using
    messages: [
      { role: "system", content: "You are a resume generator..." },
      { role: "user", content: prompt }
    ]
  });

  if (response && response.choices && response.choices.length > 0) {
    const resume = response.choices[0].message.content;
    res.status(200).json({ resume });
  } else {
    res.status(500).json({ error: "No valid response from AI" });
  }
} catch (error) {
  console.error("OpenAI Error:", error);
  res.status(500).json({ error: error.message || "Unexpected error" });
}


  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate resume" });
  }
};
