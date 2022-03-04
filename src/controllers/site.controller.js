require('dotenv').config()

module.exports = {
    home: async (req, res) => {
       // res.send('Hello Badmous');
        res.render('home');
    }
}