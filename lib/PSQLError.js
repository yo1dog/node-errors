const ExtendableError = require('@yo1dog/extendable-error');
const CError          = require('@yo1dog/cerror');
const formatMessage   = require('./formatMessage');


class PSQLError extends ExtendableError {
  /**
   * Wraps a PSQL error.
   * 
   * @param {Error}  pgError 
   * @param {string} message 
   * @param {object} [sql]
   * @param {string} sql.text     SQL text 
   * @param {any[]}  [sql.values] SQL values 
   */
  constructor(pgError, message, sql = null) {
    const meta = Object.assign(
      // show these keys first 
      {message: undefined, detail: undefined}, // eslint-disable-line no-undefined
      pgError,
      sql && {
        sql: {
          text  : sql.text,
          values: sql.values
        }
      }
    );
    
    Object.keys(meta).forEach(key => {
      if (typeof meta[key] === 'undefined') {
        delete meta[key];
      }
    });
    
    super(formatMessage(message, meta));
    
    CError.chain(pgError, this);
    
    this.meta = meta; this.makeUnenumerable('meta');
  }
}

module.exports = PSQLError;