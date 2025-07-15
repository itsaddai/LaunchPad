router.post("/generate", authenticateUser, coverLetterController.generateCoverLetter);
