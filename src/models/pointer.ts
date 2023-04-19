const mongoosePoi = require('mongoose');

const pointerSchema = new mongoosePoi.Schema({
	name: { type: String, required: true },
	lastName: { type: String, require: true },
	password: { type: String, required: true },
	age: Number,
	sex: String,
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongoosePoi.model('pointer', pointerSchema);
