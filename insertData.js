'use strict';
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/yandex';

var students = [
    {
        name: 'Федя',
        group: 'КБ-301',
        grade: 5
    },
    {
        name: 'Никита',
        group: 'КБ-301',
        grade: 5
    },
    {
        name: 'Игорь',
        group: 'КБ-301',
        grade: 4
    },
    {
        name: 'Дима',
        group: 'МТ-301',
        grade: 5
    },
    {
        name: 'Гоша',
        group: 'КБ-101',
        grade: 3
    }
];

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.log('Не удалось подключиться. Ошибка: ', err);
    } else {
        var collectionStudents = db.collection('students');
        collectionStudents.remove({});
        students.forEach(function (student) {
            collectionStudents.insert(student);
        });
        collectionStudents.find().toArray(function (err, data) {
            console.log(data);
            db.close();
        });
    }
});
