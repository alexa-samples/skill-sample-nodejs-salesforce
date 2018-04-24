# Private Alexa Skill With Salesforce Integration for Serverless Application Repository

![ASK](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/quiz-game/header._TTH_.png)

## Introduction

This Serverless Application is the back-end of a private Alexa skill that integrates with Salesforce. It includes using account linking, via a connected app in Salesforce, along with a voice code confirmation process that stores the code as a custom setting in Salesforce. Then, you can access opportunities and make updates to them using your voice.

In order to use the Alexa skill, you will need to complete a few other necessary steps to set up other resources.

Ultimately, we'll build a skill that is invoked with the name Salesforce Demo.

```text
Alexa, open Salesforce Demo
```

Let's get started!

## Part 1. Salesforce Setup

One of the parameters for this application is the Salesforce Instance URL. If you do not have a Salesforce instance, follow the directions below to obtain  a [Salesforce Trailhead Playground](https://trailhead.salesforce.com/en/modules/trailhead_playground_management/units/create-a-trailhead-playground).

## Part 2. Deploy this Serverless App

1. Using the Serverless Application Repository, deploy this application by following the prompts. Fill in your Salesforce instance URL to match your Trailhead Playground site. It will look something like this: ```https://brave-moove-406615-dev-ed.my.salesforce.com```.
2. Once the deployment was completed, go to your [CloudFormation Stacks](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks) and find the stack you just deployed.
3. Click on the stack name.
4. Expand the **Resources** menu.
5. Copy the Lambda Function Name that was created. It should look something like this: ```aws-serverless-repository-AlexaSalesforceFunction-<Generated ID>```

## Part 3. Deploying the Alexa Skill front-end

Once you've deployed the Serverless App, you need to deploy the Alexa Skill front-end.

1. You can use the [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html) to deploy your Alexa skill voice user interface.
2. Once you have installed the CLI, you need to initialize it with the following command:

```bash
$ ask init
```

Note: You need an [Amazon developer account](https://developer.amazon.com) to create an Alexa Skill.

3. Clone or download [https://github.com/Alexa/skill-sample-nodejs-salesforce](https://github.com/Alexa/skill-sample-nodejs-salesforce).
4. Navigate into the ```skill-sample-nodejs-salesforce``` directory. 
5. Set your Lambda function name in the Alexa config file. In the directory you just downloaded, modify the ```.ask/config``` file to have the Lambda ARN that you saved in the previous step. You want to change the ```"uri"``` setting to match that ARN. For example:

```json
"apis": {
  "custom": {
    "endpoint": {
      "uri": "<StackName>-AlexaSalesforceFunction-<Generated ID>"
     }
  }
}
```

6. Deploy the Alexa skill with the following command (it will also link your Lambda source code in the repository to the skill):

```bash
ask deploy
```

7. Make sure to save your skill ID that comes out from the ```deploy``` command, as you need it later in the instructions.

```
-------------------- Create Skill Project --------------------
Profile for the deployment: [default]
Skill Id: **<Skill ID>**
Skill deployment finished.
Model deployment finished.
Lambda deployment finished.
Your skill is now deployed and enabled in the development stage.
Try invoking the skill by saying “Alexa, open {your_skill_invocation_name}” or simulate an invocation via the `ask simulate` command.
```

8. Enable Testing - In order to test the skill before publishing, you need to enable testing on the  Alexa Developer Console.

You can directly jump to the page by substituting your Skill ID into the following URL: ```https://developer.amazon.com/alexa/console/ask/test/<Skill ID>/development/en_US```

Click the slider next to Disabled for testing. It should now say Enabled.

9. For extra security, you can also go to your Lambda function and re-create the Alexa Skills Kit trigger with Skill ID verification enabled. For more details, see [the Alexa Skills Kit documentation](https://developer.amazon.com/docs/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html#configuring-the-alexa-skills-kit-trigger).

## Continue with Github instructions

At this point, you can continue with the rest of the setup starting at [Step 3: Account Linking](https://github.com/alexa/skill-sample-nodejs-salesforce/blob/master/instructions/3-account-linking.md) in the Github repository.


