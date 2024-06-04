import { LambdaClient, InvokeCommand, LogType } from "@aws-sdk/client-lambda";

export const invokeLogger = async (payload) => {
    const client = new LambdaClient({ region: "eu-north-1" });

    const cmd = new InvokeCommand({
        FunctionName: "loggerProducer-dev",
        Payload: JSON.stringify(payload),
        LogType: LogType.Tail,
        InvocationType: "Event",
    });
    await client.send(cmd);
};
