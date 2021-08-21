exports.handler = function (event, context, callback) {
    let body
    const secretContent = `
    <h3>welcome to the Secret Area</h3>
    <p>Here we can tell you that sky is <strong>blue</strong></p>
    `
    if (event.body) {
        body = JSON.parse(event.body)
    }
    else {
        body = {}
    }
    if (body.password == "javascript") {
        callback(null, {
            statusCode: 200,
            body: secretContent
        })
    }
    else {
        callback(null, {
            statusCode: 401
        })
    }
}