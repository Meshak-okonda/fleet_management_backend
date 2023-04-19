const mongooseTowingPrivate = require('mongoose');

const TowingPrivateSchema = new mongooseTowingPrivate.Schema({
	idDriver: String,
	status: String,
	imageTowing: { type: Object, require: true },

	// Car informations
	model: { type: String },
	brand: { type: String },
	typeCar: { type: String },
	numberPlaque: { type: String },
	color: { type: String },

	// Person Identity
	name: { type: String },
	lastName: { type: String },
	adress: String,
	phone: String,
	identityPerson: { type: Object },
	pinkCard: String,
	yellowCard: String,

	// Party AV
	hood: { type: Object },
	grille: { type: Object },
	headLightsAV: { type: Object },
	blinkersAV: { type: Object },
	bumperAV: { type: Object },
	wheelArchesAV: { type: Object },
	windShieldAV: { type: Object },

	// Party AR
	lightsAR: { type: Object },
	chest: { type: Object },
	headLightAR: { type: Object },
	turnSignalAR: { type: Object },
	bumperAR: { type: Object },
	wheelArchAR: { type: Object },
	windShieldAR: { type: Object },

	// Party Lat Left
	wingAVLeft: { type: Object },
	doorAVLeft: { type: Object },
	doorARLeft: { type: Object },
	crateArmLeft: { type: Object },
	mirrorLeft: { type: Object },
	boxPanelLeft: { type: Object },
	wingARLeft: { type: Object },

	// Party Lat Right
	wingAVRight: { type: Object },
	doorAVRight: { type: Object },
	doorARRight: { type: Object },
	crateArmRight: { type: Object },
	mirrorRight: { type: Object },
	boxPanelRight: { type: Object },
	wingARRight: { type: Object },

	// More informations
	tireAVLeft: { type: Object },
	tireAVRight: { type: Object },
	tireARLeft: { type: Object },
	tireARRight: { type: Object },

	// after fourrieur informations
	dateEnterPound: { type: String, default: '' },
	VehiclePoundInfo: { type: String, default: '' },
	refPositionTake: { type: String, default: '' },
	refPositionRestitution: { type: String, default: '' },
	dateOutPound: { type: String, default: '' },

	date: { type: String },
	stateVehicle: { type: Object },
	position: { type: Object },
	createdAt: { type: Date, default: Date() },
	delete: { type: Boolean, default: false },
});
module.exports = mongooseTowingPrivate.model(
	'towingPrivates',
	TowingPrivateSchema
);
