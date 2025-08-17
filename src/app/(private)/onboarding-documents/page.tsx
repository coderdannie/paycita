'use client';

import React, { useState } from 'react';
import { Upload, Download, Trash2, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FaFile } from 'react-icons/fa6';
import { DeleteModal } from '@/src/components/modals/DeleteLoanPolicy';
import {
  useUploadOnboardingDocument,
  useGetOnboardingDocuments,
  useDeleteOnboardingDocument,
} from '@/src/hooks/dashboard/useDashboard';
import { toast } from 'react-hot-toast';

interface Document {
  id: number;
  document_name: string;
  file_name: string;
  file_size: string;
  document: string;
  created_at: string;
}

interface NewDocument {
  name: string;
  file: File | null;
}

const DocumentUploadPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [newDocument, setNewDocument] = useState<NewDocument>({
    name: '',
    file: null,
  });

  // React Query hooks
  const {
    data: documents = [],
    isLoading,
    error: fetchError,
  } = useGetOnboardingDocuments();

  const { mutateUploadOnboardingDocument, isPending: isUploading } =
    useUploadOnboardingDocument();

  const { mutate: deleteDocument, isPending: isDeleting } =
    useDeleteOnboardingDocument();

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
      const formData = new FormData();
      formData.append('document_name', newDocument.name);
      formData.append('document', newDocument.file);

      mutateUploadOnboardingDocument(formData, {
        onSuccess: () => {
          setNewDocument({ name: '', file: null });
          setIsModalOpen(false);

          // Reset the file input
          const fileInput = document.getElementById(
            'file-upload'
          ) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = '';
          }
        },
        onError: (error) => {
          console.error('Upload failed:', error);
        },
      });
    } else {
      toast.error('Please provide both document name and file');
    }
  };

  const handleDeleteDocument = (doc: Document): void => {
    setDocumentToDelete(doc);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (): void => {
    if (!documentToDelete) return;
    deleteDocument(documentToDelete.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        setDocumentToDelete(null);
      },
    });
  };

  const handleCancelDelete = (): void => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  const handleDownloadDocument = (doc: Document): void => {
    try {
      const link = document.createElement('a');
      link.href = doc.document;
      link.download = doc.document_name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Download started');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download document');
    }
  };

  console.log(documents?.data);
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setNewDocument({
      ...newDocument,
      name: event.target.value,
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            <span className="ml-2 text-gray-600">Loading documents</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError) {
    return (
      <div className="bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">
              Failed to load documents Please try again.
            </p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
              <span className="font-medium">{documents?.data.length} </span>{' '}
              Uploaded
            </div>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
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

          {documents?.data.length === 0 ? (
            <div className="text-center py-12">
              <FaFile className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No documents uploaded yet.</p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                Upload First Document
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents?.data?.map((doc: Document) => (
                <div
                  key={doc.id}
                  className="border flex justify-between border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <FaFile className="text-[#344054]" />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {doc.document_name}
                      </h3>
                      <p className="text-sm text-gray-500">{doc.file_size}</p>
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
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                  disabled={isUploading}
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
                    disabled={isUploading}
                    className="w-full px-3 py-2 border rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                      disabled={isUploading}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer ${
                        isUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
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
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleSubmitDocument}
                  disabled={
                    !newDocument.name || !newDocument.file || isUploading
                  }
                  className="flex-1 px-4 py-2"
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        title="Delete Document"
        description={`Are you sure you want to delete "${documentToDelete?.document_name}"? This action cannot be undone.`}
        onCancel={handleCancelDelete}
        onDelete={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default DocumentUploadPage;
