import { SpamDetectionEngine } from "./src/spam-detection-engine";
import { exampleEmails } from './example-input';

let spamDetectionEngine = new SpamDetectionEngine(exampleEmails);
exampleEmails.forEach((email, i) => {
    let result = spamDetectionEngine.spamProbability(i);
    console.log(`${Math.round(result * 100)}%\t${email.substring(0, 100)}...`);
});