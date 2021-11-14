import { DataFrame, Series } from 'danfojs';
import { Interval } from 'date-fns';
import {
  addMonths,
  compareAsc,
  differenceInDays,
  differenceInMonths,
  getDaysInMonth,
  parse,
} from 'date-fns/fp';
import { flow, pipe } from 'fp-ts/function';
import { ap as ioAp, map as ioMap, of as ioOf } from 'fp-ts/IO';
import {
  always,
  anyPass,
  apply,
  compose,
  converge,
  divide,
  equals,
  flip,
  identity,
  ifElse,
  lensProp,
  multiply,
  prop,
  set,
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
export const intervalToArray = (i: Interval) => [i.start, i.end];
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
 * 根据给定的日期字符串与当期时间一起来构造 Interval 对象
 *
 * @param dateString yyyy-MM-dd
 * @returns Interval
 *
 * intervalBaseNow :: Interval a => string -> a
 */
export const intervalBaseNow = (dateString: string): Interval => ({
  start: parseDate(dateString),
  end: Date.now(),
});
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
 * setFullMonthInterval :: Interval a => a -> a
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
/**
 * 根据给定的日期字符串结合当前日期计算月差
 *
 * diffMonthsByNow :: string -> number
 */
export const diffMonthsByNow = flow(intervalBaseNow, getExactDiffMonths);
/**
 * 根据给定的包含其实日期字符串的 series 计算到现在为止的月差
 *
 * @param series 起始日期字符串 series
 * @returns 月差 series
 *
 * seriesApply :: Series a => a -> a
 */
export const seriesApply = (series: Series) =>
  <Series>(
    series.apply(
      flow(diffMonthsByNow, multiply(100), Math.round, flip(divide)(100))
    )
  );
/**
 *
 * 创建包含月差字段的 DataFrame
 *
 * @param newColumnName 创建的新字段名称
 * @param startDate 开始日期字段名称
 * @param df DataFame
 * @returns DataFrame
 *
 * addColumn :: string -> string -> DataFrame -> IO<DataFrame>
 */
export const addColumn =
  (newColumnName: string) => (startDate: string) => (df: DataFrame) =>
    pipe(
      ioOf(seriesApply),
      ioAp(ioOf(df[startDate])),
      ioMap(
        (v) => <DataFrame>df.addColumn({
            column: newColumnName,
            values: v,
          })
      )
    );
