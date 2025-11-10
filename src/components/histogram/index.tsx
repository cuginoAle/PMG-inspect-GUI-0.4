import style from './style.module.css';

type HistogramProps = {
  data?: [string, number][];
  title?: string;
};

const Histogram = ({ data, title }: HistogramProps) => {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  const maxCount = Math.max(...data.map(([, count]) => count));
  return (
    <span className={style.root}>
      {title && <span className={style.title}>{title}</span>}
      <span className={style.histogram}>
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
              <span className={style.label}>{treatment.slice(0, 5)}.</span>
            </span>
          );
        })}
      </span>
    </span>
  );
};
export { Histogram };
