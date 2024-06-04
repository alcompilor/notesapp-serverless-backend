import { db } from "../../utils/dynamodb.mjs";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import ResponseModel from "../../classes/ResponseModel.mjs";
import { invokeLogger } from "../../utils/invokeLogger.mjs";

export const handler = async (event) => {
    try {
        await invokeLogger(event);

        const decodedToken = JSON.parse(
            event.requestContext.authorizer.lambda.decodedToken,
        );
        const { title } = JSON.parse(event.body);

        if (!title) {
            return new ResponseModel(400, "Missing fields. Expected `title`.");
        }

        const cmd = new DeleteCommand({
            TableName: "NotesTable",
            Key: {
                username: decodedToken.username,
                title,
            },
        });
        await db.send(cmd);

        return new ResponseModel(200, "Note deleted");
    } catch (error) {
        return new ResponseModel(500, error.message);
    }
};
