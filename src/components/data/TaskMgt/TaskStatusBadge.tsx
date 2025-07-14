interface TaskStatusBadgeProps {
  status: string;
}

export const TaskStatusBadge = ({ status }: TaskStatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return ' bg-white rounded-[4px] font-semibold  text-[#00AA4F] border  border-[#89D8A9]';
      case 'in progress':
        return 'bg-white border  rounded-[4px]  text-[#FFA80A] font-semibold  border-[#FFD384]';
      default:
        return 'bg-gray-100 border font-semibold text-gray-800 rounded-[4px] border-[#34405480]';
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusStyles(
        status
      )}`}
    >
      {status}
    </span>
  );
};
