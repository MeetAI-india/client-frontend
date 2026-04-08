import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react'; // Assuming you use lucide-react based on your <tab.icon> syntax

export default function TabBar({ tabs, activeTab, setActiveTab }) {
    const tabsRef = useRef(null);
    const dropdownRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const { visibleTabs, otherTabs, showDropdown } = useMemo(() => {
        const importantTabs = tabs.filter((tab) => tab.important);
        const nonImportantTabs = tabs.filter((tab) => !tab.important);

        return {
            visibleTabs: importantTabs.length > 0 ? importantTabs : tabs,
            otherTabs: nonImportantTabs,
            showDropdown: importantTabs.length > 0 && nonImportantTabs.length > 0,
        };
    }, [tabs]);

    useEffect(() => {
        if (tabsRef.current) {
            // Find the index of the active tab ONLY among the visible tabs
            const activeIndex = visibleTabs.findIndex(
                (tab) => (tab.id || tab.label) === activeTab
            );

            if (activeIndex !== -1) {
                const activeChild = tabsRef.current.children[activeIndex];
                if (activeChild) {
                    const nextStyle = {
                        left: activeChild.offsetLeft,
                        width: activeChild.offsetWidth,
                        opacity: 1, // Show indicator
                    };

                    setIndicatorStyle((prev) =>
                        prev.left === nextStyle.left &&
                        prev.width === nextStyle.width &&
                        prev.opacity === nextStyle.opacity
                            ? prev
                            : nextStyle
                    );
                }
            } else {
                // Active tab is inside the dropdown, hide the sliding indicator
                setIndicatorStyle((prev) => (
                    prev.opacity === 0 ? prev : { ...prev, opacity: 0 }
                ));
            }
        }
    }, [activeTab, visibleTabs]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTabClick = (tabValue) => {
        setActiveTab(tabValue);
        setIsDropdownOpen(false); // Close dropdown if a tab is clicked from inside it
    };

    return (
        <div className="w-full border-b border-white/10 flex relative">
            {/* Container strictly for visible tab buttons (for accurate indicator math) */}
            <div ref={tabsRef} className="flex flex-1">
                {visibleTabs.map((tab) => {
                    const tabValue = tab.id || tab.label;
                    const isActive = activeTab === tabValue;

                    return (
                        <button
                            key={tabValue}
                            onClick={() => handleTabClick(tabValue)}
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
            </div>

            {/* Dropdown for non-important tabs */}
            {showDropdown && (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className={`relative px-4 pb-3 pt-2 text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${isDropdownOpen ? 'text-white' : 'text-white/40 hover:text-white'
                            }`}
                    >
                        <MoreHorizontal size={14} />
                        More
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl py-2 z-50 min-w-[180px]">
                            {otherTabs.map((tab) => {
                                const tabValue = tab.id || tab.label;
                                const isActive = activeTab === tabValue;

                                return (
                                    <button
                                        key={tabValue}
                                        onClick={() => handleTabClick(tabValue)}
                                        className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-between gap-3 ${isActive
                                                ? 'text-white bg-white/5'
                                                : 'text-white/40 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="flex items-center gap-2">
                                            {tab.icon && <tab.icon size={14} />}
                                            {tab.label}
                                        </span>
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
                        </div>
                    )}
                </div>
            )}

            {/* Sliding Underline Indicator */}
            <div
                className="absolute bottom-0 h-0.5 bg-white transition-all duration-300 ease-out"
                style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    opacity: indicatorStyle.opacity, // Fades out when a dropdown tab is active
                }}
            />
        </div>
    );
}
