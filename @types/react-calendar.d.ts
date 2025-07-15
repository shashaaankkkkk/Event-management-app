declare module 'react-calendar' {
  import * as React from 'react';
  export interface CalendarProps {
    onChange?: (date: Date) => void;
    value?: Date;
    className?: string;
    [key: string]: any;
  }
  const Calendar: React.FC<CalendarProps>;
  export default Calendar;
} 