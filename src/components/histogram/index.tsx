import style from './style.module.css';

type HistogramProps = {
  data?: [string, number][];
};

const dummyData: HistogramProps = {
  data: [
    ['Rejuvenation', 5],
    ['Maintenance', 15],
    ['Preservation', 25],
    ['Structural', 10],
    ['Rehabilitation', 20],
  ],
};

const Histogram = ({ data = dummyData.data }: HistogramProps) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  const maxCount = Math.max(...data.map(([, count]) => count));
  return (
    <span className={style.root}>
      {data.map(([treatment, count]) => {
        const heightPerc = (count * 100) / maxCount;
        const perc = (count * 100) / data.reduce((sum, [, c]) => sum + c, 0);
        return (
          <span key={treatment} className={style.bar}>
            <span
              className={style.fill}
              style={{
                height: `${heightPerc}%`,
              }}
            >
              {perc.toFixed(0)}%
            </span>
            <strong>{treatment.slice(0, 5)}.</strong>
          </span>
        );
      })}
    </span>
  );
};
export { Histogram };
