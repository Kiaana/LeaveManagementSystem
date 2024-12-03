// components/RoomInspectionScroll.js
import React, { useEffect, useRef } from 'react';

const RoomInspectionScroll = React.memo(({ data, isDarkMode }) => {
    const scrollRef = useRef(null);
    const scrollPositionRef = useRef(0); // 使用 useRef 代替 useState

    useEffect(() => {
        if (!data.length) return;

        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        const maxScrollPosition = scrollElement.scrollHeight / 2;

        const scroll = () => {
            if (scrollPositionRef.current >= maxScrollPosition) {
                scrollPositionRef.current = 0;
                scrollElement.scrollTop = 0;
            } else {
                scrollPositionRef.current += 1;
                scrollElement.scrollTop += 1;
            }
        };

        const timer = setInterval(scroll, 50);
        return () => clearInterval(timer);
    }, [data]); // 仅依赖 data

    return (
        <div
            ref={scrollRef}
            className="overflow-hidden h-[520px] relative"
        >
            <div className="space-y-4">
                {[...data, ...data].map((room, index) => (
                    <div
                        key={`${room.room_number}-${index}`}
                        className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                            } rounded-lg p-4 transition-colors duration-200`}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-semibold">
                                {room.room_number}宿舍
                            </span>
                            <span className={`text-lg font-bold ${room.total_score > 0 ? 'text-green-500' :
                                room.total_score < 0 ? 'text-red-500' :
                                    'text-gray-500'
                                }`}>
                                {room.total_score > 0 ? '+' : ''}
                                {room.total_score}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {room.inspections.map((inspection) => (
                                <div
                                    key={inspection.id}
                                    className="flex justify-between items-center text-sm"
                                >
                                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                        }`}>
                                        {inspection.reason}
                                    </span>
                                    <span className={`${inspection.score > 0 ? 'text-green-500' :
                                        inspection.score < 0 ? 'text-red-500' :
                                            'text-gray-500'
                                        }`}>
                                        {inspection.score > 0 ? '+' : ''}
                                        {inspection.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default RoomInspectionScroll;
