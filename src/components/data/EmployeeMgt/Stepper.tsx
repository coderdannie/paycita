const Stepper = () => {
  return (
    <div className="flex items-center space-x-4">
      {/* Step 1 - Active */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-600 text-white font-semibold">
          1
        </div>
        <span className="font-semibold text-gray-900">Personal info</span>
      </div>

      {/* Divider */}
      <div className="w-10 h-px bg-gray-300"></div>

      {/* Step 2 - Inactive */}
      <div className="flex items-center space-x-2 text-gray-400">
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-semibold">
          2
        </div>
        <span>Employee details</span>
      </div>
    </div>
  );
};

export default Stepper;
