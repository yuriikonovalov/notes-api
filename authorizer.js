const {CognitoJwtVerifier} = require("aws-jwt-verify");

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_USER_POOL_ID,
    tokenUse: "id",
    clientId: COGNITO_WEB_CLIENT_ID
})

const generatePolicy = (principalId, effect, resource) => {
    // Lambda Authorizer cache issue workaround
    var tmp = resource.split(":")
    var apiGatewayArnTmp = tmp[5].split("/")
    var resource = tmp[0] + ":" + tmp[1] + ":" + tmp[2] + ":" + tmp[3] + ":" + tmp[4] + ":" + apiGatewayArnTmp[0] + "/*/*"


    // IAM Policy
    var authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        authResponse.policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke"
                }
            ]
        };
    }
    authResponse.context = {
        foo: "bar"
    }

    console.log(JSON.stringify(authResponse))

    return authResponse;
}

exports.handler = async (event, context, callback) => {
    // lambda authorizer code
    var token = event.authorizationToken;
    console.log(token)

    try {
        const payload = await jwtVerifier.verify(token)
        console.log(JSON.stringify(payload))
        callback(null, generatePolicy("user", "Allow", event.methodArn));
    } catch (error) {
        callback("Error: Invalid token");
    }
}