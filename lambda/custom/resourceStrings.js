/*
 * Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
 
var languageString = {
  "en": {
    "translation": {
      /* General messaging */
      "CANCEL_MESSAGE": "Ok, I've cleared your session details. Goodbye.",
      "LIKE_TO_DO": "What would you like to do?",
      "PROMPT": "How else can I help?",
      "STOP_MESSAGE": "Ok, bye!",
      "WELCOME_HAS_CODE": "Please say your 4-digit voice code to get started. ",
      "WELCOME_MESSAGE": "Welcome to the sample Alexa skill with Salesforce integration. ",
      "WELCOME_NO_CODE": "To use this skill, you need to set a 4-digit voice code first. Please say a voice code now. ",
      "WELCOME_SKILL": "Your voice code is still valid. ",
      "WELCOME_SUCCESS_CODE": "Great, I verified your identity using your voice code. ",
      "WELCOME_SUCCESS_NEW_CODE": "I've changed your voice code. ",

      /* Help messaging */
      "HELP_MESSAGE": "This skill can be used to see how Alexa can work with Salesforce to set a voice code, and how to access Salesforce data through the account linking process. Try asking for a recent lead, or opportunity. For testing the voice code process, try asking me to start over, so you will have to authenticate again. You can also ask to change your voice code. How can I help? ",
      "SHORT_HELP": "You can ask about your most recent lead, or I can find an opportunity by name. What would you want to do?",

      /* Slot Elicitation */
      "OPPORTUNITY_VALUE": "What's the new amount?'",
      "OPPORTUNITY_DATE": "What's the new close date?'",
      "OPPORTUNITY_STAGE": "What's the new stage?'",

      /* Account/Voice Code Related messages */
      "ACCOUNT_RELINK_MESSAGE": "You need to relink your Salesforce account in order to use this skill. I've placed more information on a card in your Alexa app. ",
      "ACCOUNT_REQUIRED_MESSAGE": "A Salesforce account is required to use this skill. I've placed more information on a card in your Alexa app. ",
      "ACCOUNT_REQUIRED_CARD": "Relink your account. To relink your account, open the skill within the Alexa App and click re-link account. ",
      "CODE_REPEAT_REQUEST": "Please try your code one more time. ",
      "CHANGE_NEW_CODE": "Say your new, 4-digit voice code now. ",
      "CHANGE_PROVIDE_CODE": "Before proceeding with a voice code change, please say your current voice code. ",
      "CODE_REQUEST": "Please say your voice code. ",
      "CODE_SET": "I've saved your voice code. You'll need to use it the next time you use this skill, so don't forget it! ",

      /* Salesforce related messages */
      "LEAD": "Your most recent lead is for %s from %s. ",
      "LEAD_NOT_FOUND": "I didn't find any leads. What else can I do?",
      "OPPORTUNITY": "Your most recent opportunity that's not closed is for %s and it's in the %s stage. ",
      "OPPORTUNITY_CARD": "ID: %s\nName: %s\nClose Date: %s\nStage: %s\nAmount: %s",
      "OPPORTUNITY_CARD_TITLE": "Opportunity Details",
      "OPPORTUNITY_ERROR": "I ran into an error when trying to update your opportunity. Please try again later. ",
      "OPPORTUNITY_NOT_FOUND": "I didn't find any opportunities. Can you try another name? ",
      "OPPORTUNITY_PREVIOUS": "Here is the last Opportunity you selected, %s. To remove this, just tell me to cancel. Otherwise, you can make updates to the stage, amount, or close date.",
      "OPPORTUNITY_SELECTED": "I found an Opportunity called %s. You can make updates to the stage, amount, or close date.",
      "OPPORTUNITY_UPDATE": "I've made the update. ",

      /* Error messages */
      "UNKNOWN_SALESFORCE_ERROR": "I encountered an error when trying reach Salesforce. Please try again later.",
      "UNKNOWN_ERROR": "I ran into a problem with that request. Please try again later. ",
    }
  }
};

module.exports = languageString;