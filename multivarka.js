'use strict';
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var Multivarka = function () {
    var url = null;
    var collectionName = null;
    var field = null;
    var query = {};
    var isNot = false;
    var anti = {
        $gt: '$lt',
        $lt: '$gt',
        $in: '$nin',
        $nin: '$in'
    };
    var self = this;

    this.server = function (inURL) {
        if (!inURL) {
            console.log('Укажите URL для подключения');
            return;
        } else {
            url = inURL;
        }
        return self;
    };

    this.collection = function (name) {
        if (!name) {
            console.log('Укажите название коллекции');
            return;
        } else {
            collectionName = name;
        }
        return self;
    };

    this.where = function (inField) {
        isNot = false;
        if (!inField) {
            console.log('Укажите название поля');
            return;
        } else {
            field = inField;
        }
        return self;
    };

    this.equal = function (value) {
        if (isNot) {
            query[field] = {
                $ne: value
            };
        } else {
            query[field] = value;
        }
        return self;
    };

    this.lessThan = function (value) {
        if (isNot) {
            query[field] = {
                $gt: value
            };
        } else {
            query[field] = {
                $lt: value
            };
        }
        return self;
    };

    this.greatThan = function (value) {
        if (isNot) {
            query[field] = {
                $lt: value
            };
        } else {
            query[field] = {
                $gt: value
            };
        }
        return self;
    };

    this.include = function (valuesArray) {
        if (isNot) {
            query[field] = {
                $nin: valuesArray
            };
        } else {
            query[field] = {
                $in: valuesArray
            };
        }
        return self;
    };

    this.not = function () {
        isNot = true;
        return self;
    };

    this.find = function (callback) {
        connectDB(url)
            .then(function (db) {
                request(db, collectionName, query, callback);
            });
    };

    var connectDB = function (url) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    console.log('Не удалось подключиться. Ошибка: ', err);
                    reject();
                } else {
                    resolve(db);
                }
            });
        });
    };

    var request = function (db, collectionName, query, callback) {
        console.log(query);
        var collection = db.collection(collectionName);
        collection.find(query).toArray(function (err, data) {
            if (err) {
                console.log('Не удалось найти данные по данному запросу. Ошибка ', err);
                callback(err);
            } else {
                callback(null, data);
            }
            db.close();
        });
    };
};

module.exports = new Multivarka();
