const nodemailer = require("nodemailer");
const Student = require("../models/Student");

// 📨 Configure mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // e.g. "youremail@gmail.com"
    pass: process.env.EMAIL_PASS, // app password from Google
  },
});

/**
 * Send mail to all students (or a test email)
 * @param {string} subject - Mail subject
 * @param {string} message - Message body (from frontend)
 * @param {string} kt - "technical", "communication", or "both"
 * @param {string|null} testEmail - optional test email
 */
module.exports = async function sendMailToAllStudents(subject, message, kt, testEmail = null) {
  // ✅ Prepare recipients
  const recipients = testEmail
    ? [{ email: testEmail }]
    : await Student.find({}, "email name scores");

  if (!recipients.length) throw new Error("No students found in DB");

  // ✅ Prepare personalized mails
  const sendPromises = recipients.map((student) => {
    const email = student.email;
    const name = student.name || "Student";
    const scores = student.scores || {};

    // Append score info based on kt selection
    let scoreText = "";
    if (kt === "technical") {
      scoreText = `\n\nYour *Technical Score* is: ${scores.technical ?? "N/A"}`;
    } else if (kt === "communication") {
      scoreText = `\n\nYour *Communication Score* is: ${scores.communication ?? "N/A"}`;
    } else if (kt === "both") {
      scoreText = `\n\nYour Scores:\n• Technical: ${scores.technical ?? "N/A"}\n• Communication: ${scores.communication ?? "N/A"}`;
    }

    const finalMessage = `${message}\n\n${scoreText}\n\nBest regards,\nAdmin Team`;

    return transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text: finalMessage,
    });
  });

  await Promise.all(sendPromises);
};
