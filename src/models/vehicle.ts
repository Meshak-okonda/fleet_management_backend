const mongooseVeh = require('mongoose');

const vehicleSchema = new mongooseVeh.Schema({
	idDriver: String,
	idTypeVehicle: { type: String, require: true },
	name: { type: String, required: true },
	model: { type: String, required: true },
	gpsData: String,
	serie: String,
	image: [String],
	color: String,
	startYear: String,
	yearConstruction: String,
	registrationNumber: { type: String, required: true },
	power: String,
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseVeh.model('vehicle', vehicleSchema);
