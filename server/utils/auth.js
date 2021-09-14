const jwt = require('jsonwebtoken');

const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  authMiddleware: function({ req }) {
      //allow token to be sent via req.body, req.query, and headers
      let token = req.body.token || req.query.token || req.headers.authorization;

      //separate the "Bearer" from "<tokenValue>"
        if (req.headers.authorization) {
          token = token
            .split(' ')
            .pop()
            .trim();
      }

      //if no token, return req object as is
      if(!token) {
          return req;
      }

      try {
          //decode and request user data to req object
          const { data } = jwt.verify(token, secret, { maxAge: expiration });
          req.user = data;
      } catch {
          console.log('Invalid Token');
      }
      // return updated req object
      return req;
  }
};