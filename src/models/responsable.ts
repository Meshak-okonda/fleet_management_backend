const mongooseRes = require('mongoose');

const responsableSchema = new mongooseRes.Schema({
	name: { type: String, required: true },
	lastName: { type: String, require: true },
	password: { type: String, required: true },
	email: String,
	phone: String,
	image: String,
	age: Number,
	sex: String,
	createdAt: { type: Date, default: Date() },
	superAdm: { type: Boolean, default: false },
	addVehicle: { type: Boolean, default: true },
	upVehicle: { type: Boolean, default: true },
	delVehicle: { type: Boolean, default: true },
	addDriver: { type: Boolean, default: true },
	upDriver: { type: Boolean, default: true },
	delDriver: { type: Boolean, default: true },
	addResponsable: { type: Boolean, default: true },
	upResponsable: { type: Boolean, default: true },
	delResponsable: { type: Boolean, default: true },
	delete: { type: Boolean, default: false },
});

module.exports = mongooseRes.model('responsable', responsableSchema);
