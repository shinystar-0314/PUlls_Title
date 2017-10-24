import { getDDMMMYYYY } from '../../../utils/time-helpers.utils';

export const diagnosesColumnsConfig = [
  { key: 'problem', title: 'Problems / Diagnoses', width: '56%' },
  { key: 'dateOfOnset', title: 'Date', transformer: getDDMMMYYYY, width: '25%' },
  { key: 'source', title: 'Source', width: '19%' },
  { key: 'sourceId', title: 'SourceID', width: 0 },
];

export const defaultColumnsSelected = {
  problem: true,
  dateOfOnset: true,
  source: true,
  sourceId: true,
};
