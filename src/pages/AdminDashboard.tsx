import React, { useState, useMemo } from "react";
import { dummyReports } from "../data/dummyReports";
import { Report } from "../types";
import { Search, Filter, CheckCircle, XCircle, Clock, MapPin, AlertTriangle, Building, Tag } from "lucide-react";

export function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>(dummyReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");

  const departments = ["All", "Public Works", "Power & Light", "Sanitation", "Transportation", "Parks & Recreation"];
  const statuses = ["All", "Open", "In Progress", "Resolved", "Rejected"];

  // Analytics
  const totalReports = reports.length;
  const openReports = reports.filter(r => r.status === "Open").length;
  const inProgressReports = reports.filter(r => r.status === "In Progress").length;
  const resolvedReports = reports.filter(r => r.status === "Resolved").length;

  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            r.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || r.status === statusFilter;
      const matchesDept = deptFilter === "All" || r.department === deptFilter;
      return matchesSearch && matchesStatus && matchesDept;
    });
  }, [reports, searchTerm, statusFilter, deptFilter]);

  const handleAction = (id: string, action: "approve" | "reject" | "resolve") => {
    setReports(prev => prev.map(report => {
      if (report.id === id) {
        if (action === "approve") return { ...report, isVerified: true, status: "In Progress" };
        if (action === "reject") return { ...report, status: "Rejected" };
        if (action === "resolve") return { ...report, status: "Resolved" };
      }
      return report;
    }));
  };

  const handleAssign = (id: string, dept: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === id) {
        return { ...report, department: dept };
      }
      return report;
    }));
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden">
      {/* Header & Analytics */}
      <div className="bg-white border-b border-slate-200 px-8 py-6 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Reports</p>
            <p className="text-3xl font-bold text-slate-900">{totalReports}</p>
          </div>
          <div className="bg-amber-50 p-4 border border-amber-200 rounded-xl">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">Open</p>
            <p className="text-3xl font-bold text-amber-900">{openReports}</p>
          </div>
          <div className="bg-blue-50 p-4 border border-blue-200 rounded-xl">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">In Progress</p>
            <p className="text-3xl font-bold text-blue-900">{inProgressReports}</p>
          </div>
          <div className="bg-green-50 p-4 border border-green-200 rounded-xl">
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Resolved</p>
            <p className="text-3xl font-bold text-green-900">{resolvedReports}</p>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="px-8 py-4 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search reports..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select 
              className="w-full sm:w-auto bg-white border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Building className="w-4 h-4 text-slate-400 shrink-0" />
            <select 
              className="w-full sm:w-auto bg-white border border-slate-300 rounded-lg text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-1 gap-4">
          {filteredReports.map(report => (
            <div key={report.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6">
              {/* Image */}
              <div className="w-full md:w-48 h-32 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                {report.imageUrl ? (
                  <img src={report.imageUrl} alt={report.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <MapPin className="w-8 h-8 opacity-50" />
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
                  <h3 className="text-lg font-bold text-slate-900 truncate">{report.title}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      report.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      report.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      report.severity === 'Medium' || report.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {report.severity}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                      report.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'Rejected' ? 'bg-slate-100 text-slate-500' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {report.status}
                    </span>
                    {report.isVerified && (
                      <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{report.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {report.location}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {report.timeAgo}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {report.category}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Assign Dept:</span>
                  <select 
                    className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={report.department || "All"}
                    onChange={(e) => handleAssign(report.id, e.target.value)}
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.filter(d => d !== "All").map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-row md:flex-col gap-2 shrink-0 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                {report.status === 'Open' && (
                  <button 
                    onClick={() => handleAction(report.id, 'approve')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Approve
                  </button>
                )}
                
                {(report.status === 'Open' || report.status === 'In Progress') && (
                  <button 
                    onClick={() => handleAction(report.id, 'resolve')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> Resolve
                  </button>
                )}

                {report.status === 'Open' && (
                  <button 
                    onClick={() => handleAction(report.id, 'reject')}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-red-50 text-red-600 rounded-lg text-sm font-bold transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No reports found</h3>
              <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
