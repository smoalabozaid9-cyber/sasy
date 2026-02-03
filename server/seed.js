const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected For Seeding'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const importData = async () => {
    try {
        await User.deleteMany();

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@legaltech.com',
            password: 'password123',
            role: 'admin'
        });

        await adminUser.save();

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData();
} else {
    importData();
}
