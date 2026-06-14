'use client';
import styles from './TrendChart.module.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { IndicatorPayload } from '../lib/types';
import { COUNTRY_COLORS, COUNTRIES } from '../lib/constants';

interface Props {
  payload: IndicatorPayload;
  title?: string;
  visibleCountries?: string[];
  focusCountry?: string;
}

interface ChartRow { year: string; [country: string]: string | number | null; }

const ALL_COUNTRIES = ['Rwanda', 'Kenya', 'South Africa', 'Senegal'];

function buildChartData(payload: IndicatorPayload): ChartRow[] {
  const yearsSet = new Set(payload.data.map((d) => d.year));
  const years = Array.from(yearsSet).sort();
  return years.map((year) => {
    const row: ChartRow = { year };
    payload.data
      .filter((d) => d.year === year)
      .forEach((d) => { row[d.country] = d.value; });
    return row;
  });
}

export default function HealthSpendChart({
  payload,
  title,
  visibleCountries = ALL_COUNTRIES,
  focusCountry = 'RWA',
}: Props) {
  const data = buildChartData(payload);
  const focusName = COUNTRIES.find((c) => c.code === focusCountry)?.name ?? 'Rwanda';
  const activeCountries = ALL_COUNTRIES.filter((c) => visibleCountries.includes(c));

  return (
    <div className={`card ${styles.card}`}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{title ?? payload.indicatorName}</h3>
          <p className={styles.sub}>
            <a href={payload.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {payload.source} ↗
            </a>
            {' · '}Updated {payload.lastUpdated}
          </p>
        </div>
        <span className="badge badge-muted">{payload.unit}</span>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15, 23, 42, 0.05)" strokeDasharray="4 4" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(15, 23, 42, 0.06)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748B', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) =>
              v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(0)}M` : `$${v}`
            }
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid rgba(15,23,42,0.08)',
              borderRadius: 10,
              color: '#0F172A',
              fontSize: 12,
              boxShadow: '0 4px 20px rgba(15,23,42,0.08)',
            }}
            formatter={(value: any, name: any) => [
              `$${(Number(value) / 1_000_000).toFixed(2)}M`,
              name,
            ]}
          />
          <Legend wrapperStyle={{ fontSize: 12, color: '#64748B', paddingTop: 12 }} />
          {activeCountries.map((country) => {
            const isFocus = country === focusName;
            return (
              <Line
                key={country}
                type="monotone"
                dataKey={country}
                stroke={COUNTRY_COLORS[country] ?? '#888'}
                strokeWidth={isFocus ? 2.8 : 1.6}
                strokeOpacity={isFocus ? 1 : 0.55}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2 }}
                connectNulls
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
