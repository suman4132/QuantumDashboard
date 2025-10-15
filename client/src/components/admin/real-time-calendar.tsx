import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: "maintenance" | "release" | "meeting" | "quantum";
  attendees?: number;
  description: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "System Maintenance",
    date: new Date(2025, 9, 15),
    time: "02:00 AM",
    type: "maintenance",
    description: "Scheduled backend upgrade"
  },
  {
    id: "2",
    title: "Quantum Feature Release",
    date: new Date(2025, 9, 15),
    time: "10:00 AM",
    type: "release",
    attendees: 45,
    description: "New quantum algorithm features"
  },
  {
    id: "3",
    title: "Team Standup",
    date: new Date(2025, 9, 16),
    time: "09:00 AM",
    type: "meeting",
    attendees: 12,
    description: "Daily team sync"
  },
  {
    id: "4",
    title: "QPU Calibration",
    date: new Date(2025, 9, 18),
    time: "03:00 PM",
    type: "quantum",
    description: "Quantum processor recalibration"
  },
  {
    id: "5",
    title: "Premium User Webinar",
    date: new Date(2025, 9, 20),
    time: "02:00 PM",
    type: "meeting",
    attendees: 150,
    description: "Advanced quantum computing workshop"
  },
  {
    id: "6",
    title: "Platform Update v2.5",
    date: new Date(2025, 9, 22),
    time: "12:00 PM",
    type: "release",
    description: "Major platform improvements"
  },
];

const eventTypeColors = {
  maintenance: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
  release: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
  meeting: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/20" },
  quantum: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
};

export function RealTimeCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const hasEvent = (day: number) => {
    return mockEvents.some(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return mockEvents.filter(
      (event) =>
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
    );
  };

  const getEventIcon = (type: CalendarEvent["type"]) => {
    switch (type) {
      case "quantum":
        return <Zap className="h-3 w-3" />;
      case "meeting":
        return <Users className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const selectedEvents = getEventsForDate(selectedDate);
  const upcomingEvents = mockEvents
    .filter((e) => e.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  return (
    <Card className="border-2 hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-6 w-6 text-purple-500" />
              Event Calendar
            </CardTitle>
            <CardDescription className="mt-1">
              Scheduled events and system activities
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-1 border-emerald-500/50 text-emerald-600 dark:text-emerald-400">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{monthName}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={previousMonth}
                  className="h-8 w-8"
                  data-testid="button-prev-month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8"
                  data-testid="button-next-month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground p-2">
                  {day}
                </div>
              ))}

              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="p-2" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();
                const isSelected =
                  selectedDate &&
                  day === selectedDate.getDate() &&
                  currentDate.getMonth() === selectedDate.getMonth() &&
                  currentDate.getFullYear() === selectedDate.getFullYear();
                const hasEventOnDay = hasEvent(day);

                return (
                  <motion.button
                    key={day}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(date)}
                    className={`
                      relative p-2 rounded-lg text-sm font-medium transition-all
                      ${isToday ? "bg-primary text-primary-foreground" : ""}
                      ${isSelected ? "ring-2 ring-primary" : ""}
                      ${!isToday && !isSelected ? "hover:bg-accent" : ""}
                    `}
                    data-testid={`calendar-day-${day}`}
                  >
                    {day}
                    {hasEventOnDay && !isToday && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-3">
                {selectedDate
                  ? `Events on ${selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                  : "Upcoming Events"}
              </h4>
              <ScrollArea className="h-[280px]">
                <div className="space-y-2">
                  {(selectedDate ? selectedEvents : upcomingEvents).length > 0 ? (
                    (selectedDate ? selectedEvents : upcomingEvents).map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg border-2 ${eventTypeColors[event.type].bg} ${eventTypeColors[event.type].border}`}
                        data-testid={`event-item-${event.id}`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`mt-0.5 ${eventTypeColors[event.type].text}`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                            {event.attendees && (
                              <div className="flex items-center gap-1 mt-1">
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                              </div>
                            )}
                          </div>
                          <Badge variant="outline" className={`text-[10px] ${eventTypeColors[event.type].text}`}>
                            {event.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">No events scheduled</p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
