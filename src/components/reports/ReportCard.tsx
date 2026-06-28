import React from "react";
import { Report } from "../../types";

interface ReportCardProps {
  report: Report;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report }) => {
  const getSeverityStyle = (severity: string, status: string) => {
    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }
    switch (severity) {
      case "Critical":
        return "bg-red-100 text-red-700";
      case "Moderate":
        return "bg-amber-100 text-amber-700";
      case "Low":
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusText = (report: Report) => {
    if (report.status === "Resolved") return "Resolved";
    return report.severity;
  };

  return (
    <div className={`bg-white border border-slate-200 p-4 rounded-sm shadow-sm flex flex-col h-full ${report.status === "Resolved" ? "opacity-60" : ""}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] px-2 py-0.5 font-bold uppercase ${getSeverityStyle(report.severity, report.status)}`}>
          {getStatusText(report)}
        </span>
        <span className="text-[10px] text-slate-400">{report.timeAgo}</span>
      </div>
      <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1">{report.title}</h3>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3 italic underline text-blue-600">
        {report.location}
      </p>
      
      <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-1">
            <div className="w-5 h-5 rounded-full bg-slate-300 border border-white"></div>
            <div className="w-5 h-5 rounded-full bg-slate-400 border border-white"></div>
          </div>
          <span className="text-[9px] text-slate-400 ml-2 font-medium">+{report.upvotes} upvotes</span>
        </div>
        <button className="text-[10px] font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
          UPVOTE ▲
        </button>
      </div>
    </div>
  );
}
