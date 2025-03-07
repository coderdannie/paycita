import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const WeeklyAttendance = () => (
  <Card className="w-full">
    <CardHeader>Weekly Attendance</CardHeader>
    <CardContent className="flex items-center justify-center">
      <div className="relative">
        <Progress value={95} className="w-32 h-32 bg-purple-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-purple-600">95%</span>
        </div>
      </div>
      <div className="ml-4 text-sm">
        <p>From 3-7 Feb, 2025</p>
        <p>On Time: 4</p>
        <p>Late: 1</p>
        <p>Missed: N/A</p>
      </div>
    </CardContent>
  </Card>
);
export default WeeklyAttendance;