const PasswordBaseSixFour = (shortCode, Passkey, timestamps) => {
    const buffer = Buffer.from(shortCode + Passkey + timestamps).toString(
      "base64"
    );
    return buffer;
  };
  
  module.exports = PasswordBaseSixFour;