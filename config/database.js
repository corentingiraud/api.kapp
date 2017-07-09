let env = process.env;
const username = env.MONGOD_USERNAME || "";
const password = env.MONGOD_PASSWORD || "";
const url = env.MONGOD_URL || "localhost:27017/kapp";
module.exports = {
    url : 'mongodb://'+username+':'+password+'@'+url,
};
