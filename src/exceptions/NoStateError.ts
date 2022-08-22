class NoStateError extends Error
{
    httpStatusCode: number;

    constructor(msg: string)
    {
        super(msg);
        this.name = "NoStateError";
        this.httpStatusCode = 401;
    }
}
