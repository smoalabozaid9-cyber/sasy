const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected Check...'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const clearData = async () => {
    try {
        const count = await User.countDocuments();
        console.log(`Found ${count} users.`);

        if (count > 0) {
            await User.deleteMany();
            console.log('All Users Destroyed! You can now register as the first Admin.');
        } else {
            console.log('Database is already empty. You are good to go.');
        }

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

clearData();
