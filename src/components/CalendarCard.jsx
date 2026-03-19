import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, subDays } from 'date-fns';

export function CalendarCard() {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    // Dummy events
    const events = {
        [format(new Date(), 'yyyy-MM-dd')]: [{ type: 'event', color: 'bg-rose-500' }],
        [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: [{ type: 'meeting', color: 'bg-emerald-500' }],
        [format(addDays(new Date(), 5), 'yyyy-MM-dd')]: [{ type: 'searching', color: 'bg-sky-500' }, { type: 'meeting', color: 'bg-emerald-500' }],
        [format(subDays(new Date(), 3), 'yyyy-MM-dd')]: [{ type: 'meeting', color: 'bg-emerald-500' }],
    };

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            const cloneDay = day;
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayEvents = events[dateKey] || [];
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            days.push(
                <div
                    key={day.toString()}
                    className={`h-11 w-full flex flex-col justify-start items-center cursor-pointer transition-colors hover:bg-zinc-50 rounded-xl pt-1.5 ${!isCurrentMonth ? 'text-zinc-300' : 'text-zinc-700 font-medium'}`}
                >
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-[13px] ${isToday ? 'bg-zinc-900 text-white font-bold shadow-md ring-2 ring-zinc-900/20 ring-offset-1' : ''}`}>
                        {formattedDate}
                    </div>
                    <div className="flex gap-0.5 mt-1">
                        {dayEvents.map((evt, idx) => (
                            <span key={idx} className={`w-1 h-1 rounded-full ${evt.color}`}></span>
                        ))}
                    </div>
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className="grid grid-cols-7 gap-1 w-full" key={day.toString()}>
                {days}
            </div>
        );
        days = [];
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
        <div key={d} className="text-center font-bold text-[11px] text-zinc-400 uppercase tracking-wider py-2">
            {d}
        </div>
    ));

    return (
        <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col h-full w-full">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-zinc-900 font-bold text-lg tracking-tight">Calendar</h2>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">Upcoming events</p>
                </div>
                <div className="flex items-center gap-2 bg-zinc-50 rounded-full p-1 border border-zinc-100">
                    <button onClick={prevMonth} className="text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-full p-1 transition-all"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-zinc-800 font-semibold min-w-[100px] text-center text-sm">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button onClick={nextMonth} className="text-zinc-400 hover:text-zinc-900 hover:bg-white rounded-full p-1 transition-all"><ChevronRight className="w-4 h-4" /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 w-full mb-1">
                {weekDays}
            </div>
            <div className="flex flex-col gap-0.5 w-full flex-1">
                {rows}
            </div>

            <div className="mt-auto pt-4 flex flex-wrap gap-4 px-1 border-t border-zinc-100">
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500"></span><span className="text-xs font-semibold text-zinc-500 tracking-tight">Event date</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500"></span><span className="text-xs font-semibold text-zinc-500 tracking-tight">Meeting</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sky-500"></span><span className="text-xs font-semibold text-zinc-500 tracking-tight">Sponsor search</span></div>
            </div>
        </div>
    );
}
