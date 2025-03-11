"use client";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";

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
      <div className="space-y-4">
        {metrics.map((metric, index) => {
          const data = [
            {
              name: metric.label,
              value: metric.value,
            },
          ];

          return (
            <div key={index} className="flex items-center py-[.7rem]">
              <span className="text-gray-800 text-[.8rem] font-thin min-w-[120px]">
                {metric.label}
              </span>
              <div className="relative flex-1">
                <ResponsiveContainer width="100%" height={32}>
                  <BarChart
                    data={data}
                    layout="vertical"
                    barSize={32}
                    margin={{ top: 0, right: 40, bottom: 0, left: 0 }}
                  >
                    <XAxis type="number" hide domain={[0, maxValue]} />
                    <YAxis type="category" dataKey="name" hide />
                    <Bar
                      dataKey="value"
                      radius={[4, 4, 4, 4]}
                      fill={colorMap[metric.color || "purple"]}
                    >
                      <LabelList
                        dataKey="value"
                        position="right"
                        offset={10}
                        fill="#000000"
                        style={{
                          fontWeight: 600,
                          fontSize: "14px",
                          fill: "#000000",
                        }}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricCard;
