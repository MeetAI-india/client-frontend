import React, { useState } from "react";
import { MoreHorizontal, Plus } from "lucide-react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import Badge from "@/components/Badge";

export default function PipelinePage() {
    const defaultStages = [
        {
            id: 'lead', title: 'Lead', count: 3, value: '$45k', items: [
                { id: 1, title: 'Website Redesign', contact: 'Alice F.', value: '$15k', tags: ['High'] },
                { id: 2, title: 'Mobile App POC', contact: 'Bob S.', value: '$20k', tags: ['Medium'] },
                { id: 3, title: 'Cloud Audit', contact: 'Diana P.', value: '$10k', tags: ['Low'] }
            ]
        },
        {
            id: 'qualified', title: 'Qualified', count: 2, value: '$82k', items: [
                { id: 4, title: 'Security Auth Module', contact: 'Charlie D.', value: '$32k', tags: ['High'] },
                { id: 5, title: 'Data Migration', contact: 'Evan W.', value: '$50k', tags: ['High'] }
            ]
        },
        {
            id: 'proposal', title: 'Proposal', count: 1, value: '$120k', items: [
                { id: 6, title: 'Enterprise Portal', contact: 'Alice F.', value: '$120k', tags: ['Medium'] }
            ]
        },
        {
            id: 'closed', title: 'Closed Won', count: 0, value: '$0', items: []
        }
    ];

    const [stages, setStages] = useState(defaultStages);
    const [draggedItem, setDraggedItem] = useState(null);

    const handleDragStart = (e, item, sourceStageId) => {
        setDraggedItem({ item, sourceStageId });
        // Making drag image transparent could look cooler but standard is fine
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add('bg-white/[0.08]');
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove('bg-white/[0.08]');
    };

    const handleDrop = (e, targetStageId) => {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-white/[0.08]');

        if (!draggedItem) return;
        const { item, sourceStageId } = draggedItem;
        if (sourceStageId === targetStageId) return;

        setStages(prev => {
            const newStages = [...prev];
            const sourceIndex = newStages.findIndex(s => s.id === sourceStageId);
            const targetIndex = newStages.findIndex(s => s.id === targetStageId);

            // Remove from source
            newStages[sourceIndex].items = newStages[sourceIndex].items.filter(i => i.id !== item.id);
            // Add to target
            newStages[targetIndex].items.push(item);

            // Recompute values
            newStages[sourceIndex].count--;
            newStages[targetIndex].count++;

            return newStages;
        });
        setDraggedItem(null);
    };

    return (
        <div className="h-full flex flex-col animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white mb-2 underline decoration-white/10 underline-offset-8">
                        Pipeline
                    </h1>
                    <p className="text-white/40 font-medium">
                        Drag and drop deals across stages.
                    </p>
                </div>
                <Button onClick={() => { }}>
                    + Add Deal
                </Button>
            </header>

            <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
                {stages.map((stage) => (
                    <div
                        key={stage.id}
                        className="flex-shrink-0 w-80 flex flex-col bg-white/[0.03] border border-white/[0.1] rounded-[30px] p-5 transition-colors"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, stage.id)}
                    >
                        {/* Stage Header */}
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-white text-lg tracking-tight flex items-center gap-3">
                                {stage.title}
                                <span className="w-6 h-6 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px]">
                                    {stage.count}
                                </span>
                            </h3>
                            <button className="text-white/40 hover:text-white transition-colors">
                                <MoreHorizontal size={18} />
                            </button>
                        </div>

                        {/* Cards Container */}
                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                            {stage.items.map(item => (
                                <Card
                                    key={item.id}
                                    className="p-5"
                                >
                                    <div
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item, stage.id)}
                                        className="cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <Badge variant={item.tags[0].toLowerCase()}>
                                                {item.tags[0]}
                                            </Badge>
                                        </div>
                                        <h4 className="font-bold text-white mb-1 leading-tight">{item.title}</h4>
                                        <p className="text-xs text-white/50 mb-4">{item.contact}</p>
                                        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                                            <span className="font-black text-white">{item.value}</span>
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                                                {item.contact.charAt(0)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            <button className="w-full mt-2 py-3 border border-dashed border-white/20 rounded-2xl text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/[0.05] hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                                <Plus size={14} /> Add Node
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
