// const nodemailer = require('nodemailer');

// const sendEmail = async (email, subject, text) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS
//             }
//         });

//         await transporter.sendMail({
//             from: process.env.EMAIL_USER,
//             to: email,
//             subject: subject,
//             text: text,
//             html: htmlContent // ✅ Use HTML content for rich email format

//         });

//         console.log("Email sent successfully");
//     } catch (error) {
//         console.error("Email failed to send:", error);
//     }
// };

// module.exports = sendEmail;

const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,  
            html: htmlContent || text  // ✅ If HTML is not provided, fallback to text
        });

        console.log(`Email sent successfully to ${email}`);
    } catch (error) {
        console.error("Email failed to send:", error);
    }
};

module.exports = sendEmail;
