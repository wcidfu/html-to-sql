const fs = require('fs');
const cheerio = require('cheerio');

// html
const htmlData = fs.readFileSync('htmlCode.txt', 'utf8');
const tests = htmlData.split('###').filter(test => test.trim());

let resultData = '';

tests.forEach((testHtml, index) => {
    const $ = cheerio.load(testHtml);
    
    const question = $('.otp-item-view-title a').text().trim();

    resultData += `-- Test ${index + 1}\n`;
    resultData += `INSERT INTO TEST (question) VALUES ('${question}');\n`;

    $('.rb-chk-container .item').each((i, el) => {
        const answerText = $(el).find('p').text().trim();
        const isCorrect = $(el).find('.icon-rb-checked').length > 0; 
        
        // sql
        resultData += `INSERT INTO ANSWER_OPTIONS (test_id, answer, is_correct) VALUES (currval('test_id_seq'), '${answerText}', ${isCorrect});\n`;
    });

    resultData += `\n\n\n`;
});

// => sqlResult
fs.writeFileSync('sqlResult.txt', resultData, 'utf8');
console.log('all fine => sqlResult.txt');
