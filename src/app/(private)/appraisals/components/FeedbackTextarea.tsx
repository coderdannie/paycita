import { FC } from "react";

interface FeedbackTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const FeedbackTextarea: FC<FeedbackTextareaProps> = ({ value, onChange }) => {
  return (
    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="font-medium">Employee Feedback</h3>
      <p className="text-sm text-gray-500 mt-1">
        Please provide any additional comments or feedback about your
        performance during this period
      </p>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="mt-3 w-full border border-gray-300 rounded-md p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Enter your feedback here..."
      />
    </div>
  );
};

export default FeedbackTextarea;
