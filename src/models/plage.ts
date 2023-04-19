const mongoosePlage = require('mongoose');

const plageController = new mongoosePlage.Schema({
	name: String,
	zone: String,
	delete: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date() },
});
module.exports = mongoosePlage.model('plage', plageController);
