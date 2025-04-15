"use client";
import { FC, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import SubmitModal from "./submitModal";


interface CriteriaRating {
  id: string;
  name: string;
  description: string;
  score: number;
  managerScore: number;
}

const AssignmentPage: FC = () => {
  const router = useRouter();
  // const params = useParams();

  const [ratings, setRatings] = useState<CriteriaRating[]>([
    {
      id: "communication",
      name: "Communication Skill",
      description:
        "Clarity and effectiveness in written and verbal communication",
      score: 0,
      managerScore: 0,
    },
    {
      id: "teamwork",
      name: "Teamwork",
      description: "Ability to work collaboratively with others",
      score: 0,
      managerScore: 0,
    },
    {
      id: "problem-solving",
      name: "Problem Solving",
      description:
        "Effectiveness in identifying problems and implementing solutions",
      score: 0,
      managerScore: 0,
    },
    {
      id: "punctuality",
      name: "Punctuality",
      description: "Adherence to deadlines and punctuality in work attendance",
      score: 0,
      managerScore: 0,
    },
    {
      id: "quality",
      name: "Quality of Work",
      description: "Consistency and accuracy of work delivered",
      score: 0,
      managerScore: 0,
    },
    {
      id: "innovation",
      name: "Innovation",
      description: "Ability to contribute new ideas and creative solutions",
      score: 0,
      managerScore: 0,
    },
  ]);

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setFinalComment] = useState("");

  useEffect(() => {
    const allRated = ratings.every(
      (rating) => rating.score > 0 && rating.managerScore > 0
    );
    setIsFormComplete(allRated);
  }, [ratings]);

  const handleRatingChange = (criteriaId: string, score: number) => {
    setRatings(
      ratings.map((rating) =>
        rating.id === criteriaId ? { ...rating, score } : rating
      )
    );
  };

  const handleManagerRatingChange = (criteriaId: string, score: number) => {
    setRatings(
      ratings.map((rating) =>
        rating.id === criteriaId ? { ...rating, managerScore: score } : rating
      )
    );
  };

  const handleSubmit = () => {
    if (!isFormComplete) return;
    setIsModalOpen(true);
  };

  const handleCommentSubmit = (comment: string) => {
    setFinalComment(comment);
    setIsModalOpen(false);

    console.log("Submitting assignment:", {
      ratings,
      comment,
    });
    router.push("/appraisals");
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className=" w-full ">
      <div className="w-full mx-auto py-6 px-4">
        <div className="mb-4 text-sm text-gray-600">
          <span>Q1 Performance Review / Sarah Johnson</span>
        </div>

        <button
          onClick={handleCancel}
          className="flex items-center text-[#1D2939] mb-6"
        >
          <IoArrowBack className="mr-2" />
          <span>Assignment (Line Manager Score)</span>
        </button>

        <div className="p-6 w-full">
          {ratings.map((criteria) => (
            <div key={criteria.id} className="py-8 ">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 mb-6 md:mb-0">
                  <h3 className="font-medium text-gray-800">{criteria.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {criteria.description}
                  </p>
                </div>

                <div className="md:w-2/3 flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/2">
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
                                    ? " bg-[#692E9F]"
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

                  <div className="md:w-1/2 mt-6 md:mt-0">
                    <h4 className="text-sm font-medium text-gray-600 mb-3">
                      Line Manager Score
                    </h4>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <div key={score} className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <div
                              className={`w-5 h-5 rounded-full border flex items-center justify-center 
                                ${
                                  criteria.managerScore === score
                                    ? " bg-[#692E9F]"
                                    : "border-gray-300"
                                }`}
                              onClick={() =>
                                handleManagerRatingChange(criteria.id, score)
                              }
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
          ))}

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
                  ? "bg-[#692E9F] hover:bg-purple-800"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isFormComplete}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <SubmitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCommentSubmit}
      />
    </div>
  );
};

export default AssignmentPage;
