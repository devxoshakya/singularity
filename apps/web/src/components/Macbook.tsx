import React from 'react';

import { MacbookScroll } from '@/components/ui/macbook-scroll';

export function Macbook() {
  return (
    <div className="w-full overflow-hidden bg-white dark:bg-[#0B0B0F]">
      <MacbookScroll
        src="/assets/images/content.png"
        showGradient={false}
      />
    </div>
  );
}
