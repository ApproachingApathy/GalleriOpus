/**
 * 
 * @param data Data to be sent in the body. Objects and arrays are converted by JSON.stringify.
 * @param status HTTP status code.
 * @param contentType HTTP mime-type. Defaults to application/json
 */
export const createResponse = (data: any, status = 200, contentType = "application/json") => {
    const headers = new Headers()
    headers.set("Content-Type", contentType)

    let stringifiedData: string
    if (Array.isArray(data) || typeof data === 'object') stringifiedData = JSON.stringify(data)
    else stringifiedData = data

    console.log(stringifiedData)

    return new Response(stringifiedData, {
        status,
        headers
    })
}