var path = require('path');
var yargs = require('yargs');

var logger = require('../logger');
var yargsOptions = require('./arguments');

function addDefaultValue(args) {
    return function(argKey) {
        var defaultValue = yargsOptions[argKey].default;
        if (!args[argKey] && defaultValue !== undefined) {
            args[argKey] = defaultValue;
        }
    };
}

function loadConfiguration() {
    var args = yargs.options({config: {}}).argv;
    if (args.config) {
        logger.log('Loading Configuration:', args.config.white);
        logger.log('WARNING'.red, 'All command line arguments will be ignored');
        var loadedArgs = require(path.resolve('./', args.config));
        var processDefaultOptionsFn = addDefaultValue(loadedArgs);
        Object.keys(yargsOptions).forEach(processDefaultOptionsFn);
        return loadedArgs;
    }
}

function loadCommandlineArguments() {
    return yargs
        .usage('Usage: \n  ./drakov -f <path to blueprint> [-p <server port|3000>]' +
        '\n\nExample: \n  ' + './drakov -f ./*.md -p 3000')
        .options(yargsOptions)
        .demand('f')
        .wrap(80)
        .argv;
}

exports.getArgv = function() {
    var preloadedArgs = loadConfiguration();
    if (preloadedArgs) {
        return preloadedArgs;
    }
    return loadCommandlineArguments();
};
