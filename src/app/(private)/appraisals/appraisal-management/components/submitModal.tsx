import { FC, useState } from "react";

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comment: string) => void;
}

const SubmitModal: FC<SubmitModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [comment, setComment] = useState("");


  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = ""; 
    return null;
  }

  const handleSubmit = () => {
    document.body.style.overflow = "";
    onSubmit(comment);
    setComment("");
  };

  const handleClose = () => {
    document.body.style.overflow = "";
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-medium text-gray-800">Add Comment</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <textarea
          className="w-full border border-gray-300 rounded-md p-4 text-gray-700 focus:outline-none focus:border-purple-500 min-h-32 mb-4"
          placeholder="Enter your comment here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={6}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-[#692E9F] hover:bg-purple-800 text-white font-medium py-3 rounded-md transition duration-200"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;
