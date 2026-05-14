/** Country code → flag emoji mapping for the most common backpacker nationalities */
export const FLAGS: Record<string, string> = {
  US: '🇺🇸', GB: '🇬🇧', DE: '🇩🇪', FR: '🇫🇷', AU: '🇦🇺',
  IN: '🇮🇳', BR: '🇧🇷', CA: '🇨🇦', NL: '🇳🇱', SE: '🇸🇪',
  IT: '🇮🇹', ES: '🇪🇸', JP: '🇯🇵', KR: '🇰🇷', TH: '🇹🇭',
  MX: '🇲🇽', CO: '🇨🇴', AR: '🇦🇷', NZ: '🇳🇿', IE: '🇮🇪',
  CH: '🇨🇭', PT: '🇵🇹', PL: '🇵🇱', IL: '🇮🇱', ZA: '🇿🇦',
  SG: '🇸🇬', PH: '🇵🇭', ID: '🇮🇩', MY: '🇲🇾', VN: '🇻🇳',
  NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮', BE: '🇧🇪', AT: '🇦🇹',
  CL: '🇨🇱', PE: '🇵🇪', TR: '🇹🇷', RU: '🇷🇺', UA: '🇺🇦',
};

export const getFlag = (code: string): string => FLAGS[code] ?? '🏳️';
