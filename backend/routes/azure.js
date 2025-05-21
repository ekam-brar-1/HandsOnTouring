const express = require('express');
const {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
} = require('@azure/storage-blob');

const router = express.Router();

const account = process.env.AZURE_ACCOUNT_NAME;
const accountKey = process.env.AZURE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER;

const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);

router.post('/generate-azure-upload-url', async (req, res) => {
  const { filename } = req.body;

  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(filename);

    const sasToken = generateBlobSASQueryParameters(
      {
        containerName,
        blobName: filename,
        permissions: BlobSASPermissions.parse('cw'),
        expiresOn: new Date(Date.now() + 5 * 60 * 1000),
      },
      sharedKeyCredential
    ).toString();

    const uploadUrl = `${blobClient.url}?${sasToken}`;

    res.json({ uploadUrl, blobUrl: blobClient.url });
  } catch (err) {
    console.error('Azure upload error:', err);
    res.status(500).json({ error: 'Azure SAS generation failed' });
  }
});

module.exports = router;
