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
      id: "job-knowledge",
      name: "Job Knowledge & Expertise",
      description:
        "Understanding of duties and responsibilities\nTechnical skills related to the role\nAbility to apply knowledge to work effectively",
      score: 0,
    },
    {
      id: "quality-of-work",
      name: "Quality of Work",
      description:
        "Accuracy and thoroughness\nAttention to detail\nConsistency in output\nMeets/exceeds quality standards",
      score: 0,
    },
    {
      id: "productivity",
      name: "Productivity & Efficiency",
      description:
        "Timeliness in completing tasks\nAbility to manage workload\nMinimizes downtime\nTime management",
      score: 0,
    },
    {
      id: "communication",
      name: "Communication Skills",
      description:
        "Clear verbal and written communication\nActive listening\nTimely and appropriate feedback\nAbility to communicate with colleagues, management, and customers",
      score: 0,
    },
    {
      id: "customer-service",
      name: "Customer Service (for client-facing roles)",
      description:
        "Response time to inquiries or issues\nCustomer satisfaction ratings\nProfessionalism in handling complaints\nResolution of customer issues",
      score: 0,
    },
    {
      id: "teamwork",
      name: "Teamwork & Collaboration",
      description:
        "Cooperates with team members\nShares information and ideas\nOffers solutions and suggestions\nTakes ownership of tasks\nWorks well across departments",
      score: 0,
    },
    {
      id: "initiative",
      name: "Initiative & Problem-Solving",
      description:
        "Proactively identifies problems\nOffers solutions and suggestions\nTakes ownership of tasks\nWillingness to go beyond the assigned duties",
      score: 0,
    },
    {
      id: "dependability",
      name: "Dependability & Accountability",
      description: "Meets deadlines\nReliable and punctual",
      score: 0,
    },
    {
      id: "adaptability",
      name: "Adaptability & Flexibility",
      description:
        "Open to change and feedback\nAdjusts quickly to new responsibilities or shifts in priorities\nLearns new skills when required",
      score: 0,
    },
    {
      id: "leadership",
      name: "Leadership & Supervision (For team leads/supervisors)",
      description:
        "Delegates tasks appropriately\nMotivates and guides team\nConflict resolution\nProvides feedback and support",
      score: 0,
    },
    {
      id: "company-policies",
      name: "Adherence to Company Policies",
      description:
        "Follows company procedures and rules\nMaintains confidentiality\nComplies with safety and operational guidelines",
      score: 0,
    },
    {
      id: "professionalism",
      name: "Professionalism & Attitude",
      description:
        "Respectful and courteous behavior\nPositive attitude towards work\nPresentation and grooming (where applicable)\nEthical conduct",
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
                  <p className="text-sm text-gray-500 mt-1 whitespace-pre-line">
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
                                  ? "border-[#692E9F] bg-purple-600"
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
              className="px-6 py-2 border border-[#692E9F] rounded-md text-[#692E9F] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-md text-white ${
                isFormComplete
                  ? "bg-[#692E9F] hover:bg-purple-800"
                  : "bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed"
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
