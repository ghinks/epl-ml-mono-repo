const forecast = require('./dist/index').default;

forecast().then(() => console.log("finished")).catch((e) => console.error(e.message));
