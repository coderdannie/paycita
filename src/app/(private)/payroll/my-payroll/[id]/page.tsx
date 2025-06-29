'use client';

import { useGetSinglePayslip } from '@/src/hooks/payroll/usePayroll';
import { formatDate, imageToBase64, numberToWords } from '@/src/utils/helper';
import { usePathname } from 'next/navigation';
import { BsFileEarmarkArrowDownFill } from 'react-icons/bs';
import { useAuthSelector } from '@/src/Redux/selectors';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const PaySlips = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const payslipRef = useRef<HTMLDivElement>(null);

  const [profilePicBase64, setProfilePicBase64] = useState<string | null>(null);

  const [imageConversionError, setImageConversionError] = useState<
    string | null
  >(null);

  const userData = useAuthSelector();

  const currency = userData?.user?.currency || 'NGN';

  const { singlePayslipData, isLoading } = useGetSinglePayslip(id);

  useEffect(() => {
    setProfilePicBase64(null);
    setImageConversionError(null);

    const imageUrl = singlePayslipData?.profile_picture;

    if (imageUrl && !isLoading) {
      imageToBase64(imageUrl)
        .then((base64String) => {
          setProfilePicBase64(base64String as string);
          setImageConversionError(null);
        })
        .catch((error) => {
          setImageConversionError('Could not load profile picture for PDF.');
          setProfilePicBase64(null);
        });
    } else {
      setProfilePicBase64(null);
      setImageConversionError(null);
    }
  }, [singlePayslipData?.profile_picture, isLoading]);

  const handleDownloadPdf = () => {
    const input = payslipRef.current;
    if (!input) {
      console.error('Payslip element not found');
      return;
    }

    if (imageConversionError && singlePayslipData?.profile_picture) {
      toast.error(
        `Warning: Profile picture could not be loaded due to an error (${imageConversionError}). It might be missing from the PDF.`
      );
    }

    // Remove useCORS: true if you added it previously. It's not needed for Data URLs.
    html2canvas(input, {
      scale: 2,
      // useCORS: false, // Or just remove the option
      // logging: true, // Enable logging for debugging html2canvas itself
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4',
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        let imgWidth = pdfWidth - 40;
        let imgHeight = imgWidth / ratio;

        if (imgHeight > pdfHeight - 40) {
          imgHeight = pdfHeight - 40;
          imgWidth = imgHeight * ratio;
        }

        const xPos = (pdfWidth - imgWidth) / 2;
        const yPos = 20;

        pdf.addImage(imgData, 'PNG', xPos, yPos, imgWidth, imgHeight);

        const dateStr = singlePayslipData?.date
          ? formatDate(singlePayslipData.date).split(' ').slice(1, 3).join('_')
          : 'payslip';
        const employeeName =
          singlePayslipData?.employee_name?.replace(/\s+/g, '_') || 'employee';
        const filename = `Payslip_${employeeName}_${dateStr}.pdf`;

        pdf.save(filename);
      })
      .catch((err) => {
        console.error('Error generating PDF with html2canvas:', err);
        alert(
          'An error occurred while generating the PDF. Please check the console for details.'
        );
      });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const netPayInWords = singlePayslipData?.net_pay
    ? numberToWords(singlePayslipData?.net_pay.replace(/,/g, ''))
    : '';

  const imageSrc = profilePicBase64 || singlePayslipData?.profile_picture; // Prefer Base64

  return (
    <div>
      <div className="flex justify-between items-end flex-wrap gap-3 p-4">
        <div>
          <h2 className="text-[#1D2939] font-bold text-lg md:text-2xl">
            Payslips
          </h2>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            className="flex h-[40px] w-fit px-[10px] gap-1 border-2 rounded-lg border-primary font-semibold text-sm items-center text-primary"
            // onClick={() => setIsDrawerOpen(true)}
          >
            Print
          </button> */}
          <button
            className="flex items-center gap-2 bg-primary text-white h-[40px] px-4 rounded-md text-sm"
            onClick={handleDownloadPdf}
          >
            <BsFileEarmarkArrowDownFill /> <span>Download as PDF</span>
          </button>
        </div>
      </div>
      <div ref={payslipRef} className="min-h-screen md:p-4">
        <div className="bg-white rounded-lg shadow-md mx-auto ">
          {/* Header */}
          <div className="flex justify-between gap-4 flex-wrap px-4 md:px-8 pt-8 ">
            <p className="text-lg font-semibold">
              Payslip of{' '}
              {formatDate(singlePayslipData?.date)
                .split(' ')
                .slice(1, 3)
                .join(' ')}
            </p>
            <p>Date: {formatDate(singlePayslipData?.date)}</p>
          </div>
          <div className="flex  flex-col sm:flex-row gap-4 mt-[40px] justify-between mb-8 p-8 ">
            <div className="flex-1 mb-4 md:mb-0">
              <div className="flex items-center  ">
                <div className="bg-gray-200 p-2 rounded mr-4">
                  {singlePayslipData?.profile_picture && ( // Add a check if the picture exists
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imageSrc}
                      alt="Profile Picture"
                      className="object-contain max-w-20 max-h-20"
                    />
                  )}
                </div>
                <div>
                  <p className="font-semibold md:text-lg capitalize">
                    {singlePayslipData?.bank_account_name}
                  </p>
                  <div className="text-[#667085] pt-4">
                    <p className="text-sm">
                      {singlePayslipData?.bank_name} <br /> Account number:{' '}
                      {singlePayslipData?.bank_account_number}
                    </p>
                    <p className="text-xs">
                      Phone number: {singlePayslipData?.phone_number}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 text-right">
              <p className="font-semibold pb-5  md:text-lg">
                {singlePayslipData?.employee_name}{' '}
              </p>
              <p className="text-sm pb-1">{singlePayslipData?.job_title} </p>
              <p className="text-sm">{singlePayslipData?.employment_type} </p>
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
                      {singlePayslipData?.basic}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">Housing </td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.housing}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">Transport</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.transport}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">Gross Salary</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.gross_income}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="pt-5 mt-5  border-t border-[#E4E7EC] font-semibold flex justify-between">
                <p>Total Income</p>
                <p className="text-right">
                  {currency}
                  {singlePayslipData?.gross_income}{' '}
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
                      {singlePayslipData?.pension}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">NSITF</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.nsitf}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">HMO</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.hmo}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">NHF</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.nhf}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">Loan Deduction</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.loan_deduction}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">PAYE</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.paye}
                    </td>
                  </tr>
                  <tr className="border border-[#E4E7EC]">
                    <td className="py-2 pl-4">Other Deductions</td>
                    <td className="py-2 text-right pr-[6px]">
                      {currency}
                      {singlePayslipData?.other_deduction}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="pt-5 mt-5  border-t border-[#E4E7EC] font-semibold flex justify-between">
                <p>Total Deduction</p>
                <p className="text-right">
                  {currency}
                  {singlePayslipData?.deductions}
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-2 px-4 md:px-8 pb-[60px] border-b border-[#E4E7EC] ">
            <div>
              <p className="text-xl font-bold ml-2">Take Home Pay</p>
            </div>
            <div>
              <p className="font-semibold">
                {currency}
                {singlePayslipData?.net_pay}{' '}
              </p>
              <p className=" text-gray-600 capitalize max-w-96">
                ({netPayInWords})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PaySlips;
