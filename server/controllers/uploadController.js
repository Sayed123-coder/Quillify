import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});


export const getImageKitAuth = (req, res) => {
  try {
    const authParams = imagekit.getAuthenticationParameters();
    return res.status(200).json(authParams);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};