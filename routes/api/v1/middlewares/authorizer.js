const authorizer = (req, res, next)=>{
  const clientApiKey = req.headers.apikey || '';
  const appApiKey = (process.env.APP_API_KEY).split('|');
  if (appApiKey.includes(clientApiKey)) {
    return next();
  }
  console.error("authorizer: Invalid 'API TOKEN'", req.headers);
  res.status(401).json({"error":"Client request not authorized."});
}

module.exports.authorizer = authorizer;
