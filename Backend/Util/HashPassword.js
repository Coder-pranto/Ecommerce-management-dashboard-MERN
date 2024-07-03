const bcrypt = require('bcrypt');

function hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
}

module.exports.hashPassword = hashPassword;