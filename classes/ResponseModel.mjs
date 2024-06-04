class ResponseModel {
    constructor(
        statusCode = 500,
        message = "Internal Server Error",
        data = null,
        contentType = "application/json",
    ) {
        this.statusCode = statusCode;
        this.body = {};
        this.body["message"] = message;
        if (data) {
            this.body["data"] = data;
        }
        this.body = JSON.stringify(this.body);
        this.headers = {};
        this.headers["Content-Type"] = contentType;
    }
}

export default ResponseModel;
