// pages/games/whack-a-mole.js
import { useState, useEffect, useCallback } from 'react';
import PageTransition from '../../components/PageTransition';
import Image from 'next/image';
import mole1 from '../../public/moles/mole1.webp'; // 普通地鼠
import mole2 from '../../public/moles/mole2.webp'; // 假地鼠
import mole3 from '../../public/moles/mole3.webp'; // 金色地鼠
import mole4 from '../../public/moles/mole4.webp'; // 炸弹地鼠
import { Howl } from 'howler';

const moleTypes = {
  normal: {
    image: mole1,
    score: 1,
    description: '普通地鼠：点击得1分',
  },
  fake: {
    image: mole2,
    score: -1,
    description: '假地鼠：点击扣1分',
  },
  gold: {
    image: mole3,
    score: 2,
    description: '金色地鼠：点击得2分',
  },
  bomb: {
    image: mole4,
    score: -5,
    description: '炸弹地鼠：点击扣5分',
  },
};

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 游戏时间设定为60秒
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMoles, setActiveMoles] = useState([]); // 支持多个地鼠
  const [level, setLevel] = useState(1); // 游戏关卡
  const [maxMoles, setMaxMoles] = useState(2); // 初始最多显示2个地鼠
  const [moleInterval, setMoleInterval] = useState(1200); // 地鼠出现的间隔
  const [combo, setCombo] = useState(0); // 连击
  const [lastWhackTime, setLastWhackTime] = useState(0); // 上次打击的时间
  const [maxCombo, setMaxCombo] = useState(0);

  // 初始化高分
  useEffect(() => {
    const savedHighScore = localStorage.getItem('whackAMoleHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, []);

  // 更新高分
  const updateHighScore = useCallback(
    (newScore) => {
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('whackAMoleHighScore', newScore.toString());
      }
    },
    [highScore]
  );

  // 开始游戏
  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setActiveMoles([]);
    setLevel(1);
    setMaxMoles(2);
    setMoleInterval(1200);
    setCombo(0);
    setMaxCombo(0); // 重置最高连击
    setLastWhackTime(0);
  };

  // 游戏结束处理
  const handleGameEnd = () => {
    setIsPlaying(false);
    updateHighScore(score);
    setActiveMoles([]);
    // 不重置最高连击，用于显示在结果界面
    setLastWhackTime(0);
  };

  // 游戏计时器
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  // 地鼠出现逻辑
  useEffect(() => {
    let moleTimer;
    if (isPlaying) {
      moleTimer = setInterval(() => {
        setActiveMoles((prev) => {
          if (prev.length >= maxMoles) return prev;

          // 获取当前已占用的位置
          const occupiedPositions = prev.map((mole) => mole.position);

          // 随机选择一个未被占用的空位置
          let position;
          do {
            position = Math.floor(Math.random() * 9);
          } while (occupiedPositions.includes(position));

          // 定义不同地鼠的概率
          const rand = Math.random();
          let type = 'normal';
          if (rand < 0.05) {
            type = 'gold'; // 5%概率生成金色地鼠
          } else if (rand < 0.10) {
            type = 'bomb'; // 5%概率生成炸弹地鼠
          } else if (rand < 0.30) {
            type = 'fake'; // 20%概率生成假地鼠
          }

          const newMole = {
            id: Date.now() + Math.random(), // 确保唯一
            position: position, // 使用未占用的位置
            type: type,
          };

          playSound('pop');
          return [...prev, newMole];
        });
      }, moleInterval);
    }
    return () => clearInterval(moleTimer);
  }, [isPlaying, maxMoles, moleInterval]);

  // 修改地鼠自动隐藏的逻辑
  useEffect(() => {
    const timers = activeMoles.map(mole => {
      const hideTimer = setTimeout(() => {
        // 首先检查这个地鼠是否还存在（没有被点击消失）
        setActiveMoles(prev => {
          const stillExists = prev.some(m => m.id === mole.id);

          // 如果地鼠还存在（未被点击），则需要进行惩罚
          if (stillExists && (mole.type === 'normal' || mole.type === 'gold')) {
            // 扣分
            // setScore(prev => Math.max(prev - 1, 0));
            // 减少时间
            setTimeLeft(prev => Math.max(prev - 2, 0));
            // 重置连击
            setCombo(0);
            // 播放错过音效
            playSound('mistake');
          }

          // 移除这个地鼠
          return prev.filter(m => m.id !== mole.id);
        });
      }, 1000 + Math.random() * 1000);

      return () => clearTimeout(hideTimer);
    });

    // 清理所有计时器
    return () => timers.forEach(timer => clearTimeout(timer));
  }, [activeMoles]);

  // 打击地鼠
  const whackMole = (id, type) => {
    if (!isPlaying) return;

    const currentTime = Date.now();
    const timeSinceLastWhack = currentTime - lastWhackTime;

    // 找到被点击的地鼠
    const clickedMole = activeMoles.find((mole) => mole.id === id);
    if (!clickedMole) return;

    // 移除被打击的地鼠
    setActiveMoles((prev) => prev.filter((m) => m.id !== id));

    if (type === 'normal' || type === 'gold') {
      let pointsToAdd = moleTypes[type].score; // 基础得分

      // 连击奖励
      if (timeSinceLastWhack < 1000) { // 1秒内连续打击
        setCombo(prev => {
          const newCombo = prev + 1;
          // 更新最高连击
          if (newCombo > maxCombo) {
            setMaxCombo(newCombo);
          }
          // 连击达到5次给予额外奖励
          if (newCombo >= 5) {
            pointsToAdd += 5;
            playSound('combo');
            return 0; // 重置连击
          }
          return newCombo;
        });
      } else {
        setCombo(1);
      }

      setScore(prev => prev + pointsToAdd);
      setLastWhackTime(currentTime);

      // 增加时间奖励
      setTimeLeft(prev => Math.min(prev + 1, 99)); // 限制最大时间为99秒

      // 升级机制
      const pointsForLevelUp = type === 'normal' ? 10 : 15;
      if ((score + pointsToAdd) >= pointsForLevelUp * level) {
        setLevel(prev => prev + 1);
        setMaxMoles(prev => Math.min(prev + 1, 7));
        setMoleInterval(prev => Math.max(300, prev - 100));
      }

      playSound('whack');
    } else if (type === 'fake') {
      setScore(prev => Math.max(prev + moleTypes[type].score, 0));
      setCombo(0);
      playSound('mistake');
    } else if (type === 'bomb') {
      setScore(prev => Math.max(prev + moleTypes[type].score, 0));
      setCombo(0);
      playSound('bomb');
    }
  };


  // 声音播放
  const playSound = (type) => {
    let sound;
    if (type === 'pop') {
      sound = new Howl({ src: ['/sounds/mole-pop.mp3'] });
    } else if (type === 'whack') {
      sound = new Howl({ src: ['/sounds/mole-whack.mp3'] });
    } else if (type === 'combo') {
      sound = new Howl({ src: ['/sounds/combo.mp3'] });
    } else if (type === 'mistake') {
      sound = new Howl({ src: ['/sounds/mistake.mp3'] });
    } else if (type === 'bomb') {
      sound = new Howl({ src: ['/sounds/bomb.mp3'] });
    }
    sound?.play();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-4 lg:py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧计分板 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <div className="text-3xl font-bold mb-4 text-center bg-blue-50 py-2 rounded-lg">
                  得分: {score}
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">最高分</span>
                    <span className="text-xl font-semibold">{highScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">剩余时间</span>
                    <span className="text-xl font-semibold text-blue-600">{timeLeft}秒</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">关卡</span>
                    <span className="text-xl font-semibold text-green-600">{level}</span>
                  </div>
                  <div className="flex justify-center mt-4">
                    <span className={`px-4 py-2 rounded-full text-lg font-medium ${combo >= 5
                      ? 'bg-yellow-400 text-white animate-pulse shadow-lg'
                      : 'bg-gray-100 text-gray-700'
                      }`}>
                      连击: {combo}
                    </span>
                  </div>
                </div>
              </div>

              {/* 地鼠类型说明 */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 lg:mb-0">
                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">地鼠类型说明</h2>
                <div className="space-y-4">
                  {Object.entries(moleTypes).map(([type, details]) => (
                    <div key={type} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-12 h-12 relative flex-shrink-0">
                        <Image
                          src={details.image}
                          alt={`${type} mole`}
                          layout="fill"
                          objectFit="contain"
                          className="rounded-full"
                        />
                      </div>
                      <span className="text-sm text-gray-700">{details.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧游戏区域 */}
            <div className="lg:col-span-2">
              {/* 游戏结束统计 */}
              {!isPlaying && timeLeft === 0 && (
                <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
                  <h2 className="text-3xl font-bold mb-6 text-blue-600">游戏结束!</h2>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-gray-600 mb-1">最终得分</div>
                      <div className="text-2xl font-bold">{score}</div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-gray-600 mb-1">最高连击</div>
                      <div className="text-2xl font-bold">{maxCombo}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-gray-600 mb-1">关卡</div>
                      <div className="text-2xl font-bold">{level}</div>
                    </div>
                  </div>
                  <button
                    onClick={startGame}
                    className="w-full py-3 rounded-lg text-white font-bold text-lg bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    重新开始
                  </button>
                </div>
              )}

              {/* 游戏界面 */}
              {isPlaying && (
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 9 }).map((_, index) => {
                    const mole = activeMoles.find((m) => m.position === index);
                    return (
                      <div
                        key={index}
                        className="relative aspect-square bg-gradient-to-br from-green-200 to-green-300 rounded-xl shadow-md overflow-hidden transform hover:scale-102 transition-transform duration-200"
                      >
                        {mole && (
                          <Image
                            src={moleTypes[mole.type].image}
                            alt={`${mole.type} mole`}
                            layout="fill"
                            objectFit="contain"
                            className={`transition-all duration-200 cursor-pointer
                          ${mole.type === 'fake'
                                ? 'opacity-90 hover:opacity-100 rotate-12 hover:rotate-0'
                                : 'hover:scale-110'
                              }`}
                            onClick={() => whackMole(mole.id, mole.type)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 控制按钮 */}
              {!isPlaying && timeLeft > 0 && (
                <button
                  onClick={startGame}
                  className="w-full mt-6 py-4 rounded-xl text-white font-bold text-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  开始游戏
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default WhackAMole;
