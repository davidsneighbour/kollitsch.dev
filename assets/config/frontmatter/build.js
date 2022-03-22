var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var fs = require('node:fs');
var path = require('node:path');
var defaults = fs.readFileSync(path.join(__dirname, '/defaults.json'));
var defaultConfiguration = JSON.parse(defaults.toString());
var files = fs.readdirSync(path.join(__dirname, '/types/'));
var typeConfiguration = {};
files.forEach(function mergeConfigs(value) {
    var data = fs.readFileSync(path.join(__dirname, "/types/".concat(value)));
    typeConfiguration = __assign(__assign({}, typeConfiguration), JSON.parse(data));
});
fs.writeFileSync('frontmatter.json', "".concat(JSON.stringify(__assign(__assign({}, typeConfiguration), defaultConfiguration), undefined, 2), "\n"));
