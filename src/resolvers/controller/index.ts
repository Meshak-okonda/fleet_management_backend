const Controller = require('../../models/controller');
const bcriptController = require('bcryptjs');
require('dotenv').config();

const ErrorControllerMessage = "Le chauffeur n'existe pas";
const ErrorControllerMessageIdentificationMult =
	"Ces identifiants sont déjà utilisés, \n veuillez en choisir d'autres SVP !";

module.exports = {
	Query: {
		getControllers: async () => await Controller.find({ delete: false }),
		getController: async (_, { id }) => {
			const pointer = await Controller.findById(id);
			if (!pointer || pointer.delete)
				throw new Error(ErrorControllerMessage + ' : Controller');
			return pointer;
		},
		connectionController: async (_, { name, password }) => {
			const namePointer = name.toLowerCase();
			const pointerFind = await Controller.findOne({
				name: namePointer,
				delete: false,
			});
			if (!pointerFind) throw new Error("Nom d'utiliateur Incorrect !");
			const isMatch = await bcriptController.compare(password, pointerFind.password);
			if (!isMatch) throw new Error('Mot de passe incorrect !');
			return pointerFind;
		},
	},
	Mutation: {
		createController: async (_, { controller }) => {
			let { name, password } = controller;
			name = name.toLowerCase();

			const pointerVerification = await Controller.findOne({
				name,
				delete: false,
			});
			if (pointerVerification)
				throw new Error(ErrorPointerMessageIdentificationMult);

			const passPointerHashed = await bcriptController.hash(password, 10);
			const newPointer = new Controller({
				...controller,
				name,
				password: passPointerHashed,
			});
			return await newPointer.save();
		},
		deleteController: async (_, { id }) => {
			console.log(await Controller.findById(id), id);
			const pointer = await Controller.findByIdAndUpdate(id, { delete: true });
			if (!pointer) {
				throw new Error(ErrorControllerMessage + ' : Chauffeur');
			}
			return pointer;
		},
		updateController: async (_, { id, controller }) => {
			const pointerUpdate = await Controller.findById(id);
			if (!pointerUpdate) throw new Error(ErrorControllerMessage + ' : Chauffeur');
			let { name, password, ...others } = controller;
			name = name.toLowerCase();
			if (password.match(/^(?!\s*$).+/) !== null) {
				const passHashed = await bcriptController.hash(password, 10);
				await Controller.findByIdAndUpdate(id, {
					...others,
					name,
					password: passHashed,
				});
			} else {
				await Controller.findByIdAndUpdate(id, {
					...others,
					name,
				});
			}
			return await Controller.findById(id);
		},
		reverseDeleteController: async (_, { id }) => {
			const pointerExist = await Controller.findById(id);
			if (!pointerExist) throw new Error(ErrorControllerMessage + ' : Chauffeur');
			return await Controller.findByIdAndUpdate(id, {
				delete: false,
			});
		},
	},
};
