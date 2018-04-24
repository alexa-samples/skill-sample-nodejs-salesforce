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

const constants = require('./constants');
const nforce = require('nforce');

/*
 These are set to NA as they are not used, due to the fact that we are using 
 Alexa's account linking process to obtain an acess token, not the default
 nforce createConnection and authenticate methods.
 */
const org = nforce.createConnection({
  clientId: "NA",
  clientSecret: "NA",
  redirectUri: "NA"
});

const sf = {
  getIdentity: function (accessToken, callback, origContext) {
    org.getIdentity({ oauth: getOauthObject(accessToken) }, callback.bind(origContext));
  },
  getVoiceCode: function (userId, accessToken, callback, origContext) {
    const q = `Select ${constants.VOICE_CODE_FIELD_NAME} From ${constants.VOICE_CODE_OBJECT_NAME} Where Name = '${userId}' LIMIT 1`;
    org.query({ oauth: getOauthObject(accessToken), query: q }, callback.bind(origContext));
  },
  query: function (query, accessToken, callback, origContext) {
    const q = query;
    org.query({ oauth: getOauthObject(accessToken), query: q }, callback.bind(origContext));
  },
  updateVoiceCode: function (code, userId, accessToken, callback, origContext) {
    const q = `Select Id From ${constants.VOICE_CODE_OBJECT_NAME} Where Name = '${userId}' LIMIT 1`;

    org.query({ oauth: getOauthObject(accessToken), query: q }).then(function (resp) {
      const updated_code = nforce.createSObject(constants.VOICE_CODE_OBJECT_NAME);
      updated_code.set(constants.VOICE_CODE_FIELD_NAME, code);
      updated_code.set("Id", resp.records[0]._fields.id);
      updated_code.set("Name", userId);
      org.update({ sobject: updated_code, oauth: getOauthObject(accessToken) }, callback.bind(origContext));
    });
  },
  createVoiceCode: function (code, userId, accessToken, callback, origContext) {
    const new_code = nforce.createSObject(constants.VOICE_CODE_OBJECT_NAME);
    new_code.set(constants.VOICE_CODE_FIELD_NAME, code);
    new_code.set("Name", userId);
    org.insert({ sobject: new_code, oauth: getOauthObject(accessToken) }, callback.bind(origContext));
  },
  updateOpportunity: function (id, value, fieldName, userId, accessToken, callback, origContext) {
    if (id && userId && fieldName && value && accessToken) {
      const update_opportunity = nforce.createSObject("Opportunity");
      update_opportunity.set("Id", id);
      update_opportunity.set(fieldName, value);
      org.update({ sobject: update_opportunity, oauth: getOauthObject(accessToken) }, callback.bind(origContext));
    } else {
      console.error(`missing value for one value: id: ${id}, userId: ${userId}, fieldName: ${fieldName}, value: ${value}, accessToken: ${accessToken}.`);
      callback.call(origContext, "Error, fields missing");
    }
  }
}

module.exports = sf;

function getOauthObject(accessToken) {
  // Construct our OAuth token based on the access token we were provided from Alexa
  const oauth = {};
  oauth.access_token = accessToken;
  oauth.instance_url = constants.INSTANCE_URL;
  return oauth;
}