/**
 * 
 * @param data Data to be sent in the body. Objects and arrays are converted by JSON.stringify.
 * @param status HTTP status code.
 * @param contentType HTTP mime-type. Defaults to application/json
 */
export const createResponse = (data: any, status = 200, contentType = "application/json") => {
    const headers = new Headers()
    headers.set("Content-Type", contentType)

    let responseBody: string
    if (Array.isArray(data) || data.constructor.name === "Object") responseBody = JSON.stringify(data)
    else responseBody = data

    return new Response(responseBody, {
        status,
        headers
    })
}