const ExtendableError = require('@yo1dog/extendable-error');


class HTTPResponseError extends ExtendableError {
  /**
   * Formats an error message around an HTTP response.
   * 
   * Built to work with "request" library.
   * 
   * @param {object} res 
   * @param {string} message 
   */
  constructor(res, message) {
    const req = {
      path  : res.request.path,
      url   : res.request.href,
      method: res.request.method
    };
    
    const status = res.statusCode;
    
    if (message) {
      message += '\n';
    }
    else {
      message = '';
    }
    
    // add the HTTP request URL to the message
    if (req.url || req.path) {
      message +=
        'HTTP Request URL: ' +
        (req.method? req.method + ' ' : '') +
        (req.url || req.path) + '\n';
    }
    
    // add the HTTP status to the message
    message += `HTTP Response Status: ${status} ${res.statusMessage}`;
    
    let bodyStr;
    let bodyObj;
    
    if (typeof res.body === 'string') {
      bodyStr = res.body;
      try {
        bodyObj = JSON.parse(bodyStr);
      }
      catch (err) {/*noop*/}
    }
    else if (res.body) {
      bodyObj = res.body;
      bodyStr = JSON.stringify(res.body);
    }
    
    // add the body to the message
    message +=
      '\nHTTP Response Body: ' +
      (bodyObj? JSON.stringify(bodyObj, null, '  ') : '\n') +
      bodyStr;
    
    // set the message
    super(message);
    
    this.status  = status ; this.makeUnenumerable('status' );
    this.bodyObj = bodyObj; this.makeUnenumerable('bodyObj');
    this.bodyStr = bodyStr; this.makeUnenumerable('bodyStr');
    this.res     = res    ; this.makeUnenumerable('res'    );
    this.req     = req    ; this.makeUnenumerable('req'    );
  }
}


module.exports = HTTPResponseError;
