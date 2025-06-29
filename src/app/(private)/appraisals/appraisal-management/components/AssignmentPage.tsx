'use client';
import { FC, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { IoArrowBack } from 'react-icons/io5';
import SubmitModal from './submitModal';

interface CriteriaRating {
  id: string;
  name: string;
  description: string;
  score: number;
  managerScore: number;
}

const AssignmentPage: FC = () => {
  const router = useRouter();

  const [ratings, setRatings] = useState<CriteriaRating[]>([
    {
      id: 'job-knowledge',
      name: 'Job Knowledge & Expertise',
      description:
        'Understanding of duties and responsibilities\nTechnical skills related to the role\nAbility to apply knowledge to work effectively',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'quality-of-work',
      name: 'Quality of Work',
      description:
        'Accuracy and thoroughness\nAttention to detail\nConsistency in output\nMeets/exceeds quality standards',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'productivity',
      name: 'Productivity & Efficiency',
      description:
        'Timeliness in completing tasks\nAbility to manage workload\nMinimizes downtime\nTime management',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'communication',
      name: 'Communication Skills',
      description:
        'Clear verbal and written communication\nActive listening\nTimely and appropriate feedback\nAbility to communicate with colleagues, management, and customers',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'customer-service',
      name: 'Customer Service (for client-facing roles)',
      description:
        'Response time to inquiries or issues\nCustomer satisfaction ratings\nProfessionalism in handling complaints\nResolution of customer issues',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'teamwork',
      name: 'Teamwork & Collaboration',
      description:
        'Cooperates with team members\nShares information and ideas\nOffers solutions and suggestions\nTakes ownership of tasks\nWorks well across departments',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'initiative',
      name: 'Initiative & Problem-Solving',
      description:
        'Proactively identifies problems\nOffers solutions and suggestions\nTakes ownership of tasks\nWillingness to go beyond the assigned duties',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'dependability',
      name: 'Dependability & Accountability',
      description: 'Meets deadlines\nReliable and punctual',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'adaptability',
      name: 'Adaptability & Flexibility',
      description:
        'Open to change and feedback\nAdjusts quickly to new responsibilities or shifts in priorities\nLearns new skills when required',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'leadership',
      name: 'Leadership & Supervision (For team leads/supervisors)',
      description:
        'Delegates tasks appropriately\nMotivates and guides team\nConflict resolution\nProvides feedback and support',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'company-policies',
      name: 'Adherence to Company Policies',
      description:
        'Follows company procedures and rules\nMaintains confidentiality\nComplies with safety and operational guidelines',
      score: 0,
      managerScore: 0,
    },
    {
      id: 'professionalism',
      name: 'Professionalism & Attitude',
      description:
        'Respectful and courteous behavior\nPositive attitude towards work\nPresentation and grooming (where applicable)\nEthical conduct',
      score: 0,
      managerScore: 0,
    },
  ]);

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setFinalComment] = useState('');

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

    router.push('/appraisals');
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
              <div className="flex flex-col md:flex-row gap-24">
                <div className="md:w-1/3 mb-6 md:mb-0 mt-11">
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
                                    ? ' bg-[#692E9F]'
                                    : 'border-gray-300'
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
                              {score} -{' '}
                              {score === 1
                                ? 'Poor'
                                : score === 2
                                ? 'Fair'
                                : score === 3
                                ? 'Good'
                                : score === 4
                                ? 'Very Good'
                                : 'Excellent'}
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
                                    ? ' bg-[#692E9F]'
                                    : 'border-gray-300'
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
                              {score} -{' '}
                              {score === 1
                                ? 'Poor'
                                : score === 2
                                ? 'Fair'
                                : score === 3
                                ? 'Good'
                                : score === 4
                                ? 'Very Good'
                                : 'Excellent'}
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
                  ? 'bg-[#692E9F] hover:bg-purple-800'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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
