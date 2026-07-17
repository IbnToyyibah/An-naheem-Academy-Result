import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary inline
cloudinary.config({
  cloud_name: 'xhmrsalb',
  api_key: '111572784462832',
  api_secret: 'HpftKr_u-3Vj5y9wYO-kT0cChTA',
  secure: true
});

async function main() {
  try {
    const sampleImageUrl = 'https://res.cloudinary.com/demo/image/upload/dog.jpg';
    console.log('Uploading sample image:', sampleImageUrl);

    // 1. Upload an image
    const uploadResult = await cloudinary.uploader.upload(sampleImageUrl);
    console.log('Upload successful!');
    console.log('Secure URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);

    // 2. Get image details
    console.log('\nFetching image details...');
    console.log('Width:', uploadResult.width);
    console.log('Height:', uploadResult.height);
    console.log('Format:', uploadResult.format);
    console.log('File Size (bytes):', uploadResult.bytes);

    // 3. Transform the image
    // fetch_format: 'auto' (f_auto) - Automatically detects the requesting browser and converts the image to the most optimal format (e.g. WebP, AVIF)
    // quality: 'auto' (q_auto) - Automatically analyzes the image to find the optimal quality compression level, reducing file size without visible loss
    const transformedUrl = cloudinary.url(uploadResult.public_id, {
      fetch_format: 'auto',
      quality: 'auto',
      secure: true
    });

    console.log('\nDone! Click link below to see optimized version of the image. Check the size and the format.');
    console.log('Transformed URL:', transformedUrl);

  } catch (error) {
    console.error('Error during Cloudinary operations:', error);
  }
}

main();
