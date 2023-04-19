const mongooseDri = require('mongoose');

const driverSchema = new mongooseDri.Schema({
	name: { type: String, required: true },
	lastName: { type: String, require: true },
	password: { type: String, required: true },
	licenseValidity: { type: String, required: true },
	email: String,
	phone: String,
	image: [String],
	age: Number,
	sex: String,
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseDri.model('driver', driverSchema);
