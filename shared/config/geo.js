export const EU_COUNTRIES = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czech Republic',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Ireland',
  'Italy',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
]

export const BUYER_COUNTRY_OPTIONS = ['United States', ...EU_COUNTRIES]

const EU_COUNTRY_SET = new Set(EU_COUNTRIES.map((country) => country.toLowerCase()))

export function isEuCountry(country) {
  return EU_COUNTRY_SET.has(String(country || '').trim().toLowerCase())
}

export function verificationRegionFromCountry(country) {
  const normalized = String(country || '').trim().toLowerCase()
  if (isEuCountry(country)) return 'eu'
  if (['united states', 'usa', 'us'].includes(normalized)) return 'us'
  return 'global'
}
