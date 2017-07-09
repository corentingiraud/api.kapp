var mongoose = require('mongoose');

module.exports = mongoose.model('adherent', {
    nom: {type: String},
    prenom: {type: String},
    dateNaissance: {type: Date},
    dateCreation: {type: Date},
    ecole: {type: String},
});
