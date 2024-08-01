import { createTransport } from "nodemailer";

const sendEmail = async (
  to = "",
  subject = "",
  html = "",
  attachments = []
) => {
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: "islam.hussen.13@gmail.com",
      pass: "qxtchwbrozztrcve",
    },
  });

  const info = await transporter.sendMail({
    from: '"Sticky Tasks 👻" <islam.hussen.13@gmail.com>',
    to,
    subject,
    html,
    attachments,
  });

  if (info.accepted.length) return true;

  return false;
};

export default sendEmail;
