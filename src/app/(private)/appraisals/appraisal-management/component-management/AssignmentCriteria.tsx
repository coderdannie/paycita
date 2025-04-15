import { FC } from "react";
import AssignmentRatingOptions from "./AssignmentRatingOptions";



interface CriteriaProps {
  criteria: {
    id: string;
    name: string;
    description: string;
    score: number;
    managerScore: number;
  };
  onRatingChange: (score: number) => void;
  onManagerRatingChange: (score: number) => void;
}

const AssignmentCriteria: FC<CriteriaProps> = ({
  criteria,
  onRatingChange,
  onManagerRatingChange,
}) => {
  return (
    <div className="py-6 border-b border-gray-100 last:border-0">
      <div className="flex flex-col md:flex-row md:items-start">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <h3 className="font-medium text-gray-800">{criteria.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
        </div>

        <div className="md:w-2/3 flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <AssignmentRatingOptions
              currentScore={criteria.score}
              onRatingChange={onRatingChange}
            />
          </div>

          <div className="md:w-1/2 mt-6 md:mt-0">
            <h4 className="text-sm font-medium text-gray-600 mb-3">
              Line Manager Score
            </h4>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((score) => (
                <div key={score} className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <div
                      onClick={() => onManagerRatingChange(score)}
                      className={`w-5 h-5 rounded-full border flex items-center justify-center
                        ${
                          criteria.managerScore === score
                            ? "border-purple-600 bg-purple-600"
                            : "border-gray-300"
                        }`}
                    >
                      {criteria.managerScore === score && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <span className="ml-3 text-sm text-gray-700">
                      {score} -{" "}
                      {score === 1
                        ? "Poor"
                        : score === 2
                        ? "Fair"
                        : score === 3
                        ? "Good"
                        : score === 4
                        ? "Very Good"
                        : "Excellent"}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCriteria;
