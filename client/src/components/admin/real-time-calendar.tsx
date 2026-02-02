import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  addDays,
  isSameDay
} from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: "maintenance" | "release" | "meeting" | "quantum" | "audit";
  color: string;
}

const generateMockEvents = (currentDate: Date): CalendarEvent[] => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  return [
    {
      id: "1",
      title: "Sys Maintenance",
      start: new Date(year, month, 2),
      end: new Date(year, month, 4),
      type: "maintenance",
      color: "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-l-2 border-pink-500" 
    },
    {
      id: "2",
      title: "v2.0 Release",
      start: new Date(year, month, 2),
      end: new Date(year, month, 5),
      type: "release",
      color: "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-l-2 border-orange-500"
    },
    {
      id: "3",
      title: "Team Sync",
      start: new Date(year, month, 4),
      end: new Date(year, month, 5),
      type: "meeting",
      color: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-l-2 border-emerald-500"
    },
     { 
      id: "4",
      title: "Audit Review",
      start: new Date(year, month, 5),
      end: new Date(year, month, 7),
      type: "audit",
      color: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-l-2 border-indigo-500"
    },
    {
      id: "5",
      title: "Quantum Job",
      start: new Date(year, month, 8),
      end: new Date(year, month, 14),
      type: "quantum",
      color: "bg-primary/10 text-primary dark:text-primary border-l-2 border-primary"
    },
    {
       id: "6",
       title: "Design",
       start: new Date(year, month, 8),
       end: new Date(year, month, 8),
       type: "meeting",
       color: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500"
    },
    {
       id: "7",
       title: "Client",
       start: new Date(year, month, 8),
       end: new Date(year, month, 8),
       type: "meeting",
       color: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-l-2 border-purple-500"
    },
    {
      id: "9",
      title: "Migration",
      start: new Date(year, month, 22),
      end: new Date(year, month, 24),
      type: "maintenance",
      color: "bg-red-500/10 text-red-700 dark:text-red-300 border-l-2 border-red-500"
    },
    {
      id: "10",
      title: "Test Phase",
      start: new Date(year, month, 25),
      end: new Date(year, month, 26),
      type: "release",
      color: "bg-teal-500/10 text-teal-700 dark:text-teal-300 border-l-2 border-teal-500"
    },
     {
      id: "11",
      title: "Calibration",
      start: new Date(year, month, 24),
      end: new Date(year, month, 26),
      type: "quantum",
      color: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-l-2 border-slate-500"
    },
    {
      id: "12",
      title: "Long Task",
      start: new Date(year, month, 27),
      end: new Date(year, month, 30), 
      type: "quantum",
      color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-l-2 border-yellow-500"
    },
  ];
};

export function RealTimeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const events = generateMockEvents(currentDate);

  // Group days into weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  calendarDays.forEach((day) => {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Helper to render events for a day
  const renderEventsForDay = (day: Date) => {
    const dayEvents = events.filter(event => 
      isSameDay(day, event.start) || 
      (day > event.start && day <= event.end)
    );

    // Limit visible events for density
    const topEvents = dayEvents.slice(0, 3);
    const overflow = dayEvents.length - 3;

    return (
      <div className="flex flex-col gap-0.5 mt-1 w-full px-0.5">
        {topEvents.map((event, idx) => {
             const isStart = isSameDay(day, event.start);
             const isEnd = isSameDay(day, event.end);
             
             return (
              <div 
                key={`${event.id}-${day.toISOString()}`}
                className={cn(
                  "h-5 rounded-[2px] w-full text-[9px] leading-5 px-1.5 overflow-hidden whitespace-nowrap font-medium transition-all hover:brightness-110 cursor-pointer",
                  event.color,
                  isStart ? "rounded-l-sm ml-0.5 border-l-2" : "border-l-0 ml-0 rounded-l-none",
                  isEnd ? "rounded-r-sm mr-0.5" : "mr-0 rounded-r-none",
                )}
                title={event.title}
              >
                  {/* Show title if it's the start or first day of week */}
                  {(isStart || day.getDay() === 0) && <span className="truncate block">{event.title}</span>}
              </div>
             )
        })}
        {overflow > 0 && (
          <div className="text-[8px] font-bold text-muted-foreground pl-1 mt-0.5">
            +{overflow} more
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="h-full border-0 shadow-sm bg-card/40 backdrop-blur-xl group overflow-hidden flex flex-col relative w-full rounded-2xl ring-1 ring-border/50">
       {/* Decorative Gradient Border Left - Thinner and more subtle */}
       <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-cyan-500 via-violet-500 to-fuchsia-500 z-20" />

      <CardContent className="p-0 flex flex-col h-full bg-background/20">
        {/* Compact Header */}
        <div className="flex items-center justify-between py-3 px-5 border-b border-border/10 bg-muted/10">
          <h2 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-primary/10 rounded-lg w-7 h-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-primary/10 rounded-lg w-7 h-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 flex flex-col select-none">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-border/10 bg-muted/20">
            {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
              <div key={day} className="py-1.5 text-center text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid - Auto Fill Height */}
          <div className="flex-1 grid grid-rows-5 sm:grid-rows-5"> 
             {weeks.slice(0, 5).map((week, wIndex) => ( // Force 5 rows for consistency
               <div key={wIndex} className="grid grid-cols-7 border-b border-border/10 last:border-0 h-full min-h-[90px]">
                 {week.map((day, dIndex) => {
                   const isCurrentMonth = isSameMonth(day, currentDate);
                   const isTodayDate = isToday(day);

                   return (
                     <div 
                       key={dIndex} 
                       className={cn(
                         "relative p-1 border-r border-border/10 last:border-0 hover:bg-muted/10 transition-colors flex flex-col items-start gap-0.5",
                         !isCurrentMonth && "bg-muted/5 opacity-30 text-muted-foreground pointer-events-none"
                       )}
                     >
                        <div className="w-full flex justify-center mb-0.5">
                            <span 
                                className={cn(
                                "text-[10px] font-semibold w-5 h-5 flex items-center justify-center rounded-full transition-all",
                                isTodayDate 
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-110" 
                                    : "text-foreground/70"
                                )}
                            >
                                {format(day, "d")}
                            </span>
                        </div>
                        
                        {/* Events Container */}
                        {renderEventsForDay(day)}
                     </div>
                   );
                 })}
               </div>
             ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
