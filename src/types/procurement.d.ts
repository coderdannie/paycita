interface ProcurementDetails {
  id?: string;
  item: string;
  description: string;
  quantity: number;
  price: string;
}

interface Procurement {
  vendor_id: string;
  procurement_date: string;
  expected_delivery_date: string;
  total_price: string;
  details: ProcurementDetails[];
}

interface ProcurementData {
  id: number;
  procurement_number: string;
  vendor: string;
  total_cost: string;
  status: string;
  expected_delivery_date: string;
  created_at: string;
  finance_manager_status: string;
  managment_status: string;
  items: ProcurementDetails[];
}

interface Expenses {
  total_price: string;
  details: ProcurementDetails[];
}

export { Procurement, ProcurementData, Expenses };
