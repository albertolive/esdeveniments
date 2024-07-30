module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  moduleNameMapper: {
    "^@utils/(.*)$": "<rootDir>/utils/$1",
    "^@config/(.*)$": "<rootDir>/config/$1"
  }
};
