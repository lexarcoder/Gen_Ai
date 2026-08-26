import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
})

transporter.verify()
    .then(() => {
        console.log("Email transporter is ready to send emails")
    })
    .catch((error) => {
        console.error("Error setting up email transporter:", error)
    })


export async function sendMail({ to, subject, html, text }) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
        text
    }
    const details = await transporter.sendMail(mailOptions)
    console.log("Email sent:", details)

}