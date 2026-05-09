import React from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const EducationCard = ({ title, content, value }) => {
  return (
    <AccordionItem value={value} className="border border-gray-200 rounded-lg px-6 mb-4">
      <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-blue-700 transition-colors duration-200">
        {title}
      </AccordionTrigger>
      <AccordionContent className="text-sm text-gray-700 leading-relaxed pt-2">
        {content}
      </AccordionContent>
    </AccordionItem>
  );
};

export default EducationCard;