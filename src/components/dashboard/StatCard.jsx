// src/components/dashboard/StatCard.jsx
import { Card, CardContent } from "../ui";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

// StatCard hanya menerima field yang tersedia dari BE/hook
const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  gradient,
  trend, // { change, isPositive }
  onClick = null,
}) => {
  const colorClasses = {
    blue: "from-blue-100 to-blue-50 border-blue-200",
    green: "from-green-100 to-green-50 border-green-200",
    yellow: "from-yellow-100 to-yellow-50 border-yellow-200",
    purple: "from-purple-100 to-purple-50 border-purple-200",
    red: "from-red-100 to-red-50 border-red-200",
  };

  const iconColors = {
    blue: "text-blue-600",
    green: "text-green-600",
    yellow: "text-yellow-600",
    purple: "text-purple-600",
    red: "text-red-600",
  };

  // Hanya tampilkan trend jika field trend valid (positive/warning/negative)
  const showTrend =
    ["positive", "warning", "negative"].includes(trend) && trend !== "neutral";

  return (
    <Card
      className={`border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${
        colorClasses[color]
      } ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
    >
      {/* Decorative background pattern */}
      {/* <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-24 h-24 transform translate-x-8 -translate-y-8">
          <div
            className={`w-full h-full rounded-full bg-gradient-to-br ${gradient} opacity-20`}
          ></div>
        </div>
      </div> */}

      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-xl bg-white shadow-inner`}
            >
              <Icon className={`h-6 w-6 ${iconColors[color]}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        </div>
        {trend && (
          <div className="mt-3 flex items-center text-xs">
            {trend.isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span
              className={trend.isPositive ? "text-green-700" : "text-red-700"}
            >
              {trend.change}% vs periode sebelumnya
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
