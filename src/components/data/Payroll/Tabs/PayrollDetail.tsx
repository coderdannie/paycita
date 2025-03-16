const PayrollDetail = () => {
  return (
    <div className="min-h-screen ">
      <div className="bg-white rounded-lg border border-[#E4E7EC] mx-auto ">
        {/* Header */}
        <div className="flex justify-between gap-4 flex-wrap px-4 md:px-8 pt-8 ">
          <p className="text-lg font-semibold">Payslip of Feb 2025</p>
          <p>Date: 31 Feb 2025</p>
        </div>
        <div className="flex  flex-col sm:flex-row gap-4 mt-[40px] justify-between mb-8 p-8 ">
          <div className="flex-1 mb-4 md:mb-0">
            <div className="flex items-center  ">
              <div className="bg-gray-200 p-2 rounded mr-4">LoGo</div>
              <div>
                <p className="font-semibold md:text-lg">Name of the Business</p>
                <div className="text-[#667085] pt-4">
                  <p className="text-sm">
                    Gentle St, Trans Amadi <br /> Port Harcourt 501101, Rivers
                  </p>
                  <p className="text-xs">
                    Phone number: 0806728364 / Fax number: 0411-235235
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 text-right">
            <p className="font-semibold pb-5  md:text-lg">Sarah Johnson</p>
            <p className="text-sm pb-1">Frontend Developer</p>
            <p className="text-sm">Full Time - Staff</p>
          </div>
        </div>

        {/* Content (Earnings & Deductions) */}
        <div className="flex flex-col border-t border-[#E4E7EC] md:flex-row justify-between mb-8 pt-9 px-4 md:px-8">
          <div className="flex-1 p-4 mb-4 md:mb-0 md:mr-4">
            <h2 className="font-semibold mb-4">Earnings</h2>
            <div className="border-b border-[#E4E7EC] pt-2 pb-5 flex justify-between">
              <p>Basic salary</p>
              <p className="text-right">$3,000</p>
            </div>
            <div className="py-5 flex justify-between">
              <p>Allowance</p>
              <p className="text-right">$600</p>
            </div>
            <table className="w-full">
              <tbody>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Food allowance</td>
                  <td className="py-2 text-right pr-1">$1,000</td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Transportation allowance</td>
                  <td className="py-2 text-right pr-[6px]">$1,000</td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Position allowance</td>
                  <td className="py-2 text-right pr-[6px]">$1,600</td>
                </tr>
              </tbody>
            </table>
            <div className="pt-5 mt-5  border-t border-[#E4E7EC] font-semibold flex justify-between">
              <p>Total Income</p>
              <p className="text-right">$3,600</p>
            </div>
          </div>

          <div className="flex-1 p-4">
            <h2 className="font-semibold mb-4">Deductions</h2>
            <div className=" border-[#E4E7EC] pt-2 pb-5 flex justify-between">
              <p>Insurance</p>
              <p className="text-right">$3,000</p>
            </div>
            <table className="w-full">
              <tbody>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Health insurance</td>
                  <td className="py-2 text-right pr-[6px]">$0.00</td>
                </tr>
                <tr className="border border-[#E4E7EC]">
                  <td className="py-2 pl-4">Workforce insurance</td>
                  <td className="py-2 text-right pr-[6px]">$0.00</td>
                </tr>
              </tbody>
            </table>
            <div className="pt-5 pb-10 border-t border-[#E4E7EC] mt-5 flex justify-between">
              <p>
                {' '}
                <span className="font-semibold">CPS</span> (Contributory Pension
                Scheme)
              </p>
              <p className="text-right">$0.00</p>
            </div>
            <div className="pt-5 mt-5  border-t border-[#E4E7EC] font-semibold flex justify-between">
              <p>Total Deduction</p>
              <p className="text-right">$3,600</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mb-2 px-4 md:px-8   ">
          <div>
            <p className="text-xl font-bold ml-2">Take Home Pay</p>
          </div>
          <div>
            <p className="font-semibold">$3,600 </p>
            <p className=" text-gray-600">
              (Three thousand six hundred dollars)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PayrollDetail;
