var {jwtVerify} = require('../../../../libs/security');


const jwtAuthorizer = async (req, res, next)=>{
  const jwtToken = (req.headers.Authorization || req.headers.authorization || '').replace('Bearer ', '');
  // console.log(req);
  console.log('JwtAuthorizer: ', {jwtToken});
  try{
    const jwtData = await jwtVerify(jwtToken);
    console.log(jwtData);
    req.user = jwtData;
    return next();
  } catch (ex) {
    console.error('jwtAuthorizer: ', {ex});
    return res.status(401).json({'error':'unauthorized'});
  }
}

module.exports = {
  jwtAuthorizer
}
