import { api } from '.';

const getAllAssets = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }
  return api.get(`/hr/all-assets?${queryParams.toString()}`);
};

const createAsset = (data: {
  name: string;
  category: string;
  quantity: number;
  status: string;
}) => {
  return api.post(`/hr/create-asset`, data);
};

const getAllCategory = () => {
  return api.get(`/hr/category`);
};

const getAllUsers = () => {
  return api.get(`/hr/all-users`);
};

const assignAsset = (data: { asset_id: string; user_id: string }) => {
  return api.post(`/hr/assign-asset`, data);
};

const getAllAssignedAssets = (filters?: { page: string }) => {
  const queryParams = new URLSearchParams();

  if (
    filters.page !== null &&
    filters.page !== undefined &&
    filters.page !== ''
  ) {
    queryParams.append('page', filters.page);
  }
  return api.get(`/hr/all-assigned-assets?${queryParams.toString()}`);
};

const revokeAssets = async (query: { assetTrackingId: string }) => {
  const REVOKE_ASSETS = (assetTrackingId = '') =>
    `/hr/revoke-asset/${assetTrackingId}`;
  const res = await api.post(REVOKE_ASSETS(query.assetTrackingId));
  return res.data;
};

const assetService = {
  getAllAssets,
  createAsset,
  getAllCategory,
  getAllUsers,
  assignAsset,
  getAllAssignedAssets,
  revokeAssets,
};

export default assetService;
