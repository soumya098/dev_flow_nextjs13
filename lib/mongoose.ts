import mongoose from 'mongoose';

let isConnected: boolean = false;

export const connectToDB = async () => {
	mongoose.set('strictQuery', true);

	if (isConnected) {
		return console.log('<<<<<< MongoDB is already connected >>>>>>');
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL, { dbName: 'devflow', useNewUrlParser: true, useUnifiedTopology: true });

		isConnected = true;
		console.log('<<<<<< MongoDB is connected >>>>>>');
	} catch (error) {
		console.log(error);
	}
};