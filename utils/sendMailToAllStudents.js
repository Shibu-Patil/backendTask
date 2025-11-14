const nodemailer = require("nodemailer");
const Student = require("../models/Student");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "qspmockres@gmail.com",
    pass: "oofncshrzwvypxna", // app password
  },
});

module.exports = async function sendMailToAllStudents(subject, message, kt, testEmail = null) {
  const recipients = testEmail
    ? [{ email: testEmail }]
    : await Student.find({}, "email name scores");

  if (!recipients.length) throw new Error("No students found in DB");

  for (const student of recipients) {
    const email = student.email;
    const name = student.name || "Student";
    const scores = student.scores || {};

    let scoreText = "";
    if (kt === "technical") {
      scoreText = `\n\nYour Technical Score is: ${scores.technical ?? "N/A"}`;
    } else if (kt === "communication") {
      scoreText = `\n\nYour Communication Score is: ${scores.communication ?? "N/A"}`;
    } else if (kt === "both") {
      scoreText = `\n\nYour Scores:\n• Technical: ${scores.technical ?? "N/A"}\n• Communication: ${scores.communication ?? "N/A"}`;
    }

    const finalMessage = `${message}\n\n${scoreText}\n\nBest regards,\nAdmin Team`;

    try {
      await transporter.sendMail({
        from: "qspmockres@gmail.com", // ✅ consistent
        to: email,
        subject,
        text: finalMessage,
      });
      console.log(`✅ Sent to ${email}`);
      await new Promise(res => setTimeout(res, 1000)); // small delay
    } catch (err) {
      console.error(`❌ Error sending to ${email}:`, err.message);
    }
  }
};
