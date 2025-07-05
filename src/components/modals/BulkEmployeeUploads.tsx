import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Download, Trash2 } from 'lucide-react';

interface UploadedFile {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

interface BulkEmployeeUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: UploadedFile) => void;
  maxFileSize?: number; // in MB
  acceptedFileTypes?: string[];
}

const fieldMap: { [key: string]: string } = {
  'Full name': 'Name',
  Email: 'Email',
  'Phone number': 'Number',
  'Birth date': 'D.O.B',
  Gender: 'Gender',
  'Marital status': 'Marital status',
  Country: 'Country',
  'Resident address': 'Address',
  Emergency: 'Country',
  'Job Title': 'Job',
  'Employment Type': 'Employment',
  Department: 'Dept',
  'Company Email': 'Company Email',
  Role: 'Role',
  'Location Type': 'Location',
  'Hire Date': 'Hire Date',
  'Basic Salary': 'Salary',
  'Tax Status': 'Tax Status',
  'Tax Method': 'Tax Method',
  'Tax Number': 'Tax Number',
  'Item Given': 'Item',
  'Offer Letter': 'Offer Letter',
};

export const BulkEmployeeUpload: React.FC<BulkEmployeeUploadProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
  maxFileSize = 10,
  acceptedFileTypes = ['.csv', '.xlsx', '.xls'],
}) => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string>('');
  const [showFieldMapping, setShowFieldMapping] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }

    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFileTypes.includes(fileExtension)) {
      return `Only ${acceptedFileTypes.join(', ')} files are allowed`;
    }

    return null;
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError('');
      const fileData: UploadedFile = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
      };
      setUploadedFile(fileData);
    },
    [maxFileSize, acceptedFileTypes]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    setError('');
  }, []);

  const handleCompleteUpload = useCallback(() => {
    if (uploadedFile) {
      onUploadComplete(uploadedFile);
      setUploadedFile(null);
      setError('');
      onClose();
    }
  }, [uploadedFile, onUploadComplete, onClose]);

  const handleDownloadTemplate = useCallback(() => {
    // Create CSV header row from fieldMap
    const headers = Object.keys(fieldMap).join(',');
    const sampleData = Object.values(fieldMap)
      .map((value) => {
        if (value === 'D.O.B') return '1990-01-01';
        if (value === 'Hire Date') return '2024-01-01';
        if (value === 'Salary') return '50000';
        return `sample_${value.toLowerCase().replace(' ', '_')}`;
      })
      .join(',');

    const csvContent = `${headers}\n${sampleData}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_bulk_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  const toggleFieldMapping = useCallback(() => {
    setShowFieldMapping(!showFieldMapping);
  }, [showFieldMapping]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Add Employee in Bulk
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Drop file here or{' '}
                <label className="text-primary hover:text-blue-800 cursor-pointer underline">
                  Click to upload
                  <input
                    type="file"
                    className="hidden"
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleFileInputChange}
                  />
                </label>
              </p>
              <p className="text-xs text-gray-500">
                CSV file not greater than {maxFileSize}MB
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Uploaded File */}
          {uploadedFile && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">
                Uploaded File
              </h3>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                    <Upload className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {uploadedFile.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDownloadTemplate}
                    className="h-8 w-8 p-0"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveFile}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Field Mapping Information */}
          {showFieldMapping && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium mb-3">
                Required Fields in Template
              </h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                {Object.entries(fieldMap).map(([label, columnName]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-600">{label}:</span>
                    <span className="font-medium">{columnName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end flex-col md:flex-row gap-4 space-x-3 pt-4">
            <div className="flex-1">
              <Button
                variant="ghost"
                onClick={toggleFieldMapping}
                className="text-primary"
              >
                {showFieldMapping ? 'Hide Field Info' : 'Show Required Fields'}
              </Button>
            </div>
            <Button
              variant="outline"
              onClick={handleDownloadTemplate}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Template</span>
            </Button>
            <Button onClick={handleCompleteUpload} disabled={!uploadedFile}>
              Complete Upload
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
