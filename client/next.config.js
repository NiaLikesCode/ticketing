module.exports = {
    // helps with file change detection
    webpack: (config) => {
        config.watchOptions.poll = 300;
        return config;
    }
};