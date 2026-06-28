import React, { useRef, useState } from "react";
import { dummyReports } from "../data/dummyReports";
import { ReportCard } from "../components/reports/ReportCard";
import { useAuth } from "../store/AuthContext";

export function Dashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const { currentUser } = useAuth();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysisResult(null); // Reset on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!imagePreview) {
      alert("Please upload an image first.");
      return;
    }
    if (!currentUser) {
      alert("Please sign in to generate reports.");
      return;
    }

    setIsGenerating(true);
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          imageUrl: "", // We are passing imageBase64 instead
          imageBase64: imagePreview.split(',')[1],
          latitude: 37.7749, // Default to SF for demo
          longitude: -122.4194,
          address: "Unknown Location"
        })
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || err.message || "Failed to generate report");
      }

      const data = await response.json();
      setAnalysisResult(data.report);
      alert("Report successfully generated and saved!");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-y-auto md:overflow-hidden">
      {/* Left Panel: Report Entry */}
      <section className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-6 flex flex-col shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">New Report</h2>

        <div className="space-y-5">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <div 
            onClick={handleImageClick}
            className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors relative overflow-hidden"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <>
                <svg className="w-10 h-10 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-sm text-slate-500">Drop image here or click to upload</p>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-blue-800">Gemini Intelligence Core</span>
            </div>
            {analysisResult ? (
              <div className="text-[11px] text-blue-900 space-y-2">
                <p><strong>Detected:</strong> {analysisResult.category} ({Math.round((analysisResult.aiAnalysis?.confidence || 0) * 100)}% confidence)</p>
                <p><strong>Severity:</strong> <span className="font-bold text-red-600">{analysisResult.severity}</span></p>
                <p><strong>Department:</strong> {analysisResult.department}</p>
                <p className="italic">"{analysisResult.description}"</p>
              </div>
            ) : (
              <p className="text-[11px] text-blue-700 leading-relaxed">
                Awaiting input. Once uploaded, I will detect the issue, predict severity, and draft your official complaint.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="text-[10px] uppercase font-bold text-slate-400 absolute -top-2 left-3 bg-white px-1">Department</label>
              <select 
                className="w-full border border-slate-200 rounded p-3 text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={analysisResult?.department || "Auto-assigning..."}
                readOnly
              >
                <option>Auto-assigning...</option>
                <option>Public Works</option>
                <option>Sanitation</option>
                <option>Transportation</option>
                <option>Environmental</option>
              </select>
            </div>
            <button 
              onClick={handleGenerate}
              disabled={!imagePreview || isGenerating}
              className="w-full py-3 bg-slate-900 text-white font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors uppercase disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Generate Report"
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 md:mt-auto pt-6">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">
            <span>Project Status</span>
            <span className="text-green-600">v1.2 Production</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full">
            <div className="bg-green-500 w-3/4 h-1 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Center Panel: Map Visualization */}
      <section className="flex-1 bg-slate-200 relative overflow-hidden min-h-[400px] md:min-h-0">
        {/* Map Placeholder Pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
          {/* Simulated Markers */}
          <div className="absolute top-1/4 left-1/3 group cursor-pointer">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg shadow-red-500/50"></div>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 group cursor-pointer">
            <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-amber-600 rounded-full border-2 border-white shadow-lg shadow-amber-500/50"></div>
            </div>
          </div>
          <div className="absolute bottom-1/3 right-1/4 group cursor-pointer">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg shadow-blue-500/50"></div>
            </div>
          </div>
        </div>

        {/* Floating Control */}
        <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-2xl rounded-full px-4 md:px-6 py-2 border border-white flex items-center gap-4 md:gap-8 overflow-x-auto max-w-[90%] whitespace-nowrap">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-black">Reports</span>
            <span className="text-sm font-bold">1,248</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-black">Resolved</span>
            <span className="text-sm font-bold text-green-600">892</span>
          </div>
          <div className="w-px h-6 bg-slate-200"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-slate-400 uppercase font-black">Response</span>
            <span className="text-sm font-bold">2.4h</span>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-10 h-10 bg-white border border-slate-200 shadow-sm flex items-center justify-center text-lg font-bold hover:bg-slate-50">+</button>
          <button className="w-10 h-10 bg-white border border-slate-200 shadow-sm flex items-center justify-center text-lg font-bold hover:bg-slate-50">-</button>
        </div>
      </section>

      {/* Right Panel: Community Feed */}
      <section className="w-full md:w-80 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200 flex flex-col shrink-0 min-h-[400px] md:min-h-0">
        <div className="p-6 border-b border-slate-200 bg-white">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Recent Activity</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {dummyReports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
        <div className="p-4 bg-slate-100 border-t border-slate-200 mt-auto">
          <button className="w-full py-2 text-[10px] font-black uppercase text-slate-500 tracking-widest hover:bg-slate-200 transition-colors">View Global Feed</button>
        </div>
      </section>
    </div>
  );
}
