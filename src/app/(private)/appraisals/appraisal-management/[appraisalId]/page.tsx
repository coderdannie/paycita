"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppraisalDetailPage({ }: { params: { appraisalId: string } }) {
  const router = useRouter();
  
  useEffect(() => {

    router.push('/appraisals/appraisal-management/departments/finance/sarah-johnson');
  }, [router]);
  
  return <div>Loading...</div>;
}