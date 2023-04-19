const VerifyCredential = require('./helpers/index');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { ApolloServer } = require('apollo-server-express');
const { ApolloServerPluginLandingPageDisabled } = require('apollo-server-core');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { createServer } = require('http');
const cors = require('cors');
const jwtoken = require('jsonwebtoken');
const compression = require('compression');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const { readFileSync, existsSync, mkdirSync } = require('fs');

function removeSpecialChars(str) {
	return str
		.replace(/(?!\w|\s)./g, '')
		.replace(/\s+/g, '')
		.replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
}

const APP_PORT = process.env.NODE_PORT || 6500;

(async function start() {
	const connectDb = process.env.MONGO_DB_CONNECTION;
	const app = express();

	app.get('/graphql/doc', (req, res) => {
		res.sendFile(__dirname + '/documentation/index.html');
	});
	const corsOptions = {
		credentials: true,
	};
	app.use(cors(corsOptions));
	app.use(compression()); //Compress all routes
	app.use(fileUpload());
	app.use(express.static('/public'));
	app.use(express.urlencoded({ extended: true }));
	// app.use(helmet()); //Helmet helps you secure your Express apps by setting various HTTP headers.

	// for uploadImage
	app.post('/files/upload', ({ files: { fileSend } }, res) => {
		let extension =
			fileSend.name.split('.')[fileSend.name.split('.').length - 1];

		if (!existsSync(process.env.PATH_FILE)) {
			mkdirSync(process.env.PATH_FILE, { recursive: true });
		}

		let file = `${removeSpecialChars(fileSend.name)}${
			Math.random() * 10000
		}.${extension}`;
		let uploadPath = `${process.env.PATH_FILE}/${file}`;

		fileSend.mv(uploadPath, function (err) {
			if (err) return res.status(500).send(err);
			res.json({
				url: `${file}`,
			});
		});
	});

	app.get('/files/:file', ({ params: { file } }, res) => {
		const filePath = `${process.env.PATH_FILE}/${file}`;
		if (!existsSync(filePath)) {
			return res.status(404).sendFile(__dirname + '/assets/p-imag.png');
		}
		res.sendFile(filePath);
	});

	app.use(async (req, res, next) => {
		if (req.headers.authorization !== 'null') {
			try {
				const user = jwtoken.verify(
					req.headers.authorization,
					process.env.ACCESS_TOKEN_SECRET
				);
				req.user = VerifyCredential(user.userdId);
			} catch {}
		}
		next();
	});

	const httpServer = createServer(app);
	const schema = makeExecutableSchema({ typeDefs, resolvers });
	try {
		await mongoose
			.connect(connectDb, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			})
			.then((res) => {
				const { user, pass, host, port, name } = res.connection;
				if (user && pass)
					console.info(
						`Connected to MongoDB: ${user}:password@${host}:${port}/${name}`
					);
				else console.info(`Connected to MongoDB: ${host}:${port}/${name}`);
			})
			.catch((e) => {
				console.error(`Failled to connect to ${connectDb}, ${e.message}`);
				process.exit(1);
			});

		const apoloServer = new ApolloServer({
			schema,
			context: ({ req, res }) => ({ req, res }),
			plugins: [
				{
					async serverWillStart() {
						return {
							async drainServer() {
								subscriptionServer.close();
							},
						};
					},
				},
				// ApolloServerPluginLandingPageDisabled(),
			],
		});
		const subscriptionServer = SubscriptionServer.create(
			{ schema, execute, subscribe },
			{ server: httpServer, path: '/graphql' }
		);

		await apoloServer.start();
		apoloServer.applyMiddleware({ app, path: '/graphql' });
		app.get('', () => console.log('meshak'));

		httpServer.listen(APP_PORT, () => {
			console.log(
				`🚀 Query endpoint ready at {url}:${APP_PORT}${apoloServer.graphqlPath}`
			);
			console.log(
				`🚀 Subscription endpoint ready at ws:{url}:${APP_PORT}${apoloServer.graphqlPath}`
			);
			console.log(
				`🚀 Documentation endpoint ready at {url}:${APP_PORT}${apoloServer.graphqlPath}/doc`
			);
		});
	} catch (error) {
		console.log(error);
	}
})();
