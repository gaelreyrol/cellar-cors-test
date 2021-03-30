const express = require('express');
const AWS = require('aws-sdk');

require('dotenv').config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static('public'));

AWS.config.update({
    accessKeyId: process.env.CELLAR_ACCESS_KEY_ID,
    secretAccessKey: process.env.CELLAR_SECRET_ACCESS_KEY,
    region: 'us-east-1',
    signatureVersion: 'v4'
});

const s3 = new AWS.S3({
    endpoint: process.env.CELLAR_HOST
});

app.get('/api/pre-upload', (req, res) => {
    const url = s3.getSignedUrl('putObject', {
        Bucket: process.env.CELLAR_BUCKET,
        Key: 'cors.xml',
        ContentType: 'application/xml',
        Expires: 60 * 5
    });

    res.send({
        data: url
    });
})

app.listen(port, () => {
    console.log(`CORS App listening at http://localhost:${port}`);
});