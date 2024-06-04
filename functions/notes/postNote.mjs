import { db } from "../../utils/dynamodb.mjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import ResponseModel from "../../classes/ResponseModel.mjs";
import { invokeLogger } from "../../utils/invokeLogger.mjs";

export const handler = async (event) => {
    try {
        await invokeLogger(event);
        const decodedToken = JSON.parse(
            event.requestContext.authorizer.lambda.decodedToken,
        );
        const { title, content, date } = JSON.parse(event.body);

        if (!title || !content || !date) {
            return new ResponseModel(
                400,
                "Missing fields. Expected `title`, `content`, and `date`.",
            );
        }

        const Item = {
            username: decodedToken.username,
            title,
            content,
            date,
        };
        const cmd = new PutCommand({
            TableName: "NotesTable",
            Item,
        });
        await db.send(cmd);

        return new ResponseModel(201, "Note created", Item);
    } catch (error) {
        return new ResponseModel(500, error.message);
    }
};
