import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import EditProfileModal from "./modals/EditProfileModal";
import { Pencil } from "lucide-react";
import {
  useGetAllProfileSettings,
  useUpdateProfilePicture,
} from "@/src/hooks/settings/useSettings";
import toast from "react-hot-toast";

const ProfileTab: React.FC = () => {
  const { profile = {} } = useGetAllProfileSettings();
  const { mutate: mutateUploadProfilePicture } = useUpdateProfilePicture();

  const [profileData, setProfileData] = useState<ProfileSettings>(profile);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const firstName = useMemo(() => profile?.full_name?.split(" ")[0] || "", [profile]);
  const lastName = useMemo(() => profile?.full_name?.split(" ")[1] || "", [profile]);

  const handleDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setProfileData((prev) => ({
          ...prev,
          profile_picture: reader.result as string,
        }));
      };

      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.append("profile_picture", file);

      mutateUploadProfilePicture(formData, {
        onSuccess: (res) => {
          toast.success(res.data.message || "Profile picture uploaded successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Error uploading profile picture");
        },
      });
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif"] },
    maxFiles: 1,
  });

  const handleDeleteImage = () => {
    setProfileData((prev) => ({
      ...prev,
      profile_picture: null,
    }));
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving profile data:", profileData);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col items-start mb-8">
        <div className="flex justify-between items-center w-full mb-6">
          <div className="w-20 h-20 rounded-full border border-[#667085] overflow-hidden flex items-center justify-center bg-gray-50">
            {profileData.profile_picture ? (
              <Image
                src={profileData.profile_picture}
                alt="Profile"
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-[#692E9F] text-white text-[.9rem] px-4 py-2 rounded-[.4rem] hover:bg-purple-800 flex items-center gap-2"
          >
            Edit Profile
            <Pencil size={18} className="text-[#692E9F] bg-white rounded-[.4rem] p-[.1rem]" />
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          <button
            onClick={handleDeleteImage}
            className="border border-[#667085] text-sm text-[#667085] px-4 py-1 rounded-[.4rem] hover:bg-gray-50"
          >
            Delete
          </button>
          <button
            className="bg-[#692E9F] text-white text-sm px-4 py-2 rounded-[.4rem] hover:bg-purple-800"
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            Upload
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6">
        <div>
          <label className="block text-sm text-gray-500 mb-0.5">First Name</label>
          <p className="text-gray-800 font-medium">{firstName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-0.5">Last Name</label>
          <p className="text-gray-800 font-medium">{lastName}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-0.5">Email Address</label>
          <p className="text-gray-800 font-medium">{profile.email}</p>
        </div>
        <div>
          <label className="block text-sm text-gray-500 mb-0.5">Phone Number</label>
          <p className="text-gray-800 font-medium">{profile.phone_number}</p>
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
