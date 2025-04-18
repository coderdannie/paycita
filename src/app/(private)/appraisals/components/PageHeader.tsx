import { FC } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-medium text-gray-900">{title}</h1>
      {description && <p className="mt-2 text-gray-700">{description}</p>}
    </div>
  );
};

export default PageHeader;
