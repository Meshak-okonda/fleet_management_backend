const { PubSub } = require('graphql-subscriptions');
const pubsub = new PubSub();
const axios = require('axios');
const VehicleVerification = require('../../models/vehicleVerification');
const DriverModel = require('../../models/driver');
const VehicleModel = require('../../models/vehicle');

const ErrorMessage = "Le controle n'existe pas";

require('dotenv').config();


const isSunday = (day, month, year) => {
	let myDate = new Date();
	myDate.setFullYear(year);
	myDate.setMonth(month);
	myDate.setDate(day);
	return myDate.getDay() === 0;
}

async function sendMessage() {
	const date = new Date();
	const day = date.getDate();
	const month = date.getMonth();
	const year = date.getFullYear();
	const dateString = `${day}/0${month + 1}/${year}`;
	if(isSunday(day, month, year)) return;

	const vehicles = await VehicleModel.find({
		delete: false
	});

	for (let i = 0; i < vehicles.length; i++) {
		const control = await VehicleVerification.findOne({
			vehicle: vehicles[i]._id,
			dateVerification: dateString
		});
		// if (!control) {
		// 	const driver = await DriverModel.findById(vehicles[i].idDriver);
		// 	await axios
		// 		.post(
		// 			'https://hooks.slack.com/services/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',
		// 			{
		// 				text: `⛔ Veuillez noter que la voiture ${vehicles[i].name} attribué à ${driver.name || 'personne'} n'a pas été inspecté le ${dateString} ⛔`,
		// 			}
		// 		)
		// 		.then((res) => {
		// 			return 'Post Reussi';
		// 		})
		// 		.catch((err) => {
		// 			return 'Post echoue';
		// 		});
		// }
	}
}


// setInterval(() => {
// 	const hour = new Date().getHours();
// 	if (hour === 16) {
// 		sendMessage();
// 	}
// }, 1000 * 60 * 35);

module.exports = {
	Query: {
		getElementsVerifications: async () =>
			await VehicleVerification.find({ delete: false }),
		getElementsVerification: async (_, { id }) => {
			const verification = await VehicleVerification.findById(id);
			if (!verification || verification.delete === true)
				throw new Error(ErrorMessage + ' : Controle de Journalier');
			return verification;
		},
		getVehicleAllVerificationElements: async (_, { idVehicle }) => {
			const verification = await VehicleModel.findById(idVehicle);
			if (!verification || verification.delete === true)
				throw new Error(ErrorMessage + ' : Véhicule');
			return verification;
		},
		getVehicleVerificationElementsOfOneDay: async (
			_,
			{ idVehicle, dateVerification }
		) => {
			const vehicle = await VehicleModel.findById(idVehicle);
			if (!vehicle || vehicle.delete === true)
				throw new Error(ErrorMessage + ' : Véhicule');

			const verification = await VehicleVerification.findOne({
				idVehicle,
				dateVerification,
				delete: false,
			});
			if (!verification)
				throw new Error(ErrorMessage + ' : Vérification de vehicule');
			return verification;
		},
		getVerifiedVerificationElementsOfOneDay: async (
			_,
			{ idVehicle, dateVerification }
		) => {
			const vehicle = await VehicleModel.findById(idVehicle);
			if (!vehicle || vehicle.delete === true)
				throw new Error(ErrorMessage + ' : Véhicule');

			const verification = await VehicleVerification.findOne({
				idVehicle,
				dateVerification,
				delete: false,
			});
			if (verification)
				throw new Error('Un controle existe déjà à la date selectionner');
			return null;
		},
		getVehicleVerificationElementsByRange: async (_, { idVehicle, range }) => {
			const vehicle = await VehicleModel.findById(idVehicle);
			if (!vehicle) throw new Error(ErrorMessage + ' : Véhicule');
			const verification = await VehicleVerification.find({
				idVehicle,
				dateVerification: { $in: range.split(',') },
				delete: false,
			});
			if (!verification)
				throw new Error(ErrorMessage + ' : Vérification de vehicule');
			return verification;
		},
		getVehicleVerificationElementsByMonth: async (_, { idVehicle, month }) => {
			const vehicle = await VehicleModel.findById(idVehicle);
			if (!vehicle) throw new Error(ErrorMessage + ' : Véhicule');
			const verification = await VehicleVerification.find({
				idVehicle,
				dateVerification: { $regex: new RegExp(month) },
				delete: false,
			});
			if (!verification)
				throw new Error(ErrorMessage + ' : Vérification de vehicule');
			return verification;
		},
		getVehicleVerificationElementsByYear: async (_, { idVehicle, year }) => {
			const vehicle = await VehicleModel.findById(idVehicle);
			if (!vehicle) throw new Error(ErrorMessage + ' : Véhicule');

			let statMonths = [];
			for (let month of [
				'01',
				'02',
				'03',
				'04',
				'05',
				'06',
				'07',
				'08',
				'09',
				'10',
				'11',
				'12',
			]) {
				let dataMonth = await VehicleVerification.find({
					idVehicle,
					dateVerification: { $regex: new RegExp(`${month}/${year}`) },
					delete: false,
				});
				let dataSendMonth = {};
				dataMonth.map((dataDayValue) => {
					for (const property in dataDayValue) {
						if (
							dataDayValue[property] &&
							dataDayValue[property].state &&
							property !== 'stateVehicle'
						) {
							if (!dataSendMonth[property]) {
								dataSendMonth[property] = {
									good: 0,
									damaged: 0,
									missing: 0,
								};
							}
							switch (dataDayValue[property].state) {
								case 'Bonne':
									dataSendMonth[property].good =
										dataSendMonth[property].good + 1;
									break;
								case 'Bon':
									dataSendMonth[property].good =
										dataSendMonth[property].good + 1;
									break;
								case 'Manque':
									dataSendMonth[property].missing =
										dataSendMonth[property].missing + 1;
									break;
								case 'Abimé':
									dataSendMonth[property].damaged =
										dataSendMonth[property].damaged + 1;
									break;
							}
						} else if (property === 'mileage') {
							dataSendMonth[property] = dataDayValue[property];
						} else if (property === 'stateVehicle') {
							if (!dataSendMonth[property]) {
								dataSendMonth[property] = {
									good: 0,
									damaged: 0,
									missing: 0,
								};
							}
							dataSendMonth[property].good += dataDayValue[property].good;
							dataSendMonth[property].damaged += dataDayValue[property].damaged;
							dataSendMonth[property].missing += dataDayValue[property].missing;
						}
					}
				});
				statMonths.push({
					month,
					dataMonth: dataSendMonth,
				});
			}
			return statMonths;
		},
	},
	Mutation: {
		createVehicleVerification: async (_, { vehicleVerification }) => {
			const { idVehicle } = vehicleVerification;
			const vehicle = await VehicleModel.findById(idVehicle);
			if (!vehicle || vehicle.delete === true)
				throw new Error(ErrorMessage + ' : Véhicule');

			let driver: any = null;
			if(vehicle.idDriver.match(/^(?!\s*$).+/) !== null){
				driver = await DriverModel.findById(vehicle.idDriver);
			}
			if (!driver) return;
			const dateReplace = vehicleVerification.dateVerification
				.split('/')
				.join('-');
			await axios
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `Un Controle est fait à la date  ${
							vehicleVerification.dateVerification
						} \nVehicule: ${vehicle.name} \n Chauffeur: ${
							driver.name ? `${driver.name} ${driver.lastName}` : 'Aucune donnée'
						} \n Total Element Bon Etat : ${
							vehicleVerification.stateVehicle.good
						} \nTotal Element Abimé :${
							vehicleVerification.stateVehicle.damaged
						}\nTotal Element Manquant :${
							vehicleVerification.stateVehicle.missing
						}\n Le Kilometrage est à : ${
							vehicleVerification.mileage
						}\n Voir le controle : ${
							process.env.URL_BASE_FRONT_OFFICE +
							vehicleVerification.idVehicle +
							'/' +
							dateReplace
						}
			`,
					}
				)
				.then((res) => {
					return 'Post Reussi';
				})
				.catch((err) => {
					return 'Post echoue';
				});

			const verification = new VehicleVerification(vehicleVerification);
			pubsub.publish('VERIFICATION_VEHICLE', {
				VerificationVehicleAdded: verification,
			});
			return await verification.save();
		},

		deleteVehicleVerification: async (_, { id }) => {
			const verification = await VehicleVerification.findById(id);
			if (!verification || verification.delete === true)
				throw new Error(ErrorMessage + ' : Controle de Vehicule');

			await VehicleVerification.findByIdAndUpdate(id, { delete: true });
			return VehicleVerification;
		},
		updateVehicleVerification: async (_, { id, updateVehicleVerification }) => {
			const vehicle = await VehicleModel.findById(
				updateVehicleVerification.idVehicle
			);
			const driver = await DriverModel.findById(vehicle.idDriver);
			const dateReplace = updateVehicleVerification.dateVerification
				.split('/')
				.join('-');
			await axios
				.post(
					'https://hooks.slack.com/services/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',
					{
						text: `Mis à jour du controle à la date  ${
							updateVehicleVerification.dateVerification
						} \nVehicule : ${vehicle.name || 'Aucune donnée'} \n Chauffeur: ${
							driver.name || 'Aucune donnée'
						} \n Total Element Bon Etat : ${
							updateVehicleVerification.stateVehicle.good
						} \nTotal Element Abimé :${
							updateVehicleVerification.stateVehicle.damaged
						}\nTotal Element Manquant :${
							updateVehicleVerification.stateVehicle.missing
						}\nVoir le controle : ${
							process.env.URL_BASE_FRONT_OFFICE +
							updateVehicleVerification.idVehicle +
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
			const verification = await VehicleVerification.findById(id);
			if (!verification || verification.delete === true)
				throw new Error(ErrorMessage + ' : Verification de Vehicule');

			await VehicleVerification.findByIdAndUpdate(
				id,
				updateVehicleVerification
			);

			return await VehicleVerification.findById(id);
		},
	},
	Subscription: {
		VerificationVehicleAdded: {
			subscribe: () => pubsub.asyncIterator(['VERIFICATION_VEHICLE']),
		},
	},
};
