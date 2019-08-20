/*
  Copyright 2019 Square Inc.
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
      http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

const squareConnect = require('square-connect');
const crypto = require('crypto');

// Set the Access Token and Location Id
const accessToken = process.env.SQUARE_PROD;

// Set Square Connect credentials
const defaultClient = squareConnect.ApiClient.instance;

// Configure OAuth2 access token for authorization: oauth2
const oauth2 = defaultClient.authentications['oauth2'];
oauth2.accessToken = accessToken;


defaultClient.basePath = 'https://connect.squareupsandbox.com';

exports.handler = async (event, context, callback) => {
	if (event.httpMethod !== "POST" || !event.body) {
		return {
			statusCode: 400,
			body: ""
			// headers: { 
			// 	"Access-Control-Allow-Origin" : "*",
			// 	"Access-Control-Allow-Credentials" : true 
			// }, 
		};
	}

	const request_params = JSON.parse(event.body);
	const amount = request_params.amount * 100;

	const idempotency_key = crypto.randomBytes(22).toString('hex');
  
	const payments_api = new squareConnect.PaymentsApi();
	const request_body = {
	  source_id: request_params.nonce,
	  amount_money: {
		amount: amount,
		currency: 'USD'
	  },
	  idempotency_key: idempotency_key
	};
  
	try {
	  const response = await payments_api.createPayment(request_body);
		return {
			statusCode: 200,
			body: `Payment Successful ${response}`,
		};
	} catch(error) {
		return {
			statusCode: 500,
			body: `Payment Failure ${error.response.text}`
		};
	}
};
