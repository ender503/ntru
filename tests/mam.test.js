const Mam = require('@iota/mam');
const {
  generateKeyPair,
  encryptToTrytes,
  decryptFromTrytes
} = require('../src/ntru');

describe('NTRU encryption', () => {
  it('Generate Key without Seeds', async () => {
    const keypair = await generateKeyPair();
    expect(keypair.publicKey).toMatch(/[9A-Z]+/);
    expect(keypair.privateKey).toMatch(/[9A-Z]+/);
  });

  it('Attach encrypted MAM Message', async () => {
    const seed =
      'THISISTHESAMPLESEEDFORBIILABSDEVELOPMENTTHENTRUENCRYPTIONPURPOSE99999999999999999';
    const keypair = await generateKeyPair(seed);

    // Encrypt message
    const text = 'BiiLabs Rocks!';
    const trytes = encryptToTrytes(text, keypair.publicKey);
    expect(trytes).toMatch(/[9A-Z]+/);

    // Attach encrypted message to the MAM channel
    let mamState = Mam.init('https://nodes.thetangle.org:443');
    const message = Mam.create(mamState, trytes);
    await Mam.attach(message.payload, message.address);

    // Fetch the encrypted message from MAM channel
    const messageRoot = message.root;
    const response = await Mam.fetch(messageRoot, 'public');
    const encrypted = response['messages'][0];

    // Decrypt message
    const decryptedText = decryptFromTrytes(encrypted, keypair.privateKey);
    expect(decryptedText).toBe(text);
  }, 30000);
});
