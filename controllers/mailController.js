const sendMailToAllStudents = require("../utils/sendMailToAllStudents");

exports.sendMail = async (req, res) => {
  try {
    const { subject, message, kt, testEmail } = req.body;

    if (!subject || !message || !kt) {
      return res.status(400).json({ error: "Subject, message, and kt are required." });
    }

    await sendMailToAllStudents(subject, message, kt, testEmail || null);

    res.json({
      message: testEmail
        ? `✅ Test email sent to ${testEmail}`
        : "✅ Emails sent to all students!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
