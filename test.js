const multivarka = require('./multivarka');

multivarka
    // Указываем url для подключения
    .server('mongodb://localhost:27017/yandex')

    // и коллекцию
    .collection('students')

    // Выбираем только те записи, в которых поле `group` равно значению «ПИ-301».
    .where('group').not().equal('КБ-301')
    .where('grade').greatThan(4)

    // После подготовки, делаем запрос
    .find(function (err, data) {
        if (!err) {
            console.log(data);
        }
    });
