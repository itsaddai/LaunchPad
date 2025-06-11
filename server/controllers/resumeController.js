const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateResume = async (req, res) => {
  const { jobDescription, userExperiences } = req.body;

  if (!jobDescription || !userExperiences) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const prompt = `
You are a professional resume writer. Given the job description and experiences below, generate a tailored professional resume summary and experience section.

Job Description:
${jobDescription}
User Experiences:
${userExperiences.map((exp, i) => `(${i + 1}) ${exp.title} at ${exp.company} - ${exp.description}`).join('\n')}
Output in professional resume format.
`;

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const resume = chatResponse.choices[0].message.content;
    res.json({ resume });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
};
