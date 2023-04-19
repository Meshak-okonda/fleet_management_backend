const driver = require('./driver');
const responsable = require('./responsable');
const vehicle = require('./vehicle');
const pointer = require('./pointer');
const verification = require('./verification');
const towingPolice = require('./towingPolice');
const towingPrivate = require('./towingPrivate');
const sabotier = require('./sabotier');
const controller = require('./controller');
const clogmaker = require('./clogmaker');
module.exports = {
	Query: {
		...responsable.Query,
		...driver.Query,
		...vehicle.Query,
		...verification.Query,
		...towingPolice.Query,
		...pointer.Query,
		...towingPrivate.Query,
		...sabotier.Query,
		...controller.Query,
		...clogmaker.Query
	},
	Mutation: {
		...responsable.Mutation,
		...driver.Mutation,
		...vehicle.Mutation,
		...verification.Mutation,
		...towingPolice.Mutation,
		...pointer.Mutation,
		...towingPrivate.Mutation,
		...sabotier.Mutation,
		...controller.Mutation,
		...clogmaker.Mutation,
	},
	Subscription: {
		...verification.Subscription,
	},
};
