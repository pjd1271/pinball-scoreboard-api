import handler from './libs/handler-lib';
import dynamoDb from './libs/dynamodb-lib';

export const main = handler(async (event, context) => {
	const data = JSON.parse(event.body);

	const players = [data.player1 || null, data.player2 || null, data.player3 || null, data.player4 || null];
	const scores = [data.score1, data.score2, data.score3, data.score4];
	const highestScore = Math.max.apply(Math, scores);
	const params = {
		TableName: process.env.tableName,
		// 'Key' defines the partition key and sort key of the item to be updated
		// - 'userId': Identity Pool identity id of the authenticated user
		// - 'date_machine': path parameter
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId,
			date_machine: event.pathParameters.date_machine,
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: 'SET players = :players, scores = :scores, highestScore = :highestScore',
		ExpressionAttributeValues: {
			':players': players,
			':scores': scores,
			':highestScore': highestScore,
		},
		// 'ReturnValues' specifies if and how to return the item's attributes,
		// where ALL_NEW returns all attributes of the item after the update; you
		// can inspect 'result' below to see how it works with different settings
		ReturnValues: 'ALL_NEW',
	};

	await dynamoDb.update(params);

	return { status: true };
});
