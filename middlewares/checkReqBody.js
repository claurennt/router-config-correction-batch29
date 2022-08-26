const checkReqBody = (req, res, next) => {
  const { username, password, firstname, lastname } = req.body;
  if (!username || !password || !firstname || !lastname)
    return res.status(400).send("The request body must have all the values");
 next()
};

module.exports = checkReqBody;
