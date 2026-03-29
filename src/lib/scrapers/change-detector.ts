import type { GscLicensee } from './gsc-scraper';

export type ChangeType =
  | 'LICENCE_GRANTED'
  | 'LICENCE_SURRENDERED'
  | 'LICENCE_REVOKED'
  | 'LICENCE_SUSPENDED'
  | 'LICENCE_REINSTATED'
  | 'DOMAIN_ADDED'
  | 'DOMAIN_REMOVED';

export interface DetectedChange {
  type: ChangeType;
  operatorName: string;
  description: string;
  detail?: string;
  occurredAt: Date;
}

export function detectChanges(
  previous: GscLicensee[],
  current: GscLicensee[],
  detectedAt: Date = new Date(),
): DetectedChange[] {
  const changes: DetectedChange[] = [];

  const prevMap = new Map(previous.map((l) => [l.operatorName.toLowerCase().trim(), l]));
  const currMap = new Map(current.map((l) => [l.operatorName.toLowerCase().trim(), l]));

  // New licensees (granted)
  for (const [key, curr] of currMap) {
    if (!prevMap.has(key)) {
      changes.push({
        type: 'LICENCE_GRANTED',
        operatorName: curr.operatorName,
        description: `New licence granted to ${curr.operatorName}`,
        detail: curr.licenceType ? `Licence type: ${curr.licenceType}` : undefined,
        occurredAt: detectedAt,
      });
    }
  }

  // Removed licensees (surrendered/revoked)
  for (const [key, prev] of prevMap) {
    if (!currMap.has(key)) {
      changes.push({
        type: 'LICENCE_SURRENDERED',
        operatorName: prev.operatorName,
        description: `${prev.operatorName} no longer appears in the register`,
        occurredAt: detectedAt,
      });
    }
  }

  // Status and domain changes for existing licensees
  for (const [key, curr] of currMap) {
    const prev = prevMap.get(key);
    if (!prev) continue;

    // Status transitions
    if (prev.status !== curr.status) {
      if (curr.status === 'suspended') {
        changes.push({
          type: 'LICENCE_SUSPENDED',
          operatorName: curr.operatorName,
          description: `${curr.operatorName} licence status changed to Suspended`,
          occurredAt: detectedAt,
        });
      } else if (curr.status === 'active' && prev.status === 'suspended') {
        changes.push({
          type: 'LICENCE_REINSTATED',
          operatorName: curr.operatorName,
          description: `${curr.operatorName} licence reinstated (was Suspended)`,
          occurredAt: detectedAt,
        });
      }
    }

    // Domain additions
    const prevDomains = new Set(prev.authorisedDomains);
    const currDomains = new Set(curr.authorisedDomains);

    for (const domain of currDomains) {
      if (!prevDomains.has(domain)) {
        changes.push({
          type: 'DOMAIN_ADDED',
          operatorName: curr.operatorName,
          description: `${curr.operatorName} added domain: ${domain}`,
          occurredAt: detectedAt,
        });
      }
    }

    // Domain removals
    for (const domain of prevDomains) {
      if (!currDomains.has(domain)) {
        changes.push({
          type: 'DOMAIN_REMOVED',
          operatorName: curr.operatorName,
          description: `${curr.operatorName} removed domain: ${domain}`,
          occurredAt: detectedAt,
        });
      }
    }
  }

  return changes;
}
