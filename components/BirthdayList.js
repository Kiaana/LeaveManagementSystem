// components/BirthdayList.js
import { FaSpinner } from 'react-icons/fa';

const BirthdayList = ({ birthdays = [], loading = false, emptyMessage = "暂无数据" }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <FaSpinner className="animate-spin text-gray-400 text-2xl" />
      </div>
    );
  }

  if (!birthdays.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {birthdays.map(person => (
        <div 
          key={person.id}
          className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex-1">
            <h3 className="font-medium text-lg">{person.name}</h3>
            <div className="mt-1 space-y-1 text-sm text-gray-500">
              <p>
                {person.isLunar ? '农历' : '阳历'}：
                {person.isLunar ? person.lunarBirthday : person.birthday}
              </p>
              <p>{person.age} 岁</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BirthdayList;