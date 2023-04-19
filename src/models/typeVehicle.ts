const mongooseTypeVeh = require('mongoose');

const typeVehicleSchema = new mongooseTypeVeh.Schema({
	name: { type: String, require: true },
	description: String,
	startYear: { type: String, required: true },
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseTypeVeh.model('typeVehicle', typeVehicleSchema);
