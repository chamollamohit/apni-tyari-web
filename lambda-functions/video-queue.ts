import axios, { isAxiosError } from 'axios';

export const handler = async (event: any) => {
    for (const record of event.Records) {
        const s3Event = JSON.parse(record.body);
        if (!s3Event.Records) continue;

        const s3Object = s3Event.Records[0].s3.object;
        const bucket = s3Event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(s3Event.Records[0].s3.object.key.replace(/\+/g, ' '));
        const sizeInBytes = s3Object.size;

        console.log(s3Event.Records[0]);

        try {
            const response = await axios.post(`${process.env.APP_URL}/api/webhooks/video`, {
                s3Key: key,
                bucketId: bucket,
                size: sizeInBytes,
                mimeType: 'video/mp4',
                status: 'COMPLETED'
            }, {
                headers: {
                    'x-api-key': process.env.WEBHOOK_SECRET
                },
                timeout: 5000
            });

            console.log('Webhook success:', response.data);
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(`Webhook failed [${error.response?.status}]:`, error.response?.data);
            } else {
                console.error('Network/Internal error:', error);
            }

            throw error;
        }
    }

    return { statusCode: 200 };
};