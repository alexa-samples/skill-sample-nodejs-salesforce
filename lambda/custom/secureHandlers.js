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

'use strict';

var Alexa = require('ask-sdk-v1adapter');
var bcrypt = require('bcryptjs');

const constants = require('./constants');
const voiceCodeHandlers = require('./voiceCodeHandlers');
const sf = require('./salesforce');

const imageObj = {
  largeImageUrl: 'https://s3.amazonaws.com/alexa-salesforce-demo-skill-images/sales_image.png'
};

const handlers = Alexa.CreateStateHandler(constants.STATES.SECURE, {
  'LaunchRequest': function () {
    if (preFunctions.call(this)) {
      let output = '';

      // Get the messaging for the user depending on their state of their voice code 
      if (this.attributes[constants.ATTRIBUTES_CHANGED_CODE]) {
        // Case where user just changed a code
        output = this.t("WELCOME_SUCCESS_NEW_CODE");
        this.attributes[constants.ATTRIBUTES_CHANGED_CODE] = null;
      } else if (this.attributes[constants.ATTRIBUTES_CREATED_CODE]) {
        // Case where user just created a new voice code
        output = this.t("CODE_SET");
        this.attributes[constants.ATTRIBUTES_CREATED_CODE] = null;
      } else if (this.attributes[constants.ATTRIBUTES_CONFIRMED_CODE]) {
        // Case where user confirmed code (coming from another handler)
        output = this.t("WELCOME_SUCCESS_CODE");
        this.attributes[constants.ATTRIBUTES_CONFIRMED_CODE] = null;
      } else {
        // Case where user has a new session with a valid voice code
        output = this.t("WELCOME_MESSAGE") + this.t("WELCOME_SKILL")
      }

      // Include opportunity details if they have it
      if (this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID]) {
        // Store the output so far so we can use it in the callback for optimal messaging
        this.attributes[constants.ATTRIBUTES_USER_MESSAGING] = output;

        // Refresh the opportunity details
        const opportunityId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
        const accessToken = this.event.session.user.accessToken;
        sf.query(`Select id, Name, StageName, CloseDate, Amount From Opportunity Where id='${opportunityId}' AND isclosed=false LIMIT 1`, accessToken, findOpportunity, this);
      } else {
        // In this case, we just add on the simple message to ask the user what they'd like to do.
        output +=  this.t("SHORT_HELP");
        this.emit(":ask", output, this.t("SHORT_HELP"));
      }
    }
  },
  'AMAZON.StartOverIntent': function () {
    voiceCodeHandlers.resetAttributes(true, this.attributes);
    // Route the user back to the SetupAccount function in voiceCodeHandlers.js if they request to start over.
    this.handler.state = constants.STATES.CODE;
    this.emitWithState("SetupAccount");
  },
  'RecentLead': function () {
    if (preFunctions.call(this)) {
      const accessToken = this.event.session.user.accessToken;
      sf.query("Select Name,Company From Lead ORDER BY CreatedDate DESC LIMIT 1", accessToken, (err, resp) => {
        if (!err) {
          if (resp.records) {
            const output = this.t("LEAD", resp.records[0]._fields.name, resp.records[0]._fields.company) + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
          } else {
            const output = this.t("LEAD_NOT_FOUND") + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
          }
        } else {
          console.log("Error in lead query call: " + JSON.stringify(err));
          this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
        }
      });
    }
  },
  'RecentOpportunity': function () {
    if (preFunctions.call(this)) {
      const accessToken = this.event.session.user.accessToken;
      sf.query("Select Name,StageName From Opportunity Where StageName != 'Closed Won' ORDER BY CreatedDate DESC LIMIT 1", accessToken, (err, resp) => {
        if (!err) {
          console.log('Opportunity query succeeded! ' + JSON.stringify(resp));

          if (resp.records) {
            var output = this.t("OPPORTUNITY", resp.records[0]._fields.name, resp.records[0]._fields.stagename) + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
          } else {
            var output = this.t("OPPORTUNITY_NOT_FOUND") + this.t("PROMPT");
            this.emit(":ask", output, this.t("PROMPT"));
          }
        } else {
          console.log("Error in opportunity query call: " + JSON.stringify(err));
          this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
        }
      });
    }
  },
  'UpdateOpportunityDateIntent': function () {
    console.log("UpdateOpportunityDateIntent function")
    if (preFunctions.call(this) && checkSlot.call(this, "opportunity_date", "OPPORTUNITY_DATE")) {
      const opportunityDate = getSlotValue(this.event.request.intent.slots.opportunity_date);
      const opportunityId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
      const currentUserId = this.attributes[constants.SALESFORCE_USER_ID];
      const accessToken = this.event.session.user.accessToken;

      console.log(`UpdateOpportunityDate \nopportunityDate: ${opportunityDate}, opportunityId: ${opportunityId}`);
      sf.updateOpportunity(opportunityId, opportunityDate, constants.OPPORTUNITY_CLOSE_DATE, currentUserId, accessToken, updateOpportunity, this);
    }
  },
  'UpdateOpportunityAmountIntent': function () {
    console.log("UpdateOpportunityAmountIntent function")
    if (preFunctions.call(this) && checkSlot.call(this, "opportunity_value", "OPPORTUNITY_VALUE")) {
      const opportunityValue = getSlotValue(this.event.request.intent.slots.opportunity_value);
      const opportunityId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
      const currentUserId = this.attributes[constants.SALESFORCE_USER_ID];
      const accessToken = this.event.session.user.accessToken;

      console.log(`UpdateOpportunityAmount \nopportunityValue: ${opportunityValue}, opportunityId: ${opportunityId}`);
      sf.updateOpportunity(opportunityId, opportunityValue, constants.OPPORTUNITY_AMOUNT, currentUserId, accessToken, updateOpportunity, this);
    }
  },
  'UpdateOpportunityStageIntent': function () {
    console.log("UpdateOpportunityStageIntent function")
    if (preFunctions.call(this) && checkSlot.call(this, "opportunity_stage", "OPPORTUNITY_STAGE")) {
      const opportunityStage = getSlotValue(this.event.request.intent.slots.opportunity_stage);
      const opportunityId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
      const currentUserId = this.attributes[constants.SALESFORCE_USER_ID];
      const accessToken = this.event.session.user.accessToken;

      console.log(`UpdateOpportunityStage \nopportunityStage: ${opportunityStage}, opportunityId: ${opportunityId}`);
      sf.updateOpportunity(opportunityId, opportunityStage, constants.OPPORTUNITY_STAGE_NAME, currentUserId, accessToken, updateOpportunity, this);
    }
  },
  'SelectOpportunityIntent': function () {
    console.log("SelectOpportunityIntent function");
    if (preFunctions.call(this)) {
      const opportunityName = getSlotValue(this.event.request.intent.slots.opportunity_name);
      console.log(`opportunityName: ${opportunityName}`);
      const accessToken = this.event.session.user.accessToken;
      sf.query(`Select id, Name, StageName, CloseDate, Amount From Opportunity Where Name='${opportunityName}' AND isclosed=false LIMIT 1`, accessToken, findOpportunity, this);
    }
  },
  'ChangeCode': function () {
    // Route the user back to the PromptForCode function in the CHANGE_CODE state handler
    // in voiceCodeHandlers.js if the user wants to change their code.
    this.handler.state = constants.STATES.CHANGE_CODE;
    this.emitWithState("PromptForCode");
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t("STOP_MESSAGE"));
  },
  'AMAZON.CancelIntent': function () {
    // Use this function to clear up and save any data needed between sessions
    this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID] = null;
    this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME] = null;

    this.emit(":tell", this.t("CANCEL_MESSAGE"));
  },
  'SessionEndedRequest': function () {
    // Use this function to clear up and save any data needed between sessions
    this.emit('AMAZON.StopIntent');
  },
  'AMAZON.HelpIntent': function () {
    // Route the user to the HELP state handler in voiceCodeHandlers.js
    this.handler.state = constants.STATES.HELP;
    this.emitWithState("helpTheUser");
  },
  'Unhandled': function () {
    console.log("in secureHandler Unhandled");
    // Route the user to the CODE state handler in voiceCodeHandlers.js
    this.handler.state = constants.STATES.CODE;
    this.emitWithState("UnhandledError");
  }
});

module.exports = handlers;

/** 
 * Collection of logic to be executed at the start of any secured intent
 */
const preFunctions = function () {
  // Extra debugging to get the value of the session attributes
  console.log(`DEBUG - attributes:\n${JSON.stringify(this.attributes)}`);
  let userValid = true;
  // Validate the voice code is within a given timeout window
  if (!voiceCodeHandlers.verifyVoiceCodeTimeout.call(this)) {
    console.log("User's voice code needs to be refreshed.");
    // Require the code to be spoken
    this.attributes[constants.ATTRIBUTES_LAST_REQUEST] = null;
    this.attributes[constants.ATTRIBUTES_NUM_ATTEMPTS] = 0;
    this.handler.state = constants.STATES.CODE;
    this.emitWithState("SetupAccount");
    userValid = false;
  } else {
    console.log("User's voice code is still within valid timeout limits.");
    // Make sure we're in the right secure state
    this.handler.state = constants.STATES.SECURE;
  }
  return userValid;
}

/**
 * Slot helper to elicit the slot if it doesn't exist
 */
const checkSlot = function(slotName, slotMessage) {
  const intentObj = this.event.request.intent;
  let slotValid = true;
  if (!intentObj.slots[slotName].value) {
    console.log(`Couldn't find a slot value for ${slotName}. Eliciting for this slot value.`);
    this.emit(":elicitSlot", slotName, this.t(slotMessage), this.t(slotMessage));
    this.emit(":responseReady");
    slotValid = false;
  }
  return slotValid;
}

/**
 * Obtains a slot value from entity resolution (if it matched a synonym) or just from the primary slot value
 * @returns value for a given slot input
 * */
const getSlotValue = function (slot) {
  let slotValue;
  console.log(`DEBUG - slot: ${JSON.stringify(slot)}`);
  if (slot && slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0 &&
    slot.resolutions.resolutionsPerAuthority[0].values && slot.resolutions.resolutionsPerAuthority[0].values.length > 0) {
    // For the purpose of this skill, we'll assume that resolutions mean we have one 
    // canonical entry from one ER. It is possible, and likely, that real scnearios 
    // have multiple canonical choices, but we're being simple for a demo.
    slotValue = slot.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    console.log(`DEBUG - getSlotValue resolutions flow - slotValue: ${slotValue}`);
  }
  if (!slotValue && slot && slot.value) {
    // If we don't have any entity resolutions or if it didn't resolve to anything, just take the slot value (if it exists)
    slotValue = slot.value;
    console.log(`DEBUG - getSlotValue non-resolutions flow - slotValue: ${slotValue}`);
  }
  return slotValue;
}

/* 
 * Find an opportunity callback function - processes a single opportunity that was selected by name.
 */
const findOpportunity = function (err, resp) {
  console.log("findOpportunity function");
  if (!err) {
    console.log(`Opportunity query succeeded: ${JSON.stringify(resp)}`);
    if (resp.records.length > 0) {
      const opp = resp.records[0]._fields;
      const currentOppId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
      let output = '';
      
      if (currentOppId === opp.id) {
        console.log("DEBUG - Matched opportunity in session, giving sign in messaging");
        output = this.attributes[constants.ATTRIBUTES_USER_MESSAGING];
        this.attributes[constants.ATTRIBUTES_USER_MESSAGING] = null;
        output += this.t("OPPORTUNITY_PREVIOUS", opp.name);
      } else {
        console.log("DEBUG - No opportunity in session or doesn't match, giving look up opportunity messaging");
        this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID] = opp.id;
        this.attributes[constants.ATTRIBUTES_OPPORTUNITY_NAME] = opp.name;  
        output = this.t("OPPORTUNITY_SELECTED", opp.name);
      }

      this.response.speak(output)
        .cardRenderer(this.t("OPPORTUNITY_CARD_TITLE"), this.t("OPPORTUNITY_CARD", opp.id, opp.name, opp.closedate, opp.stagename, renderDollarAmount(opp.amount)), imageObj)
        .listen(this.t("LIKE_TO_DO"));
      this.emit(":responseReady");
    } else {
      const output = this.t("OPPORTUNITY_NOT_FOUND");
      this.emit(":ask", output, output);
    }
  } else {
    console.log(`Error in opportunity query call: ${JSON.stringify(err)}`);
    this.emit(":tell", this.t("UNKNOWN_SALESFORCE_ERROR"));
  }
}

/* 
 * Update an opportunity attribute then shows the opportunity back to the user.
 */
const updateOpportunity = function (err, resp) {
  console.log("DEBUG - updateOpportunity callback function");
  if (!err) {
    const opportunityId = this.attributes[constants.ATTRIBUTES_OPPORTUNITY_ID];
    const accessToken = this.event.session.user.accessToken;
    sf.query(`Select id, Name, StageName, CloseDate, Amount From Opportunity Where id='${opportunityId}' LIMIT 1`, accessToken, renderUpdatedOpportunity, this);
  } else {
    console.error(`err: ${JSON.stringify(err)}`);
    this.emit(":tell", this.t("UNKNOWN_ERROR"));
  }
}

/* 
 * Create the display card after updating an opportunity
 */
const renderUpdatedOpportunity = function (err, resp) {
  console.log(`renderUpdatedOpportunity. response: ${JSON.stringify(resp)}`);
  if (!err) {
    if (resp.records.length > 0) {
      const opp = resp.records[0]._fields;
      this.response.speak(this.t("OPPORTUNITY_UPDATE"))
        .cardRenderer(this.t("OPPORTUNITY_CARD_TITLE"), this.t("OPPORTUNITY_CARD", opp.id, opp.name, opp.closedate, opp.stagename, renderDollarAmount(opp.amount)), imageObj)
        .listen(this.t("LIKE_TO_DO"));
      this.emit(':responseReady');
    } else {
      this.emit(":tell", this.t("OPPORTUNITY_ERROR"));
    }
  } else {
    console.error(`err: ${JSON.stringify(err)}`);
    this.speak(":tell", this.t("UNKNOWN_ERROR"));
  }
}

/*
 * Helper function to format dollar amounts
 */
const renderDollarAmount = function (amount) {
  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}