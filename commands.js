const { isCommand, convertAudioFile } = require("./utils");
const fs = require("fs");
const {MessageMedia} = require("whatsapp-web.js");
const { completion, transcribe } = require("./llm");
async function sendLlmMessage(message) {
    const text = message.body.split(' ');
    text.shift();

    const query = text.join(" ");
    message.reply(await completion(query));
}

async function sendTranscription(message) {
    try {
        const transcribedText = await transcribe();
        message.reply(transcribedText);
    } catch (e) {
        await message.reply("An error has occurred while creating transcription.");
    }
}
const handleMessage = async (message, chat, author) => {
    if (isCommand(message.body)) {
        try {
            await executeCommand(message);
        } catch (e){
            console.log(e);
            await message.reply("Ha ocurrido un error desconocido.");
        }
    }
}

const executeCommand = async (msg) => {
    const command =  msg.body.split(' ')[0].replace('>>', '');
    switch(command) {
        case 'ask':
            await sendLlmMessage(msg);
            break;
        case 'transcribe':
            const quoted = await msg.getQuotedMessage();
            if (quoted && quoted.hasMedia) {
                try {
                    const media = await quoted.downloadMedia();
                    if (media.mimetype.includes('audio/ogg')) {
                        await fs.promises.writeFile("temp/audio.ogg", media.data, 'base64');
                        await convertAudioFile();
                        await sendTranscription(msg);
                    } else {
                        await msg.reply("El comando debe ejecutarse respondiendo a un audio original de Whatsapp (.ogg).");
                    }
                } catch (err) {
                     await msg.reply("Ha ocurrido un error. Intenta reenviar el audio.");
                }
            } else {
                await msg.reply("El comando debe ejecutarse respondiendo a un audio original de Whatsapp (.ogg).");
            }
            break;
        case 'help':
            await msg.reply(`Lista de comandos:\n>>ask <mensaje>: Enviar un mensaje a ChatGPT.\n>>transcribe (contestando a un audio original de whatsapp): Generar una transcripción del audio.`);
            break;
        default:
            await msg.reply("Comando desconocido. Escribe >>help para listar los comandos.");
    }
}

module.exports = { handleMessage }
