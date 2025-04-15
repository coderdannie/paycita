"use client";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

interface CriteriaRating {  id: string;
  name: string;
  description: string;
  score: number;
}

const AssessmentPage: FC = () => {
  const router = useRouter();
 

  
  const [ratings, setRatings] = useState<CriteriaRating[]>([
    {
      id: "communication",
      name: "Communication Skill",
      description:
        "Clarity and effectiveness in written and verbal communication",
      score: 0,
    },
    {
      id: "teamwork",
      name: "Teamwork",
      description: "Ability to work collaboratively with others",
      score: 0,
    },
    {
      id: "problem-solving",
      name: "Problem Solving",
      description:
        "Effectiveness in identifying problems and implementing solutions",
      score: 0,
    },
    {
      id: "punctuality",
      name: "Punctuality",
      description: "Adherence to deadlines and punctuality in work attendance",
      score: 0,
    },
    {
      id: "quality",
      name: "Quality of Work",
      description: "Consistency and accuracy of work delivered",
      score: 0,
    },
    {
      id: "innovation",
      name: "Innovation",
      description: "Ability to contribute new ideas and creative solutions",
      score: 0,
    },
  ]);

  const [comments, setComments] = useState("");
  const [isFormComplete, setIsFormComplete] = useState(false);


  useEffect(() => {
    const allRated = ratings.every((rating) => rating.score > 0);
    setIsFormComplete(allRated);
  }, [ratings]);

  const handleRatingChange = (criteriaId: string, score: number) => {
    setRatings(
      ratings.map((rating) =>
        rating.id === criteriaId ? { ...rating, score } : rating
      )
    );
  };

  const handleSubmit = () => {
    if (!isFormComplete) return;

    console.log("Submitting assessment:", { ratings, comments });
    router.push("/appraisals");
  };

  const handleCancel = () => {
    router.back();
  };

 
  const scoreLabels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto py-6 px-4">
        <button
          onClick={handleCancel}
          className="flex items-center text-gray-600 mb-6"
        >
          <IoArrowBack className="mr-2" />
          <span>Assessment</span>
        </button>

        <div className="p-6 w-full">
          {ratings.map((criteria) => (
            <div
              key={criteria.id}
              className="py-8 border-b border-gray-100 last:border-0"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{criteria.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {criteria.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-3">
                    Score
                  </h4>
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <div key={score} className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center 
                              ${
                                criteria.score === score
                                  ? "border-purple-600 bg-purple-600"
                                  : "border-gray-300"
                              }`}
                            onClick={() =>
                              handleRatingChange(criteria.id, score)
                            }
                          >
                            {criteria.score === score && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="ml-3 text-sm text-gray-700">
                            {score} - {scoreLabels[score]}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-6 pt-4">
            <h3 className="font-medium text-gray-800">Comment</h3>
            <textarea
              className="mt-3 w-full border border-gray-300 rounded-md p-4 text-gray-700 focus:border-transparent min-h-32"
              placeholder="Notes about the employee performance"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={6}
            />
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-md text-white ${
                isFormComplete
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormComplete}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentPage;
