import React, { useState, useEffect } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UploadPost = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const navigate = useNavigate();

  
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; 
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    // Clean up previous preview
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      handleImageChange({ target: { files } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption.trim());

    try {
      setLoading(true);

      const res = await api.post("/post/newpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      toast.success("Post uploaded successfully");

      setImage(null);
      setCaption("");
      if (preview) {
        URL.revokeObjectURL(preview);
        setPreview(null);
      }
      setTimeout(() => {
        navigate("/feed");
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          "Upload failed. Please try again.";
      toast.error(errorMessage);
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
    // Reset file input
    document.getElementById("fileInput").value = "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create New Post
        </h2>

        {/* Image Upload Area */}
        <div 
          className={`relative border-2 border-dashed rounded-xl mb-6 transition-all duration-300 ${
            dragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-blue-400"
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="preview"
                className="w-full h-64 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove image"
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <svg 
                className="w-16 h-16 text-gray-400 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
              <p className="text-gray-600 text-center mb-2">
                Drag & drop an image here, or click to browse
              </p>
              <p className="text-gray-400 text-sm">
                Supports: JPG, PNG, GIF (Max 5MB)
              </p>
            </div>
          )}
          
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Upload image"
          />
        </div>

        {/* Caption */}
        <div className="mb-6">
          <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            id="caption"
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            rows="3"
            maxLength={2200}
          />
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${caption.length > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
              {caption.length}/2200
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !image}
          className={`w-full py-3 rounded-lg font-medium transition ${
            loading || !image
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-linear-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Uploading...
            </div>
          ) : (
            "Share Post"
          )}
        </button>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full mt-3 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition"
          disabled={loading}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default UploadPost;