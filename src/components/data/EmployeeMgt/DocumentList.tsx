'use client';

import React, { useState } from 'react';
import { BsUpload } from 'react-icons/bs';
import { RiErrorWarningLine } from 'react-icons/ri';
import Image from 'next/image';
import ViewDocDetailsDrawer from '../../modals/ViewDocDetailsDrawer';

interface Document {
  name: string;
  url?: string;
  size?: string;
  uploaded?: boolean;
  fileType?: string;
  uploadedBy?: string;
  uploadDate?: string;
  imageUrl?: string;
}

interface DocumentListProps {
  title?: string;
  documents: Document[];
}

const DocumentList: React.FC<DocumentListProps> = ({ title, documents }) => {
  const handleDownload = (url: string | undefined, name: string) => {
    if (!url) {
      console.warn(`Cannot download ${name}: Document not yet uploaded.`);
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [isDocInfoOpen, setIsDocInfoOpen] = useState(false);
  const [selectedDocumentInfo, setSelectedDocumentInfo] = useState<
    | {
        imageUrl?: string;
        fileType?: string;
        size?: string;
        uploadedBy?: string;
        uploadDate?: string;
      }
    | undefined
  >(undefined);

  const handleInfoClick = (document: Document) => {
    setSelectedDocumentInfo({
      imageUrl: document.imageUrl,
      fileType:
        document.fileType ||
        (document.name.endsWith('.pdf') ? 'PDF File' : 'Unknown File'),
      size: document.size,
      uploadedBy: document.uploadedBy,
      uploadDate: document.uploadDate,
    });
    setIsDocInfoOpen(true);
  };

  const handleCloseDocInfo = () => {
    setIsDocInfoOpen(false);
    setSelectedDocumentInfo(undefined);
  };

  return (
    <div>
      {title && (
        <h4 className="text-[#3A3A3ACC] pb-4 ">
          {title}{' '}
          <span className="font-semibold">
            ({documents.filter((doc) => doc.uploaded).length}/{documents.length}
            )
          </span>{' '}
        </h4>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {documents.map((doc, index) => (
          <div
            key={index}
            className={`border rounded-md shadow-sm p-4 flex items-center justify-between ${
              !doc.uploaded
                ? 'border-[#FF4D4F] bg-[#FFF4F4]'
                : 'border-[#E1E3EB] bg-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Image
                src={
                  doc.uploaded
                    ? '/assets/file.svg'
                    : '/assets/question-mark.svg'
                }
                alt={doc.uploaded ? 'file icon' : 'not uploaded icon'}
                width={doc.uploaded ? 30 : 20}
                height={doc.uploaded ? 30 : 20}
              />
              <div>
                <h4 className="font-medium text-sm">{doc.name}</h4>
                <p className="text-xs text-gray-500 pt-2">
                  {!doc.uploaded ? (
                    <span className="text-[#FF4D4F]">
                      This document is yet to be uploaded by employee
                    </span>
                  ) : (
                    doc.size
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!doc.uploaded ? (
                <RiErrorWarningLine className="w-5 h-5 font-semibold text-[#FF4D4F]" />
              ) : (
                <>
                  <button
                    onClick={() => handleDownload(doc.url, doc.name)}
                    className="text-gray-600 hover:text-purple-700 focus:outline-none"
                    aria-label={`Download ${doc.name}`}
                  >
                    <BsUpload className="w-4 h-4 font-semibold" />
                  </button>
                  <button
                    onClick={() => handleInfoClick(doc)} // Call handleInfoClick here
                    className="text-gray-600 hover:text-purple-700 focus:outline-none"
                    aria-label={`View info about ${doc.name}`}
                  >
                    <RiErrorWarningLine className="w-5 h-5 font-semibold" />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <ViewDocDetailsDrawer
        isOpen={isDocInfoOpen}
        onClose={handleCloseDocInfo}
        documentInfo={selectedDocumentInfo}
      />
    </div>
  );
};

export default DocumentList;
