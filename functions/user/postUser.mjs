import { db } from "../../utils/dynamodb.mjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import ResponseModel from "../../classes/ResponseModel.mjs";
import { invokeLogger } from "../../utils/invokeLogger.mjs";

export const handler = async (event) => {
    try {
        await invokeLogger(event);
        const { username, fullName, email, password } = JSON.parse(event.body);

        if (!username || !fullName || !email || !password) {
            return new ResponseModel(
                400,
                "Missing fields. Expected `username`, `fullName`, `email`, and `password`.",
            );
        }

        const Item = {
            username,
            fullName,
            email,
            password,
        };
        const cmd = new PutCommand({
            TableName: "UsersTable",
            Item,
        });
        await db.send(cmd);

        return new ResponseModel(201, "User created", Item);
    } catch (error) {
        return new ResponseModel(500, error.message);
    }
};
