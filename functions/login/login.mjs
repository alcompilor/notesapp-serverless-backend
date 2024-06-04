import jwt from "jsonwebtoken";
import { db } from "../../utils/dynamodb.mjs";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import ResponseModel from "../../classes/ResponseModel.mjs";
import { getJwtSecret } from "../../utils/jwtSecret.mjs";
import { invokeLogger } from "../../utils/invokeLogger.mjs";

export const handler = async (event) => {
    try {
        await invokeLogger(event);

        const { username, password } = JSON.parse(event.body);
        const JWT_SECRET = await getJwtSecret();

        const cmd = new QueryCommand({
            TableName: "UsersTable",
            KeyConditionExpression: "username = :username",
            ExpressionAttributeValues: {
                ":username": username,
            },
        });
        const data = await db.send(cmd);

        if (data.Items && data.Items[0].password === password) {
            const token = jwt.sign({ username }, JWT_SECRET, {
                expiresIn: "24h",
            });
            return {
                statusCode: 200,
                cookies: [
                    `authorization=${token}; SameSite=None; Secure; Partitioned`,
                ],
            };
        } else {
            return new ResponseModel(401, "Invalid username or password");
        }
    } catch (error) {
        return new ResponseModel(500, error.message);
    }
};
