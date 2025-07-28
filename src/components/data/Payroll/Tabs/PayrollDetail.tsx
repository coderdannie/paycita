import { useAuthSelector } from '@/src/Redux/selectors';
import { formatDate, numberToWords } from '@/src/utils/helper';

const PayrollDetail = ({
  details,
}: {
  details: {
    pension: string;
    nsitf: string;
    hmo: string;
    nhf: string;
    loan_deduction: string;
    paye: string;
    other_deduction: string;
    transport: string;
    housing: string;
    basic: string;
    profile_picture: string;
    name: string;
    date: string;
    employee_name: string;
    email: string;
    phone_number: string;
    sex: string;
    employment_type: string;
    job_title: string;
    job_date: string;
    bank_account_name: string;
    bank_account_number: string;
    bank_name: string;
    net_pay: string;
    gross_income: number;
    deductions: number;
  };
}) => {
  const userData = useAuthSelector();

  const currency = userData?.user?.currency || 'NGN';
  const netPayInWords = details?.net_pay
    ? numberToWords(+details?.net_pay.replace(/,/g, ''))
    : '';
  return (
    <div className="min-h-screen ">
      <div className="bg-white rounded-lg border border-[#E4E7EC] mx-auto ">
        {/* Header */}
        <div className="flex justify-between gap-4 flex-wrap px-4 md:px-8 pt-8 ">
          <p className="text-lg font-semibold">
            Payslip of{' '}
            {formatDate(details?.date).split(' ').slice(1, 3).join(' ')}
          </p>
          <p>Date: {formatDate(details?.date)}</p>
        </div>
        <div className="flex  flex-col sm:flex-row gap-4 mt-[40px] justify-between mb-8 p-8 ">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-center  ">
              <div className="bg-gray-200 p-2 rounded mr-4">
                {' '}
                {details?.profile_picture && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={details.profile_picture}
                    alt="Profile Picture"
                    className="object-contain max-w-20 max-h-20"
                  />
                )}
              </div>
              <div>
                <p className="font-semibold md:text-lg">
                  {details?.bank_account_name}
                </p>
                <div className="text-[#667085] pt-4">
                  <p className="text-sm">
                    {details?.bank_name} <br /> Account number:{' '}
                    {details?.bank_account_number}
                  </p>
                  <p className="text-xs">
                    Phone number: {details?.phone_number}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="font-semibold pb-5  md:text-lg">
              {details?.employee_name}
            </p>
            <p className="text-sm pb-1">{details?.job_title}</p>
            <p className="text-sm">{details?.employment_type}</p>
          </div>
        </div>

        {/* Content (Earnings & Deductions) */}
        <div className="flex flex-col border-t border-[#E4E7EC] md:flex-row justify-between mb-8 pt-9 px-4 md:px-8">
          <div className="flex-1 p-4 mb-4 md:mb-0 md:mr-4">
            <h2 className="font-semibold mb-4">Earnings</h2>

            <table className="w-full">
              <tbody>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Basic</td>
                  <td className="py-2 text-right pr-1">
                    {currency}
                    {details?.basic}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Housing </td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.housing}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Transport</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.transport}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Gross Salary</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.gross_income}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pt-5 mt-5  border-t border-[#E4E7EC] font-semibold flex justify-between">
              <p>Total Income</p>
              <p className="text-right">
                {currency}
                {details?.gross_income}
              </p>
            </div>
          </div>

          <div className="flex-1 p-4">
            <h2 className="font-semibold mb-4">Deductions</h2>

            <table className="w-full">
              <tbody>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Pension</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.pension}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">NSITF</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.nsitf}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">HMO</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.hmo}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">NHF</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.nhf}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Loan Deduction</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.loan_deduction}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">PAYE</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.paye}
                  </td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Other Deductions</td>
                  <td className="py-2 text-right pr-[6px]">
                    {currency}
                    {details?.other_deduction}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="pt-5 mt-5  border-t border-[#E4E7EC] font-semibold flex justify-between">
              <p>Total Deduction</p>
              <p className="text-right">
                {' '}
                {currency}
                {details?.deductions}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mb-2 px-4 md:px-8   ">
          <div>
            <p className="text-xl font-bold ml-2">Take Home Pay</p>
          </div>
          <div>
            <p className="font-semibold">
              {currency}
              {details?.net_pay}{' '}
            </p>
            <p className=" text-gray-600 capitalize max-w-96">
              ({netPayInWords})
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PayrollDetail;
