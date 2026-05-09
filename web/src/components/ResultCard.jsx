import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const ResultCard = ({ confidence_score, trust_level, detailed_explanation }) => {
  const getIcon = () => {
    if (trust_level === 'Tin cậy cao') return CheckCircle;
    if (trust_level === 'Có dấu hiệu giả') return AlertCircle;
    return AlertTriangle;
  };
  
  const getColor = () => {
    if (trust_level === 'Tin cậy cao') return 'text-green-600';
    if (trust_level === 'Có dấu hiệu giả') return 'text-red-600';
    return 'text-yellow-600';
  };
  
  const getBgColor = () => {
    if (trust_level === 'Tin cậy cao') return 'bg-green-50 border-green-200';
    if (trust_level === 'Có dấu hiệu giả') return 'bg-red-50 border-red-200';
    return 'bg-yellow-50 border-yellow-200';
  };
  
  const Icon = getIcon();
  
  return (
    <div className={`rounded-xl p-6 border ${getBgColor()}`}>
      <div className="flex items-start gap-4">
        <Icon className={`w-8 h-8 ${getColor()} flex-shrink-0`} />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-semibold text-lg ${getColor()}`}>{trust_level}</h3>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{confidence_score}%</div>
              <div className="text-xs text-gray-600">Độ tin cậy</div>
            </div>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{detailed_explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;