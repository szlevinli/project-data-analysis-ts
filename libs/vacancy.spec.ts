import {
  calcExactDiffMonths,
  getExactDiffMonths,
  getFullMonthEndDate,
  getRestDays,
  intervalToArray,
  isLegalInterval,
  parseDate,
  setFullMonthInterval,
  addColumn,
} from './vacancy';
import { DataFrame } from 'danfojs';

it('应该可以将给定的 yyyy-mm-dd 格式字符串转换给日期, 且该日期的时间是 00:00:00.00', () => {
  // 注意这里的实际创建的本地日期是 '2021-02-17T00:00:00.00+08:00'
  // 转换成 ISO 格式时时区由东八区+08:00 变成 UTC 时区, 即零时区
  // 因此需要减去八个小时, 也是 24-8=16
  // 所以 ISOString 的显示结果上日期要减去一天, 时间显示16
  expect(parseDate('2021-2-17').toISOString()).toEqual(
    '2021-02-16T16:00:00.000Z'
  );
});

it('应该可以将 Interval 类型转换为日期数组, 且按顺序转换', () => {
  const start = parseDate('2021-11-01');
  const end = parseDate('2021-11-02');
  const interval = {
    end,
    start,
  };
  expect(intervalToArray(interval)).toEqual([start, end]);
});

describe('[isLegalInterval]: 是否是合法时间段', () => {
  it('start 等于 end, 应该返回 true', () => {
    const start = parseDate('2020-11-02');
    const end = parseDate('2020-11-03');
    const interval = {
      start,
      end,
    };

    expect(isLegalInterval(interval)).toBeTruthy();
  });

  it('start 小于 end, 应该返回 true', () => {
    const start = parseDate('2020-11-18');
    const end = parseDate('2021-11-03');
    const interval = {
      start,
      end,
    };

    expect(isLegalInterval(interval)).toBeTruthy();
  });

  it('start 大于 end, 应该返回 false', () => {
    const start = parseDate('2021-11-18');
    const end = parseDate('2021-11-03');
    const interval = {
      start,
      end,
    };

    expect(isLegalInterval(interval)).toBeFalsy();
  });
});

describe('[getFullMonthEndDate]: 获取满月截止日期', () => {
  it('不满 1 个月', () => {
    const start = parseDate('2020-11-03');
    const end = parseDate('2020-12-01');
    const interval = {
      start,
      end,
    };
    expect(getFullMonthEndDate(interval)).toEqual(parseDate('2020-11-03'));
  });

  it('不满 12 个月', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2021-11-10');
    const interval = {
      start,
      end,
    };
    expect(getFullMonthEndDate(interval)).toEqual(parseDate('2021-10-15'));
  });

  it('恰好 12 个月', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2021-11-15');
    const interval = {
      start,
      end,
    };
    expect(getFullMonthEndDate(interval)).toEqual(parseDate('2021-11-15'));
  });

  it('超过 12 个月', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2021-11-18');
    const interval = {
      start,
      end,
    };
    expect(getFullMonthEndDate(interval)).toEqual(parseDate('2021-11-15'));
  });
});

it('应该可以设置 Interval 中的 start date 为满月截止日期', () => {
  const start = parseDate('2020-11-15');
  const end = parseDate('2021-11-18');
  const interval = {
    start,
    end,
  };

  expect(setFullMonthInterval(interval)).toEqual({
    start: parseDate('2021-11-15'),
    end,
  });
});

it('应该可以计算出剩余天数差', () => {
  const start = parseDate('2020-11-15');
  const end = parseDate('2021-11-18');
  const interval = {
    start,
    end,
  };

  expect(getRestDays(interval)).toEqual(3);
});

describe('[calcExactDiffMonths]: 计算精确月差', () => {
  it('不足 1 月的情况下', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2020-11-30');
    const interval = {
      start,
      end,
    };

    expect(calcExactDiffMonths(interval)).toEqual(0.5);
  });

  it('完整月的情况下', () => {
    const start = parseDate('2020-11-01');
    const end = parseDate('2021-11-01');
    const interval = {
      start,
      end,
    };

    expect(calcExactDiffMonths(interval)).toEqual(12);
  });

  it('超过 1 个月, 但不是完整月的情况下', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2021-6-23');
    const interval = {
      start,
      end,
    };

    expect(+calcExactDiffMonths(interval).toFixed(2)).toEqual(7.27);
  });
});

describe('[getExactDiffMonths]: 获取精确月差', () => {
  it('不合法的 Intervale 应该返回 0', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2020-6-23');
    const interval = {
      start,
      end,
    };

    expect(getExactDiffMonths(interval)).toEqual(0);
  });

  it('合法的 Intervale 应该返回正确的月差', () => {
    const start = parseDate('2020-11-15');
    const end = parseDate('2021-6-23');
    const interval = {
      start,
      end,
    };

    expect(+calcExactDiffMonths(interval).toFixed(2)).toEqual(7.27);
  });
});

it('应该可以计算出月差 ', () => {
  jest.spyOn(Date, 'now').mockReturnValue(new Date('2021-11-15').valueOf());

  const df = new DataFrame({
    dateA: ['2021-1-1', '2021-10-1', '2021-9-21'],
  });
  const expectV = [10.47, 1.47, 1.81];

  const newDf = addColumn('v')('dateA')(df);

  expect(newDf['v'].values).toEqual(expectV);
});
