import { Button } from '@/components/ui/button';
import React from 'react';

type NoDataStateProps = {
  icon?: React.ReactNode;
  header: string;
  subheader: string;
  button?: {
    label?: string;
    onClick?: () => void;
    component?: React.ReactNode;
  };
};

const NoDataState: React.FC<NoDataStateProps> = ({
  icon,
  header,
  subheader,
  button,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="text-4xl">{icon}</div>
      <h2 className="text-xl font-semibold">{header}</h2>
      <p className="text-gray-500 max-w-[30rem]">{subheader}</p>

      {button?.component ? (
        button.component
      ) : button?.onClick && button.label ? (
        <Button
          onClick={button.onClick}
          className="mt-2 px-6 py-2 bg-pry text-white rounded-lg"
        >
          {button.label}
        </Button>
      ) : null}
    </div>
  );
};

export default NoDataState;
