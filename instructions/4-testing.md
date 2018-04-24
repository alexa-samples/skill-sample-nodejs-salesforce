# Testing

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-done._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-done._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-on._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 4: Testing

Now that you completed most of the setup, let's make sure everything is working. We'll show you first how to test using the command line, then validate the account linking flow, and finally interact with the skill to create a voice code and access Salesforce data.

### Simulate

1. Run the following command to execute a command against your skill:

```
$ ask simulate -l en-US -t "open salesforce demo"
✓ Simulation created for simulation id: 0c857923-0753-43a5-b44c-ee2fca137aab
◜ Waiting for simulation response{
  "status": "SUCCESSFUL",
  "result": {
...
```

2. Check for the output message to also see what Alexa would have said:

```
...
"outputSpeech": {
  "type": "SSML",
  "ssml": "<speak> A Salesforce account is required to use this skill. I've placed more information on a card in your Alexa app. </speak>"
},
...
```

### Test the Linking Flow

1. Go to your Alexa app on your device (or go to https://alexa.amazon.com).
2. Click **Skills**. 
3. Click **Your Skills**.
4. Click the **Dev Skills** header.
5. Find the **Salesforce Demo** skill and click it.
6. Click **Enable**.

Your browser or device will then open a window to the Salesforce login screen. 
Enter your Trailhead Playground user credentials, and you should see a page letting you know your skill was successfully linked.

### Use the Skill

1. Try out the following request: **“Alexa, open Salesforce Demo”**.
2. Alexa will welcome you and ask you to create a voice code.
3. Choose a 4-digit code and speak it back.
4. Alexa will create the code and let you ask about your recent leads or opportunities.
5. Don’t forget to try changing your code!
6. Now try pulling up an opportunity. If you've created a Trailhead Playground, you should have an opportunity with this name: **"Select opportunity United Oil Installations"**.
7. Alexa will pull back the opportunity and display some of the opportunity details on a card.
8. You can now change a detail, such as the close date: **"Update close date to next Friday"**.
9. Alexa will make the change in Salesforce and update the card details.

If at any point you aren’t sure what else you can ask, just say “Help”.

[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./5-distribute-private-skills.md)
