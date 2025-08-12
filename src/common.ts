import { GiteaLabel } from './types';

export function isSameLabel(left: GiteaLabel, right: GiteaLabel): boolean {
  const { name: lName, color: lColor, description: lDescription = '', exclusive: lExclusive = false, is_archived: lIsArchived = false } = left;
  const { name: rName, color: rColor, description: rDescription = '', exclusive: rExclusive = false, is_archived: rIsArchived = false } = right;

  return lName === rName && lColor === rColor && lDescription === rDescription && lExclusive === rExclusive && lIsArchived === rIsArchived;
}
