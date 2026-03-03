"use client";

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Events() {
  const [currentCalendarView, setCurrentCalendarView] = useState(0); // 0 = Jan-Jun, 1 = Jul-Dec

  const allMonths = [
    'JANUARY', 'FEBRUARY', 'MARCH',
    'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER',
    'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const firstHalfMonths = allMonths.slice(0, 6);
  const secondHalfMonths = allMonths.slice(6, 12);

  const displayMonths = currentCalendarView === 0 ? firstHalfMonths : secondHalfMonths;

  const year = 2026;

  // Event dates for highlighting (example: {month: 0-11, day: 1-31})
  const eventDates = [
    { month: 4, day: 20 }, // May 20, Regalo Eskwela
    { month: 5, day: 5 },  // Jun 5, Tree Planting
    { month: 6, day: 15 }, // Jul 15, First Aid Workshop
    { month: 7, day: 12 }, // Aug 12, Youth Got Talent
    { month: 8, day: 1 },  // Sep 1, Liga
    { month: 8, day: 2 },  // Sep 2, Liga
    { month: 8, day: 3 },  // Sep 3, Liga
    { month: 8, day: 4 },  // Sep 4, Liga
    { month: 8, day: 5 },  // Sep 5, Liga
    { month: 10, day: 18 }, // Nov 18
    { month: 10, day: 19 }, // Nov 19
    { month: 10, day: 20 }, // Nov 20
    { month: 10, day: 25 }, // Nov 25
    { month: 11, day: 15 }, // Dec 15
    { month: 11, day: 23 }, // Dec 23
    { month: 11, day: 28 }, // Dec 28
    { month: 11, day: 30 }  // Dec 30
  ];

  const hasEvent = (monthIndex: number, day: number) => {
    return eventDates.some(event => event.month === monthIndex && event.day === day);
  };

  const getDaysInMonth = (year: number, monthIndex: number) => {
    return new Date(year, monthIndex + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (year: number, monthIndex: number) => {
      return new Date(year, monthIndex, 1).getDay();
  };

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
                {currentCalendarView === 0 ? `January - June ${year}` : `July - December ${year}`}
              </h3>
              <button
                onClick={() => setCurrentCalendarView(1)}
                disabled={currentCalendarView === 1}
                className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {displayMonths.map((month, index) => {
                const actualMonthIndex = currentCalendarView === 0 ? index : index + 6;
                const daysInMonth = getDaysInMonth(year, actualMonthIndex);
                const firstDay = getFirstDayOfMonth(year, actualMonthIndex);

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
          <div className="h-full flex flex-col justify-between">
             <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">May {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">May 20, {year}</span> - Regalo Eskwela
                </li>
              </ul>
            </div>
             <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">June {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">June 5, {year}</span> - Tree Planting
                </li>
              </ul>
            </div>
             <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">July {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">July 15, {year}</span> - First Aid Workshop
                </li>
              </ul>
            </div>
             <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">August {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">August 12, {year}</span> - Youth Got Talent
                </li>
              </ul>
            </div>
             <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">September {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">September 1-5, {year}</span> - Liga (Sportsfest)
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">November {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">November 18-20, {year}</span> - November Market Fever
                </li>
                <li>
                  <span className="font-bold text-foreground">November 25, {year}</span> - Community Meeting
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-4xl text-primary mb-4 font-headline">December {year}</h2>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>
                  <span className="font-bold text-foreground">December 15, {year}</span> - Parol Making Contest
                </li>
                <li>
                  <span className="font-bold text-foreground">December 23, {year}</span> - Distribution of Gifts among Children
                </li>
                <li>
                  <span className="font-bold text-foreground">December 28, {year}</span> - Mrs. and Mr. Rivera Wedding Venue
                </li>
                <li>
                  <span className="font-bold text-foreground">December 30, {year}</span> - Community Party
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
