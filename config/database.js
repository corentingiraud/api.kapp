const env = process.env;
const username = env.MONGODB_USERNAME || "";
const password = env.MONGODB_PASSWORD || "";
const url = env.MONGODB_URL || "localhost:27017/kapp";
module.exports = {
    url : 'mongodb://'+username+':'+password+'@'+url,
};
