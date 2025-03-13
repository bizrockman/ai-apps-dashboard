import React from 'react';
import StatCard from './StatCard';
import { TextStatistics } from './types';

interface StatisticsProps {
  stats: TextStatistics;
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Characters"
        value={stats.characters}
        color="blue"
      />
      <StatCard
        label="Words"
        value={stats.words}
        color="indigo"
      />
      <StatCard
        label="Without Spaces"
        value={stats.withoutSpaces}
        color="purple"
      />
      <StatCard
        label="Paragraphs"
        value={stats.paragraphs}
        color="pink"
      />
    </div>
  );
};

export default Statistics;