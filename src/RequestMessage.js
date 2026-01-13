export const issueRequestId = (function () {
    let id = 0;
    return function () {
        let reqId = (id + 1) & 0xffff;
        if (reqId === 0) {
            reqId = 1;
        }
        id = reqId;
        return reqId;
    }
})();
