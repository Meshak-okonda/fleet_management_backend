const mongooseVehHistory = require('mongoose');

const mongooseVehicleHistory = new mongooseVehHistory.Schema({
	idDriver: { type: String, required: true },
	idVehicle: { type: String, required: true },
	createdAt: { type: String, default: new Date().toISOString() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseVehHistory.model(
	'driverHistory',
	mongooseVehicleHistory
);
