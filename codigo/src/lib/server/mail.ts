import { env } from '$env/dynamic/private'
import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: "gmail",
	auth: {
		user: env.GMAIL_USER,
		pass: env.GMAIL_PASSWORD,
	},
})