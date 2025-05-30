const express = require('express');
const router = express.Router();

router.get('/latest/meta-data/', (req, res) => {
  res.set('Metadata-Flavor', 'Amazon');
  res.send('iam/\ninstance-id\nlocal-ipv4');
});

router.get('/latest/meta-data/instance-id', (req, res) => {
  res.set('Metadata-Flavor', 'Amazon');
  res.send('i-0abcd1234efgh5678');
});

router.get('/latest/meta-data/local-ipv4', (req, res) => {
  res.set('Metadata-Flavor', 'Amazon');
  res.send('192.168.0.10');
});

router.get('/latest/meta-data/iam/', (req, res) => {
  res.set('Metadata-Flavor', 'Amazon');
  res.send('security-credentials/');
});

router.get('/latest/meta-data/iam/security-credentials/', (req, res) => {
  res.set('Metadata-Flavor', 'Amazon');
  res.send('LabSSRFRole');
});

router.get('/latest/meta-data/iam/security-credentials/LabSSRFRole', (req, res) => {
  res.set('Metadata-Flavor', 'Amazon');
  res.json({
    "Code": "Success",
    "LastUpdated": "2025-05-28T04:00:00Z",
    "Type": "AWS-HMAC",
    "AccessKeyId": "AKIAFAKEKEY123",
    "SecretAccessKey": "FAKESECRETKEY4567890",
    "Token": "FAKETOKEN==",
    "Expiration": "2025-06-01T04:00:00Z"
  });
});

module.exports = router;
