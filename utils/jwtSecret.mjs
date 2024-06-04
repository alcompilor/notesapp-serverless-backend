import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm";

const ssm = new SSMClient({
    region: "eu-north-1",
});

export const getJwtSecret = async () => {
    const cmd = new GetParameterCommand({
        Name: "JWT_SECRETKEY_NOTESAPP",
        WithDecryption: true,
    });

    const res = await ssm.send(cmd);
    return res.Parameter.Value;
};
