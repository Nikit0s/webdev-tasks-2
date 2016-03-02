'use strict';
var MongoClient = require('mongodb').MongoClient;

module.exports = {
    url: null,
    collectionName: null,
    field: null,
    query: {},
    isNot: false,
    anti: {
        $gt: '$lt',
        $lt: '$gt',
        $in: '$nin',
        $nin: '$in'
    },

    server: function (url) {
        if (!url) {
            console.log('Укажите URL для подключения');
            return;
        } else {
            this.url = url;
        }
        return this;
    },

    collection: function (name) {
        if (!name) {
            console.log('Укажите название коллекции');
            return;
        } else {
            this.collectionName = name;
        }
        return this;
    },

    where: function (field) {
        if (!field) {
            console.log('Укажите название поля');
            return;
        } else {
            this.field = field;
        }
        return this;
    },

    equal: function (value) {
        if (this.isNot) {
            this.query[this.field] = {
                $ne: value
            };
        } else {
            this.query[this.field] = value;
        }
        return this;
    },

    lessThan: function (value) {
        if (this.isNot) {
            this.query[this.field] = {
                $gt: value
            };
        } else {
            this.query[this.field] = {
                $lt: value
            };
        }
        return this;
    },

    greatThan: function (value) {
        if (this.isNot) {
            this.query[this.field] = {
                $lt: value
            };
        } else {
            this.query[this.field] = {
                $gt: value
            };
        }
        return this;
    },

    include: function (valuesArray) {
        if (this.isNot) {
            this.query[this.field] = {
                $nin: valuesArray
            };
        } else {
            this.query[this.field] = {
                $in: valuesArray
            };
        }
        return this;
    },

    not: function () {
        this.isNot = true;
        return this;
    },

    find: function (callback) {
        var _this = this;
        MongoClient.connect(this.url, function (err, db) {
            if (err) {
                console.log('Не удалось подключиться. Ошибка: ', err);
                callback(err);
            } else {
                console.log(_this.query);
                var collection = db.collection(_this.collectionName);
                collection.find(_this.query).toArray(function (err, data) {
                    if (err) {
                        console.log('Не удалось найти данные по данному запросу. Ошибка ', err);
                        callback(err);
                    } else {
                        callback(null, data);
                    }
                    db.close();
                });
            }
        });
    }
};
