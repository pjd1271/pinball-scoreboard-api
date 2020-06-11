import * as uuid from 'uuid';
import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
	const data = JSON.parse(event.body);
	const players = data.players;
	const scores = data.scores;
	// const players = [data.player1, data.player2, data.player3, data.player4];
	// const scores = [data.score1, data.score2, data.score3, data.score4];
	const highestScore = Math.max.apply(Math, scores);
	const params = {
		TableName: process.env.tableName,
		// 'Item' contains the attributes of the item to be created
		// - 'userId': user identities are federated through the
		//             Cognito Identity Pool, we will use the identity id
		//             as the user id of the authenticated user
		// - 'date_machine': parsed from request body and current Unix timestamp, concatenated to form sort key
		// - 'gameId': a unique uuid
		// - 'players': players array
		// - 'scores': scores array
		// - 'highestScore': calculated highest score
		Item: {
			userId: event.requestContext.identity.cognitoIdentityId,
			date_machine: `${Date.now()}_${data.machine}`,
			gameId: uuid.v1(),
			players: players,
			scores: scores,
			highestScore: highestScore,
		},
	};

	await dynamoDb.put(params);

	return params.Item;
});
