const Responsable = require('../../models/responsable');
const bcryptResponsable = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

const ErrorResponsableMessage = "Le responsable n'existe pas";
const ErrorResponsableMessageIdentificationMult =
	"Ces identifiants sont déjà utilisés, \n veuillez en choisir d'autres SVP !";

module.exports = {
	Query: {
		getResponsables: async () => await Responsable.find(),
		getResponsable: async (_, { id }) => {
			const responsable = await Responsable.findById(id);
			if (!responsable || responsable.delete)
				throw new Error(ErrorResponsableMessage + ': Responsable');
			return responsable;
		},
		connectionResponsable: async (_, { name, password }, { req, res }) => {
			
			const nameResponsable = name.toLowerCase();
			const responsable = await Responsable.findOne({
				name: nameResponsable,
				delete: false,
			});
			if (!responsable) throw new Error("Nom d'utiliateur Incorrect !");
			const isMatch = await bcryptResponsable.compare(
				password,
				responsable.password
			);
			if (!isMatch) throw new Error('Mot de passe incorrect !');

			/* const accessToken = jwt.sign(
				{ userdId: responsable.id },
				process.env.ACCESS_TOKEN_SECRET
			);
			responsable.token = accessToken;*/
			return responsable;
		},
	},
	Mutation: {
		createResponsable: async (_, { responsable }) => {
			let { name, password } = responsable;
			name = name.toLowerCase();
			const responsableVerificationAlone = await Responsable.findOne({
				name,
				delete: false,
			});
			if (responsableVerificationAlone)
				throw new Error(ErrorResponsableMessageIdentificationMult);

			const passHashed = await bcryptResponsable.hash(password, 10);
			const resp = new Responsable({
				...responsable,
				name,
				password: passHashed,
			});
			await resp.save();
			return resp;
		},
		deleteResponsable: async (_, { id }) => {
			const responsable = await Responsable.findByIdAndUpdate(id, {
				delete: true,
			});
			if (!responsable) {
				throw new Error(ErrorResponsableMessage + ' : Responsable');
			}
			return responsable;
		},
		updateResponsable: async (_, { id, responsable }) => {
			const responsableExist = await Responsable.findById(id);
			if (!responsableExist)
				throw new Error(ErrorResponsableMessage + ' : Responsable');
			let { name, password, ...others } = responsable;
			name = name.toLowerCase();
			if (password.match(/^(?!\s*$).+/) !== null) {
				const passHashed = await bcryptResponsable.hash(password, 10);
				await Responsable.findByIdAndUpdate(id, {
					...others,
					name,
					password: passHashed,
				});
			} else {
				await Responsable.findByIdAndUpdate(id, {
					...others,
					name,
				});
			}
			return await Responsable.findById(id);
		},
		reverseDeleteResponsable: async (_, { id }) => {
			const responsableExist = await Responsable.findById(id);
			if (!responsableExist)
				throw new Error(ErrorResponsableMessage + ' : Responsable');
			return await Responsable.findByIdAndUpdate(id, {
				delete: false,
			});
		},
		recoveryAccount: async (_, { name, code }) => {
			name = name.toLowerCase();
			const responsable = await Responsable.findOne({
				name,
				delete: false,
			});
			if (!responsable)
				throw new Error(ErrorResponsableMessage + ' : Responsable');
			if (process.env.CPS_CODE !== code)
				throw new Error('Mauvai code de Reinitialisation CPS');

			const randomPassWord = Math.random().toString(36).slice(-8);
			const passHashed = await bcryptResponsable.hash(randomPassWord, 10);
			await Responsable.findByIdAndUpdate(responsable._id, {
				password: passHashed,
			});

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.MAIL_USER,
					pass: process.env.MAIL_PASS,
				},
			});
			const mailOptions = {
				from: process.env.MAIL_USER,
				to: responsable.email,
				subject: 'Reinitialisation du compte',
				text: 'Reinitialisation du compte',
				html: `
				<html>
					<head>
					<title></title>
					</head>
					<body>
					<div data-role="module-unsubscribe" class="module" role="module" data-type="unsubscribe" style="color:#444444; font-size:12px; line-height:20px; padding:16px 16px 16px 16px; text-align:Center;" data-muid="4e838cf3-9892-4a6d-94d6-170e474d21e5">
						<div class="Unsubscribe--addressLine">
						<p class="Unsubscribe--senderName"
							style="font-size:12px;line-height:20px"
						>
							Merci ${responsable.name} ${responsable.lastName} d'avoir utiliser le service de reinitialisation du compte de fleet management soft.
						</p>
						</div>
						<p style="font-size:12px; line-height:20px;">
						Votre nouveau mot de passe est : <p style="font-size:18px; line-height:20px;"><strong>${randomPassWord}</strong></p>
						</p>
					</div>
					</body>
				</html>`,
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					throw new Error('Impossible de réalisé cette action !');
				} else {
					return `Felicitation Mot de pass envoyer à ${responsable.email}`;
				}
			});
		},
	},
};
