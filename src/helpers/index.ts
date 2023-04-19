const ResponsableModel = require('../models/responsable');
const DriverModels = require('../models/driver');

module.exports = async function VerifyCredential(id) {
	const responsable = await ResponsableModel.findById(id);
	if (responsable) return { ...responsable.toObject(), type: 'responsable' };

	const driver = await DriverModels.findById(id);
	if (driver) return { ...driver.toObject(), type: 'driver' };

	return null;
};
