// components/Calendar.js
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';

const Calendar = ({ value, onChange, birthdays = [], loading = false }) => {
  const startOfMonth = value.startOf('month');
  const endOfMonth = value.endOf('month');
  const startDate = startOfMonth.startOf('week');
  const endDate = endOfMonth.endOf('week');

  const days = [];
  let day = startDate;
  
  while (day.isBefore(endDate) || day.isSame(endDate, 'day')) {
    days.push(day);
    day = day.add(1, 'day');
  }

  const hasBirthday = (date) => {
    return birthdays.some(person => 
      dayjs(person.birthday).format('MM-DD') === date.format('MM-DD')
    );
  };

  return (
    <div className="select-none">
      {/* 日历头部 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          {value.format('YYYY年 M月')}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onChange(value.subtract(1, 'month'))}
            className="p-1 rounded hover:bg-gray-100"
            disabled={loading}
          >
            <FaChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => onChange(value.add(1, 'month'))}
            className="p-1 rounded hover:bg-gray-100"
            disabled={loading}
          >
            <FaChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 星期标题 */}
      <div className="grid grid-cols-7 mb-2">
        {['日', '一', '二', '三', '四', '五', '六'].map(weekday => (
          <div
            key={weekday}
            className="text-center text-sm font-medium text-gray-500 py-2"
          >
            {weekday}
          </div>
        ))}
      </div>

      {/* 日历主体 */}
      <div className="grid grid-cols-7 gap-1">
        {days.map(date => {
          const isToday = date.isSame(dayjs(), 'day');
          const isCurrentMonth = date.isSame(value, 'month');
          const isSelected = date.isSame(value, 'day');
          const birthdayToday = hasBirthday(date);

          return (
            <button
              key={date.format()}
              onClick={() => onChange(date)}
              disabled={loading}
              className={`
                py-2 rounded-lg text-sm relative
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${isSelected ? 'bg-blue-100' : ''}
                ${!isSelected && 'hover:bg-gray-100'}
                ${loading ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span
                className={`
                  ${isToday ? 'bg-blue-500 text-white' : ''}
                  inline-flex items-center justify-center w-7 h-7 rounded-full
                `}
              >
                {date.format('D')}
              </span>
              {birthdayToday && (
                <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <span className="block w-1 h-1 rounded-full bg-pink-500"></span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;