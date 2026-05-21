import { useRef, useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import api from "../services/api";

const authenticator = async () => {
  const response = await api.get("/upload/auth");
  return response.data;
};

const ImageUpload = ({ value, onChange, label = "Upload image" }) => {
  const ikUploadRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onSuccess = (res) => {
    setUploading(false);
    setError("");
    onChange(res.url);
  };

  const onError = (err) => {
    setUploading(false);
    setError("Upload failed — try again");
    console.error(err);
  };

  const onUploadStart = () => {
    setUploading(true);
    setError("");
  };

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticator={authenticator}
    >
      <div>
        {/* Preview */}
        {value && (
          <div className="mb-3 rounded-xl overflow-hidden border border-gray-200 w-full h-40">
            <img
              src={value}
              alt="preview"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        {/* Upload button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => ikUploadRef.current.click()}
            disabled={uploading}
            className="text-sm px-4 py-2.5 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50"
          >
            {uploading ? "Uploading..." : `📷 ${label}`}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-sm px-4 py-2.5 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition"
            >
              Remove
            </button>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-2">{error}</p>
        )}

        {/* Hidden IKUpload */}
        <IKUpload
          ref={ikUploadRef}
          fileName="quillify-upload"
          folder="/quillify"
          onSuccess={onSuccess}
          onError={onError}
          onUploadStart={onUploadStart}
          style={{ display: "none" }}
        />
      </div>
    </IKContext>
  );
};

export default ImageUpload;