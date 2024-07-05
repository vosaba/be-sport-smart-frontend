import type { SxProps } from '@mui/material/styles';
import * as React from 'react';
import { useEffect } from 'react';

import { useMeasureValuesStore } from '../../stores/MeasureValuesStore';
import { useSportStore } from '../../stores/SportStore';
import { DashboardCard } from '../common/DashboardCard';

import { SportTable } from './sport-table/SportTable';
import { SportRankFullList } from './SportRankFullList';

const cardSportCountLimit = 8;

export interface SportRankCardProps {
  sx?: SxProps;
}

export function SportRankCard({ }: SportRankCardProps): React.JSX.Element {
  const { measureValues } = useMeasureValuesStore();
  const { initialized, rankSports } = useSportStore();

  useEffect(() => {
    if (!initialized) {
      rankSports(measureValues);
    }
  }, []);

  return (
    <DashboardCard
      sx={{ overflowX: "auto" }}
      titleKey='sport.rank.title'
      noPadding={true}
      actions={
        <SportRankFullList />
      }>
      <SportTable recordsLimit={cardSportCountLimit}/>
    </DashboardCard>
  );
}