const ffmpeg = require("fluent-ffmpeg");
const oggFilePath = 'temp/audio.ogg';
const mp3FilePath = 'temp/audio.mp3';
const isCommand = (message) => message.startsWith('>>', 0);

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

module.exports = { isCommand, convertAudioFile }

