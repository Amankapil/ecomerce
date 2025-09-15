import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import cloudinary from '../../lib/cloudinary'; // Adjust your import path
import dbConnect from '../../lib/db';
// import Image from '../../../models/Image';
import { Readable } from 'stream';


export const config = {
  api: {
    bodyParser: false, // disable Next.js default body parser
  },
};

// Helper function to parse form-data with formidable
const parseForm = (req) =>
  new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });

export async function POST(request) {
  await dbConnect();

  // Convert Web Request to Node.js req for formidable
  const req = request; // request is Web API Request, but formidable expects Node.js req
  // workaround: get the raw body buffer and parse it manually

  // We need to read the raw request from the body stream
  const reqBuffer = await request.arrayBuffer();

  // Create a fake req stream for formidable
  const stream = Readable.from(Buffer.from(reqBuffer));

  const fakeReq = {
    headers: Object.fromEntries(request.headers),
    method: 'POST',
    on: stream.on.bind(stream),
    emit: stream.emit.bind(stream),
  };

  try {
    const { files } = await new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm();
      form.parse(fakeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    const imageFile = files.image;
    if (!imageFile) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    // Read file from temp path
    const fileData = fs.readFileSync(imageFile.filepath);

    // Convert to base64
    const base64 = fileData.toString('base64');
    const dataURI = `data:${imageFile.mimetype};base64,${base64}`;

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      folder: 'nextjs_uploads',
      resource_type: 'image',
    });

    // Save in DB
    // const savedImage = await Image.create({ url: uploadRes.secure_url });

    return NextResponse.json({ message: 'Image uploaded', image: uploadRes.secure_url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 });
  }
}
