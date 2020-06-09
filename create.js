import * as uuid from 'uuid';
import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const main = handler(async (event, context) => {
	const data = JSON.parse(event.body);
	const params = {
		TableName: process.env.tableName,
		// 'Item' contains the attributes of the item to be created
		// - 'userId': user identities are federated through the
		//             Cognito Identity Pool, we will use the identity id
		//             as the user id of the authenticated user
		// - 'date_machine': parsed from request body and current Unix timestamp, concatenated to form sort key
		// - 'gameId': a unique uuid
		// - 'players': parsed from request body
		// - 'scores': parsed from request body
		// - 'highestScore': parsed from request body
		Item: {
			userId: event.requestContext.identity.cognitoIdentityId,
			date_machine: `${Date.now()}_${data.machine}`,
			gameId: uuid.v1(),
			players: data.players,
			scores: data.scores,
			highestScore: Math.max.apply(Math, data.scores),
		},
	};

	await dynamoDb.put(params);

	return params.Item;
});
