const Sabotier = require('../../models/sabotier');
const bcriptSabotier = require('bcryptjs');
require('dotenv').config();

const ErrorSabotierMessage = "Le chauffeur n'existe pas";
const ErrorSabotierMessageIdentificationMult =
	"Ces identifiants sont déjà utilisés, \n veuillez en choisir d'autres SVP !";

module.exports = {
	Query: {
		getSabotiers: async () => await Sabotier.find({delete: false}),
		getSabotier: async (_, { id }) => {
			const pointer = await Sabotier.findById(id);
			if (!pointer || pointer.delete)
				throw new Error(ErrorSabotierMessage + ' : Chauffeur');
			return pointer;
		},
		connectionSabotier: async (_, { name, password }) => {
			const namePointer = name.toLowerCase();
			const pointerFind = await Sabotier.findOne({
				name: namePointer,
				delete: false,
			});
			if (!pointerFind) throw new Error("Nom d'utiliateur Incorrect !");
			const isMatch = await bcriptSabotier.compare(password, pointerFind.password);
			if (!isMatch) throw new Error('Mot de passe incorrect !');
			return pointerFind;
		},
	},
	Mutation: {
		createSabotier: async (_, { sabotier }) => {
			let { name, password } = sabotier;
			name = name.toLowerCase();

			const pointerVerification = await Sabotier.findOne({
				name,
				delete: false,
			});
			if (pointerVerification)
				throw new Error(ErrorPointerMessageIdentificationMult);

			const passPointerHashed = await bcriptSabotier.hash(password, 10);
			const newPointer = new Sabotier({
				...sabotier,
				name,
				password: passPointerHashed,
			});
			return await newPointer.save();
		},
		deleteSabotier: async (_, { id }) => {
			const pointer = await Sabotier.findByIdAndUpdate(id, { delete: true });
			if (!pointer) {
				throw new Error(ErrorSabotierMessage + ' : Chauffeur');
			}
			return pointer;
		},
		updateSabotier: async (_, { id, sabotier }) => {
			const pointerUpdate = await Sabotier.findById(id);
			if (!pointerUpdate) throw new Error(ErrorSabotierMessage + ' : Chauffeur');
			let { name, password, ...others } = sabotier;
			name = name.toLowerCase();
			if (password.match(/^(?!\s*$).+/) !== null) {
				const passHashed = await bcriptSabotier.hash(password, 10);
				await Sabotier.findByIdAndUpdate(id, {
					...others,
					name,
					password: passHashed,
				});
			} else {
				await Sabotier.findByIdAndUpdate(id, {
					...others,
					name,
				});
			}
			return await Sabotier.findById(id);
		},
		reverseDeleteSabotier: async (_, { id }) => {
			const pointerExist = await Sabotier.findById(id);
			if (!pointerExist) throw new Error(ErrorSabotierMessage + ' : Chauffeur');
			return await Sabotier.findByIdAndUpdate(id, {
				delete: false,
			});
		},
	},
};
