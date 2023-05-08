const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const completion = async (message) => {
    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content:  message}],
        max_tokens: 1000
    });

    return response.data.choices[0].message.content;
}

async function transcribe() {
    const resp = await openai.createTranscription(
        fs.createReadStream("temp/audio.mp3"),
        "whisper-1", undefined, undefined, undefined,
        "es"
    );
    return resp.data.text;
}

module.exports = { completion, transcribe };
