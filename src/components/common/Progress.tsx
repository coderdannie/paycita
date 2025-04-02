const Progress = () => {
  return (
    <div className="relative flex flex-col items-center w-3 h-16">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-full bg-[#9B73BF]/20 rounded-full" />
      <div
        className="w-3 h-12 bg-[#9B73BF] rounded-full relative"
        style={{ top: '2px' }}
      />
    </div>
  );
};
export default Progress;
