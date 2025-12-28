const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: { rejectUnauthorized: false }
});

const enviarEmail = async ({ to, subject, html, bcc }) => {
    const mailOptions = {
        from: `"AnthonyWeb" <${process.env.EMAIL_SENDER}>`,
        to,
        subject,
        html,
        bcc
    };
    return await transporter.sendMail(mailOptions);
};

module.exports = { enviarEmail };