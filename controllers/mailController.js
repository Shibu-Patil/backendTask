const sendMailToAllStudents = require("../utils/sendMailToAllStudents");

exports.sendMail = async (req, res) => {
  console.log("Email:", process.env.EMAIL_USER);
  console.log("Pass exists:", process.env.EMAIL_PASS);
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
    console.log(err);
    
    res.status(500).json({ error: err.message });
  }
};
