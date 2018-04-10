# Distribute Private Skills

[![Salesforce Setup](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-1-done._TTH_.png)](./1-salesforce-setup.md)[![Deploy](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-2-done._TTH_.png)](./2-deploy.md)[![Account Linking](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-3-done._TTH_.png)](./3-account-linking.md)[![Testing](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-4-done._TTH_.png)](./4-testing.md)[![Distribute Private Skills](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/tutorial-page-marker-5-on._TTH_.png)](./5-distribute-private-skills.md)

## Part 5: Distribute Private Skills

[Alexa for Business](https://aws.amazon.com/alexaforbusiness/) lets you use Alexa to voice-enable your workplace by providing  the tools you need to manage Alexa devices, skills, and users at scale, and  an API to build custom, context-aware voice skills for your organization. 

In this case, let's assume you know the AWS account ID of an Alexa for Business organization that you want to give this Salesforce skill to.

### Publish the Private Skill
The ```skill.json``` that you used to create this skill is already marked as private. In this case, you need to submit the skill to move it to the ```Live``` stage.

1. You can confirm that the skill is marked to be published to Alexa for Business Organizations by going to ```https://developer.amazon.com/alexa/console/ask/publish/alexapublishing/<Skill ID>/development/en_US/availability```.

2. Click on the **Submission** option in the left menu bar.
3. Click **Submit for review** to submit your skill to the ```Live``` stage.

After the skill has been submitted, it takes about 30 minutes to 2 hours to propagate the skill to the live stage. To grant access to an AWS account, the skill must be in the live stage. 

### Grant Access to an AWS Account

1. Find your skill in the [Alexa Skills Kit Developer Console](https://developer.amazon.com/alexa/console/ask).
2. Make sure you see the skill has a **Status** of **Live**.
3. Click on the **Manage Access** link to the right of your Live skill.
4. Enter in the AWS account ID of the Alexa for Business organization you wish to grant access to, using the following format: ```arn:aws:iam::<AWS Account ID>:root```
5. Click **Add**.
6. Click **Save**.

## Distribute the Skill to Users

The Alexaa for Business account you gave access to will now be able to review and enable the skill for distribution to their enrolled users. For more information, see [Private Skills](https://docs.aws.amazon.com/a4b/latest/ag/private-skills.html) and [Managing Users](https://docs.aws.amazon.com/a4b/latest/ag/manage-users.html) in our [Alexa for Business documentation](https://docs.aws.amazon.com/a4b/latest/ag/what-is.html).

With these steps, you have been able to create a private Alexa skill that allows you to interact with your Salesforce data. You were able to set up account linking and a personal voice code. Finally, you deployed the skill to an Alexa for Business organization.