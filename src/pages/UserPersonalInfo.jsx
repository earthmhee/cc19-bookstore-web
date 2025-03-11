import React, { useState, useEffect } from "react";
import useUserStore from "../stores/userStore";
import { updateUserInfo } from "../api/user";
import { getUserInfo } from "../api/user";
function UserPersonalInfo() {
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const updateUser = useUserStore((state) => state.updateUser);
  const refreshUser = useUserStore((state) => state.refreshUser);
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    age: user?.age || "",
    address: user?.address || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      console.log("Setting form data from user:", user);
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        age: user.age || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Reset update success flag after a short delay
  useEffect(() => {
    if (updateSuccess) {
      const timer = setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [updateSuccess]);

  // Refresh user data when component mounts
  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Submitting form data:", formData);
      const response = await updateUserInfo(token, formData);
      console.log("API response:", response.data);
      
      // Update the user in the store
      updateUser(response.data);
      
      // Refresh user data from server to ensure we have the latest
    //   await refreshUser(token);
      
      // Set success flag
      setUpdateSuccess(true);
      
      // Exit edit mode
      setIsEditing(false);
      console.log('Profile updated successfully');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(
        error.response?.data?.message || 
        'Failed to update profile. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    // Reset form data to current user data
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        age: user.age || "",
        address: user.address || "",
      });
    }
    setError(null);
    setIsEditing(false);
  };

  // Guard against null user
  if (!user) {
    return <div className="text-center p-8">Loading user information...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen px-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center gap-12 text-white">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <img
            src={user.urlImage || "https://via.placeholder.com/150"}
            alt="User Avatar"
            className="w-40 h-40 rounded-full border-4 border-gold shadow-lg"
          />
          <h2 className="text-3xl font-semibold mt-4">
            {`${user.firstName || ""} ${user.lastName || ""}`}
          </h2>
          <p className="text-gray-400 text-lg">@{user.username}</p>
          
          {/* Success message */}
          {updateSuccess && (
            <div className="mt-4 p-2 bg-green-500 bg-opacity-20 border border-green-500 text-green-500 rounded">
              Profile updated successfully!
            </div>
          )}
        </div>

        {/* User Details Section */}
        {!isEditing ? (
          <div className="w-full md:w-2/3 space-y-4 text-left">
            <p>
              <span className="font-semibold text-gold">Email:</span>{" "}
              {user.email || "Not provided"}
            </p>
            <p>
              <span className="font-semibold text-gold">Phone:</span>{" "}
              {user.phoneNumber || "Not provided"}
            </p>
            <p>
              <span className="font-semibold text-gold">Age:</span>{" "}
              {user.age || "Not provided"}
            </p>
            <p>
              <span className="font-semibold text-gold">Address:</span>{" "}
              {user.address || "Not provided"}
            </p>
            <p>
              <span className="font-semibold text-gold">Role:</span>{" "}
              <span className="px-3 py-1 bg-gold text-black rounded-full text-sm font-medium">
                {user.role}
              </span>
            </p>
            <button
              className="btn-primary mt-4"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full md:w-2/3 space-y-4 text-left"
          >
            {error && (
              <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-500 p-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gold mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-gold mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-gold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-gold mb-1">Phone</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-gold mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
              />
            </div>
            <div>
              <label className="block text-gold mb-1">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
                rows="3"
              />
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={cancelEdit}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UserPersonalInfo;