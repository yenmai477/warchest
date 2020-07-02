const Nofication = require('../models/noficationModel');
const factory = require('./handleFactory');

exports.getAllNofication = factory.getAll(Nofication);
exports.getNofication = factory.getOne(Nofication);
exports.createNofication = factory.createOne(Nofication);
exports.updateNofication = factory.updateOne(Nofication);
exports.deleteNofication = factory.deleteOne(Nofication);
