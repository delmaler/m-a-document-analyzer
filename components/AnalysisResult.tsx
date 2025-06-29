
import React from 'react';
import { type AnalysisData } from '../types';
import { DocumentIcon, CalendarIcon, MoneyIcon, UsersIcon, ListIcon, CheckCircleIcon, ArrowPathIcon } from './Icons';

interface AnalysisResultProps {
  data: AnalysisData;
  fileName: string;
  onReset: () => void;
}

const InfoCard: React.FC<{ icon: React.ReactNode; title: string; value: string; className?: string }> = ({ icon, title, value, className }) => (
    <div className={`bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-start space-x-4 ${className}`}>
        <div className="flex-shrink-0 h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value || 'Not Specified'}</p>
        </div>
    </div>
);


const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, fileName, onReset }) => {
  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <div className="flex items-center justify-center text-center gap-2">
            <CheckCircleIcon className="w-8 h-8 text-green-500" />
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-slate-100">Analysis Complete</h2>
        </div>
        <p className="text-center text-slate-600 dark:text-slate-400 mt-2">
            <DocumentIcon className="inline-block w-4 h-4 mr-1.5 align-text-bottom"/>
            {fileName}
        </p>
      </div>

      <div className="space-y-6">
        <InfoCard icon={<MoneyIcon className="w-6 h-6 text-green-500"/>} title="Deal Value" value={data.dealValue} className="col-span-2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoCard icon={<UsersIcon className="w-6 h-6 text-blue-500"/>} title="Buyer Name" value={data.buyerName} />
            <InfoCard icon={<UsersIcon className="w-6 h-6 text-purple-500"/>} title="Seller Name" value={data.sellerName} />
            <InfoCard icon={<CalendarIcon className="w-6 h-6 text-red-500"/>} title="Signing Date" value={data.signingDate} />
            <InfoCard icon={<CalendarIcon className="w-6 h-6 text-yellow-500"/>} title="Closing Date" value={data.closingDate} />
        </div>

        <div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <ListIcon className="w-6 h-6 text-indigo-500" />
                Conditions Precedent
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                {data.conditionsPrecedent && data.conditionsPrecedent.length > 0 ? (
                    <ul className="space-y-3">
                        {data.conditionsPrecedent.map((condition, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <span className="text-slate-700 dark:text-slate-300">{condition}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">No specific conditions precedent were found.</p>
                )}
            </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 transition-transform transform hover:scale-105"
        >
            <ArrowPathIcon className="w-5 h-5 mr-2" />
            Analyze Another Document
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;
