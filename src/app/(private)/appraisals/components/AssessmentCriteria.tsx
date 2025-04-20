import { FC } from "react";
import RatingOptions from "./RatingOptions";

interface CriteriaProps {
  criteria: {
    id: string;
    name: string;
    description: string;
    score: number;
  };
  onRatingChange: (score: number) => void;
}

const AssessmentCriteria: FC<CriteriaProps> = ({
  criteria,
  onRatingChange,
}) => {
  return (
    <div className="py-6 last:border-0">
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="md:w-1/3 mb-4 md:mb-0">
          <h3 className="font-medium text-gray-800">{criteria.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{criteria.description}</p>
        </div>
        <div className="md:w-2/3">
          <RatingOptions
            currentScore={criteria.score}
            onRatingChange={onRatingChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AssessmentCriteria;
