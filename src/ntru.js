const {
  createKeyPair,
  encrypt,
  decrypt,
  toTrytes,
  fromTrytes
} = require('@decentralized-auth/ntru');
const generateSeed = require('@decentralized-auth/gen-seed');

const generateKeyPair = async seed => {
  if (seed == null) {
    seed = await generateSeed();
  }
  const keyPair = createKeyPair(seed);

  return {
    publicKey: toTrytes(keyPair.public),
    privateKey: toTrytes(keyPair.private)
  };
};

const encryptToTrytes = (message, publicKey) => encrypt(message, publicKey);

const decryptFromTrytes = (trytes, privateKey) => {
  return decrypt(trytes, fromTrytes(privateKey)).toString();
};

module.exports = {
  generateKeyPair,
  encryptToTrytes,
  decryptFromTrytes
};
