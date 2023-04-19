const axiosP = require('axios');
const TowingPoliceModel = require('../../models/towingPolice');
const DriverModelss = require('../../models/driver');
const ErrorMessageTowingPolice = "Le remorque n'existe pas";

require('dotenv').config();

const dateFormats = () => {
	const date = new Date();
	const hour = date.getHours() + 1;
	const minutes = date.getMinutes() + 1;
	return `${hour}H${minutes} minutes`;
}

const getStatusValidate = (status) => {
	let response;
	switch (status) {
		case "STAND":
			response = "⏲ en attente de validation ⏲"
			break;
		case "NOT_GOOD":
				response = "⛔ non conforme après validation ⛔"
				break;
		case "GOOD":
			response = "✅ conforme après validation ✅"
			break;
		default:
			response = "Erreur système"
			break;
	}
	return response;
}

module.exports = {
	Query: {
		getPoliceTowings: async () =>
			await TowingPoliceModel.find(),
			getPoliceTowing: async (_, {id}) =>
			await TowingPoliceModel.findById(id),
		getPoliceTowingStandDriver: async (_, {date, idDriver}) => await TowingPoliceModel.find({date, idDriver, delete: false}),
		getPoliceTowingElementsOfOneDay: async (_, { date }) => {
			const towing = await TowingPoliceModel.find({
				date,
				delete: false,
			});

			return towing;
		},
		getPoliceTowingElementsByRange: async (_, { range }) => {
			const towing = await TowingPoliceModel.find({
				date: { $in: range.split(',') },
				delete: false,
			});
			if (!towing)
				throw new Error(ErrorMessageTowingPolice);
			return towing;
		},
		getPoliceTowingElementsByMonth: async (_, { month }) => {
			const towing = await TowingPoliceModel.find({
				date: { $regex: new RegExp(month) },
				delete: false,
			});
			if (!towing)
				throw new Error(ErrorMessageTowingPolice);
			return towing;
		},
	},
	Mutation: {
		createVehiclePoliceTowing: async (_, { vehiclePoliceTowing }) => {
			const towingSchema = new TowingPoliceModel(vehiclePoliceTowing);
			const towing = await towingSchema.save();

			const dateReplace = vehiclePoliceTowing.date
				.split('/')
				.join('-');
			await axiosP
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `:car: :car: :car: :car: :car:  \nUn Remorquage vient d'etre fait date  ${
							vehiclePoliceTowing.date
						}\n\nStatus: ${getStatusValidate(
							vehiclePoliceTowing.status
						)} \nModel: ${vehiclePoliceTowing.model}\nType: ${
							vehiclePoliceTowing.type
						}\nNom du propriètaire: ${`${vehiclePoliceTowing.name} ${vehiclePoliceTowing.lastName}`}\n\nTotal Bon Etat : ${
							towing.stateVehicle.good
						}\nTotal Abimé: ${towing.stateVehicle.damaged}\nTotal Rayure: ${
							towing.stateVehicle.grooves
						}\nTotal Hors service: ${
							towing.stateVehicle.outService
						}\nVoir le controle: ${
							process.env.URL_BASE_FRONT_OFFICE + 'towing/police/' + towing.id
						}`,
					}
				)
				.then((res) => {
					return 'Post Reussi';
				})
				.catch((err) => {
					return 'Post echoue';
				});

			return towing;
		},
		createStandingPoliceTowing: async (_, { standingPoliceTowing }) => {
			const towingSchema = new TowingPoliceModel(standingPoliceTowing);
			const towing = await towingSchema.save();
			let driver;
			if(standingPoliceTowing.idDriver){
				driver = await DriverModelss.findById(standingPoliceTowing.idDriver);
			}

			await axiosP
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `:car: :car: :car: :car: :car: \nUn Remorquage vient d'etre fait à ${
							dateFormats()
							}\nStatus: ${getStatusValidate(standingPoliceTowing.status)}\nNom du chauffeur: ${
							 `${driver.name} ${driver.lastName}`
							}\n Image de l'infraction \n --------------------- \n${standingPoliceTowing.imageTowing.infractionImage && standingPoliceTowing.imageTowing.infractionImage.length > 0 ? standingPoliceTowing.imageTowing.infractionImage.map((e) => `${process.env.LIEN_BACK_IMAGE}${e} \n`) : "Aucune image"}`,
					}
				)
				.then((res) => {
					return 'Post Reussi';
				})
				.catch((err) => {
					return 'Post echoue';
				});

			return towing;
		},
		validatePoliceTowing: async (_, { id, validateVehicleTowing }) => {
			const towing = await TowingPoliceModel.findByIdAndUpdate(id, validateVehicleTowing);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessageTowingPolice);

			await axiosP
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `:car: :car: :car: :car: :car:\nValidation remorquage\n---------------------\nStatus: ${getStatusValidate(validateVehicleTowing.status)}\nNom du propriètaire: ${
							 `${validateVehicleTowing.name} ${validateVehicleTowing.lastName}`
						}\nMarque: ${validateVehicleTowing.brand}\nModel: ${validateVehicleTowing.model}\nTotal Bon Etat : ${
							validateVehicleTowing.stateVehicle.good
						}\nTotal Abimé: ${
							validateVehicleTowing.stateVehicle.damaged
						}\nTotal Rayure: ${
							validateVehicleTowing.stateVehicle.grooves
						}\nTotal Hors service: ${
							validateVehicleTowing.stateVehicle.outService
						}\nVoir le controle: ${
							process.env.URL_BASE_FRONT_OFFICE +
							"towing/police/" +
							id
						}\n\n\n\n\nImage de l'infraction \n --------------------- \n${validateVehicleTowing.imageTowing.infractionImage && validateVehicleTowing.imageTowing.infractionImage.length > 0 ? validateVehicleTowing.imageTowing.infractionImage.map((e: any) => `${process.env.LIEN_BACK_IMAGE}${e} \n`) : "Aucune image"}`,
					}
				)
				.then((res) => {
					return 'Post Reussi';
				})
				.catch((err) => {
					return 'Post echoue';
				});
			await TowingPoliceModel.findByIdAndUpdate(
				id,
				validateVehicleTowing
			);
			return await TowingPoliceModel.findById(id);
		},
		deleteVehiclePoliceTowing: async (_, { id }) => {
			const towing = await TowingPoliceModel.findById(id);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessageTowingPolice);

			await TowingPoliceModel.findByIdAndUpdate(id, { delete: true });
			return TowingPoliceModel;
		},
		updateVehiclePoliceTowing: async (_, { id, updateVehiclePoliceTowing }) => {
			const vehicle = await VehicleModel.findById(
				updateVehiclePoliceTowing.idVehicle
			);
			const dateReplace = updateVehiclePoliceTowing.date
				.split('/')
				.join('-');

			const towing = await TowingPoliceModel.findById(id);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessageTowingPolice);

			await TowingPoliceModel.findByIdAndUpdate(
				id,
				updateVehiclePoliceTowing
			);
			await axiosP
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `Mis à jour du controle à la date  ${
							updateVehiclePoliceTowing.date
						} \nVehicule : ${vehicle.name || 'Aucune donnée'} \n Chauffeur: ${
							'Aucune donnée'
						} \n Total Element Bon Etat : ${
							updateVehiclePoliceTowing.stateVehicle.good
						} \nTotal Element Abimé :${
							updateVehiclePoliceTowing.stateVehicle.damaged
						}\nTotal Element Manquant :${
							updateVehiclePoliceTowing.stateVehicle.missing
						}\nVoir le controle : ${
							process.env.URL_BASE_FRONT_OFFICE +
							updateVehiclePoliceTowing.idVehicle +
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

			return await TowingPoliceModel.findById(id);
		},
	},
};
