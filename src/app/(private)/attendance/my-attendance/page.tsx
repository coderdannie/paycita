"use client"
import FirstLayer from '@/src/components/data/Attendance/FirstLayer';
import TableLayer from '@/src/components/data/Attendance/TableLayer';
import { useDashboardSelector } from '@/src/Redux/selectors';

const MyAttendance = () => {

  const { attendance } = useDashboardSelector();

  return (
    <>
      <FirstLayer attendance={attendance}/>
      <TableLayer attendance={attendance?.attendance} />
    </>
  );
};
export default MyAttendance;
