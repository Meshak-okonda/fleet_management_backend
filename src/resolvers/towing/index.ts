const axiosPri = require('axios');
const TowingModel = require('../../models/towing.ts');
const DriverModelPri = require('../../models/driver');
const ErrorMessageTowing = "Le remorque n'existe pas";

require('dotenv').config();

const dateFormat = () => {
	const date = new Date();
	const hour = date.getHours();
	const minutes = date.getMinutes() + 1;
	return `${hour}H${minutes} minutes`;
};

module.exports = {
	Query: {
		getTowings: async () =>
			await TowingModel.find(),
		getTowingElementsOfOneDay: async (_, { date }) => {
			const towing = await TowingModel.find({
				date,
				delete: false,
			});
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessage + ' : remorquage de Journalier');
			return towing;
		},
		getTowingElementsByRange: async (_, { range }) => {
			const towing = await TowingModel.find({
				date: { $in: range.split(',') },
				delete: false,
			});
			if (!towing)
				throw new Error(ErrorMessage + ' : Vérification de vehicule');
			return towing;
		},
		getTowingElementsByMonth: async (_, { month }) => {
			const towing = await TowingModel.find({
				date: { $regex: new RegExp(month) },
				delete: false,
			});
			if (!towing)
				throw new Error(ErrorMessage + ' : Vérification de vehicule');
			return towing;
		},
	},
	Mutation: {
		createVehicleTowing: async (_, { vehicleTowing }) => {
			const towingSchema = new TowingModel(vehicleTowing);
			const towing = await towingSchema.save();

			const dateReplace = vehicleTowing.date
				.split('/')
				.join('-');
			await axiosPri
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `:car: :car: :car: :car: :car:  \nUn Remorquage vient d'etre fait date  ${
							vehicleTowing.date
							}\nModel: ${vehicleTowing.model}\nType: ${vehicleTowing.type}\nNom du propriètaire: ${
							 `${vehicleTowing.name} ${vehicleTowing.lastName}`
						}\nHabite au: ${vehicleTowing.adress}\nTotal Bon Etat : ${
							towing.stateVehicle.good
						}\nTotal Abimé: ${
							towing.stateVehicle.damaged
						}\nTotal Rayure: ${
							towing.stateVehicle.grooves
						}\nTotal Hors service: ${
							towing.stateVehicle.outService
						}\nVoir le controle: ${
							process.env.URL_BASE_FRONT_OFFICE +
							"towing/" +
							towing.id
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
		createStandingTowing: async (_, { standingTowing }) => {
			const towingSchema = new TowingModel(standingTowing);
			const towing = await towingSchema.save();
			let driver;
			if(standingTowing.idDriver){
				driver = await DriverModelPri.findById(standingTowing.idDriver);
			}
			await axiosPri
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `:car: :car: :car: :car: :car:  \nUn Remorquage type police vient d'etre fait à ${
							dateFormat()
							}\nNom du chauffeur: ${
							 `${driver.name} ${driver.lastName}`
						}\nImage gauche: ${standingTowing.imageTowing.imageLeft}\nImage droite: ${standingTowing.imageTowing.imageRight}\nImage arrière: ${standingTowing.imageTowing.imageBack}\nImage Avant: ${
							standingTowing.imageTowing.imageFront
						}\nEn attente de validation`,
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
		deleteVehicleTowing: async (_, { id }) => {
			const towing = await TowingModel.findById(id);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessage + ' : Controle de Vehicule');

			await TowingModel.findByIdAndUpdate(id, { delete: true });
			return TowingModel;
		},
		updateVehicleTowing: async (_, { id, updateVehicleTowing }) => {
			const vehicle = await VehicleModel.findById(
				updateVehicleTowing.idVehicle
			);
			const dateReplace = updateVehicleTowing.date
				.split('/')
				.join('-');
			await axiosPri
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `Mis à jour du controle à la date  ${
							updateVehicleTowing.date
						} \nVehicule : ${vehicle.name || 'Aucune donnée'} \n Chauffeur: ${
							'Aucune donnée'
						} \n Total Element Bon Etat : ${
							updateVehicleTowing.stateVehicle.good
						} \nTotal Element Abimé :${
							updateVehicleTowing.stateVehicle.damaged
						}\nTotal Element Manquant :${
							updateVehicleTowing.stateVehicle.missing
						}\nVoir le controle : ${
							process.env.URL_BASE_FRONT_OFFICE +
							updateVehicleTowing.idVehicle +
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
			const towing = await TowingModel.findById(id);
			if (!towing || towing.delete === true)
				throw new Error(ErrorMessage + ' : Verification de Vehicule');

			await TowingModel.findByIdAndUpdate(
				id,
				updateVehicleTowing
			);

			return await TowingModel.findById(id);
		},
	},
};
