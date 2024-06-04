import jwt from "jsonwebtoken";
import { getJwtSecret } from "../../utils/jwtSecret.mjs";

export const handler = async (event) => {
    try {
        const authHeader = event.headers.cookie;
        const token = authHeader.split("=")[1];
        const JWT_SECRET = await getJwtSecret();

        if (!token) {
            return {
                isAuthorized: false,
            };
        }

        const payload = jwt.verify(token, JWT_SECRET);

        return {
            isAuthorized: true,
            context: {
                decodedToken: JSON.stringify(payload),
            },
        };
    } catch (err) {
        return {
            isAuthorized: false,
        };
    }
};
