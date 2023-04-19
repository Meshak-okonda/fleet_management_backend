const axiosPr = require('axios');
const TowingPrivateModel = require('../../models/towingPrivate');
const DriverModelPr = require('../../models/driver');
const ErrorMessageTowingPoliceP = "Le remorque n'existe pas";

require('dotenv').config();

const dateFormatP = () => {
	const date = new Date();
	const hour = date.getHours() + 1;
	const minutes = date.getMinutes() + 1;
	return `${hour}H${minutes} minutes`;
};

const getStatusValidateP = (status) => {
	let response;
	switch (status) {
		case 'NOT_GOOD':
			response = '⛔ Vehicule en etat critique ⛔';
			break;
		case 'GOOD':
			response = '✅ Vehicule en bonne etat ✅';
			break;
		default:
			response = 'Erreur système';
			break;
	}
	return response;
};

module.exports = {
	Query: {
		getPrivateTowings: async () => await TowingPrivateModel.find(),
		getPrivateTowing: async (_, { id }) =>
			await TowingPrivateModel.findById(id),
		getPrivateTowingStandDriver: async (_, { date, idDriver }) =>
			await TowingPrivateModel.find({ date, idDriver, delete: false }),
		getPrivateTowingElementsOfOneDay: async (_, { date }) => {
			const towing = await TowingPrivateModel.find({
				date,
				delete: false,
			});

			return towing;
		},
		getPrivateTowingElementsByRange: async (_, { range }) => {
			const towing = await TowingPrivateModel.find({
				date: { $in: range.split(',') },
				delete: false,
			});
			if (!towing) throw new Error(ErrorMessageTowingPoliceP);
			return towing;
		},
		getPrivateTowingElementsByMonth: async (_, { month }) => {
			const towing = await TowingPrivateModel.find({
				date: { $regex: new RegExp(month) },
				delete: false,
			});
			if (!towing) throw new Error(ErrorMessageTowingPoliceP);
			return towing;
		},
	},
	Mutation: {
		createVehiclePrivateTowing: async (_, { vehiclePrivateTowing }) => {
			const towingSchema = new TowingPrivateModel(vehiclePrivateTowing);
			const towing = await towingSchema.save();

			const dateReplace = vehiclePrivateTowing.date.split('/').join('-');
			await axiosPr
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `:car: :car: :car: :car: :car:  \nUn Remorquage vient d'etre fait date  ${
							vehiclePrivateTowing.date
						}\n\nStatus: ${getStatusValidateP(
							vehiclePrivateTowing.status
						)} \nModel: ${vehiclePrivateTowing.model}\nType: ${
							vehiclePrivateTowing.type
						}\nNom du propriètaire: ${`${vehiclePrivateTowing.name} ${vehiclePrivateTowing.lastName}`}\n\nTotal Bon Etat : ${
							towing.stateVehicle.good
						}\nTotal Abimé: ${towing.stateVehicle.damaged}\nTotal Rayure: ${
							towing.stateVehicle.grooves
						}\nTotal Hors service: ${
							towing.stateVehicle.outService
						}\nVoir le controle: ${
							process.env.URL_BASE_FRONT_OFFICE + 'towing/private/' + towing.id
						}
						\n Images de la voiture \n ------------------------ \n${towing.imageTowing.infractionImage && towing.imageTowing.infractionImage.length > 0 ? towing.imageTowing.infractionImage.map((e) => `${process.env.LIEN_BACK_IMAGE}${e} \n`) : "Aucune image"}`,
					}
				)
				.then((res) => {
					console.log('Post Reussi');
				})
				.catch((err) => {
					console.log('Post echoue');
				});

			return towing;
		},

		deleteVehiclePrivateTowing: async (_, { id }) => {
			const towing = await TowingPrivateModel.findById(id);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessageTowingPoliceP);

			await TowingPrivateModel.findByIdAndUpdate(id, { delete: true });
			return TowingPrivateModel;
		},
		updateVehiclePrivateTowing: async (
			_,
			{ id, updateVehiclePrivateTowing }
		) => {
			const vehicle = await VehicleModel.findById(
				updateVehiclePrivateTowing.idVehicle
			);
			const dateReplace = updateVehiclePrivateTowing.date.split('/').join('-');

			const towing = await TowingPrivateModel.findById(id);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessageTowingPoliceP);

			await TowingPrivateModel.findByIdAndUpdate(
				id,
				updateVehiclePrivateTowing
			);
			await axiosPr
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `Mis à jour du controle à la date  ${
							updateVehiclePrivateTowing.date
						} \nVehicule : ${
							vehicle.name || 'Aucune donnée'
						} \n Chauffeur: ${'Aucune donnée'} \n Total Element Bon Etat : ${
							updateVehiclePrivateTowing.stateVehicle.good
						} \nTotal Element Abimé :${
							updateVehiclePrivateTowing.stateVehicle.damaged
						}\nTotal Element Manquant :${
							updateVehiclePrivateTowing.stateVehicle.missing
						}\nVoir le controle : ${
							process.env.URL_BASE_FRONT_OFFICE +
							updateVehiclePrivateTowing.idVehicle +
							'/' +
							dateReplace
						}
			`,
					}
				)
				.then((res) => {
					console.log('Post Reussi');
				})
				.catch((err) => {
					throw new Error('Post echoue');
				});

			return await TowingPrivateModel.findById(id);
		},
	},
};
