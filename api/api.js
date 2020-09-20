const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://Vansh:Naman1703@cluster0.zdswl.mongodb.net', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const Device = require('./models/device');
const User = require('./models/user');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Store = require('./models/Store');
//const geocoder = require('./utils/geocoder');
/** 
const NodeGeocoder = require('node-geocoder');
const options = {
    provider: "mapquest",
    httpAdapter: "https",
    apiKey: "AuQL1oZhRYvkD4XfeANYt488LJDLJipH",
    formatter: null
  };
  
  const geocoder = NodeGeocoder(options);*/

const { exists } = require('./models/device');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.get('/api/test', (req, res) => {
    res.send('The API is working!');
});
app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
    res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.get('/api/:storeId/fridges', (req, res) => {
    const { storeId } = req.params;
    Store.findOne({ "_id": storeId }, (err, stores) => {
        const { Fridges } = stores;
        return err
            ? res.send(err)
            : res.send(Fridges);
    });
});
app.get('/api/devices/:deviceId/device-history', (req, res) => {
    const { deviceId } = req.params;
    Device.findOne({ "_id": deviceId }, (err, devices) => {
        const { sensorData } = devices;
        return err
            ? res.send(err)
            : res.send(sensorData);
    });
});

app.get('/api/stores', (req, res) => {
    Store.find({}, (err, stores) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(stores);
        }
    });
});
app.post('/api/stores', (req, res) => {
    const { storeId, address  } = req.body;
    const newStore = new Store({
        storeId,
        address
    });
    newStore.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added device and data');
    });
});

app.get('/api/devices', (req, res) => {
    Device.find({}, (err, devices) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(devices);
        }
    });
});
/**app.get('/api/users', (req, res) => {
    const {names} = req.body
    User.find({name:names }, (err, users) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(name);
        }
    });
});*/

app.post('/api/devices', (req, res) => {
    const { name, user, sensorData } = req.body;
    const newDevice = new Device({
        name,
        user,
        sensorData
    });
    newDevice.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added device and data');
    });
});

app.post('/api/authenticate', (req, res) => {
    const { user, password } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (!found) {
            return res.send('Sorry. We cant find any such username');
        }
        else if (found.password != password) {
            return res.send('The password is invalid');
        }
        else {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
            });
        }
    });
});
app.post('/api/register', (req, res) => {
    const { user, password, isAdmin } = req.body;
    console.log(req.body);
    User.findOne({ name: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (found) {
            return res.send('User already exists');
        }
        else {
            const newUser = new User({
                name: user,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});


app.get('/api/users/:user/devices', (req, res) => {
    const { user } = req.params;

    Device.find({ "user": user }, (err, devices) => {
        return err
            ? res.send(err)
            : res.send(devices);
    });
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
