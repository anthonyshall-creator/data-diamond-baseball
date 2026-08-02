// 2021 Houston Astros (AL champions, lost the World Series to Atlanta).
// Full-season regular-season stat lines from Baseball-Reference, using the
// 9 primary starters at each defensive spot.
export const astros2021 = {
  name: 'Houston Astros',
  abbrev: 'HOU',
  lineup: [
    {
      name: 'Martín Maldonado',
      position: 'C',
      batting: { pa: 426, ab: 373, h: 64, doubles: 10, triples: 1, hr: 12, bb: 47, so: 127, hbp: 5, avg: 0.172, obp: 0.272, slg: 0.300 },
    },
    {
      name: 'Yuli Gurriel',
      position: '1B',
      batting: { pa: 605, ab: 530, h: 169, doubles: 31, triples: 0, hr: 15, bb: 59, so: 68, hbp: 4, avg: 0.319, obp: 0.383, slg: 0.462 },
    },
    {
      name: 'Jose Altuve',
      position: '2B',
      batting: { pa: 678, ab: 601, h: 167, doubles: 32, triples: 1, hr: 31, bb: 66, so: 91, hbp: 4, avg: 0.278, obp: 0.350, slg: 0.489 },
    },
    {
      name: 'Alex Bregman',
      position: '3B',
      batting: { pa: 400, ab: 348, h: 94, doubles: 17, triples: 0, hr: 12, bb: 44, so: 53, hbp: 4, avg: 0.270, obp: 0.355, slg: 0.422 },
    },
    {
      name: 'Carlos Correa',
      position: 'SS',
      batting: { pa: 640, ab: 555, h: 155, doubles: 34, triples: 1, hr: 26, bb: 75, so: 116, hbp: 4, avg: 0.279, obp: 0.366, slg: 0.485 },
    },
    {
      name: 'Michael Brantley',
      position: 'LF',
      batting: { pa: 508, ab: 469, h: 146, doubles: 29, triples: 3, hr: 8, bb: 33, so: 53, hbp: 5, avg: 0.311, obp: 0.362, slg: 0.437 },
    },
    {
      name: 'Myles Straw',
      position: 'CF',
      batting: { pa: 370, ab: 325, h: 85, doubles: 13, triples: 1, hr: 2, bb: 38, so: 71, hbp: 2, avg: 0.262, obp: 0.339, slg: 0.326 },
    },
    {
      name: 'Kyle Tucker',
      position: 'RF',
      batting: { pa: 567, ab: 506, h: 149, doubles: 37, triples: 3, hr: 30, bb: 53, so: 90, hbp: 1, avg: 0.294, obp: 0.359, slg: 0.557 },
    },
    {
      name: 'Yordan Alvarez',
      position: 'DH',
      batting: { pa: 598, ab: 537, h: 149, doubles: 35, triples: 1, hr: 33, bb: 50, so: 145, hbp: 8, avg: 0.277, obp: 0.346, slg: 0.531 },
    },
  ],
  pitchers: {
    starter: {
      name: 'Lance McCullers Jr.',
      role: 'SP',
      pitching: { ip: 162.1, bf: 684, h: 122, bb: 76, so: 185, hr: 13, hbp: 10, er: 57, era: 3.16, whip: 1.220, k9: 10.3, bb9: 4.2, hr9: 0.7 },
    },
    setup: {
      name: 'Cristian Javier',
      role: 'RP',
      pitching: { ip: 101.1, bf: 424, h: 67, bb: 53, so: 130, hr: 16, hbp: 7, er: 40, era: 3.55, whip: 1.184, k9: 11.5, bb9: 4.7, hr9: 1.4 },
    },
    closer: {
      name: 'Ryan Pressly',
      role: 'CL',
      pitching: { ip: 64.0, bf: 250, h: 49, bb: 13, so: 81, hr: 4, hbp: 0, er: 16, era: 2.25, whip: 0.969, k9: 11.4, bb9: 1.8, hr9: 0.6 },
    },
  },
};
