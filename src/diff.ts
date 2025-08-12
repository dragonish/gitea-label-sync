import { GiteaLabelConf, RemoteGiteaLabel, GiteaLabel } from './types';
import { isSameLabel } from './common';

export function diff(localLabels: GiteaLabelConf[], remoteLabels: RemoteGiteaLabel[]) {
  const useLocalLabels = localLabels.map(label => ({ ...label, used: false }));

  const unchanged: RemoteGiteaLabel[] = [];
  const deleted: RemoteGiteaLabel[] = [];
  const processed: RemoteGiteaLabel[] = [];
  const unprocessed: RemoteGiteaLabel[] = [];

  const added: Required<GiteaLabel>[] = [];

  for (const remoteLabel of remoteLabels) {
    let found = false;
    for (const localLabel of useLocalLabels) {
      if (remoteLabel.name === localLabel.name || localLabel.aliases?.includes(remoteLabel.name)) {
        found = true;
        localLabel.used = true;
        if (localLabel.delete) {
          deleted.push(remoteLabel);
        } else if (isSameLabel(localLabel, remoteLabel)) {
          unchanged.push(remoteLabel);
        } else {
          const { name, color, description = '', exclusive = false, is_archived = false } = localLabel;
          const { id, url } = remoteLabel;
          processed.push({
            name,
            color,
            description,
            exclusive,
            is_archived,
            id,
            url,
          });
        }
        break;
      }
    }

    if (!found) {
      unprocessed.push(remoteLabel);
    }
  }

  for (const localLabel of useLocalLabels) {
    if (!localLabel.used && !localLabel.delete) {
      const { name, color, description = '', exclusive = false, is_archived = false } = localLabel;
      added.push({
        name,
        color,
        description,
        exclusive,
        is_archived,
      });
    }
  }

  return {
    unchanged,
    deleted,
    processed,
    unprocessed,
    added,
  };
}
