
import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/authComponents/AuthContext";
import { FiUser, FiCamera, FiX, FiCheck, FiMail, FiCalendar, FiArrowLeft } from "react-icons/fi";

const Profile = () => {
  const { user, updateUserProfile, operationLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [uploading, setUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const fileInputRef = useRef(null);

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setPreviewImage(null);
    }
  }, [user]);

  // Clear messages after timeout
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 2MB for Firebase Auth compatibility)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => setUploading(true);
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
      setUploading(false);
      setError("");
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      setError('Display name cannot be empty');
      return;
    }

    if (displayName.length > 50) {
      setError('Display name must be less than 50 characters');
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      let finalPhotoURL = user?.photoURL;

      // If there's a new image, use it
      if (previewImage && previewImage !== user?.photoURL) {
        // Check if data URL is too large for Firebase Auth (approx. 100KB limit)
        const base64Length = previewImage.length - (previewImage.indexOf(',') + 1);
        const padding = previewImage.endsWith('==') ? 2 : previewImage.endsWith('=') ? 1 : 0;
        const fileSize = Math.floor((base64Length * 3) / 4) - padding;
        
        if (fileSize > 100 * 1024) { // 100KB limit
          setError('Image is too large for profile photo. Please choose a smaller image (max 100KB).');
          setUploading(false);
          return;
        }
        
        finalPhotoURL = previewImage;
      }

      await updateUserProfile({
        displayName: displayName.trim(),
        photoURL: finalPhotoURL
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setPreviewImage(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Specific error handling
      if (error.code === 'auth/requires-recent-login') {
        setError('Security verification required. Please log in again to update your profile.');
      } else if (error.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(error.message || 'Failed to update profile. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleCancelEdit = () => {
    setDisplayName(user?.displayName || "");
    setPreviewImage(null);
    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getMemberSinceDate = () => {
    if (!user?.metadata?.creationTime) return 'Unknown';
    
    return new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getLastLoginDate = () => {
    if (!user?.metadata?.lastSignInTime) return 'Unknown';
    
    return new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6 transition-colors duration-200"
        >
          <FiArrowLeft className="text-lg" />
          Back
        </button>

        {/* Header Card */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="px-6 py-8 text-white">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={previewImage || user?.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-white shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/100/9ca3af/ffffff?text=U";
                  }}
                />
                {isEditing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <FiCamera className="text-white text-2xl" />
                  </div>
                )}
              </div>
              
              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {user.displayName || "Anonymous User"}
                </h1>
                <p className="text-purple-200 text-lg">
                  {user.email}
                </p>
                <p className="text-purple-100 mt-1">
                  Member since {getMemberSinceDate()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiX className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <FiCheck className="flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Profile Content Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <FiUser className="text-purple-600" />
              Profile Information
            </h2>
            <p className="text-gray-600 mt-1">
              Manage your account settings and profile information
            </p>
          </div>

          <div className="p-6">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group mb-4">
                <img
                  src={previewImage || user?.photoURL || "/default-avatar.png"}
                  alt="Profile"
                  className="h-32 w-32 rounded-full border-4 border-gray-100 shadow-lg object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/128/9ca3af/ffffff?text=U";
                  }}
                />
                
                {isEditing && (
                  <button
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="absolute bottom-2 right-2 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-110"
                  >
                    <FiCamera className="text-xl" />
                  </button>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {isEditing && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Click the camera icon to upload a new photo
                  </p>
                  <p className="text-xs text-gray-500">
                    Supported formats: JPEG, PNG, GIF • Max size: 2MB
                  </p>
                  {uploading && (
                    <div className="flex items-center gap-2 justify-center mt-2 text-purple-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                      <span className="text-sm">Processing image...</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiUser className="text-gray-400" />
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your display name"
                    disabled={uploading || operationLoading}
                    maxLength={50}
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">
                    {user?.displayName || "Not set"}
                  </div>
                )}
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    {displayName.length}/50 characters
                  </p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiMail className="text-gray-400" />
                  Email Address
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">
                  {user?.email}
                </div>
              </div>

              {/* Member Since */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiCalendar className="text-gray-400" />
                  Member Since
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">
                  {getMemberSinceDate()}
                </div>
              </div>

              {/* Last Login */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Login
                </label>
                <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200">
                  {getLastLoginDate()}
                </div>
              </div>
            </div>

            {/* User ID (Full width) */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800 border border-gray-200 font-mono text-sm break-all">
                {user?.uid}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={uploading || operationLoading}
                    className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center font-medium"
                  >
                    {(uploading || operationLoading) ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <FiCheck className="text-lg" />
                        Save Changes
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={handleCancelEdit}
                    disabled={uploading || operationLoading}
                    className="flex items-center gap-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center font-medium"
                  >
                    <FiX className="text-lg" />
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-200 flex-1 justify-center font-medium"
                >
                  <FiUser className="text-lg" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

