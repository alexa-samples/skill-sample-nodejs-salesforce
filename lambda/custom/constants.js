 /*
  * Copyright 2018 Amazon.com, Inc. and its affiliates. All Rights Reserved.
  *
  * Licensed under the MIT License. See the LICENSE accompanying this file
  * for the specific language governing permissions and limitations under
  * the License.
  */

'use strict';

module.exports = Object.freeze({

  // App-ID. TODO: set to your own Skill App ID from the developer portal. KS done 12/21 9:51 am MT
  appId: process.env.SKILL_ID || 'run-hackathon-alexa-2021-FirstSkill',

  // Salesforce Constants
  INSTANCE_URL: process.env.INSTANCE_URL || '', // TODO Set your own. KS done 12/21
  VOICE_CODE_OBJECT_NAME: process.env.VOICE_CODE_OBJECT_NAME || 'voice_code__c',
  VOICE_CODE_FIELD_NAME: process.env.VOICE_CODE_FIELD_NAME || 'code__c',

  // Custom Skill Settings
  dynamoDBTableName: 'Salesforce_Skill',
  CODE_TIMEOUT_MINUTES: 5,
  SALESFORCE_USER_ID: 'salesforceUserId',

  // Salesforce field names
  OPPORTUNITY_AMOUNT: "Amount",
  OPPORTUNITY_CLOSE_DATE: "CloseDate",
  OPPORTUNITY_STAGE_NAME: "StageName",

  // Attributes names
  ATTRIBUTES_ACCOUNT: 'account-id',
  ATTRIBUTES_CHANGED_CODE: 'CHANGED_CODE',
  ATTRIBUTES_CONFIRMED_CODE: 'CONFIRMED_CODE',
  ATTRIBUTES_CREATED_CODE: 'CREATED_CODE',
  ATTRIBUTES_HAS_CODE: 'HAS_CODE',
  ATTRIBUTES_LAST_REQUEST: 'lastRequest',
  ATTRIBUTES_NUM_ATTEMPTS: 'numAttempts',
  ATTRIBUTES_OPPORTUNITY_ID: 'opportunity-id',
  ATTRIBUTES_OPPORTUNITY_NAME: 'opportunity-name',
  ATTRIBUTES_USER_MESSAGING: 'userMessaging',
  
  // For code debugging
  DEBUG: true,

  // States for state handlers
  STATES: {
    START: '',
    HELP: '_HELP_MODE',
    CODE: '_WAITING_FOR_CODE_MODE', // User needs to provide a voice code
    CHANGE_CODE: '_CHANGE_CODE', // User wants to change their voice code, confirming current code
    NEW_CODE: '_NEW_CODE', // User wants to set their new voice code
    SECURE: '_SECURE' // voice code validated
  }
});
