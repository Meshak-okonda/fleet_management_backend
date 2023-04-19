const ClogMaker = require('../../models/clog');
const PlageModel = require('../../models/plage');
require('dotenv').config();

const ErrorClogMessage = "Le sabotage n'existe pas";

(async () => {
   const ab = await ClogMaker.find({});
 	ab.map((e)=>console.log(e._id));
 })();

module.exports = {
  Query: {
    getPlages: async () => await PlageModel.find({ delete: false }),
		getClogMakers: async () => await ClogMaker.find({ delete: false }),
		getClogMakersOfController: async (_, { id }) => await ClogMaker.find({idController: id}),
    getClogMakersOfSabotier: async (_, { id }) => await ClogMaker.find({idSabotier: id}),
		getClogMakerOfOneDay: async (_, { date }) => await ClogMaker.find({date: date}),
	},
	Mutation: {
		createClogMaker: async (_, { clogMaker }) => {
			const newClogMaker = new ClogMaker(clogMaker);
			return await newClogMaker.save();
		},
		updateClogMakerStatus: async (_, { id, status, idSabotier }) => {
      const updateClog = await ClogMaker.findById(id);
      if (!updateClog) throw new Error(ErrorClogMessage);
      let update;
      if (idSabotier){
        update = await ClogMaker.findByIdAndUpdate(id, {
          idSabotier,
          status
        });
      } else {
        update = await ClogMaker.findByIdAndUpdate(id, {
          status
        });
      }
 
      return update;
    },
    createPlage: async (_, { plage }) => {
      const newPlage = new PlageModel(plage);
			return await newPlage.save();
    },
    updatePlage: async (_, { id, plage }) => {
      const updatePlage = await PlageModel.findById(id);
      if (!updatePlage) throw new Error("la plage n'existe pas ! ");

      const update = await PlageModel.findByIdAndUpdate(id, {
        ...plage
      });
      return update;
    },
    deletePlage: async (_, { id }) => {
      const updatePlage = await PlageModel.findById(id);
      if (!updatePlage) throw new Error("la plage n'existe pas ! ");

      return await PlageModel.findByIdAndUpdate(id, {
        delete: true
      });
    }
	},
};
