const jwt = require("jsonwebtoken");
let count = 0;
function generateSignUpData(request, context, ee, next) {
  const rNumber = Math.floor(Math.random() * 10 + 1);
  // console.log('context.var.phone', context.vars)
  let payload = {
    // phone: phone[Math.floor(Math.random() * 9) + 1],
    // phone: phone[count],
    name: `sidd${rNumber}`,
    dateOfBirth: "2014-04-16",
    gender: "Male",
    recoveryEmail: `${rNumber}@gmail.com`,
    referral: null,
  };
  count++;

  request.json = { ...payload };
  return next();
}

function afterRegisterRequest(requestParams, response, context, ee, next) {
  let resp = JSON.parse(response.body);
  context.vars.jwt = resp.jwt
  // context.vars.id = resp.user._id;
  // context.vars.jwt = resp.jwt;
  return next();
}
function homeScreenBeforeRequest(request, context, ee, next) {
  // console.log(context.vars._id)
  const token = getSignedToken(context.vars._id)
  request["headers"] = {
    authorization: "Bearer " + token,
  };

  return next();
}
function homeScreenAfterRequest(request, response, context, ee, next) {
  
  console.log("homeScreenResponse", request.headers["x-my-header"],response.body);
  return next();
}
function generalUserBeforeRequest(request, context, ee, next) {
  request["headers"] = {
    authorization: "Bearer " + context.vars.jwt,
  };
  // console.log("context.vars.id", context.vars.id);
  let payload = {
    userId: context.vars.id,
  };
  request.json = { ...payload };
  // console.log("request.json", request.json);
  return next();
}
function generalUserAfterRequest(request, response, context, ee, next) {
  // console.log("generalScreen", response.body);
  return next();
}

function getSignedToken(user) {
  return jwt.sign(
    { id: String(user) },
   "68c372da0eb9885b7975e1cf0e528bff8335ab23d836afc7c84a69e081415d4a064298777da0d7255915fd933e7f5485b30c76bc4f49547965f42a41496b3fe7",
    {
      // Token expires in 1 month
      expiresIn: 60 * 60 * 24 * 30,
    }
  );
}

module.exports = {
  generateSignUpData,
  afterRegisterRequest,
  homeScreenBeforeRequest,
  homeScreenAfterRequest,
  generalUserBeforeRequest,
  generalUserAfterRequest,
};
