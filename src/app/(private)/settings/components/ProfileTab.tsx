import React, { useState } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { FiUpload, FiTrash2, FiEdit } from "react-icons/fi";
import EditProfileModal from "./modals/EditProfileModal";


interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImage?: string | null;
}

const ProfileTab: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phoneNumber: "081279354621",
    profileImage: null,
  });


  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setProfileData({
          ...profileData,
          profileImage: reader.result as string,
        });
      };

      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
    },
    maxFiles: 1,
  });

  const deleteImage = () => {
    setProfileData({
      ...profileData,
      profileImage: null,
    });
  };

  // Add handlers for the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSaveChanges = () => {
    // typically send the updated profileData to your API
    console.log("Saving profile data:", profileData);

    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="w-24 h-24 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
            {profileData.profileImage ? (
              <Image
                src={profileData.profileImage}
                alt="Profile"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </div>
          <div className="ml-4">
            <button
              className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 mb-2 flex items-center"
              {...getRootProps()}
            >
              <FiUpload className="mr-2" />
              <input {...getInputProps()} />
              Upload
            </button>
            <button
              onClick={deleteImage}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 flex items-center"
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
          </div>
        </div>
        <button
          onClick={handleOpenModal}
          className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 flex items-center"
        >
          <FiEdit className="mr-2" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-500 mb-1">First Name</label>
          <p className="text-gray-800">{profileData.firstName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">Last name</label>
          <p className="text-gray-800">{profileData.lastName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Email Address
          </label>
          <p className="text-gray-800">{profileData.email}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-1">
            Phone Number
          </label>
          <p className="text-gray-800">{profileData.phoneNumber}</p>
        </div>
      </div>


      <EditProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formData={profileData}
        onChange={handleInputChange}
        onSave={handleSaveChanges}
      />
    </div>
  );
};

export default ProfileTab;
