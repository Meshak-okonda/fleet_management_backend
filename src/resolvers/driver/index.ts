const Driver = require('../../models/driver');
const bcriptDriver = require('bcryptjs');
require('dotenv').config();

const ErrorDriverMessage = "Le chauffeur n'existe pas";
const ErrorDriverMessageIdentificationMult =
	"Ces identifiants sont déjà utilisés, \n veuillez en choisir d'autres SVP !";

module.exports = {
	Query: {
		getDrivers: async () => await Driver.find(),
		getDriver: async (_, { id }) => {
			const driver = await Driver.findById(id);
			if (!driver || driver.delete)
				throw new Error(ErrorDriverMessage + ' : Chauffeur');
			return driver;
		},
		connectionDriver: async (_, { name, password }) => {
			const nameDriver = name.toLowerCase();
			const driverFind = await Driver.findOne({
				name: nameDriver,
				delete: false,
			});
			if (!driverFind) throw new Error("Nom d'utiliateur Incorrect !");
			const isMatch = await bcriptDriver.compare(password, driverFind.password);
			if (!isMatch) throw new Error('Mot de passe incorrect !');
			return driverFind;
		},
	},
	Mutation: {
		createDriver: async (_, { driver }) => {
			let { name, password } = driver;
			name = name.toLowerCase();

			const driverVerification = await Driver.findOne({
				name,
				delete: false,
			});
			if (driverVerification)
				throw new Error(ErrorDriverMessageIdentificationMult);

			const passDriverHashed = await bcriptDriver.hash(password, 10);
			const newDriver = new Driver({
				...driver,
				name,
				password: passDriverHashed,
			});
			return await newDriver.save();
		},
		deleteDriver: async (_, { id }) => {
			const driver = await Driver.findByIdAndUpdate(id, { delete: true });
			if (!driver) {
				throw new Error(ErrorDriverMessage + ' : Chauffeur');
			}
			return driver;
		},
		updateDriver: async (_, { id, driver }) => {
			const driverUpdate = await Driver.findById(id);
			if (!driverUpdate) throw new Error(ErrorDriverMessage + ' : Chauffeur');
			let { name, password, ...others } = driver;
			name = name.toLowerCase();
			if (password.match(/^(?!\s*$).+/) !== null) {
				const passHashed = await bcriptDriver.hash(password, 10);
				await Driver.findByIdAndUpdate(id, {
					...others,
					name,
					password: passHashed,
				});
			} else {
				await Driver.findByIdAndUpdate(id, {
					...others,
					name,
				});
			}
			return await Driver.findById(id);
		},
		reverseDeleteDriver: async (_, { id }) => {
			const driverExist = await Driver.findById(id);
			if (!driverExist) throw new Error(ErrorDriverMessage + ' : Chauffeur');
			return await Driver.findByIdAndUpdate(id, {
				delete: false,
			});
		},
	},
};
