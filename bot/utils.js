const unidecode = require("unidecode");
const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const oggFilePath = 'temp/audio.ogg';
const mp3FilePath = 'temp/audio.mp3';
const fetch = require("node-fetch");
const isCommand = (message) => message.startsWith('>>', 0);
const uuid = require('uuid');

const searchCiPort = process.env.SEARCH_CI_PORT;

const soRegex = /(q+u?e+\?*!*$)|(k+h*e+\?*!*$)|(q+\?*!*$)/i
const isQueso = (message) => soRegex.test(unidecode(message));

const convertAudioFile = () => {
    return new Promise((resolve, reject) => {
        ffmpeg(oggFilePath)
            .toFormat('mp3')
            .on('end', () => {
                console.log('Conversion complete');
                resolve();
            })
            .on('error', (err) => {
                console.log('Error:', err);
                reject(err);
            })
            .save(mp3FilePath);
    });
};


const getCi = async (name, isAdmin) => {
    const token = "token for searching CI";
    const data = {key: token, name};
    const response = await fetch(`http://localhost:${searchCiPort}/search`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    let results = await response.json();
    if (!isAdmin) {
        results = results.map( (result) => {
            const strs = result.split(',');
            strs.shift();
            return strs.join(' ');
        });
    }

    let resultString = "Ultimos 15 resultados: \n";
    results.forEach( (res) => resultString += `${res}\n`);
    return resultString;
}


module.exports = { isCommand, isQueso, convertAudioFile, getCi }

console.log();
