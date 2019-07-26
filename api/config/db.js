require('dotenv').config()

module.exports = {
  'development': {
    'host': process.env.DB_HOST,
    'database': process.env.DB_NAME,
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'dialect': 'mysql',
    'quoteIdentifiers': false,
    'freezeTableName': true,
    'dialectOptions': {
      'encrypt': true
    },
    'logging': true,
    'define': {
      'paranoid': true,
      'timestamps': true,
      'underscored': true
    }
  },
  'production': {
    'host': process.env.DB_HOST,
    'database': process.env.DB_NAME,
    'username': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'dialect': 'mysql',
    'quoteIdentifiers': false,
    'freezeTableName': true,
    'dialectOptions': {
      'encrypt': true
    },
    'logging': true,
    'define': {
      'paranoid': true,
      'timestamps': true,
      'underscored': true
    }
  }
}
