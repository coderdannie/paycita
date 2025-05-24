export interface ExpenseItem {
  id: string;
  itemName: string;
  description: string;
  vendorName: string;
  unitPrice: string;
  quantity: string | number;
  totalCost: string;
}

export interface ExpenseRequest {
  employee_name: string;
  expense_number: string;
  id: string;
  department: string;
  amount: string;
  status: 'Approved' | 'Rejected' | 'Pending';
  date: string;
  requestDate: string;
  items: ExpenseItem[];
}
