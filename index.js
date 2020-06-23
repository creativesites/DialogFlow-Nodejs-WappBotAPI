"use strict";

const express = require("express");
const bodyParser = require("body-parser");
// Instantiate a DialogFlow client.
const dialogflow = require('dialogflow');
var cors = require('cors');

const restService = express();
restService.use(cors());

restService.use(
    bodyParser.urlencoded({
        extended: true
    })
);

restService.use(bodyParser.json());

const projectId = 'small-talk-1-59506';

//https://dialogflow.com/docs/agents#settings
// generate session id (currently hard coded)
const sessionId = '2eccb33b-8494-40dd-ac92-212972b9dbea';
const languageCode = 'en-US';


let privateKey = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCyvvuUy4RAty+b\nFhhQ1oMFuDuFpt002lCzwpW2RbyTVWCflKKRsbkTaE0ObE9x/5/AFmPBaBmAXOzn\nwhmG87qgE2Bf8DlBorEkSnF7Sp4zExzcSzItyHNekwsikNWp4vXYO29nE3vaD4oe\nsFkvODa0LvL3mk/jGAhtijvAA40IqSN8NPsDAk6+XqBTi6qmJ5Ig1in9BtZx79P2\n1AM9lMwtB0GyLrGWwO86M5sEynZNmy4fE+WLIzkNjXtJTCHFLmOSUq/l/tmqUMHU\nlhMlDjTVt7jGE+BBms6sJvLpH2uYtWYpFN0Tb0UPYWhUWyWeLnedv0AwajcRu+1f\nKIcT85BnAgMBAAECggEABYfdnqHaIpXTI3ArFMaWa5pi6RnxKp3+CkSL6lsSYIKv\nSIYfrkoP/nbnOiTaznMI5+IpeFthZ/SNdgcDpYaBcKDjhgRtA8gQxXKHkWI32T+5\npbgD7PZmBM1K9mkB23haKrR9bXSPtqnCwyaqE8kgVDHxsvyeL9osr0BW5J7s1xGL\nV3mru0stZWlqeZQ2l/qDZvje3pfoo9MR0TbcXypHyMG30P2epSDh203taDLi3/ok\nEQ5khOT//eoPZ73ocnGA99nS1L4vALh4wTkcWGXg6akuT3HZK/zSaxQs8cPt7zjJ\nQnkCdG/g+jft3XnYGLCBevTHgZQzOEWKaPoil2Q5uQKBgQD28F4BdKrkcj+sB4H/\nWNyzwsYj8BRdvbqwxTz33KMaZo9FfhV72tKJQf8HuIl6EuCPVGLPcteD6DIUNx5t\n6WbT5WsvlgsUfDOG8IXwNE2FI4R9DZM5bHz4GZxMUDsn9/2IQqFJLOosb3+gnKn/\nRSog2e1a7P76LVdYIy5d0yExjwKBgQC5TgrK5IOOKQHJDzT4Q9TuNnjTTi4B/CPC\n2vxdXszA8NgRaDPvbWz1fAJovO5OyeL90/RoDbW+wFBbq8bf76Xi83q9qHfEurXM\nRv3SlendjzgOIY8SHiYj2IKxzFoGFhNPrPoT8FMiwPgtgKUFdQevGQsWpG6GSPnM\n578MuAoXqQKBgHlZmfjBKpHlCyEw91NSifLUzqYufvOqHyprYxCzHnwE1ndiBJC+\n8iN9iSR0LSsOR8hnwb8MQpiR7Lo+c/ezcVLENS5HX96LQo8Xd9qY+VdqItuJZkYb\n6DXL8CEYdFmp5q+lfrkFF3cKu/9jva6ygIdwUNIUESFEUt3/O/PjozZFAoGBAILn\nb9Ze0dSmgV1gwcG0YYKatoZHj1bVoQmxG2B2bNzMB0dcvnugaL2OikElXpAILLO1\nfM3ZCZAkWWA5HDfsGtsVt5qtnVY7s9wINp0CTIC5ARdye5iH9deSxtkFjH8KL0A0\n6UEWoBRID8pNO8Z8Ix596YhoRq/Uc6td92frxy1pAoGBAJMo9auOoiC1e+iMNeuV\npC95HBh99SM7yzohGSI/rg1Uu7/6hB4dazuyO5Dx5FeKvtNb9dFts1repqPnWnvW\nfWacjT2BZVgMO4+f8n+4GuksQJ6O+fOxbzGRxTKqNA5CTxH1Z1JzAx1ps8f5lycF\nuEyE0NX5z9kab9KCIMm0oZC3\n-----END PRIVATE KEY-----\n";

// as per goolgle json
let clientEmail = "stembot@small-talk-1-59506.iam.gserviceaccount.com";
let config = {
    credentials: {
        private_key: privateKey,
        client_email: clientEmail
    }
}
const sessionClient = new dialogflow.SessionsClient(config);

// Define session path
const sessionPath = sessionClient.sessionPath(projectId, sessionId);



restService.post("/message", async function (req, res) {

    if(!req.body) return res.sendStatus(400);
    // The text query request.
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: req.body.messageText,
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            console.log(`  Response: ${result.fulfillmentText}`);

            return res.json({ messageResponse: result.fulfillmentText });
        })
        .catch(err => {
            return res.json({ messageResponse: "there was an error getting a response from server" });
            console.log(err)
        });

});

restService.listen(process.env.PORT || 8000, function () {
    console.log("Server up and listening");
});
