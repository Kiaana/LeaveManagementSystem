import React, { useState, useEffect, useCallback } from 'react';
import PageTransition from '../../components/PageTransition';

// 卡片类型定义
const CARD_TYPES = ['🐑', '🐮', '🐷', '🐰', '🐶', '🐱', '🤡']
const CARDS_PER_TYPE = 30;
const MAX_STORAGE = 7;
const LAYERS = 5; // 总层数

// 游戏区域和卡片尺寸定义
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const CARD_SIZE = 80; // 卡片宽高相等

const YangGame = () => {
    const [tiles, setTiles] = useState([]); // 场上的卡片
    const [selectedTiles, setSelectedTiles] = useState([]); // 暂存区卡片
    const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'lost'
    const [remainingCards, setRemainingCards] = useState(CARDS_PER_TYPE * CARD_TYPES.length);
    const [showMessage, setShowMessage] = useState({ text: '', type: '' });
    const [isProcessing, setIsProcessing] = useState(false); // 添加点击锁状态

    const calculateGridSize = useCallback(() => {
        // 考虑到卡片横向和纵向都占用2格，以及需要留出边距
        const gridWidth = Math.floor((GAME_WIDTH - CARD_SIZE) / (CARD_SIZE / 2));
        const gridHeight = Math.floor((GAME_HEIGHT - CARD_SIZE) / (CARD_SIZE / 2));
        return {
            width: gridWidth,
            height: gridHeight
        };
    }, []);

    // 显示消息提示
    const showNotification = useCallback((text, type) => {
        setShowMessage({ text, type });
        setTimeout(() => setShowMessage({ text: '', type: '' }), 2000);
    }, []);

    // 判断两张卡片是否重叠
    const isOverlapping = useCallback((tile1, tile2) => {
        return !(
            tile1.x + tile1.width <= tile2.x ||
            tile1.x >= tile2.x + tile2.width ||
            tile1.y + tile1.height <= tile2.y ||
            tile1.y >= tile2.y + tile2.height
        );
    }, []);

    // 检查三消
    const checkMatch = useCallback((currentSelected) => {
        const len = currentSelected.length;
        if (len < 3) return;

        const lastThree = currentSelected.slice(-3);
        if (lastThree.every(tile => tile.type === lastThree[0].type)) {
            // 消除最后三张卡片
            const remainingTiles = currentSelected.slice(0, len - 3);
            setSelectedTiles(remainingTiles);
            showNotification('消除成功！', 'success');
        }
    }, [showNotification]);

    // 计算卡片遮挡关系
    const calculateBlocking = useCallback((currentTiles) => {
        // 按layer从高到低排序
        const sortedTiles = [...currentTiles].sort((a, b) => b.layer - a.layer);

        // 创建新的卡片数组，避免直接修改状态
        const updatedTiles = sortedTiles.map(tile => ({ ...tile, blocked: false }));

        // 检查每张卡片是否被上层卡片遮挡
        for (let i = 0; i < updatedTiles.length; i++) {
            const currentTile = updatedTiles[i];
            for (let j = 0; j < updatedTiles.length; j++) {
                if (updatedTiles[j].layer <= currentTile.layer) continue; // 只检查更高层的卡片
                if (isOverlapping(currentTile, updatedTiles[j])) {
                    updatedTiles[i].blocked = true;
                    break;
                }
            }
        }

        return updatedTiles;
    }, [isOverlapping]);

    // 检查三消
    const handleMatchCheck = useCallback((newSelectedTiles) => {
        checkMatch(newSelectedTiles);
    }, [checkMatch]);

    // 处理卡片点击
    const handleTileClick = useCallback((clickedTile) => {
        if (gameStatus !== 'playing' || clickedTile.blocked || isProcessing) return;
        setIsProcessing(true); // 开始处理时锁定

        if (selectedTiles.length >= MAX_STORAGE) {
            setGameStatus('lost');
            showNotification('暂存区已满，游戏结束！', 'error');
            setIsProcessing(false); // 解除锁定
            return;
        }

        // 先将卡片设置为透明并缩小
        const tileElement = document.getElementById(`tile-${clickedTile.id}`);
        if (tileElement) {
            tileElement.style.opacity = '0';
            tileElement.style.transform = 'scale(0.8)';
        }

        // 延迟更新状态，等待动画完成
        setTimeout(() => {
            setTiles(prevTiles => {
                const newTiles = prevTiles.filter(tile => tile.id !== clickedTile.id);
                return calculateBlocking(newTiles);
            });

            setSelectedTiles(prev => {
                const newSelectedTiles = [...prev, clickedTile];
                handleMatchCheck(newSelectedTiles);
                return newSelectedTiles;
            });

            setRemainingCards(prev => {
                const newCount = prev - 1;
                // 检查游戏胜利条件
                if (tiles.length === 1 && selectedTiles.length === 0) {
                    setGameStatus('won');
                    showNotification('恭喜通关！', 'success');
                }
                return Math.max(0, newCount); // 确保不会出现负数
            });

            setIsProcessing(false); // 完成处理后解除锁定
        }, 300);

    }, [tiles, selectedTiles, gameStatus, calculateBlocking, handleMatchCheck, showNotification, isProcessing]);

    // 初始化游戏
    const initGame = useCallback(() => {
        setIsProcessing(false);
        const { width: gridWidth, height: gridHeight } = calculateGridSize();
        
        const allCards = [];
        CARD_TYPES.forEach(type => {
            for (let i = 0; i < CARDS_PER_TYPE; i++) {
                allCards.push(type);
            }
        });
    
        const shuffledCards = [...allCards].sort(() => Math.random() - 0.5);
        const newTiles = [];
        let cardIndex = 0;
    
        // 创建网格占用状态数组
        const createEmptyGrid = () => {
            return Array(gridHeight).fill().map(() => Array(gridWidth).fill(false));
        };
    
        // 检查2x2区域是否可用
        const isAreaAvailable = (grid, row, col) => {
            if (row + 1 >= gridHeight || col + 1 >= gridWidth) return false;
            return !grid[row][col] && !grid[row][col + 1] &&
                   !grid[row + 1][col] && !grid[row + 1][col + 1];
        };
    
        // 标记2x2区域为已占用
        const markArea = (grid, row, col) => {
            grid[row][col] = true;
            grid[row][col + 1] = true;
            grid[row + 1][col] = true;
            grid[row + 1][col + 1] = true;
        };
    
        // 获取当前层可用的随机位置
        const getRandomAvailablePosition = (grid, isOddLayer) => {
            const available = [];
            const startOffset = isOddLayer ? 0 : 1;
            
            for (let row = startOffset; row < gridHeight - 1; row += 2) {
                for (let col = startOffset; col < gridWidth - 1; col += 2) {
                    if (isAreaAvailable(grid, row, col)) {
                        available.push({ row, col });
                    }
                }
            }
    
            if (available.length === 0) return null;
            return available[Math.floor(Math.random() * available.length)];
        };
    
        // 为每层生成卡片
        for (let layer = 0; layer < LAYERS; layer++) {
            const grid = createEmptyGrid();
            const isOddLayer = layer % 2 === 1;
            const maxCardsPerLayer = Math.floor((gridWidth * gridHeight) / 8); // 每个卡片占用4个格子
            const cardsPerLayer = Math.min(maxCardsPerLayer, Math.floor(shuffledCards.length / LAYERS));
            let placedCards = 0;
    
            while (placedCards < cardsPerLayer && cardIndex < shuffledCards.length) {
                const position = getRandomAvailablePosition(grid, isOddLayer);
                if (!position) break;
    
                const { row, col } = position;
                markArea(grid, row, col);
    
                // 计算实际位置
                const x = col * (CARD_SIZE / 2);
                const y = row * (CARD_SIZE / 2);
    
                newTiles.push({
                    id: cardIndex,
                    type: shuffledCards[cardIndex],
                    x,
                    y,
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                    layer,
                    row,
                    col,
                    blocked: false
                });
    
                cardIndex++;
                placedCards++;
            }
        }
    
        const tilesWithBlocking = calculateBlocking(newTiles);
        setTiles(tilesWithBlocking);
        setSelectedTiles([]);
        setGameStatus('playing');
        setRemainingCards(tilesWithBlocking.length);
    }, [calculateGridSize, calculateBlocking]);

    // 重新开始游戏
    const restartGame = useCallback(() => {
        initGame();
    }, [initGame]);

    // 初始化游戏
    useEffect(() => {
        initGame();
    }, [initGame]);

    return (
        <PageTransition>
            <div className="flex flex-col items-center min-h-screen bg-white">
                <div className="w-full max-w-4xl mx-auto px-4 py-6 lg:py-8">
                    {/* 游戏标题 */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-6">
                        羊了个羊
                    </h1>

                    {/* 消息提示 */}
                    {showMessage.text && (
                        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 
                            ${showMessage.type === 'error'
                                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                : 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                            } animate-fade-in`}>
                            {showMessage.text}
                        </div>
                    )}

                    {/* 状态栏 */}
                    <div className="flex flex-col sm:flex-row justify-between items-center w-full p-4 sm:p-5 mb-6 
                        bg-white backdrop-blur-md bg-opacity-90 rounded-xl shadow-lg gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">剩余卡片</span>
                            <span className="text-xl font-bold text-blue-600">{remainingCards}</span>
                        </div>
                        <button
                            onClick={restartGame}
                            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white 
                                rounded-xl hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 
                                transform hover:scale-105 active:scale-100 transition-all duration-200 text-lg font-medium 
                                shadow-md hover:shadow-lg"
                        >
                            重新开始
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">状态</span>
                            <span className={`font-bold ${gameStatus === 'won' ? 'text-green-500' :
                                gameStatus === 'lost' ? 'text-red-500' :
                                    'text-blue-500'
                                }`}>
                                {gameStatus === 'playing' ? '游戏中' : gameStatus === 'won' ? '胜利' : '失败'}
                            </span>
                        </div>
                    </div>

                    {/* 游戏区域容器 */}
                    <div className="flex flex-col items-center gap-6">
                        {/* 游戏主区域 */}
                        <div className="w-full sm:w-[800px] aspect-[4/3] bg-white bg-opacity-90 backdrop-blur-md 
                            rounded-xl shadow-lg overflow-hidden relative">
                            <div className="absolute inset-0 touch-none">
                                {tiles.map((tile) => (
                                    <div
                                        id={`tile-${tile.id}`}
                                        key={tile.id}
                                        className={`absolute flex items-center justify-center bg-white border-2 rounded-sm
                                            transition-all duration-300 ease-out transform ${tile.blocked
                                                ? 'border-gray-300 bg-gray-100 opacity-60 scale-95 cursor-not-allowed'
                                                : 'border-blue-400 hover:-translate-y-1 hover:scale-105 hover:shadow-xl hover:border-blue-500 active:translate-y-0 active:scale-100 active:shadow-md cursor-pointer'
                                            }`}
                                        style={{
                                            left: `${(tile.x / 800) * 100}%`,
                                            top: `${(tile.y / 600) * 100}%`,
                                            width: `${(tile.width / 800) * 100}%`,
                                            height: `${(tile.height / 600) * 100}%`,
                                            zIndex: tile.layer + 1,
                                            pointerEvents: isProcessing ? 'none' : 'auto', // 处理中禁用点击
                                            boxShadow: tile.blocked ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.1)',
                                            opacity: 1,
                                            transform: 'scale(1)',
                                            transition: 'all 0.3s ease-out',
                                        }}
                                        onClick={() => !isProcessing && handleTileClick(tile)}
                                    >
                                        <span className="text-2xl sm:text-3xl select-none 
                                            transition-transform duration-200 
                                            hover:scale-110 active:scale-90">
                                            {tile.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 暂存区 */}
                        <div className="w-full sm:w-[800px] flex justify-center gap-3 p-4 sm:p-5 bg-white bg-opacity-90 
                            backdrop-blur-md rounded-xl shadow-lg min-h-[70px] sm:min-h-[90px]">
                            {selectedTiles.map((tile, index) => (
                                <div
                                    key={`storage-${tile.id}`}
                                    className="flex items-center justify-center w-[45px] h-[45px] sm:w-[65px] sm:h-[65px] 
                                        bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-400 
                                        rounded-xl shadow-md transform transition-all duration-300 ease-out
                                        hover:scale-105 hover:shadow-lg"
                                    style={{
                                        opacity: 1,
                                        transform: 'scale(1)',
                                        transition: 'all 0.3s ease-out',
                                    }}
                                >
                                    <span className="text-xl sm:text-2xl select-none">{tile.type}</span>
                                </div>
                            ))}
                            {/* 空位样式优化 */}
                            {Array.from({ length: MAX_STORAGE - selectedTiles.length }).map((_, index) => (
                                <div
                                    key={`empty-${index}`}
                                    className="w-[45px] h-[45px] sm:w-[65px] sm:h-[65px] border-2 
                                        border-dashed border-gray-300 rounded-xl bg-gray-50 bg-opacity-50"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default YangGame;