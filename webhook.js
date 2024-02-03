require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const sessionId = process.env.SESSION_ID;
const projectId = process.env.PROJECT_ID;
const languageCode = process.env.LANGUAGE_CODE;

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

app.get('/webhook', (req, res) => {
    res.send('Webhook is working');
});


    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text,
                languageCode,
            },
        },
    };

    try {
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;
        const twiml = new twilio.twiml.MessagingResponse();

        twiml.message(result.fulfillmentText);
        res.writeHead(200, { 'Content-Type': 'text/xml' });
        res.end(twiml.toString());
    } catch (e) {
        console.log('error:', e);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
