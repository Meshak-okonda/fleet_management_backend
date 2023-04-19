const Pointer = require('../../models/pointer');
const bcriptPointer = require('bcryptjs');
require('dotenv').config();

const ErrorPointerMessage = "Le chauffeur n'existe pas";
const ErrorPointerMessageIdentificationMult =
	"Ces identifiants sont déjà utilisés, \n veuillez en choisir d'autres SVP !";

module.exports = {
	Query: {
		getPointers: async () => await Pointer.find(),
		getPointer: async (_, { id }) => {
			const pointer = await Pointer.findById(id);
			if (!pointer || pointer.delete)
				throw new Error(ErrorPointerMessage + ' : Chauffeur');
			return pointer;
		},
		connectionPointer: async (_, { name, password }) => {
			const namePointer = name.toLowerCase();
			const pointerFind = await Pointer.findOne({
				name: namePointer,
				delete: false,
			});
			if (!pointerFind) throw new Error("Nom d'utiliateur Incorrect !");
			const isMatch = await bcriptPointer.compare(password, pointerFind.password);
			if (!isMatch) throw new Error('Mot de passe incorrect !');
			return pointerFind;
		},
	},
	Mutation: {
		createPointer: async (_, { pointer }) => {
			let { name, password } = pointer;
			name = name.toLowerCase();

			const pointerVerification = await Pointer.findOne({
				name,
				delete: false,
			});
			if (pointerVerification)
				throw new Error(ErrorPointerMessageIdentificationMult);

			const passPointerHashed = await bcriptPointer.hash(password, 10);
			const newPointer = new Pointer({
				...pointer,
				name,
				password: passPointerHashed,
			});
			return await newPointer.save();
		},
		deletePointer: async (_, { id }) => {
			const pointer = await Pointer.findByIdAndUpdate(id, { delete: true });
			if (!pointer) {
				throw new Error(ErrorPointerMessage + ' : Chauffeur');
			}
			return pointer;
		},
		updatePointer: async (_, { id, pointer }) => {
			const pointerUpdate = await Pointer.findById(id);
			if (!pointerUpdate) throw new Error(ErrorPointerMessage + ' : Chauffeur');
			let { name, password, ...others } = pointer;
			name = name.toLowerCase();
			if (password.match(/^(?!\s*$).+/) !== null) {
				const passHashed = await bcriptPointer.hash(password, 10);
				await Pointer.findByIdAndUpdate(id, {
					...others,
					name,
					password: passHashed,
				});
			} else {
				await Pointer.findByIdAndUpdate(id, {
					...others,
					name,
				});
			}
			return await Pointer.findById(id);
		},
		reverseDeletePointer: async (_, { id }) => {
			const pointerExist = await Pointer.findById(id);
			if (!pointerExist) throw new Error(ErrorPointerMessage + ' : Chauffeur');
			return await Pointer.findByIdAndUpdate(id, {
				delete: false,
			});
		},
	},
};
