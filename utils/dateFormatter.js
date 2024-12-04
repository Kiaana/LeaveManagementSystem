// utils/dateFormatter.js
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

// 设置语言为中文
dayjs.locale('zh-cn');

/**
 * 格式化时间
 * @param {string} dateString - 日期字符串
 * @param {string} format - 格式化类型 'date' | 'time' | 'datetime' | 'custom'
 * @param {string} customFormat - 自定义格式
 * @returns {string} 格式化后的时间字符串
 */
export const formatDate = (dateString, format = 'datetime', customFormat = '') => {
  if (!dateString) return '-';

  try {
    // 获取本地时区偏移量（分钟）
    const localOffset = new Date().getTimezoneOffset();
    const date = dayjs(dateString).subtract(localOffset, 'minute');

    // 预定义格式
    const formats = {
      date: 'YYYY-MM-DD',
      time: 'HH:mm',
      datetime: 'MM-DD HH:mm',
      full: 'YYYY-MM-DD HH:mm',
      custom: customFormat
    };

    // 验证format是否有效
    if (!formats[format]) {
      console.warn('无效的格式类型，使用默认datetime格式');
      format = 'datetime';
    }

    return date.format(formats[format]);
  } catch (error) {
    console.error('时间格式化错误:', error);
    return '时间格式错误';
  }
};

/**
 * 获取相对时间
 * @param {string} dateString - 日期字符串
 * @returns {string} 相对时间描述
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '-';

  try {
    const localOffset = new Date().getTimezoneOffset();
    const date = dayjs(dateString).subtract(localOffset, 'minute');
    const now = dayjs();

    const diffMinutes = now.diff(date, 'minute');
    const diffHours = now.diff(date, 'hour');
    const diffDays = now.diff(date, 'day');

    if (diffMinutes < 1) return '刚刚';
    if (diffMinutes < 60) return `${diffMinutes}分钟前`;
    if (diffHours < 24) return `${diffHours}小时前`;
    if (diffDays < 7) return `${diffDays}天前`;
    
    return date.format('YYYY-MM-DD');
  } catch (error) {
    console.error('相对时间计算错误:', error);
    return '时间格式错误';
  }
};

/**
 * 判断是否为同一天
 * @param {string} date1 - 第一个日期
 * @param {string} date2 - 第二个日期
 * @returns {boolean}
 */
export const isSameDay = (date1, date2) => {
  try {
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);
    return d1.format('YYYY-MM-DD') === d2.format('YYYY-MM-DD');
  } catch (error) {
    console.error('日期比较错误:', error);
    return false;
  }
};

/**
 * 检查日期是否有效
 * @param {string} dateString - 日期字符串
 * @returns {boolean}
 */
export const isValidDate = (dateString) => {
  return dayjs(dateString).isValid();
};

/**
 * 格式化持续时间（分钟）
 * @param {number} minutes - 分钟数
 * @returns {string} 格式化后的持续时间
 */
export const formatDuration = (minutes) => {
  if (!minutes || isNaN(minutes)) return '-';

  try {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) return `${mins}分钟`;
    return `${hours}小时${mins > 0 ? ` ${mins}分钟` : ''}`;
  } catch (error) {
    console.error('持续时间格式化错误:', error);
    return '格式错误';
  }
};