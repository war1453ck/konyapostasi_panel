import { useState } from 'react';
import { NewsModal } from '@/components/news/news-modal';
import { useLocation } from 'wouter';

export default function NewsForm() {
  const [, setLocation] = useLocation();
  
  return (
    <div className="p-6">
      <NewsModal
        isOpen={true}
        onClose={() => setLocation('/news')}
        news={null}
      />
    </div>
  );
}
