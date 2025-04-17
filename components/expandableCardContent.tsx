'use client';

import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

interface ExpandableCardContentProps {
  children: React.ReactNode;
  collapsedHeight?: number;
  overlayColor?: string;
}

export function ExpandableCardContent({
  children,
  collapsedHeight = 150,
}: ExpandableCardContentProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);
    const [fullHeight, setFullHeight] = useState<number>(0);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
  
    // Reset to collapsed state whenever children change
    useEffect(() => {
      setExpanded(false);
    }, [children]);

    // Measure full content height when mounted or children change
    useEffect(() => {
      if (containerRef.current) {
        // Temporarily set height to auto to measure full height
        containerRef.current.style.height = 'auto';
        const measuredHeight = containerRef.current.scrollHeight;
        setFullHeight(measuredHeight);
        
        // Check if content overflows collapsed height
        const overflowing = measuredHeight > collapsedHeight;
        setIsOverflowing(overflowing);
        
        // Reset to collapsed state if not expanded
        if (!expanded) {
          containerRef.current.style.height = `${collapsedHeight}px`;
          containerRef.current.style.overflow = 'hidden';
        } else {
          // If expanded, still need to update height in case content changed
          containerRef.current.style.height = 'auto';
          containerRef.current.style.overflow = 'visible';
        }

        setHasMounted(true);
      }
    }, [children, expanded, collapsedHeight]);
  
    // Toggle expand / collapse state with a smooth height animation
    const toggleExpand = () => {
      if (!containerRef.current) return;
  
      if (expanded) {
        // Animate from full height back to collapsed height
        animate(containerRef.current, {
          height: collapsedHeight,
          duration: 300,
          easing: 'easeOutQuad',
          complete: () => {
            if (containerRef.current) {
              containerRef.current.style.overflow = 'hidden';
            }
            setExpanded(false);
          },
        });
      } else {
        // Animate from collapsed height to full content height
        animate(containerRef.current, {
          height: fullHeight,
          duration: 300,
          easing: 'easeOutQuad',
          begin: () => {
            if (containerRef.current) {
              containerRef.current.style.overflow = 'visible';
            }
          },
          complete: () => setExpanded(true),
        });
      }
    };
  
    return (
      <div>
        {/* Wrapping element with relative positioning to position the fade overlay */}
        <div className="relative">
          <div ref={containerRef} style={{ height: collapsedHeight, overflow: 'hidden' }}>
            {children}
            {/* Only render overlay if needed AND mounted */}
            {hasMounted && !expanded && isOverflowing && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-black to-transparent" />
            )}
          </div>
        </div>
        {/* Only render button if needed AND mounted */}
        {hasMounted && isOverflowing && (
          <div className="flex justify-center mt-3">
            <button
              onClick={toggleExpand}
              className="
                px-3 p-px rounded-full shadow-md text-sm text-center transition-colors duration-200 
                bg-[#606c5d] text-white hover:bg-[#4f594c]
                dark:text-secondary-foreground dark:hover:bg-white dark:hover:text-black
              "
            >
              {expanded ? 'Show Less' : 'Show More'}
            </button>
          </div>
        )}
      </div>
    );
}