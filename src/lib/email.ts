import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendInviteEmail(email: string, inviteCode: string, inviterName: string) {
  const inviteUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/invite?code=${inviteCode}`
  
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: `You're invited to join ${process.env.NEXT_PUBLIC_APP_NAME}`,
    html: `
      <h2>You've been invited to join ${process.env.NEXT_PUBLIC_APP_NAME}</h2>
      <p>${inviterName} has invited you to become an author on our blog platform.</p>
      <p>Click the link below to accept your invitation:</p>
      <a href="${inviteUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Accept Invitation</a>
      <p>This invitation will expire in 7 days.</p>
      <p>If you didn't expect this invitation, you can safely ignore this email.</p>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Failed to send invite email:', error)
    return { success: false, error }
  }
}

export async function sendNotificationEmail(
  to: string,
  subject: string,
  content: string
) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html: content,
  }

  try {
    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Failed to send notification email:', error)
    return { success: false, error }
  }
} 