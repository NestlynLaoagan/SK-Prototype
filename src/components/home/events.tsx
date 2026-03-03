"use client";

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Loader } from 'lucide-react';
import { useFirebase, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import type { Event as EventType } from '@/lib/types';
import { format, parseISO, getMonth, getDate, getYear } from 'date-fns';

type EventDate = {
    month: number;
    day: number;
}

export function Events() {
  const [currentCalendarView, setCurrentCalendarView] = useState(0); // 0 = Jan-Jun, 1 = Jul-Dec

  const { firestore } = useFirebase();
  const eventsCollectionRef = useMemoFirebase(
    () => firestore ? query(collection(firestore, 'events'), orderBy('start', 'asc')) : null,
    [firestore]
  );
  const { data: events, isLoading } = useCollection<EventType>(eventsCollectionRef);

  const allMonths = [
    'JANUARY', 'FEBRUARY', 'MARCH',
    'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER',
    'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const firstHalfMonths = allMonths.slice(0, 6);
  const secondHalfMonths = allMonths.slice(6, 12);

  const displayMonths = currentCalendarView === 0 ? firstHalfMonths : secondHalfMonths;

  const currentYear = new Date().getFullYear();

  const eventDates = useMemo(() => {
    if (!events) return [];
    return events.map(event => {
        const startDate = parseISO(event.start);
        if(getYear(startDate) !== currentYear) return null;
        return {
            month: getMonth(startDate),
            day: getDate(startDate)
        }
    }).filter((d): d is EventDate => d !== null);
  }, [events, currentYear]);

  const hasEvent = (monthIndex: number, day: number) => {
    return eventDates.some(event => event.month === monthIndex && event.day === day);
  };

  const getDaysInMonth = (year: number, monthIndex: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, monthIndex: number) => {
      return new Date(year, monthIndex, 1).getDay();
  };

  const eventsByMonth = useMemo(() => {
    if (!events) return {};
    return events.reduce((acc, event) => {
        const monthName = format(parseISO(event.start), 'MMMM');
        if (!acc[monthName]) {
            acc[monthName] = [];
        }
        acc[monthName].push(event);
        return acc;
    }, {} as Record<string, EventType[]>);
  }, [events]);

  return (
    <section id="events" className="w-full py-16 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-3 mb-12">
          <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-4xl md:text-5xl">Events</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            This calendar outlines the scheduled events at the Bakakeng Central Basketball Court.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[3fr_1fr] gap-12 max-w-7xl mx-auto">
          {/* Calendar Carousel Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentCalendarView(0)}
                disabled={currentCalendarView === 0}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h3 className="text-xl font-medium">
                {currentCalendarView === 0 ? `January - June ${currentYear}` : `July - December ${currentYear}`}
              </h3>
              <button
                onClick={() => setCurrentCalendarView(1)}
                disabled={currentCalendarView === 1}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            {isLoading && <div className="flex justify-center items-center h-96"><Loader className="w-8 h-8 animate-spin" /></div>}

            {!isLoading && 
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {displayMonths.map((month, index) => {
                const actualMonthIndex = currentCalendarView === 0 ? index : index + 6;
                const daysInMonth = getDaysInMonth(currentYear, actualMonthIndex);
                const firstDay = getFirstDayOfMonth(currentYear, actualMonthIndex);

                const emptyDays = Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`}></div>);
                
                const monthDays = Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isEventDay = hasEvent(actualMonthIndex, day);
                    return (
                        <div key={day} className={`flex items-center justify-center text-sm h-8 w-8`}>
                            {isEventDay ? (
                                <div className="flex items-center justify-center w-7 h-7 bg-primary text-primary-foreground rounded-full">
                                    {day}
                                </div>
                            ) : (
                                day
                            )}
                        </div>
                    );
                });

                const days = [...emptyDays, ...monthDays];

                return (
                  <div key={month} className="bg-card border rounded-lg p-3 shadow-sm transition-transform duration-300 ease-in-out hover:scale-[1.2] hover:shadow-2xl relative hover:z-20">
                    <div className="bg-accent text-accent-foreground text-center font-semibold py-1 mb-2 rounded">
                      {month}
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-xs text-center text-muted-foreground font-medium mb-2">
                      <div>S</div>
                      <div>M</div>
                      <div>T</div>
                      <div>W</div>
                      <div>T</div>
                      <div>F</div>
                      <div>S</div>
                    </div>
                    <div className="grid grid-cols-7 gap-y-1 text-sm text-center">
                      {days}
                    </div>
                  </div>
                );
              })}
            </div>
            }
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentCalendarView(0)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentCalendarView === 0 ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground/50'
                }`}
              />
              <button
                onClick={() => setCurrentCalendarView(1)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentCalendarView === 1 ? 'bg-primary w-6' : 'bg-muted hover:bg-muted-foreground/50'
                }`}
              />
            </div>
          </div>

          {/* Events List */}
          <div className="h-full flex flex-col justify-start space-y-8">
            {isLoading && <div className="flex justify-center items-center h-full"><Loader className="w-8 h-8 animate-spin"/></div>}
            {!isLoading && Object.keys(eventsByMonth).length === 0 && <p className="text-muted-foreground text-center">No events scheduled for this year.</p>}
            {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                 <div key={month}>
                    <h2 className="text-4xl text-primary mb-4 font-headline">{month} {currentYear}</h2>
                    <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                        {monthEvents.map(event => (
                            <li key={event.id}>
                                <span className="font-bold text-foreground">{format(parseISO(event.start), 'MMM d, yyyy')}</span> - {event.title}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
