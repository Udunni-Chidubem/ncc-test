require('dotenv').config()

module.exports = {
    home: async (req, res) => {
        res.send('Welcome to NIGSIMS')
    }
}