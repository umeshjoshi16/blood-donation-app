import nodemailer from 'nodemailer';

export const sendEmergencyMail = async (req, res) => {
  const requestId = req.params.id;
  const { email, hospitalName, hospitalCity, hospitalContact } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Donor email required" });
    if (!hospitalName || !hospitalCity) return res.status(400).json({ message: "Hospital info required" });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { 
        user: process.env.SMTP_USER, 
        pass: process.env.SMTP_PASS 
      },
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Emergency Blood Request",
      text: `Hello,

A new emergency blood request is available:

- Request ID: ${requestId}
- Hospital: ${hospitalName}, ${hospitalCity}
- Hospital Contact: ${hospitalContact || "Not provided"}

Please respond if you can donate.

Thank you!`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully ✅" });
  } catch (err) {
    console.error("sendEmergencyMail error:", err);
    res.status(500).json({ message: "Failed to send email" });
  }
};