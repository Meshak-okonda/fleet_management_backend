const Vehicle = require('../../models/vehicle');
const TypeVehicle = require('../../models/typeVehicle');
const vehicleHistory = require('../../models/vehicleHistory');
const VehicleVerificationModel = require('../../models/vehicleVerification');
require('dotenv').config();

const ErrorMessageVehicle = "Le Vehicule n'existe pas";
const ErrorMessageHistory = "L'historique n'existe pas";
const ErrorMessageVehicleIdentificationMult =
	"Ces identifiants sont déjà utilisés, \n veuillez en choisir d'autres SVP !";

module.exports = {
	Query: {
		getVehicles: async () => await Vehicle.find(),
		getVehicle: async (_, { id }) => {
			const vehicle = await Vehicle.findById(id);
			if (!vehicle || vehicle.delete == true) {
				throw new Error(ErrorMessageVehicle + ' : Véhicule');
			}
			return vehicle;
		},

		getTypeVehicles: async () => await TypeVehicle.find({ delete: false }),
		getTypeVehicle: async (_, { id }) => {
			const type = await TypeVehicle.findById(id);
			if (!type || type.delete == true)
				throw new Error(ErrorMessageVehicle + ' : Type de véhicule');
			return type;
		},

		getVehicleHistoryForOneVehicle: async (_, { id }) => {
			const vehHistory = await vehicleHistory.find({
				idVehicle: id,
				delete: false,
			});
			if (!vehHistory)
				throw new Error(ErrorMessageHistory + 'Historique du vehicule');
			return vehHistory;
		},
		getVehicleHistories: async () => {
			const vehHistory = await vehicleHistory.find({ delete: false });
			if (!vehHistory)
				throw new Error(ErrorMessageHistory + 'Historique des vehicules');
			return vehHistory;
		},
	},
	Mutation: {
		createVehicle: async (_, { vehicle }) => {
			const { idDriver } = vehicle;
			if (!idDriver) {
				const newVehicle = new Vehicle(vehicle);
				await newVehicle.save();
				return newVehicle;
			}
			const otherVehicleWithIdDriver = await Vehicle.find({
				$and: [{ idDriver: idDriver }],
			});
			if (otherVehicleWithIdDriver.length > 0) {
				otherVehicleWithIdDriver.forEach(async (veh) => {
					await Vehicle.findByIdAndUpdate(veh._id.toString(), { idDriver: '' });
				});
			}
			const newVehicle = new Vehicle(vehicle);
			const { _id } = newVehicle;
			const driverHisto = new vehicleHistory({
				idDriver: idDriver,
				idVehicle: _id.toString(),
			});
			await driverHisto.save();
			await newVehicle.save();
			return newVehicle;
		},
		deleteVehicle: async (_, { id }) => {
			const vehicle = await Vehicle.findByIdAndUpdate(id, {
				idDriver: '',
				delete: true,
			});
			if (!vehicle) throw new Error(ErrorMessageVehicle + ' : Véhicule');

			if (!vehicle || vehicle.delete === true)
				throw new Error(ErrorMessageVehicle + ' : Véhicule');

			await VehicleVerificationModel.updateMany(
				{ idVehicle: id },
				{ delete: true }
			);

			await vehicleHistory.updateMany({ idVehicle: id }, { delete: true });

			return vehicle;
		},
		updateVehicle: async (_, { id, vehicle }) => {
			const vehExist = await Vehicle.findById(id);
			if (!vehExist || vehExist.delete === true)
				throw new Error(ErrorMessageVehicle + ' : Véhicule');

			const { idDriver } = vehicle;
			if (!idDriver) {
				const vehicleUpdate = await Vehicle.findByIdAndUpdate(id, vehicle);
				await vehicleUpdate.save();
				return vehicleUpdate;
			}
			const otherVehicleWithIdDriver = await Vehicle.find({
				$and: [{ idDriver: idDriver }, { name: { $ne: vehExist.name } }],
			});
			if (otherVehicleWithIdDriver.length > 0) {
				otherVehicleWithIdDriver.forEach(async (veh) => {
					await Vehicle.findByIdAndUpdate(veh._id.toString(), { idDriver: '' });
				});
			}
			if (
				idDriver.match(/^(?!\s*$).+/) !== null &&
				idDriver !== vehExist.idDriver
			) {
				const vehHistory = new vehicleHistory({
					idDriver: idDriver,
					idVehicle: id,
				});
				await vehHistory.save();
			}
			await Vehicle.findByIdAndUpdate(id, vehicle);
			return await Vehicle.findById(id);
		},
		reverseDeleteVehicle: async (_, { id }) => {
			const vehExist = await Vehicle.findById(id);
			if (!vehExist) throw new Error(ErrorMessageVehicle + ' : Véhicule');
			return await Vehicle.findByIdAndUpdate(id, {
				delete: false,
			});
		},
		createTypeVehicle: async (_, { typeVehicle }) => {
			const type = new TypeVehicle(typeVehicle);
			await type.save();
			return type;
		},
		deleteTypeVehicle: async (_, { id }) => {
			const type = await TypeVehicle.findById(id);
			if (!type || type.delete === true)
				throw new Error(ErrorMessageVehicle + ' : Type de véhicule');
			return await TypeVehicle.findByIdAndUpdate(id, { delete: true });
		},
		updateTypeVehicle: async (_, { id, typeVehicle }) => {
			const type = await TypeVehicle.findById(id);
			if (!type || type.delete === true)
				throw new Error(ErrorMessageVehicle + ' : Type de véhicule');

			await TypeVehicle.findByIdAndUpdate(id, typeVehicle);
			return await TypeVehicle.findById(id);
		},
	},
};
