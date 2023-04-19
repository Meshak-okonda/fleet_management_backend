const { gql } = require('apollo-server-express');

module.exports = gql`
	type Responsable {
		id: ID!
		name: String!
		lastName: String!
		password: String!
		email: String
		phone: String
		image: String
		age: Int
		sex: String
		superAdm: Boolean
		addVehicle: Boolean
		upVehicle: Boolean
		delVehicle: Boolean
		addDriver: Boolean
		upDriver: Boolean
		delDriver: Boolean
		addResponsable: Boolean
		upResponsable: Boolean
		delResponsable: Boolean
		token: String
		createdAt: String
		delete: Boolean
	}

	type Driver {
		id: ID!
		name: String
		lastName: String!
		password: String!
		licenseValidity: String!
		email: String
		phone: String
		image: [String]
		age: Int
		sex: String
		createdAt: String
		delete: Boolean
	}

	type Vehicle {
		id: ID!
		idDriver: String
		idTypeVehicle: String
		name: String!
		model: String!
		serie: String!
		gpsData: String
		image: [String]
		color: String
		yearConstruction: String
		startYear: String
		registrationNumber: String
		power: String
		createdAt: String
		delete: Boolean
	}

	type TypeVehicle {
		id: ID!
		name: String!
		description: String!
		startYear: String!
	}

	type stateElement {
		state: String!
		image: [String]
		comment: String
	}

	type recapState {
		good: Int!
		damaged: Int!
		missing: Int!
	}

	type ElementsVerification {
		id: ID!
		idVehicle: String!
		honk: stateElement!
		motor: stateElement!
		stopLight: stateElement!
		startUp: stateElement!
		handBrake: stateElement
		stricken: stateElement!
		siegeState: stateElement!
		ceilingState: stateElement!
		windshieldConditionAV: stateElement!
		windshieldConditionAR: stateElement!
		carStateOut: stateElement!
		carStateIn: stateElement!
		shockAbsorbersAV: stateElement!
		shockAbsorbersAR: stateElement!
		brakingSystem: stateElement!
		radioAndReader: stateElement!
		reserveTire: stateElement!
		leftAndRightTireAV: stateElement!
		leftAndRightTireAR: stateElement!
		gironfardOperation: stateElement!
		flashingOperationAV: stateElement!
		flashingOperationAR: stateElement!
		warningLightsOperation: stateElement!
		windshieldWipers: stateElement!
		mechanismOperation: stateElement!
		cric: stateElement!
		wheelWrench: stateElement!
		cricRemover: stateElement!
		mileage: String!
		dateVerification: String!
		stateVehicle: recapState!
		createdAt: String
		delete: Boolean
	}

	type recapStateTowing {
		good: Int!
		damaged: Int!
		grooves: Int!
		outService: Int!
	}

	type position {
		lat: Float!
		long: Float!
	}

	type identityPerson {
		type: String
		number: String
	}

	type imageTowing {
		infractionImage: [String]
		imageLeft: String!
		imageRight: String!
		imageFront: String!
		imageBack: String!
	}

	type imageClogMaker {
		carImage: [String]
	}


	type ElementVerificationPoliceTowing {
		id: ID!
		idDriver: String!
		status: String!
		imageTowing: imageTowing!

		model: String
		brand: String
		typeCar: String
		numberPlaque: String
		color: String
		pinkCard: String
		yellowCard: String
		# // Person Identity
		name: String
		lastName: String
		adress: String
		phone: String
		identityPerson: identityPerson
		# // Party AV
		hood: stateElement
		grille: stateElement
		headLightsAV: stateElement
		blinkersAV: stateElement
		bumperAV: stateElement
		wheelArchesAV: stateElement
		windShieldAV: stateElement
		# // Party AR
		lightsAR: stateElement
		chest: stateElement
		headLightAR: stateElement
		turnSignalAR: stateElement
		bumperAR: stateElement
		wheelArchAR: stateElement
		windShieldAR: stateElement
		# // Party Lat Left
		wingAVLeft: stateElement
		doorAVLeft: stateElement
		doorARLeft: stateElement
		crateArmLeft: stateElement
		mirrorLeft: stateElement
		boxPanelLeft: stateElement
		wingARLeft: stateElement
		# // Party Lat Right
		wingAVRight: stateElement
		doorAVRight: stateElement
		doorARRight: stateElement
		crateArmRight: stateElement
		mirrorRight: stateElement
		boxPanelRight: stateElement
		wingARRight: stateElement
		# // More informations
		tireAVLeft: stateElement
		tireAVRight: stateElement
		tireARLeft: stateElement
		tireARRight: stateElement

		# after fourrieur informations
		dateEnterPound: String
		VehiclePoundInfo: String
		refPositionTake: String
		refPositionRestitution: String
		dateOutPound: String

		date: String
		stateVehicle: recapStateTowing
		position: position
		createdAt: String
		delete: Boolean
	}

	type ElementVerificationPrivateTowing {
		id: ID!
		idDriver: String!
		status: String!
		imageTowing: imageTowing!

		model: String
		brand: String
		typeCar: String
		numberPlaque: String
		color: String
		pinkCard: String
		yellowCard: String
		# // Person Identity
		name: String
		lastName: String
		adress: String
		phone: String
		identityPerson: identityPerson
		# // Party AV
		hood: stateElement
		grille: stateElement
		headLightsAV: stateElement
		blinkersAV: stateElement
		bumperAV: stateElement
		wheelArchesAV: stateElement
		windShieldAV: stateElement
		# // Party AR
		lightsAR: stateElement
		chest: stateElement
		headLightAR: stateElement
		turnSignalAR: stateElement
		bumperAR: stateElement
		wheelArchAR: stateElement
		windShieldAR: stateElement
		# // Party Lat Left
		wingAVLeft: stateElement
		doorAVLeft: stateElement
		doorARLeft: stateElement
		crateArmLeft: stateElement
		mirrorLeft: stateElement
		boxPanelLeft: stateElement
		wingARLeft: stateElement
		# // Party Lat Right
		wingAVRight: stateElement
		doorAVRight: stateElement
		doorARRight: stateElement
		crateArmRight: stateElement
		mirrorRight: stateElement
		boxPanelRight: stateElement
		wingARRight: stateElement
		# // More informations
		tireAVLeft: stateElement
		tireAVRight: stateElement
		tireARLeft: stateElement
		tireARRight: stateElement

		# after fourrieur informations
		dateEnterPound: String
		VehiclePoundInfo: String
		refPositionTake: String
		refPositionRestitution: String
		dateOutPound: String

		date: String
		stateVehicle: recapStateTowing
		position: position
		createdAt: String
		delete: Boolean
	}

	type ElementsVerificationDataFormat {
		honk: recapState
		motor: recapState
		stopLight: recapState
		startUp: recapState
		handBrake: recapState
		stricken: recapState
		siegeState: recapState
		ceilingState: recapState
		windshieldConditionAV: recapState
		windshieldConditionAR: recapState
		carStateOut: recapState
		carStateIn: recapState
		shockAbsorbersAV: recapState
		shockAbsorbersAR: recapState
		brakingSystem: recapState
		radioAndReader: recapState
		reserveTire: recapState
		leftAndRightTireAV: recapState
		leftAndRightTireAR: recapState
		gironfardOperation: recapState
		flashingOperationAV: recapState
		flashingOperationAR: recapState
		warningLightsOperation: recapState
		windshieldWipers: recapState
		mechanismOperation: recapState
		cric: recapState
		wheelWrench: recapState
		cricRemover: recapState
		mileage: String
		stateVehicle: recapState
	}

	type statYearFormatData {
		month: String!
		dataMonth: ElementsVerificationDataFormat
	}

	type vehicleHistory {
		idDriver: String!
		idVehicle: String!
		createdAt: String!
		delete: Boolean
	}

	type Pointer {
		id: ID!
		name: String!
		lastName: String!
		password: String
		age: Int
		sex: String
		createdAt: String
		delete: Boolean
	}

	type Sabotier {
		id: ID!
		name: String!
		lastName: String!
		password: String
		sex: String
		createdAt: String
		delete: Boolean
	}

	type Controller {
		id: ID!
		name: String!
		lastName: String!
		password: String
		sex: String
		createdAt: String
		delete: Boolean
	}

	type Query {
		getResponsables: [Responsable]
		getResponsable(id: ID!): Responsable
		connectionResponsable(name: String!, password: String!): Responsable

		getDrivers: [Driver]
		getDriver(id: ID!): Driver
		connectionDriver(name: String!, password: String!): Driver

		getVehicles: [Vehicle]
		getVehicle(id: ID!): Vehicle

		getTypeVehicles: [TypeVehicle]
		getTypeVehicle(id: ID!): TypeVehicle

		getElementsVerifications: [ElementsVerification]
		getElementsVerification(id: ID!): ElementsVerification
		getVehicleAllVerificationElements(idVehicle: ID!): ElementsVerification
		getVehicleVerificationElementsOfOneDay(
			idVehicle: ID!
			dateVerification: ID!
		): ElementsVerification

		getVerifiedVerificationElementsOfOneDay(
			idVehicle: ID!
			dateVerification: ID!
		): ElementsVerification

		getVehicleVerificationElementsByRange(
			idVehicle: ID!
			range: String!
		): [ElementsVerification]

		getVehicleVerificationElementsByMonth(
			idVehicle: ID!
			month: String!
		): [ElementsVerification]

		getVehicleVerificationElementsByYear(
			idVehicle: ID!
			year: String!
		): [statYearFormatData]

		getVehicleHistoryForOneVehicle(id: String!): [vehicleHistory]
		getVehicleHistories: [vehicleHistory]

		# Police Towing get method
		getPoliceTowings: [ElementVerificationPoliceTowing]
		getPoliceTowing(id: String!): ElementVerificationPoliceTowing
		getPoliceTowingStandDriver(
			date: String!
			idDriver: String
		): [ElementVerificationPoliceTowing]
		getPoliceTowingElementsOfOneDay(
			date: String!
		): [ElementVerificationPoliceTowing]
		getPoliceTowingElementsByRange(
			range: String!
		): [ElementVerificationPoliceTowing]
		getPoliceTowingElementsByMonth(
			month: String!
		): [ElementVerificationPoliceTowing]

		getPrivateTowings: [ElementVerificationPrivateTowing]
		getPrivateTowing(id: String!): ElementVerificationPrivateTowing
		getPrivateTowingStandDriver(
			date: String!
			idDriver: String
		): [ElementVerificationPrivateTowing]
		getPrivateTowingElementsOfOneDay(
			date: String!
		): [ElementVerificationPrivateTowing]
		getPrivateTowingElementsByRange(
			range: String!
		): [ElementVerificationPrivateTowing]
		getPrivateTowingElementsByMonth(
			month: String!
		): [ElementVerificationPrivateTowing]

		getPointers: [Pointer]
		getPointer(id: ID!): Pointer
		connectionPointer(name: String!, password: String!): Pointer

		getSabotiers: [Sabotier]
		getSabotier(id: ID!): Sabotier
		connectionSabotier(name: String!, password: String!): Sabotier

		getControllers: [Controller]
		getController(id: ID!): Controller
		connectionController(name: String!, password: String!): Controller

		# CLog maker
		getClogMakerOfOneDay(date: String!): [ElementClogMaker]
		getClogMakers: [ElementClogMaker]
		getClogMakersOfController(id: String): [ElementClogMaker]
		getClogMakersOfSabotier(id: String): [ElementClogMaker]

		getPlages: [Plage]
	}

	type Plage{
		id: ID!
		name: String!
		zone: String!
		delete: Boolean
		createdAt: String
	}

	type ElementClogMaker {
		id: ID!
		idController: String!
		status: String
		images: [String]
		idSabotier: String
		zone: String
		plage: String

		typeCar: String
		numberPlaque: String
		color: String

		comment: String
		date: String
		position: position
		createdAt: String
		delete: Boolean
	}

	input ResponsableInput {
		name: String!
		lastName: String!
		password: String!
		email: String
		phone: String
		image: String
		age: Int
		sex: String
		addVehicle: Boolean
		upVehicle: Boolean
		delVehicle: Boolean
		addDriver: Boolean
		upDriver: Boolean
		delDriver: Boolean
		addResponsable: Boolean
		upResponsable: Boolean
		delResponsable: Boolean
	}

	input DriverInput {
		name: String!
		lastName: String!
		password: String!
		licenseValidity: String!
		email: String
		phone: String
		image: [String]
		age: Int
		sex: String
	}

	input VehicleInput {
		idDriver: String
		idTypeVehicle: String
		name: String!
		model: String!
		gpsData: String
		serie: String!
		image: [String]
		color: String
		yearConstruction: String
		startYear: String!
		registrationNumber: String!
		power: String
	}

	input TypeVehicleInput {
		name: String!
		description: String!
		startYear: String!
	}

	input stateInput {
		state: String!
		image: [String]
		comment: String
	}

	input recapStateInput {
		good: Int!
		damaged: Int!
		missing: Int!
	}

	input VerificationVehicleInput {
		idVehicle: String!
		honk: stateInput!
		motor: stateInput!
		stopLight: stateInput!
		startUp: stateInput!
		handBrake: stateInput
		stricken: stateInput!
		siegeState: stateInput!
		ceilingState: stateInput!
		windshieldConditionAV: stateInput!
		windshieldConditionAR: stateInput!
		carStateOut: stateInput!
		carStateIn: stateInput!
		shockAbsorbersAV: stateInput!
		shockAbsorbersAR: stateInput!
		brakingSystem: stateInput!
		radioAndReader: stateInput!
		reserveTire: stateInput!
		leftAndRightTireAV: stateInput!
		leftAndRightTireAR: stateInput!
		gironfardOperation: stateInput!
		flashingOperationAV: stateInput!
		flashingOperationAR: stateInput!
		warningLightsOperation: stateInput!
		windshieldWipers: stateInput!
		mechanismOperation: stateInput!
		cric: stateInput!
		wheelWrench: stateInput!
		cricRemover: stateInput!
		mileage: String!
		dateVerification: String!
		stateVehicle: recapStateInput!
	}

	input recapStateTowingInput {
		good: Int!
		damaged: Int!
		grooves: Int!
		outService: Int!
	}

	input positionInput {
		lat: Float!
		long: Float!
	}

	input identityPersonInput {
		type: String
		number: String
	}

	enum towingStatus {
		STAND
		NOT_GOOD
		GOOD
	}

	enum towingPrivateStatus {
		NOT_GOOD
		GOOD
	}

	enum towingStateStatus {
		GOOD
		DAMAGED
		GROOVES
		OUT_SERVICE
	}

	input towingStateElement {
		state: towingStateStatus!
		image: [String]
		comment: String
	}

	input imageTowingInput {
		infractionImage: [String]
		imageLeft: String!
		imageRight: String!
		imageFront: String!
		imageBack: String!
	}

	input towingStandInput {
		idDriver: String!
		status: towingStatus!
		imageTowing: imageTowingInput!
		position: positionInput!
		date: String!
	}

	input ElementVerificationTowingPrivateInput {
		idDriver: String!
		status: towingPrivateStatus!
		imageTowing: imageTowingInput!

		model: String!
		brand: String!
		typeCar: String!
		numberPlaque: String!
		color: String!
		pinkCard: String!
		yellowCard: String!
		# // Person Identity
		name: String!
		lastName: String!
		adress: String
		phone: String
		identityPerson: identityPersonInput!
		# // Party AV
		hood: towingStateElement!
		grille: towingStateElement!
		headLightsAV: towingStateElement!
		blinkersAV: towingStateElement!
		bumperAV: towingStateElement!
		wheelArchesAV: towingStateElement!
		windShieldAV: towingStateElement!
		# // Party AR
		lightsAR: towingStateElement!
		chest: towingStateElement!
		headLightAR: towingStateElement!
		turnSignalAR: towingStateElement!
		bumperAR: towingStateElement!
		wheelArchAR: towingStateElement!
		windShieldAR: towingStateElement!
		# // Party Lat Left
		wingAVLeft: towingStateElement!
		doorAVLeft: towingStateElement!
		doorARLeft: towingStateElement!
		crateArmLeft: towingStateElement!
		mirrorLeft: towingStateElement!
		boxPanelLeft: towingStateElement!
		wingARLeft: towingStateElement!
		# // Party Lat Right
		wingAVRight: towingStateElement!
		doorAVRight: towingStateElement!
		doorARRight: towingStateElement!
		crateArmRight: towingStateElement!
		mirrorRight: towingStateElement!
		boxPanelRight: towingStateElement!
		wingARRight: towingStateElement!
		# // More informations
		tireAVLeft: towingStateElement!
		tireAVRight: towingStateElement!
		tireARLeft: towingStateElement!
		tireARRight: towingStateElement!

		# after fourrieur informations
		dateEnterPound: String
		VehiclePoundInfo: String
		refPositionTake: String
		refPositionRestitution: String
		dateOutPound: String

		date: String!
		stateVehicle: recapStateTowingInput!
		position: positionInput!
		createdAt: String
		delete: Boolean
	}

	input ElementVerificationTowingPoliceInput {
		idDriver: String!
		status: towingStatus!
		imageTowing: imageTowingInput!

		model: String!
		brand: String!
		typeCar: String!
		numberPlaque: String!
		color: String!
		pinkCard: String!
		yellowCard: String!
		# // Person Identity
		name: String!
		lastName: String!
		adress: String
		phone: String
		identityPerson: identityPersonInput!
		# // Party AV
		hood: towingStateElement!
		grille: towingStateElement!
		headLightsAV: towingStateElement!
		blinkersAV: towingStateElement!
		bumperAV: towingStateElement!
		wheelArchesAV: towingStateElement!
		windShieldAV: towingStateElement!
		# // Party AR
		lightsAR: towingStateElement!
		chest: towingStateElement!
		headLightAR: towingStateElement!
		turnSignalAR: towingStateElement!
		bumperAR: towingStateElement!
		wheelArchAR: towingStateElement!
		windShieldAR: towingStateElement!
		# // Party Lat Left
		wingAVLeft: towingStateElement!
		doorAVLeft: towingStateElement!
		doorARLeft: towingStateElement!
		crateArmLeft: towingStateElement!
		mirrorLeft: towingStateElement!
		boxPanelLeft: towingStateElement!
		wingARLeft: towingStateElement!
		# // Party Lat Right
		wingAVRight: towingStateElement!
		doorAVRight: towingStateElement!
		doorARRight: towingStateElement!
		crateArmRight: towingStateElement!
		mirrorRight: towingStateElement!
		boxPanelRight: towingStateElement!
		wingARRight: towingStateElement!
		# // More informations
		tireAVLeft: towingStateElement!
		tireAVRight: towingStateElement!
		tireARLeft: towingStateElement!
		tireARRight: towingStateElement!

		# after fourrieur informations
		dateEnterPound: String
		VehiclePoundInfo: String
		refPositionTake: String
		refPositionRestitution: String
		dateOutPound: String

		date: String!
		stateVehicle: recapStateTowingInput!
		position: positionInput!
		createdAt: String
		delete: Boolean
	}

	input ElementVerificationTowingInput {
		idDriver: String!
		status: towingStatus!
		imageTowing: imageTowingInput!

		model: String!
		brand: String!
		typeCar: String!
		numberPlaque: String!
		color: String!
		pinkCard: String!
		yellowCard: String!
		# // Person Identity
		name: String!
		lastName: String!
		adress: String
		phone: String
		identityPerson: identityPersonInput!
		# // Party AV
		hood: towingStateElement!
		grille: towingStateElement!
		headLightsAV: towingStateElement!
		blinkersAV: towingStateElement!
		bumperAV: towingStateElement!
		wheelArchesAV: towingStateElement!
		windShieldAV: towingStateElement!
		# // Party AR
		lightsAR: towingStateElement!
		chest: towingStateElement!
		headLightAR: towingStateElement!
		turnSignalAR: towingStateElement!
		bumperAR: towingStateElement!
		wheelArchAR: towingStateElement!
		windShieldAR: towingStateElement!
		# // Party Lat Left
		wingAVLeft: towingStateElement!
		doorAVLeft: towingStateElement!
		doorARLeft: towingStateElement!
		crateArmLeft: towingStateElement!
		mirrorLeft: towingStateElement!
		boxPanelLeft: towingStateElement!
		wingARLeft: towingStateElement!
		# // Party Lat Right
		wingAVRight: towingStateElement!
		doorAVRight: towingStateElement!
		doorARRight: towingStateElement!
		crateArmRight: towingStateElement!
		mirrorRight: towingStateElement!
		boxPanelRight: towingStateElement!
		wingARRight: towingStateElement!
		# // More informations
		tireAVLeft: towingStateElement!
		tireAVRight: towingStateElement!
		tireARLeft: towingStateElement!
		tireARRight: towingStateElement!

		# after fourrieur informations
		dateEnterPound: String
		VehiclePoundInfo: String
		refPositionTake: String
		refPositionRestitution: String
		dateOutPound: String

		date: String!
		stateVehicle: recapStateTowingInput!
		position: positionInput!
		createdAt: String
		delete: Boolean
	}

	input PointerInput {
		name: String!
		lastName: String!
		password: String!
		age: Int
		sex: String
		delete: Boolean
	}

	input SabotierInput {
		name: String!
		lastName: String!
		password: String!
		age: Int
		sex: String
		delete: Boolean
	}

	input ControllerInput {
		name: String!
		lastName: String!
		password: String!
		age: Int
		sex: String
		delete: Boolean
	}

	type Mutation {
		createResponsable(responsable: ResponsableInput): Responsable
		deleteResponsable(id: String!): Responsable
		updateResponsable(id: String!, responsable: ResponsableInput): Responsable
		reverseDeleteResponsable(id: String!): Responsable

		createDriver(driver: DriverInput): Driver
		deleteDriver(id: String!): Driver
		updateDriver(id: String!, driver: DriverInput): Driver
		reverseDeleteDriver(id: String!): Driver

		createVehicle(vehicle: VehicleInput): Vehicle
		addDriverToVehicle(idVehicle: String!, idDriver: ID!): Vehicle
		addImageToVehicle(idVehicle: String!, image: String!): Vehicle
		deleteVehicle(id: String!): Vehicle
		updateVehicle(id: String!, vehicle: VehicleInput): Vehicle
		reverseDeleteVehicle(id: String!): Vehicle

		createVehicleVerification(
			vehicleVerification: VerificationVehicleInput
		): ElementsVerification
		deleteVehicleVerification(id: ID!): ElementsVerification
		updateVehicleVerification(
			id: String!
			updateVehicleVerification: VerificationVehicleInput
		): ElementsVerification

		# towingPolice
		createVehiclePoliceTowing(
			vehiclePoliceTowing: ElementVerificationTowingInput
		): ElementVerificationPoliceTowing
		createStandingPoliceTowing(
			standingPoliceTowing: towingStandInput
		): ElementVerificationPoliceTowing
		validatePoliceTowing(
			id: String!
			validateVehicleTowing: ElementVerificationTowingInput
		): ElementVerificationPoliceTowing
		deleteVehiclePoliceTowing(id: ID!): ElementVerificationPoliceTowing
		updateVehiclePoliceTowing(
			id: String!
			updateVehiclePoliceTowing: ElementVerificationTowingInput
		): ElementVerificationPoliceTowing

		# # towing private
		createVehiclePrivateTowing(
			vehiclePrivateTowing: ElementVerificationTowingPrivateInput
		): ElementVerificationPrivateTowing
		deleteVehiclePrivateTowing(id: ID!): ElementVerificationPrivateTowing
		updateVehiclePrivateTowing(
			id: String!
			updateVehiclePrivateTowing: ElementVerificationTowingPrivateInput
		): ElementVerificationPrivateTowing

		# type vehicle
		createTypeVehicle(typeVehicle: TypeVehicleInput): TypeVehicle
		deleteTypeVehicle(id: String!): TypeVehicle
		updateTypeVehicle(id: String!, typeVehicle: TypeVehicleInput): TypeVehicle

		createPointer(pointer: PointerInput): Pointer
		deletePointer(id: String!): Pointer
		updatePointer(id: String!, pointer: PointerInput): Pointer
		reverseDeletePointer(id: String!): Pointer

		createSabotier(sabotier: SabotierInput): Sabotier
		deleteSabotier(id: String!): Sabotier
		updateSabotier(id: String!, sabotier: SabotierInput): Sabotier
		reverseDeleteSabotier(id: String!): Sabotier

		createController(controller: ControllerInput): Controller
		deleteController(id: String!): Controller
		updateController(id: String!, controller: ControllerInput): Controller
		reverseDeleteController(id: String!): Controller

		createPlage(plage: PlageInput): Plage
		updatePlage(id: ID!, plage: PlageInput): Plage
		deletePlage(id: ID!): Plage

		createClogMaker(clogMaker: ElementClogMakerInput): ElementClogMaker
		updateClogMakerStatus(id: ID!, status: towingClogMaker, idSabotier: String): ElementClogMaker

		recoveryAccount(name: String!, code: String!): String
	}

	enum Zone{
		DROIT
		GAUCHE
	}

	input PlageInput{
		name: String!
		zone: Zone!
	}

	input ElementClogMakerInput {
		idController: String!
		status: towingClogMaker!
		images: [String]!
		idSabotier: String
		zone: Zone!
		plage: String!

		typeCar: String!
		numberPlaque: String!
		color: String

		date: String
		comment: String
		position: positionInput
		createdAt: String
		delete: Boolean
	}

	enum towingClogMaker {
		WAITING
		CLOG
		PAY
		END
	}

	type Subscription {
		VerificationVehicleAdded: ElementsVerification
	}
`;
