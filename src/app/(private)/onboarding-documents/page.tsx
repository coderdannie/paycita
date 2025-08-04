'use client';

import React, { useState } from 'react';
import { Upload, Download, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaFile } from 'react-icons/fa6';
import { DeleteModal } from '@/src/components/modals/DeleteLoanPolicy';

interface Document {
  id: number;
  name: string;
  fileName: string;
  size: string;
  status: 'uploaded' | 'uploading';
}

interface NewDocument {
  name: string;
  file: File | null;
}

const DocumentUploadPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Handbook',
      fileName: 'handbook.pdf',
      size: '12kb',
      status: 'uploaded',
    },
    {
      id: 2,
      name: 'company policy',
      fileName: 'company-policy.pdf',
      size: '15kb',
      status: 'uploaded',
    },
    {
      id: 3,
      name: 'NDA document',
      fileName: 'nda-document.pdf',
      size: '8kb',
      status: 'uploaded',
    },
    {
      id: 4,
      name: 'Non Compete Form',
      fileName: 'non-compete.pdf',
      size: '12kb',
      status: 'uploaded',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [newDocument, setNewDocument] = useState<NewDocument>({
    name: '',
    file: null,
  });

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        file: file,
      });
    }
  };

  const handleSubmitDocument = (): void => {
    if (newDocument.name && newDocument.file) {
      const newDoc: Document = {
        id: documents.length + 1,
        name: newDocument.name,
        fileName: newDocument.file.name,
        size: `${Math.round(newDocument.file.size / 1024)}kb`,
        status: 'uploaded',
      };

      setDocuments([...documents, newDoc]);
      setNewDocument({ name: '', file: null });
      setIsModalOpen(false);
    }
  };

  const handleDeleteDocument = (doc: Document): void => {
    setDocumentToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (!documentToDelete) return;

    setIsDeleting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setDocuments(documents.filter((doc) => doc.id !== documentToDelete.id));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleCancelDelete = (): void => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownloadDocument = (doc: Document): void => {
    // Simulate download
    console.log(`Downloading ${doc.fileName}`);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNewDocument({
      ...newDocument,
      name: event.target.value,
    });
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Upload On-boarding Documents
          </h1>
          <p className="text-gray-600">Please upload documents below</p>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{documents.length} </span> Uploaded
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className=" px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            On-boarding Documents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="border flex justify-between border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <FaFile className="text-[#344054]" />
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.name}</h3>
                    <p className="text-sm text-gray-500">{doc.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadDocument(doc)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDocument(doc)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Upload Document
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={newDocument.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter document name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {newDocument.file
                          ? newDocument.file.name
                          : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX up to 10MB
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSubmitDocument}
                  disabled={!newDocument.name || !newDocument.file}
                  className="flex-1 px-4 py-2"
                >
                  Upload
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Document"
        description={`Are you sure you want to delete "${documentToDelete?.name}"? This action cannot be undone.`}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DocumentUploadPage;
