// 2021 Atlanta Braves (World Series champions). Full-season regular-season
// stat lines from Baseball-Reference. Lineup picked as the 9 highest-PA
// players at each defensive spot (roster churned heavily via trade-deadline
// deals for Duvall/Soler/Rosario/Pederson and Acuna's August ACL injury).
export const braves2021 = {
  name: 'Atlanta Braves',
  abbrev: 'ATL',
  lineup: [
    {
      name: "Travis d'Arnaud",
      position: 'C',
      batting: { pa: 229, ab: 209, h: 46, doubles: 14, triples: 0, hr: 7, bb: 17, so: 53, hbp: 2, avg: 0.220, obp: 0.284, slg: 0.388 },
    },
    {
      name: 'Freddie Freeman',
      position: '1B',
      batting: { pa: 695, ab: 600, h: 180, doubles: 25, triples: 2, hr: 31, bb: 85, so: 107, hbp: 8, avg: 0.300, obp: 0.393, slg: 0.503 },
    },
    {
      name: 'Ozzie Albies',
      position: '2B',
      batting: { pa: 686, ab: 629, h: 163, doubles: 40, triples: 7, hr: 30, bb: 47, so: 128, hbp: 3, avg: 0.259, obp: 0.310, slg: 0.488 },
    },
    {
      name: 'Austin Riley',
      position: '3B',
      batting: { pa: 662, ab: 590, h: 179, doubles: 33, triples: 1, hr: 33, bb: 52, so: 168, hbp: 12, avg: 0.303, obp: 0.367, slg: 0.531 },
    },
    {
      name: 'Dansby Swanson',
      position: 'SS',
      batting: { pa: 653, ab: 588, h: 146, doubles: 33, triples: 2, hr: 27, bb: 52, so: 167, hbp: 5, avg: 0.248, obp: 0.311, slg: 0.449 },
    },
    {
      name: 'Adam Duvall',
      position: 'LF',
      batting: { pa: 216, ab: 199, h: 45, doubles: 7, triples: 1, hr: 16, bb: 14, so: 69, hbp: 3, avg: 0.226, obp: 0.287, slg: 0.513 },
    },
    {
      name: 'Guillermo Heredia',
      position: 'CF',
      batting: { pa: 347, ab: 305, h: 67, doubles: 26, triples: 0, hr: 5, bb: 32, so: 81, hbp: 9, avg: 0.220, obp: 0.311, slg: 0.354 },
    },
    {
      name: 'Jorge Soler',
      position: 'RF',
      batting: { pa: 242, ab: 208, h: 56, doubles: 11, triples: 0, hr: 14, bb: 29, so: 45, hbp: 1, avg: 0.269, obp: 0.358, slg: 0.524 },
    },
    {
      name: 'Ronald Acuña Jr.',
      position: 'DH',
      batting: { pa: 360, ab: 297, h: 84, doubles: 19, triples: 1, hr: 24, bb: 49, so: 85, hbp: 9, avg: 0.283, obp: 0.394, slg: 0.596 },
    },
  ],
  pitchers: {
    starter: {
      name: 'Charlie Morton',
      role: 'SP',
      pitching: { ip: 185.2, bf: 756, h: 136, bb: 58, so: 216, hr: 16, hbp: 17, er: 69, era: 3.34, whip: 1.045, k9: 10.5, bb9: 2.8, hr9: 0.8 },
    },
    setup: {
      name: 'Luke Jackson',
      role: 'RP',
      pitching: { ip: 63.2, bf: 261, h: 45, bb: 29, so: 70, hr: 6, hbp: 2, er: 14, era: 1.98, whip: 1.162, k9: 9.9, bb9: 4.1, hr9: 0.8 },
    },
    closer: {
      name: 'Will Smith',
      role: 'CL',
      pitching: { ip: 68.0, bf: 283, h: 49, bb: 28, so: 87, hr: 11, hbp: 5, er: 26, era: 3.44, whip: 1.132, k9: 11.5, bb9: 3.7, hr9: 1.5 },
    },
  },
};
