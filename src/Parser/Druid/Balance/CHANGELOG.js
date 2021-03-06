import React from 'react';

import { Iskalla, Gebuz } from 'CONTRIBUTORS';
import ItemLink from 'common/ItemLink';
import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';

export default [
  { 
    date: new Date('2018-6-21'),
    changes: <React.Fragment>Removed Stellar Empowerment and added haste tracker for <SpellLink id={SPELLS.STARLORD_TALENT.id} /></React.Fragment>,
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-4-07'),
    changes: <React.Fragment>Track early dot refreshes for <SpellLink id={SPELLS.STELLAR_FLARE_TALENT.id} />, and early dot refreshes for <SpellLink id={SPELLS.MOONFIRE_BEAR.id} /> and <SpellLink id={SPELLS.SUNFIRE.id} /> while standing still, the player had <SpellLink id={SPELLS.STELLAR_DRIFT.id} />, or the player had better movement fillers available.</React.Fragment>,
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-3-23'),
    changes: 'Updated the L90 Talents module to also show total generated and added suggestion when using the wrong or no blessing.',
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-3-23'),
    changes: 'Split Blessing of Elune into it\'s own entry in the Astral Power usage and fixed a bug where Astral Power from Lunar Strike with both Blessing of Elune and Incarnation or Celestial Alignment was not counted correctly.',
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-3-15'),
    changes: <React.Fragment>Highlight inefficient <SpellLink id={SPELLS.LUNAR_STRIKE.id} /> and <SpellLink id={SPELLS.SOLAR_WRATH.id} /> casts on the timeline.</React.Fragment>,
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-1-13'),
    changes: 'Added L90 talents Astral Power gains.',
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-1-13'),
    changes: 'Added tier 20.',
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-1-6'),
    changes: 'Added tier 21.',
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-1-5'),
    changes: <React.Fragment>Added the following legendaries: <ItemLink id={ITEMS.IMPECCABLE_FEL_ESSENCE.id} />, <ItemLink id={ITEMS.ONETHS_INTUITION.id} />, <ItemLink id={ITEMS.LADY_AND_THE_CHILD.id} />, <ItemLink id={ITEMS.PROMISE_OF_ELUNE.id} />, and <ItemLink id={ITEMS.SOUL_OF_THE_ARCHDRUID.id} /> and updated <ItemLink id={ITEMS.THE_EMERALD_DREAMCATCHER.id} />.</React.Fragment>,
    contributors: [Gebuz],
  },
  { 
    date: new Date('2018-1-2'),
    changes: 'Added Astral Power usage tab.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2017-12-29'),
    changes: 'Added Checklist.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2017-12-29'),
    changes: 'Added all spells to Cast efficiency.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2017-12-28'),
    changes: 'Added cooldown thoughtput tracker.',
    contributors: [Gebuz],
  },
  {
    date: new Date('2017-9-28'),
    changes: <React.Fragment>Added a tracker module for <ItemLink id={ITEMS.THE_EMERALD_DREAMCATCHER.id} />.</React.Fragment>,
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-22'),
    changes: 'Added Overcapped Lunar and Solar empowerments modules.',
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-20'),
    changes: <React.Fragment>Minor fixes to Unempowered <SpellLink id={SPELLS.LUNAR_STRIKE.id} /> module.</React.Fragment>,
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-12'),
    changes: <React.Fragment>Added a module to track Unempowered <SpellLink id={SPELLS.LUNAR_STRIKE.id} /> casts.</React.Fragment>,
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-12'),
    changes: 'Added the Damage module and Reorder of Stat boxes.',
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-12'),
    changes: 'Minor text fixes.',
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-07'),
    changes: 'Fixed stackable buffs - Now the ABC module should be more reliable.',
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-05'),
    changes: 'Added Moon spells casted module.',
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-04'),
    changes: 'Added wasted Astral Power module.',
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-9-02'),
    changes: <React.Fragment>Added <SpellLink id={SPELLS.MOONFIRE_BEAR.id} /> and <SpellLink id={SPELLS.SUNFIRE.id} /> uptime modules.</React.Fragment>,
    contributors: [Iskalla],
  },
  {
    date: new Date('2017-8-30'),
    changes: 'Added support.',
    contributors: [Iskalla],
  },
];
