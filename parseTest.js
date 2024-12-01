const fs = require('fs');
const cheerio = require('cheerio');

// html
const htmlData = fs.readFileSync('htmlCode.txt', 'utf8');

const tests = htmlData.split('###').filter(test => test.trim());

let resultData = '';

tests.forEach((testHtml, index) => {
    const $ = cheerio.load(testHtml);
  
    const question = $('.otp-item-view-title a').text().trim();

    let answers = [];
    $('.rb-chk-container .item').each((i, el) => {
        const answerText = $(el).find('p').text().trim();
        const isCorrect = $(el).find('.icon-rb-checked').length > 0; // Проверка правильности ответа
        answers.push({ answerText, isCorrect });
    });

    // sql
    resultData += `-- Тест ${index + 1}\n`;
    answers.forEach(answer => {
        resultData += `INSERT INTO answers (question, answer, is_correct) VALUES ('${question}', '${answer.answerText}', ${answer.isCorrect});\n`;
    });
    resultData += `\n-- Конец теста ${index + 1}\n\n`;
});

// result
fs.writeFileSync('sqlResult.txt', resultData, 'utf8');
console.log('all fine => sqlResult');
