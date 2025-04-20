"use client";
import { FC, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
 
import { toast } from "react-hot-toast";
import type { AssessmentData } from "@/src/service/api/appraisal.service";
import { useTakeAssessment } from "@/src/hooks/appraisal/useAppraisal";

interface CriteriaRating {
  id: string;
  name: string;
  description: string;
  score: number;
}

const assessmentSchema = z.object({
  appraisal_id: z.string().min(1, "Appraisal ID is required"),
  job_knowledge: z.string().min(1, "Job knowledge rating is required"),
  communication: z.string().min(1, "Communication rating is required"),
  team_work: z.string().min(1, "Team work rating is required"),
  problem_solving: z.string().min(1, "Problem solving rating is required"),
  punctuality: z.string().min(1, "Punctuality rating is required"),
  quality_of_work: z.string().min(1, "Quality of work rating is required"),
  innovation: z.string().min(1, "Innovation rating is required"),
  productivity: z.string().default(""),
  customer_service: z.string().default(""),
  accountability: z.string().default(""),
  company_policy: z.string().default(""),
  professionalism: z.string().default(""),
  leadership: z.string().default(""),
  comment: z.string().min(1, "Comment is required"),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

const AssessmentPage: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const { mutate: submitAssessment, isPending } = useTakeAssessment();

  const [ratings, setRatings] = useState<CriteriaRating[]>([
    {
      id: "job_knowledge",
      name: "Job Knowledge & Expertise",
      description:
        "Understanding of duties and responsibilities\nTechnical skills related to the role\nAbility to apply knowledge to work effectively",
      score: 0,
    },
    {
      id: "quality_of_work",
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
      id: "customer_service",
      name: "Customer Service (for client-facing roles)",
      description:
        "Response time to inquiries or issues\nCustomer satisfaction ratings\nProfessionalism in handling complaints\nResolution of customer issues",
      score: 0,
    },
    {
      id: "team_work",
      name: "Teamwork & Collaboration",
      description:
        "Cooperates with team members\nShares information and ideas\nOffers solutions and suggestions\nTakes ownership of tasks\nWorks well across departments",
      score: 0,
    },
    {
      id: "problem_solving",
      name: "Initiative & Problem-Solving",
      description:
        "Proactively identifies problems\nOffers solutions and suggestions\nTakes ownership of tasks\nWillingness to go beyond the assigned duties",
      score: 0,
    },
    {
      id: "innovation",
      name: "Innovation",
      description:
        "Creativity and originality\nWillingness to take initiative\nContribution to improvement\nRisk management\nFollow-through on innovative ideas",
      score: 0,
    },
    {
      id: "accountability",
      name: "Dependability & Accountability",
      description: "Meets deadlines\nReliable and punctual",
      score: 0,
    },
    {
      id: "punctuality",
      name: "Punctuality",
      description:
        "Adhere to deadlines and punctuality in work attendance",
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
      id: "company_policy",
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      appraisal_id: id,
      job_knowledge: "",
      communication: "",
      team_work: "",
      problem_solving: "",
      punctuality: "",
      quality_of_work: "",
      innovation: "",
      productivity: "",
      customer_service: "",
      accountability: "",
      company_policy: "",
      professionalism: "",
      leadership: "",
      comment: "",
    },
  });



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

    // Directly set the form value using the criteriaId
    setValue(criteriaId as keyof AssessmentFormValues, score.toString());
  };

  const onSubmit = (data: AssessmentFormValues) => {
    const assessmentData: AssessmentData = {
      appraisal_id: data.appraisal_id,
      job_knowledge: data.job_knowledge,
      communication: data.communication,
      team_work: data.team_work,
      problem_solving: data.problem_solving,
      punctuality: data.punctuality,
      quality_of_work: data.quality_of_work,
      innovation: data.innovation,
      productivity: data.productivity,
      customer_service: data.customer_service,
      accountability: data.accountability,
      company_policy: data.company_policy,
      professionalism: data.professionalism,
      leadership: data.leadership,
      comment: data.comment,
    };

    submitAssessment(assessmentData, {
      onSuccess: () => {
        toast.success("Assessment submitted successfully");
        router.push("/appraisals");
      },
      onError: (error) => {
        toast.error("Failed to submit assessment");
        console.error(error);
      },
    });
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 w-full">
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
                                                            ${criteria.score === score
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
              {...register("comment")}
              className="mt-3 w-full border border-gray-300 rounded-md p-4 text-gray-700 focus:border-transparent min-h-32"
              placeholder="Notes about the employee performance"
              value={comments}
              onChange={(e) => {
                setComments(e.target.value);
                setValue("comment", e.target.value);
              }}
              rows={6}
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-[#692E9F] rounded-md text-[#692E9F] hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormComplete || isPending}
              className={`px-6 py-2 rounded-md text-white ${isFormComplete
                ? "bg-[#692E9F] hover:bg-purple-800"
                : "bg-[#F2F4F7] text-[#98A2B3] cursor-not-allowed"
                }`}
            >
              {isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssessmentPage;
