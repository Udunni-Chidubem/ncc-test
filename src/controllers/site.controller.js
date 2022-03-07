require('dotenv').config()

module.exports = {
    home: async (req, res) => {
       // res.send('Hello Badmous');
        res.render('home');
    },

    login : async (req, res) => {
        let x={name:"Badmous", age:"33", lga:"Bida"};
        return x
    }
}