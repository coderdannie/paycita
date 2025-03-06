const colorMap = {
  purple: "#692E9F",
  lightpurple: "#D1BEE1",
  gray: "#E5E5E5",
};

const MetricCard = ({
  title,
  metrics,
}: {
  title: string;
  metrics: Array<{
    color?: keyof typeof colorMap;
    label: string;
    value: number;
  }>;
}) => {
  const maxValue = Math.max(...metrics.map((m) => m.value));

  return (
    <div className="bg-white shadow rounded-lg p-6 w-full">
      <h2 className="text-[1rem] font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="space-y-3">
        {metrics.map((metric, index) => {
          const barWidth = (metric.value / maxValue) * 100;
          return (
            <div key={index} className="flex items-center py-[.7rem]">

              <span className="text-gray-800 text-[.8rem] font-thin min-w-[120px]">
                {metric.label}
              </span>

              <div className="relative flex-1 flex items-center">
                <div
                  className="h-6 rounded-lg"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: colorMap[metric.color || "purple"],
                  }}
                />
                <span
                  className="text-black font-semibold text-sm ml-2"
                  style={{
                    minWidth: "30px",
                  }}
                >
                  {metric.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricCard;
