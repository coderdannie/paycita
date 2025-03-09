import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";


const RecentPayslips: React.FC = () => {
  const payslips = [
    { no: 1, date: "January 2025", netSalary: "$3,200", status: "Paid" },
    { no: 2, date: "December 2024", netSalary: "$3,200", status: "Paid" },
    { no: 3, date: "November 2024", netSalary: "$3,200", status: "Paid" },
  ];

  return (
    <Card className="w-full">
      <CardHeader>Recent Payslips</CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th>NO</th>
                <th>Date</th>
                <th>Net Salary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payslips.map((payslip) => (
                <tr key={payslip.no} className="border-b last:border-b-0">
                  <td>{payslip.no}</td>
                  <td>{payslip.date}</td>
                  <td>{payslip.netSalary}</td>
                  <td>
                    <span className="text-green-500">{payslip.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentPayslips;