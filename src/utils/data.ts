import fs from 'node:fs/promises';
import path from 'node:path';

export async function getEnrichedLicenses() {
  const licensesPath = path.join(process.cwd(), 'data/ccc/current/licenses.json');
  const zipsPath = path.join(process.cwd(), 'data/ccc/ma-zips.json');

  const rawLicenses = await fs.readFile(licensesPath, 'utf-8');
  const licenses = JSON.parse(rawLicenses);

  let zipMap = {};
  try {
    const rawZips = await fs.readFile(zipsPath, 'utf-8');
    zipMap = JSON.parse(rawZips);
  } catch (e) {
    console.error('Failed to load zip map:', e);
  }

  return licenses.map(l => {
    const zip = l.ESTABLISHMENT_ZIP;
    const enrichedCity = l.ESTABLISHMENT_CITY || zipMap[zip] || 'Unknown';
    return {
      ...l,
      ESTABLISHMENT_CITY: enrichedCity
    };
  });
}
