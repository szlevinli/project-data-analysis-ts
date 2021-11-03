import { Interval } from 'date-fns';
import {
  addMonths,
  compareAsc,
  differenceInDays,
  differenceInMonths,
  getDaysInMonth,
  parse,
} from 'date-fns/fp';
import {
  always,
  anyPass,
  apply,
  compose,
  converge,
  equals,
  identity,
  ifElse,
  lensProp,
  pick,
  prop,
  set,
  values,
} from 'ramda';

/**
 * partial 化 date-fns.parse 函数
 *
 * setDateString :: string -> string -> Date
 */
export const setDateString = parse(new Date());
/**
 * 将 yyyy-MM-dd 格式的字符串转换成
 * yyyy-MM-ddT00:00:00.00+08:00 的日期对象
 *
 * parseDate :: string -> Date
 */
export const parseDate = setDateString('yyyy-MM-dd');
/**
 * 帮助函数. 将 Interval 类型按 start, end 顺序转换为日期数组
 *
 * intervalToArray :: Interval a => a -> [Date | number]
 */
export const intervalToArray = compose<
  Interval,
  Interval,
  Array<Date | number>
>(values, pick(['start', 'end']));
/**
 * 帮助函数
 *
 * diffInMonthsForInterval :: Interval a => a -> number
 */
export const diffInMonthsForInterval = compose(
  apply(differenceInMonths),
  intervalToArray
);
/**
 * 是否是合法时间段, 即开始日期要小于截止日期
 *
 * isLegalInterval :: Interval a => a -> boolean
 */
export const isLegalInterval = compose(
  anyPass([equals(1), equals(0)]),
  apply(compareAsc),
  intervalToArray
);
/**
 * 获取满月截止日期
 * 满月截止日期指的是 Interval 类型中完整的月差加上起始日期 startDate + diffMonths
 *
 * getFullMonthEndDate :: Interval a => a -> Date
 */
export const getFullMonthEndDate: (a: Interval) => Date = converge(addMonths, [
  // 计算月差
  diffInMonthsForInterval,
  // 开始日期
  prop('start'),
]);
/**
 * 转换给定的 Interval 为新的 Interval, 将原始 Interval 的 start date 设置为
 * 满月截止日期
 *
 * getNewInterval :: Interval a => a -> a
 */
export const setFullMonthInterval: (a: Interval) => any = converge(
  set(lensProp('start')),
  [getFullMonthEndDate, identity]
);
/**
 * 获取给定 Interval 的剩余天数差
 * 剩余天数差 = end date - 满月截止日期
 *
 * getRestDays :: Interval a => a -> number
 */
export const getRestDays = compose<
  Interval,
  Interval,
  Array<Date | number>,
  number
>(apply(differenceInDays), intervalToArray, setFullMonthInterval);
/**
 * 计算精确的月差
 *
 * calcExactDiffMonths :: Interval a => a -> number
 */
export const calcExactDiffMonths = converge(
  (diffMonths: number, diffDays: number, daysInMonth: number) =>
    diffMonths + diffDays / daysInMonth,
  [
    diffInMonthsForInterval,
    getRestDays,
    compose(getDaysInMonth, getFullMonthEndDate),
  ]
);
/**
 * 获取精确月差
 *
 * getExactDiffMonths :: Interval a => a -> number
 */
export const getExactDiffMonths = ifElse(
  isLegalInterval,
  calcExactDiffMonths,
  always(0)
);
