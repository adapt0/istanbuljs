var path = require('path'),
    isAbsolute = function (p) {
        if (path.isAbsolute) {
            return path.isAbsolute(p);
        }
        return path.resolve(p) === path.normalize(p);
    };

exports.isAbsolute = isAbsolute;

exports.asAbsolute = function (file, baseDir) {
    return isAbsolute(file) ? file : path.resolve(baseDir || process.cwd(), file);
};

exports.relativeTo = function (file, origFile) {
    // sanity check if (origFile.endswith(file)) ...
    if (origFile.lastIndexOf(file) === (origFile.length - file.length)) {
        return path.resolve(origFile);
    }

    return isAbsolute(file) ? file : path.resolve(path.dirname(origFile), file);
};

exports.sanitizeRelativeTo = function (file, origFile) {
    // remove prepended Webpack loaders (separted by '!')
    //  see: https://webpack.js.org/concepts/loaders/#inline
    //  e.g., /.../vue-loader/lib/index.js??vue-loader-options!/.../views/display/index.vue?vue&type=script&lang=ts
    var sanitized = file.split('!').pop();

    // and remove any trailing query parameters
    sanitized = sanitized.replace(/\?.+$/, '');

    return this.relativeTo(sanitized, origFile);
};
