// pages/games/index.js
import Link from 'next/link';
import { FaGamepad } from 'react-icons/fa';
import PageTransition from '../../components/PageTransition';

const GamesPage = () => {
  const gameItems = [
    {
      title: '打地鼠',
      description: '经典游戏，点击出现的地鼠得分，小心假地鼠！',
      icon: FaGamepad,
      path: '/games/whack-a-mole',
      color: 'bg-green-500'
    },
    // 可以在这里添加更多游戏...
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-4 lg:py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-4 lg:mb-6">游戏列表</h1>
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {gameItems.map((item, index) => (
              <Link
                key={index}
                href={item.path}
                className="block transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="bg-white rounded-xl shadow p-4 h-full">
                  <div className={`inline-flex p-2 rounded-lg ${item.color} text-white mb-3`}>
                    <item.icon className="text-xl" />
                  </div>
                  <h2 className="text-base font-bold text-gray-800 mb-1">
                    {item.title}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default GamesPage;