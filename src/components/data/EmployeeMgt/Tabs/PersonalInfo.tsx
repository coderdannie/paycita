import { useState } from 'react';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { TbEdit } from 'react-icons/tb';
import EditBasicInfoModal from '../modals/basic-information';
import AddressEditModal from '../modals/address-edit';
import EmergencyContactEditModal from '../modals/emmergency-contact';
import GuarantorEditModal from '../modals/guarantor-edit';
import { useToast } from '@/src/context/ToastContext';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/src/service/tanstack-query/queryKey';
import { useParams } from 'next/navigation';
import {
  useUpdateEmployeeAddress,
  useUpdateEmployeeEmergencyContact,
  useUpdateEmployeeFirstGuarantor,
  useUpdateEmployeeSecondGuarantor,
} from '@/src/hooks/dashboard/useDashboard';

interface PersonalInfoProps {
  full_name?: string;
  email?: string;
  phone_number?: string;
  gender?: string;
  marital_status?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  country?: string;
  address?: string;
  state?: string;
  post_code?: string;
  city?: string;
  date_of_birth?: string;
  profile_picture?: string;
  guarantor_1_name?: string;
  guarantor_1_relationship?: string;
  guarantor_1_phone?: string;
  guarantor_1_address?: string;
  guarantor_2_name?: string;
  guarantor_2_relationship?: string;
  guarantor_2_phone?: string;
  guarantor_2_address?: string;
}

interface AddressFormDataType {
  country: string;
  address: string;
  state: string;
  city: string;
  post_code: string;
}

interface EmergencyContactFormDataType {
  emergency_contact_name: string;
  emergency_contact_relationship: string;
  emergency_contact_phone: string;
}

interface GuarantorFormData {
  guarantor_name: string;
  guarantor_relationship: string;
  guarantor_address: string;
  guarantor_phone: string;
}

const PersonalInfo = ({ user }: { user: PersonalInfoProps }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddressEditModalOpen, setIsAddressEditModalOpen] = useState(false);
  const [isEmergencyContactEditModalOpen, setIsEmergencyContactEditModalOpen] =
    useState(false);
  const [isGuarantor1EditModalOpen, setIsGuarantor1EditModalOpen] =
    useState(false);
  const [isGuarantor2EditModalOpen, setIsGuarantor2EditModalOpen] =
    useState(false);

  const { id } = useParams();
  const employeeId = id as string;
  const queryClient = useQueryClient();

  const { addToast } = useToast();

  const { mutate: mutateAddress, isPending: isUpdatingAddress } =
    useUpdateEmployeeAddress();

  const {
    mutate: mutateSecondGuarantor,
    isPending: isUpdatingSecondGuarantor,
  } = useUpdateEmployeeSecondGuarantor();

  const { mutate: mutateFirstGuarantor, isPending: isUpdatingFirstGuarantor } =
    useUpdateEmployeeFirstGuarantor();

  const { mutate, isPending } = useUpdateEmployeeEmergencyContact();

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  const handleAddressEditClick = () => {
    setIsAddressEditModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressEditModalOpen(false);
  };

  const handleEmergencyContactEditClick = () => {
    setIsEmergencyContactEditModalOpen(true);
  };

  const handleCloseEmergencyContactModal = () => {
    setIsEmergencyContactEditModalOpen(false);
  };

  const handleGuarantor1EditClick = () => {
    setIsGuarantor1EditModalOpen(true);
  };

  const handleCloseGuarantor1Modal = () => {
    setIsGuarantor1EditModalOpen(false);
  };

  const handleGuarantor2EditClick = () => {
    setIsGuarantor2EditModalOpen(true);
  };

  const handleCloseGuarantor2Modal = () => {
    setIsGuarantor2EditModalOpen(false);
  };

  const handleAddressUpdate = (data: AddressFormDataType) => {
    mutateAddress(
      {
        userId: employeeId,
        data: {
          address: data.address,
        },
      },
      {
        onSuccess: () => {
          addToast('Updated successfully', 'success');
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseAddressModal();
        },
        onError: () => {
          addToast('Update failed', 'error');
        },
      }
    );
  };

  const handleEmergencyContactUpdate = (data: EmergencyContactFormDataType) => {
    mutate(
      {
        userId: employeeId,
        data: {
          emergency_contact_name: data.emergency_contact_name,
          emergency_contact_relationship: data.emergency_contact_relationship,
          emergency_contact_phone: data.emergency_contact_phone,
        },
      },
      {
        onSuccess: () => {
          addToast('Updated successfully', 'success');
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseEmergencyContactModal();
        },
        onError: () => {
          addToast('Update failed', 'error');
        },
      }
    );
  };

  const handleGuarantor1Update = (data: GuarantorFormData) => {
    // Handle the guarantor 1 update logic here

    mutateFirstGuarantor(
      {
        userId: employeeId,
        data: {
          guarantor_1_address: data.guarantor_address,
          guarantor_1_relationship: data.guarantor_relationship,
          guarantor_1_phone: data.guarantor_phone,
          guarantor_1_name: data.guarantor_name,
        },
      },
      {
        onSuccess: () => {
          addToast('Updated successfully', 'success');
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseGuarantor1Modal();
        },
        onError: () => {
          addToast('Update failed', 'error');
        },
      }
    );
  };

  const handleGuarantor2Update = (data: GuarantorFormData) => {
    mutateSecondGuarantor(
      {
        userId: employeeId,
        data: {
          guarantor_2_address: data.guarantor_address,
          guarantor_2_relationship: data.guarantor_relationship,
          guarantor_2_phone: data.guarantor_phone,
          guarantor_2_name: data.guarantor_name,
        },
      },
      {
        onSuccess: () => {
          addToast('Updated successfully', 'success');
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_ALL_EMPLOYEES],
          });
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.GET_EMPLOYEE_BY_ID],
          });
          handleCloseGuarantor2Modal();
        },
        onError: () => {
          addToast('Update failed', 'error');
        },
      }
    );
  };

  // Prepare initial address data for the modal
  const initialAddressData: AddressFormDataType = {
    country: user?.country || 'Nigeria',
    address:
      user?.address ||
      'Adetokumbo Ademola Crescent, Abuja, Federal Capital Territory, Nigeria',
    state: user?.state || 'Abuja',
    city: user?.city || 'Abuja',
    post_code: user?.post_code || '900001',
  };

  // Prepare initial emergency contact data for the modal
  const initialEmergencyContactData: EmergencyContactFormDataType = {
    emergency_contact_name: user?.emergency_contact_name || '',
    emergency_contact_relationship: user?.emergency_contact_relationship || '',
    emergency_contact_phone: user?.emergency_contact_phone || '',
  };

  // Prepare initial guarantor 1 data for the modal
  const initialGuarantor1Data: GuarantorFormData = {
    guarantor_name: user?.guarantor_1_name || '',
    guarantor_relationship: user?.guarantor_1_relationship || '',
    guarantor_address: user?.guarantor_1_address || '',
    guarantor_phone: user?.guarantor_1_phone || '',
  };

  // Prepare initial guarantor 2 data for the modal
  const initialGuarantor2Data: GuarantorFormData = {
    guarantor_name: user?.guarantor_2_name || '',
    guarantor_relationship: user?.guarantor_2_relationship || '',
    guarantor_address: user?.guarantor_2_address || '',
    guarantor_phone: user?.guarantor_2_phone || '',
  };

  return (
    <div>
      <p className="text-[#1D2939] font-semibold text-lg">Personal Info</p>

      <div className="mt-5">
        {/* Basic Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-5 border-b py-6 shadow-md rounded-lg bg-white">
          <div className="flex flex-wrap items-center space-x-4 md:border-r-2 border-[#E4E7EC]">
            <div>
              <div className="flex items-center gap-1 mb-5">
                <div className="font-semibold text-[#1D2939]">
                  Basic Information
                </div>
                <button
                  onClick={handleEditClick}
                  className="text-primary hover:text-primary/80 transition-colors"
                  aria-label="Edit basic information"
                >
                  <TbEdit size={20} />
                </button>
              </div>
              <Image
                src={user?.profile_picture ?? '/assets/avatar.jpeg'}
                alt="Profile"
                className="w-[140px] h-[140px] rounded-full object-top object-cover"
                width={100}
                height={100}
              />
            </div>

            <div className="text-sm text-[#667085] grid gap-3">
              <h3 className="font-semibold text-[#1D2939] text-base">
                {user?.full_name ?? 'N/A'}
              </h3>
              <p>♀ {user?.gender ?? 'N/A'}</p>
              <p className="flex items-center gap-2 ">
                <Mail className="text-gray-500 w-4 h-4" />{' '}
                {user?.email ?? 'N/A'}
              </p>
              <p className="flex items-center gap-2 ">
                <Phone className="text-gray-500 w-4 h-4" />{' '}
                {user?.phone_number ?? 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[200px] ">
            <p className="flex justify-between">
              <strong className=" text-[#667085] font-normal">
                Birth Date:
              </strong>{' '}
              {user?.date_of_birth ?? 'N/A'}
            </p>
            <p className="flex justify-between">
              <strong className="text-[#667085] font-normal">
                Nationality:
              </strong>{' '}
              {user?.country ?? 'N/A'}
            </p>
            <p className="flex justify-between">
              <strong className=" text-[#667085] font-normal">
                Marital Status:
              </strong>
              {user?.marital_status ?? 'N/A'}
            </p>
          </div>
        </div>

        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white px-5  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <div className="font-semibold text-[#1D2939]">Address</div>
              <button
                onClick={handleAddressEditClick}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit address"
              >
                <TbEdit size={20} />
              </button>
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex gap-2 justify-between">
                <strong className=" text-[#667085] font-normal">
                  Primary Address:
                </strong>{' '}
                {user?.address ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">Country:</strong>{' '}
                {user?.country ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">State:</strong>{' '}
                {user?.state ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">City:</strong>{' '}
                {user?.city ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">
                  Post Code:
                </strong>{' '}
                {user?.post_code ?? 'N/A'}
              </p>
            </div>
          </div>
          <div className="bg-white px-5 h-fit  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <div className="font-semibold text-[#1D2939]">
                Emergency Contact
              </div>
              <button
                onClick={handleEmergencyContactEditClick}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit emergency contact"
              >
                <TbEdit size={20} />
              </button>
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">Name</strong>{' '}
                {user?.emergency_contact_name ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">
                  {' '}
                  Relationship
                </strong>{' '}
                {user?.emergency_contact_relationship ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  Phone Number
                </strong>

                {user?.emergency_contact_phone ?? 'N/A'}
              </p>{' '}
            </div>
          </div>
        </div>

        {/* Guarantor Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-white px-5  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <h3 className="font-semibold text-[#1D2939]">Guarantor 1</h3>
              <button
                onClick={handleGuarantor1EditClick}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit guarantor 1"
              >
                <TbEdit size={20} />
              </button>
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">Name</strong>{' '}
                {user?.guarantor_1_name ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">
                  {' '}
                  Relationship
                </strong>{' '}
                {user?.guarantor_1_relationship ?? 'N/A'}
              </p>{' '}
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal"> Address</strong>{' '}
                {user?.guarantor_1_address ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  Phone Number
                </strong>

                {user?.guarantor_1_phone ?? 'N/A'}
              </p>{' '}
            </div>
          </div>
          <div className="bg-white px-5 h-fit  py-6 shadow-md  rounded-lg">
            <div className="flex items-center gap-1 mb-5">
              <h3 className="font-semibold text-[#1D2939]">Guarantor 2</h3>
              <button
                onClick={handleGuarantor2EditClick}
                className="text-primary hover:text-primary/80 transition-colors"
                aria-label="Edit guarantor 2"
              >
                <TbEdit size={20} />
              </button>
            </div>
            <div className="flex font-semibold text-sm flex-col justify-center space-y-2 max-w-[450px] ">
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">Name</strong>{' '}
                {user?.guarantor_2_name ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal">
                  {' '}
                  Relationship
                </strong>{' '}
                {user?.guarantor_2_relationship ?? 'N/A'}
              </p>{' '}
              <p className="flex justify-between">
                <strong className="text-[#667085] font-normal"> Address</strong>{' '}
                {user?.guarantor_2_address ?? 'N/A'}
              </p>
              <p className="flex justify-between">
                <strong className=" text-[#667085] font-normal">
                  Phone Number
                </strong>

                {user?.guarantor_2_phone ?? 'N/A'}
              </p>{' '}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Basic Info Modal */}
      <EditBasicInfoModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        employee={{
          full_name: user?.full_name || '',
          email: user?.email || '',
          phone_number: user?.phone_number || '',
          gender: user?.gender || '',
          date_of_birth: user?.date_of_birth || '',
          marital_status: user?.marital_status || '',
        }}
      />

      {/* Address Edit Modal */}
      <AddressEditModal
        isOpen={isAddressEditModalOpen}
        onClose={handleCloseAddressModal}
        onUpdate={handleAddressUpdate}
        initialData={initialAddressData}
        isUpdating={isUpdatingAddress}
      />

      {/* Emergency Contact Edit Modal */}
      <EmergencyContactEditModal
        isOpen={isEmergencyContactEditModalOpen}
        onClose={handleCloseEmergencyContactModal}
        onUpdate={handleEmergencyContactUpdate}
        initialData={initialEmergencyContactData}
        isUpdating={isPending}
      />

      {/* Guarantor 1 Edit Modal */}
      <GuarantorEditModal
        isOpen={isGuarantor1EditModalOpen}
        onClose={handleCloseGuarantor1Modal}
        onUpdate={handleGuarantor1Update}
        initialData={initialGuarantor1Data}
        guarantorNumber={1}
        isUpdating={isUpdatingFirstGuarantor}
      />

      {/* Guarantor 2 Edit Modal */}
      <GuarantorEditModal
        isOpen={isGuarantor2EditModalOpen}
        onClose={handleCloseGuarantor2Modal}
        onUpdate={handleGuarantor2Update}
        initialData={initialGuarantor2Data}
        guarantorNumber={2}
        isUpdating={isUpdatingSecondGuarantor}
      />
    </div>
  );
};

export default PersonalInfo;
