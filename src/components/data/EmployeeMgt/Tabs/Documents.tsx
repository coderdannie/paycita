import { useMemo } from "react";
import DocumentList from "../DocumentList";

interface Document {
  name: string;
  url: string; // URL to download the document
  size: string; // File size (e.g., "12kb")
  uploaded: boolean;
}

const Documents = ({
  documents,
}: {
  documents: {
    guarantor_1_identification: string;
    guarantor_2_identification: string;
    cv?: string;
    signed_offer_letter?: string;
    nysc_certificate?: string;
    guarantor_1_passport?: string;
    guarantor_2_passport?: string;
  };
}) => {
  const { totalDocuments, uploadedCount, documentGroups } = useMemo(() => {
    const applicationDocuments: Document[] = [
      {
        name: "CV",
        url: documents?.cv || "#",
        size: "15kb",
        uploaded: !!documents?.cv,
      },
      {
        name: "Signed offer letter",
        url: documents?.signed_offer_letter || "#",
        size: "15kb",
        uploaded: !!documents?.signed_offer_letter,
      },
      {
        name: "NYSC Certificate",
        url: documents?.nysc_certificate || "#",
        size: "10kb",
        uploaded: !!documents?.nysc_certificate,
      },
    ];

    const guarantorDocuments1: Document[] = [
      {
        name: "Guarantor 1 passport",
        url: documents?.guarantor_1_passport || "#",
        size: "25kb",
        uploaded: !!documents?.guarantor_1_passport,
      },
      {
        name: "Guarantor 2 passport",
        url: documents?.guarantor_2_passport || "#",
        size: "20kb",
        uploaded: !!documents?.guarantor_2_passport,
      },
    ];

    const guarantorDocuments2: Document[] = [
      {
        name: "Guarantor 1 Identification",
        url: documents?.guarantor_1_identification || "#",
        size: "25kb",
        uploaded: !!documents?.guarantor_1_identification,
      },
      {
        name: "Guarantor 2 Identification",
        url: documents?.guarantor_2_identification || "#",
        size: "20kb",
        uploaded: !!documents?.guarantor_2_identification,
      },
    ];

    const allDocuments = [
      ...applicationDocuments,
      ...guarantorDocuments1,
      ...guarantorDocuments2,
    ];

    return {
      totalDocuments: allDocuments?.length,
      uploadedCount: allDocuments?.filter((doc) => doc.uploaded).length,
      documentGroups: [
        { title: "Application Documents", documents: applicationDocuments },
        { title: "Guarantors Passport", documents: guarantorDocuments1 },
        { title: "Guarantors Identification", documents: guarantorDocuments2 },
      ],
    };
  }, [documents]);
  return (
    <div>
      <h4 className="font-semibold text-lg">Uploaded documents</h4>
      <p className="font-bold pt-6 pb-4">
        {uploadedCount} out of {totalDocuments}{" "}
        <span className="text-[#008000]">Uploaded</span>{" "}
      </p>

      {documentGroups?.map((group, index) => (
        <div key={index} className={index > 0 ? "mt-6" : ""}>
          <DocumentList title={group.title} documents={group.documents} />
        </div>
      ))}
    </div>
  );
};
export default Documents;
