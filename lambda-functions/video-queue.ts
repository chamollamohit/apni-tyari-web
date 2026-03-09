import axios, { isAxiosError } from 'axios';
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const s3 = new S3Client({});

export const handler = async (event: any) => {
    for (const record of event.Records) {
        const s3Event = JSON.parse(record.body);
        if (!s3Event.Records) continue;

        const s3Object = s3Event.Records[0].s3.object;
        const bucket = s3Event.Records[0].s3.bucket.name;
        const key = decodeURIComponent(s3Object.key.replace(/\+/g, ' '));

        const inputPath = "/tmp/input_video";
        const outputPath = "/tmp/output_fixed.mp4";

        try {
            console.log(`Downloading: ${key}`);
            const data = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
            const videoData = await data.Body?.transformToByteArray();
            if (videoData) fs.writeFileSync(inputPath, videoData);

            console.log("Applying FastStart metadata update...");
            execSync(`/opt/bin/ffmpeg -y -i ${inputPath} -c copy -movflags +faststart ${outputPath}`);

            const fileName = path.basename(key);
            const destinationKey = `processed-videos/${fileName}`;

            console.log(`Uploading processed file to: ${destinationKey}`);
            await s3.send(new PutObjectCommand({
                Bucket: bucket,
                Key: destinationKey,
                Body: fs.readFileSync(outputPath),
                ContentType: 'video/mp4'
            }));

            await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));

            const webhookResponse = await axios.post(`${process.env.APP_URL}/api/webhooks/video`, {
                s3Key: destinationKey,
                bucketId: bucket,
                size: fs.statSync(outputPath).size,
                mimeType: 'video/mp4',
                status: 'COMPLETED'
            }, {
                headers: { 'x-api-key': process.env.WEBHOOK_SECRET },
                timeout: 5000
            });

            console.log('Webhook success:', webhookResponse.data);

        } catch (error) {
            if (isAxiosError(error)) {
                console.error(`Webhook failed [${error.response?.status}]:`, error.response?.data);
            } else {
                console.error('Processing error:', error);
            }
            throw error;
        } finally {
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        }
    }

    return { statusCode: 200 };
};