const mongooseSab = require('mongoose');

const sabotierSchema = new mongooseSab.Schema({
	name: { type: String, required: true },
	lastName: { type: String, require: true },
	password: { type: String, required: true },
	sex: String,
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseSab.model('sabotier', sabotierSchema);
