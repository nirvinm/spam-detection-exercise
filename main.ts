import { SpamDetectionEngine } from "./src/spam-detection-engine";
import { exampleEmails } from './example-input';


// create instance of spam engine with current set of emails
let spamDetectionEngine = new SpamDetectionEngine(exampleEmails);

// now go over each email and compute the spam probability
exampleEmails.forEach((email, i) => {
    const probability = spamDetectionEngine.spamProbability(i);
    const probabilityPercentage = Math.round(probability * 100);
    const emailPreview = `${email.substring(0, 100)}...`;

    console.log(`${probabilityPercentage}%\t${emailPreview}`);
});