const api = {};
const cache = {};

api.set = (key, value) => {
    cache[key] = value;
};

api.get = key => {
    return cache[key];
};

module.exports = api;