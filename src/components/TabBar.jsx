import React, { useState, useEffect, useRef } from 'react';

export default function TabBar({ tabs, activeTab, setActiveTab }) {
    const containerRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

    useEffect(() => {
        if (containerRef.current) {
            // Find the index of the active tab
            const activeIndex = tabs.findIndex(
                (tab) => (tab.id || tab.label) === activeTab
            );

            if (activeIndex !== -1) {
                const activeChild = containerRef.current.children[activeIndex];
                if (activeChild) {
                    setIndicatorStyle({
                        left: activeChild.offsetLeft,
                        width: activeChild.offsetWidth,
                    });
                }
            }
        }
    }, [activeTab, tabs]);

    return (
        <div
            ref={containerRef}
            className="w-full border-b border-white/10 flex relative"
        >
            {tabs.map((tab) => {
                const tabValue = tab.id || tab.label;
                const isActive = activeTab === tabValue;

                return (
                    <button
                        key={tabValue}
                        onClick={() => setActiveTab(tabValue)}
                        className={`relative flex-1 pb-3 pt-2 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${isActive
                            ? 'text-white'
                            : 'text-white/40 hover:text-white'
                            }`}
                    >
                        {tab.icon && <tab.icon size={14} />}
                        {tab.label}
                        {tab.count !== undefined && (
                            <span
                                className={`text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-white/10'
                                    }`}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}

            {/* Sliding Underline Indicator */}
            <div
                className="absolute bottom-0 h-0.5 bg-white transition-all duration-300 ease-out"
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                }}
            />
        </div>
    );
}
