// pages/games/whack-a-mole.js
import { useState, useEffect, useCallback } from 'react';
import PageTransition from '../../components/PageTransition';
import Image from 'next/image';
import mole1 from '../../public/moles/mole1.webp';
import mole2 from '../../public/moles/mole2.webp';
// import mole3 from '../../public/moles/mole3.png';
// import mole4 from '../../public/moles/mole4.png';
// import mole5 from '../../public/moles/mole5.png';
import { Howl } from 'howler';

const moleImages = [mole1, mole2]; // 多种地鼠图片数组

const WhackAMole = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 增加游戏时间到60秒
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMoles, setActiveMoles] = useState([]); // 支持多个地鼠
  const [highScore, setHighScore] = useState(0);
  const [normalMoleImage, setNormalMoleImage] = useState(moleImages[0]); // 真地鼠图片
  const [fakeMoleImage, setFakeMoleImage] = useState(moleImages[1]); // 假地鼠图片
  const [level, setLevel] = useState(1);
  const [maxMoles, setMaxMoles] = useState(2); // 初始允许2个地鼠
  const [moleInterval, setMoleInterval] = useState(1200); // 地鼠出现间隔
  const [combo, setCombo] = useState(0);
  const [lastWhackTime, setLastWhackTime] = useState(0);
  const [gameStats, setGameStats] = useState(null);

  // 初始化高分
  useEffect(() => {
    const savedHighScore = localStorage.getItem('whackAMoleHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
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

  // 游戏计时器
  useEffect(() => {
    let timer;
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleGameEnd();
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
          // 如果已达到最大数量，不再添加
          if (prev.length >= maxMoles) return prev;

          // 获取当前已占用的位置
          const occupiedPositions = prev.map(mole => mole.position);

          // 找到一个未被占用的随机位置
          let position;
          do {
            position = Math.floor(Math.random() * 9);
          } while (occupiedPositions.includes(position));

          const isFake = Math.random() < 0.2; // 20%概率是假地鼠
          const newMole = {
            id: Date.now(),
            position: position, // 使用未占用的位置
            type: isFake ? 'fake' : 'normal',
          };

          playSound('pop');
          return [...prev, newMole];
        });
      }, moleInterval);
    }
    return () => clearInterval(moleTimer);
  }, [isPlaying, maxMoles, moleInterval]);

  // 地鼠自动隐藏
  useEffect(() => {
    activeMoles.forEach((mole) => {
      const hideTimer = setTimeout(() => {
        setActiveMoles((prev) => prev.filter((m) => m.id !== mole.id));
        if (mole.type === 'fake') {
          // 误点击惩罚
          setScore((prev) => Math.max(prev - 1, 0));
          setCombo(0);
          playSound('mistake');
        }
      }, 1000 + Math.random() * 1000); // 地鼠停留时间随机
      return () => clearTimeout(hideTimer);
    });
  }, [activeMoles]);

  // 开始游戏
  const startGame = () => {
    setScore(0);
    setTimeLeft(60); // 设置游戏时长
    setIsPlaying(true);
    setActiveMoles([]);
    setLevel(1);
    setMaxMoles(2); // 初始允许2个地鼠
    setMoleInterval(1200); // 初始间隔1200ms
    setCombo(0);
    setLastWhackTime(0);
    setGameStats(null);
  };

  // 游戏结束处理
  const handleGameEnd = () => {
    setIsPlaying(false);
    updateHighScore(score);
    setGameStats({
      finalScore: score,
      maxCombo: combo,
      totalLevel: level,
    });
    setActiveMoles([]);
    setCombo(0);
    setLastWhackTime(0);
  };

  // 打地鼠
  const whackMole = (id, type) => {
    if (!isPlaying) return;

    const currentTime = Date.now();
    const timeSinceLastWhack = currentTime - lastWhackTime;

    setActiveMoles((prev) => prev.filter((m) => m.id !== id));

    if (type === 'normal') {
      // 基础分数
      let pointsToAdd = 1;

      // 连击奖励
      if (timeSinceLastWhack < 1000) { // 1秒内连续打中
        const newCombo = combo + 1;
        setCombo(newCombo);
        if (newCombo >= 5) {
          pointsToAdd += 5; // 连击达到5，额外奖励5分
          playSound('combo');
          setCombo(0); // 重置连击
        }
      } else {
        setCombo(1);
      }

      setScore((prev) => prev + pointsToAdd);
      setLastWhackTime(currentTime);
      playSound('whack');

      // 升级逻辑调整
      if ((score + pointsToAdd) % 10 === 0) { // 每10分升级一次
        setLevel((prev) => prev + 1);
        setMaxMoles((prev) => Math.min(prev + 1, 5)); // 最多5个地鼠
        setMoleInterval((prev) => Math.max(400, prev - 150)); // 最小间隔400ms
      }
    } else if (type === 'fake') {
      // 惩罚机制
      setScore((prev) => Math.max(prev - 2, 0));
      setCombo(0);
      playSound('mistake');
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
    }
    sound?.play();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white py-8 px-4 flex flex-col items-center">
        <div className="max-w-md w-full">
          {/* 计分板升级 */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
            <div className="text-2xl font-bold mb-2">得分: {score}</div>
            <div className="text-xl mb-2">最高分: {highScore}</div>
            <div className="text-xl text-blue-600">剩余时间: {timeLeft}秒</div>
            <div className="mt-2">关卡: {level}</div>
            <div className="mt-2">
              <span className={`inline-block px-3 py-1 rounded-full ${combo >= 5 ? 'bg-yellow-400 text-white animate-pulse' : 'bg-gray-200'
                }`}>
                连击: {combo}
              </span>
            </div>
          </div>

          {/* 游戏结束统计 */}
          {gameStats && !isPlaying && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6 text-center">
              <h2 className="text-2xl font-bold mb-4">游戏结束!</h2>
              <div className="space-y-2">
                <p>最终得分: {gameStats.finalScore}</p>
                <p>最大连击: {gameStats.maxCombo}</p>
                <p>最终关卡: {gameStats.totalLevel}</p>
              </div>
            </div>
          )}

          {/* 地鼠图片选择 */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
            <h2 className="text-xl font-semibold mb-4">选择地鼠形象</h2>

            {/* 真地鼠选择 */}
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2 text-green-600">真地鼠</h3>
              <div className="flex justify-around">
                {moleImages.map((img, index) => (
                  <button
                    key={`normal-${index}`}
                    onClick={() => setNormalMoleImage(img)}
                    className={`border-2 rounded-full p-1 ${normalMoleImage === img ? 'border-green-500' : 'border-transparent'
                      }`}
                  >
                    <Image src={img} alt={`Normal Mole ${index + 1}`} width={50} height={50} />
                  </button>
                ))}
              </div>
            </div>

            {/* 假地鼠选择 */}
            <div>
              <h3 className="text-lg font-medium mb-2 text-red-600">假地鼠</h3>
              <div className="flex justify-around">
                {moleImages.map((img, index) => (
                  <button
                    key={`fake-${index}`}
                    onClick={() => setFakeMoleImage(img)}
                    className={`border-2 rounded-full p-1 ${fakeMoleImage === img ? 'border-red-500' : 'border-transparent'
                      }`}
                  >
                    <Image src={img} alt={`Fake Mole ${index + 1}`} width={50} height={50} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 游戏区域 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[...Array(9)].map((_, index) => (
              <div
                key={index}
                className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-md"
              >
                {activeMoles
                  .filter((mole) => mole.position === index)
                  .map((mole) => (
                    <Image
                      key={mole.id}
                      src={mole.type === 'normal' ? normalMoleImage : fakeMoleImage}
                      alt={mole.type === 'normal' ? 'Normal Mole' : 'Fake Mole'}
                      layout="fill"
                      objectFit="contain"
                      className={`transition-transform duration-200 transform hover:scale-110 cursor-pointer ${mole.type === 'fake' ? 'opacity-80 rotate-12' : ''
                        }`}
                      onClick={() => whackMole(mole.id, mole.type)}
                    />
                  ))}
              </div>
            ))}
          </div>

          {/* 控制按钮 */}
          <button
            onClick={startGame}
            disabled={isPlaying}
            className={`w-full py-3 rounded-lg text-white font-bold text-lg transition-colors duration-200
              ${isPlaying ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isPlaying ? '游戏进行中...' : '开始游戏'}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default WhackAMole;