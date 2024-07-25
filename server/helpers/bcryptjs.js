const bcrypt = require('bcryptjs');

module.exports = {
    hashpw: (password) => {
        return bcrypt.hashSync(password)
    },
    comparePw: (password, hash) => {
        return bcrypt.compareSync(password, hash)
    }
}