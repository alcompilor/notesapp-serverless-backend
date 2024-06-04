import { db } from "../../utils/dynamodb.mjs";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

export const handler = async (event) => {
    try {
        console.log(`HTTP REQUEST:\n${JSON.stringify(event.detail)}`);
        const Item = event.detail;

        const cmd = new PutCommand({
            TableName: "HttpLogsTable",
            Item,
        });
        await db.send(cmd);
    } catch (error) {
        console.error(error);
    }
};
