async function recoveryCode() {
    var code = Math.floor(Math.random() * 9000000) + 1000000;
    return code.toString();
  }
  
module.exports = recoveryCode