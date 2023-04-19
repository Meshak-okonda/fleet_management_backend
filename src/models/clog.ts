const mongooseClog = require('mongoose');

const clogController = new mongooseClog.Schema({
	idController: String,
	idSabotier: String,
	status: String,
	images: { type: Object, require: true },

	// Car informations
	typeCar: { type: String },
	numberPlaque: { type: String },
	color: { type: String },
	plage: { type: String },
	zone: { type: String },

	date: { type: String },
	position: { type: Object },
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseClog.model('clogmaker', clogController);
