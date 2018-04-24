# Deploy
 
[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-on._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-off._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-off._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-off._TTH_.png)](./5-distribute-private-skills.md)

## Part 2: Customize and Deploy the Skill 

In this part, we will deploy our skill and create the AWS Lambda function that powers it. First, you need to update the constants.js file in order to match your setup.

### Setup (without AWS Serverless Application Repository)

1. ```./lambda/custom/constants.js```

   Modify these values in constants.js file : Salesforce instance URL and the name of your Voice Code custom setting and field name. There are other fields here we will modify later, so this won't be the last time you will be edit this file.

   Note: You can also control this value via Lambda Environment Variables using the same names shown below.

```javascript
    // Salesforce Constants
  INSTANCE_URL: process.env.INSTANCE_URL || '', // TODO Set your own
  VOICE_CODE_OBJECT_NAME: process.env.VOICE_CODE_OBJECT_NAME || 'voice_code__c',
  VOICE_CODE_FIELD_NAME: process.env.VOICE_CODE_FIELD_NAME || 'code__c',
```

### Setup (with AWS Serverless Application Repository)

1. If you've deployed the application using the Serverless Application Repository, you simply need to add the function name that was created to one of the configuration files. Skip to **Step 4**.
2. If you wish to deploy the skill function using the AWS Serverless Application Repository, find the application [skill-sample-nodejs-salesforce](https://serverlessrepo.aws.amazon.com/applications/arn:aws:serverlessrepo:us-east-1:473507220772:applications~skill-sample-nodejs-salesforce).
3. Follow the instructions to deploy the application, setting the required parameter for your Salesforce instance URL based off what you created in Part 1.
4. Open your [Lambda console](https://console.aws.amazon.com/lambda/home).
5. Find the function that is named something like this: **<Application/Stack Name>-AlexaSalesforceFunction-<Generated ID>**
6. Copy the full function name, including the stack name and generated ID at the end.
7. Open the ```.ask/config``` in the root directory of this project.
8. Modify the value of **"uri"** to be the function name.

```
"apis": {
  "custom": {
    "endpoint": {
      "uri": "ask-custom-AlexaSalesforceDemo-default"
    }
  }
```

### Deployment

ASK will create the skill and the lambda function for you. The Lambda function will be created in ```us-east-1``` (Northern Virginia) by default.

If you created the Lambda function already with the Serverless Application Repository deployment process, it will link the function to your skill. 

1. You deploy the skill and the lambda function in one step :

```
$ ask deploy 
-------------------- Create Skill Project --------------------
ask profile for the deployment: default
Skill Id: amzn1.ask.skill.<Skill ID>
Skill deployment finished.
Model deployment finished.
Lambda deployment finished.
```

2. Make sure to save your skill ID returned in the previous output. We’ll use that often in the future steps.

### Grant Permission for Lambda to Call DynamoDB (without AWS Serverless Application Repository)

The standard execution role that is used for Lambda doesn’t allow permission to access DynamoDB. In order to fix that, you need to add a policy to the role that runs the Lambda function. 

1. From the AWS Console, type **IAM** in the AWS services search box at the top of the page.
2. Click **Roles**.
3. Find the role that was automatically created for this Lambda function. It should be called **ask-lambda-Salesforce-Demo**. Click on it.
4. In the Permissions tab, click **Attach policy**.
5. In the search box, search for **AmazonDynamoDBFullAccess** and then check the box next to the policy that shows up.
6. Click **Attach policy** at the bottom right.

### Enable Testing

In order to test the skill before publishing, you need to enable testing on the  Alexa Developer Console.

You can directly jump to the page by substituting your Skill ID into the following URL: ```https://developer.amazon.com/alexa/console/ask/test/<Skill ID>/development/en_US```

## Extra Credit

### Modify Lambda to Only Respond to Your Skill (optional but recommended)

1. Modify the following value in ```./lambda/custom/constants.js``` file using the skill ID you just obtained. You can also make this chance in the AWS Lambda console as an environment variable.

```javascript
    appId: process.env.SKILL_ID || '',
```
2. Run the deploy command again to update your Lambda function with the latest change.

```bash
$ ask deploy 
```

[![Next](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/button-next._TTH_.png)](./3-account-linking.md)
