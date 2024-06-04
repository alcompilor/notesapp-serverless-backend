import { db } from "../../utils/dynamodb.mjs";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import ResponseModel from "../../classes/ResponseModel.mjs";
import { invokeLogger } from "../../utils/invokeLogger.mjs";

export const handler = async (event) => {
    try {
        await invokeLogger(event);
        const decodedToken = JSON.parse(
            event.requestContext.authorizer.lambda.decodedToken,
        );

        const cmd = new QueryCommand({
            TableName: "UsersTable",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": decodedToken.username,
            },
            ProjectionExpression: "username, email, fullName",
        });
        const data = await db.send(cmd);

        return new ResponseModel(200, "User found", data.Items);
    } catch (error) {
        return new ResponseModel(500, error.message);
    }
};
