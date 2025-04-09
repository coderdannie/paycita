import DocumentList from '../DocumentList';

interface Document {
  name: string;
  url: string; // URL to download the document
  size: string; // File size (e.g., "12kb")
  uploaded: boolean;
  // Add other relevant properties if needed
}

// interface DocumentListProps {
//   title?: string;
//   documents: Document[];
// }
const Documents = () => {
  const applicationDocuments: Document[] = [
    {
      name: 'CV',
      url: '/path/to/offer_letter.pdf',
      size: '15kb',
      uploaded: true,
    },
    {
      name: 'Signed offer letter',
      url: '/path/to/offer_letter.pdf',
      size: '15kb',
      uploaded: true,
    },
    {
      name: 'NYSC Certificate',
      url: '/path/to/nysc_certificate.pdf',
      size: '10kb',
      uploaded: true,
    },
  ];

  const guarantorDocuments: Document[] = [
    {
      name: 'Guarantor 1 passport',
      url: '/path/to/guarantor1_passport.jpg',
      size: '25kb',
      uploaded: false,
    },
    {
      name: 'Guarantor 2 passport',
      url: '/path/to/guarantor2_passport.png',
      size: '20kb',
      uploaded: true,
    },
  ];

  return (
    <div>
      <h4 className="font-semibold text-lg">Uploaded documents</h4>
      <p className="font-bold pt-6 pb-4">
        5 out of 7 <span className="text-[#008000]">Uploaded</span>{' '}
      </p>

      <DocumentList
        title="Application Documents"
        documents={applicationDocuments}
      />
      <div className="mt-6">
        <DocumentList
          title="Guarantors Passport (2/2)"
          documents={guarantorDocuments}
        />
      </div>
      <div className="mt-6">
        <DocumentList
          title="Guarantors Identification (0/2)"
          documents={guarantorDocuments}
        />
      </div>
    </div>
  );
};
export default Documents;
