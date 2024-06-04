import {
    EventBridgeClient,
    PutEventsCommand,
} from "@aws-sdk/client-eventbridge";

export const handler = async (event = { hello: "world" }) => {
    try {
        const client = new EventBridgeClient({ region: "eu-north-1" });

        const data = {
            ip: event.requestContext.http.sourceIp,
            path: event.requestContext.http.path,
            method: event.requestContext.http.method,
            time: event.requestContext.time,
        };

        await client.send(
            new PutEventsCommand({
                Entries: [
                    {
                        Detail: JSON.stringify(data),
                        DetailType: "logHttpRequest",
                        Source: "http.reqs",
                        EventBusName: "notesapp-http-logger",
                    },
                ],
            }),
        );
    } catch (error) {
        console.error(error);
    }
};
