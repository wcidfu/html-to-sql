const fs = require('fs');
const cheerio = require('cheerio');

// Чтение HTML-кода из файла
const htmlData = fs.readFileSync('htmlCode.txt', 'utf8');

// Разделение на отдельные тесты
const tests = htmlData.split('###').filter(test => test.trim());

let resultData = '';

tests.forEach((testHtml, index) => {
    const $ = cheerio.load(testHtml);
    
    // Извлечение вопроса
    const question = $('.otp-item-view-title a').text().trim();

    // Извлечение ответов
    let answers = [];
    $('.rb-chk-container .item').each((i, el) => {
        const answerText = $(el).find('p').text().trim();
        const isCorrect = $(el).find('.icon-rb-checked').length > 0; // Проверка правильности ответа
        answers.push({ answerText, isCorrect });
    });

    // Формирование SQL-запросов
    resultData += `-- Тест ${index + 1}\n`; // Добавление разделителя
    answers.forEach(answer => {
        resultData += `INSERT INTO answers (question, answer, is_correct) VALUES ('${question}', '${answer.answerText}', ${answer.isCorrect});\n`;
    });
    resultData += `\n-- Конец теста ${index + 1}\n\n`; // Завершение разделителя
});

// Запись результатов в файл
fs.writeFileSync('sqlResult.txt', resultData, 'utf8');
console.log('Результаты успешно записаны в sqlResult.txt');
