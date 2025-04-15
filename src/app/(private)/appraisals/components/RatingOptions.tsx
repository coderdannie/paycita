import { FC } from "react";

interface RatingOptionsProps {
  currentScore: number;
  onRatingChange: (score: number) => void;
}

const RatingOptions: FC<RatingOptionsProps> = ({
  currentScore,
  onRatingChange,
}) => {
  const options = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" },
  ];

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-600 mb-3">Score</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.value} className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div
                onClick={() => onRatingChange(option.value)}
                className={`w-5 h-5 rounded-full border flex items-center justify-center 
                  ${
                    currentScore === option.value
                      ? "border-purple-600 bg-purple-600"
                      : "border-gray-300"
                  }`}
              >
                {currentScore === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="ml-3 text-sm text-gray-700">
                {option.value} - {option.label}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RatingOptions;
