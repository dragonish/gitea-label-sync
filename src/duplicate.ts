import type { RemoteGiteaLabel } from './types';
import { isSameLabel } from './common';

export function duplicate(labels: RemoteGiteaLabel[]) {
  const deleted: RemoteGiteaLabel[] = [];
  const used: RemoteGiteaLabel[] = [];

  for (const label of labels) {
    let found = false;
    for (let i = 0; i < used.length; i++) {
      const usedLabel = used[i]!;
      if (isSameLabel(label, usedLabel)) {
        found = true;
        if (label.id < usedLabel.id) {
          used[i] = label;
          deleted.push(usedLabel);
        } else {
          deleted.push(label);
        }
        break;
      }
    }

    if (!found) {
      used.push(label);
    }
  }

  return {
    used,
    deleted,
  };
}
