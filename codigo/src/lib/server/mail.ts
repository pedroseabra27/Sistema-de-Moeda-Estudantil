import nodemailer from 'nodemailer'
import { env } from 'process'

export const transporter = nodemailer.createTransport({
    service: "gmail",
	auth: {
		user: env.GMAIL_USER,
		pass: env.GMAIL_PASSWORD,
	},
})