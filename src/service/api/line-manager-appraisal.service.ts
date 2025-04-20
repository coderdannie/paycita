import { api } from ".";


const getLineManagerAppraisals = (filters: {
    page: string;
    status?: string;
    title?: string;
}) => {
    const queryParams = new URLSearchParams();

    if (
        filters.page !== null &&
        filters.page !== undefined &&
        filters.page !== ""
    ) {
        queryParams.append("page", filters.page);
    }

    if (
        filters.status !== null &&
        filters.status !== undefined &&
        filters.status !== ""
    ) {
        queryParams.append("status", filters.status.toString());
    }
    if (
        filters.title !== null &&
        filters.title !== undefined &&
        filters.title !== ""
    ) {
        queryParams.append("title", filters.title.toString());
    }
    return api.get(`/hr/get-all-line-manager-appraisals?${queryParams.toString()}`);
};



const getLineManagerAppraisalsById = (id: string) => {
    return api.get(`/hr/get-single-line-manager-appraisals/${id}`);
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createLineManagerAppraisals = (data: any) => {
    return api.post("/hr/add-line-manager-staff-appraisal", data);
};


const lineManagerAppraisalService = {
    getLineManagerAppraisals,
    getLineManagerAppraisalsById,
    createLineManagerAppraisals,
};

export default lineManagerAppraisalService;
