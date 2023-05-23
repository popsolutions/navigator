const { Client, LocalAuth} = require('whatsapp-web.js');
const qrimage = require('qr-image');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const { handleMessage } = require("./commands");

class Bot {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {headless: true}
        });

        this.client.on('loading_screen', (percent, message) => {
            console.log('LOADING SCREEN', percent, message);
        });

        this.client.on('qr', (qr) => {
            const qr_png = qrimage.image(qr, { type: 'png' });
            qr_png.pipe(fs.createWriteStream('temp/qr.png'));
            qrcode.generate(qr, {small: true});
            console.log('Nuevo QR Generado!');
        });

        this.client.on('authenticated', () => {
            console.log('AUTHENTICATED');
        });

        this.client.on('auth_failure', msg => {
            // Fired if session restore was unsuccessful
            console.error('AUTHENTICATION FAILURE', msg);
        });

        this.client.on('ready', () => {
            console.log('Client is ready!');
        });

        this.client.on('message_create', async(message) => {
            const author = await message.getContact();
            const chat = await message.getChat();

            console.log("######################");
            console.log(chat.name);
            console.log(message.body);
            console.log(chat.id.user);
            console.log("######################");
            await handleMessage(message, chat, author);
        });

        this.client.initialize();
    }
}

const bot = new Bot();



