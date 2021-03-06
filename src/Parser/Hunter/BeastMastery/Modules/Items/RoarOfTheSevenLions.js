import React from 'react';

import ITEMS from 'common/ITEMS';

import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from 'common/SPELLS';
import { formatNumber, formatPercentage } from 'common/format';
import TimeFocusCapped from 'Parser/Hunter/Shared/Modules/Features/TimeFocusCapped';
import ItemLink from 'common/ItemLink';
import SpellLink from 'common/SpellLink';

/**
 * Roar of the Seven Lions
 * Equip: Bestial Wrath reduces the Focus cost of all your abilities by 15%.
 */
const LIST_OF_FOCUS_SPENDERS = [
  SPELLS.COBRA_SHOT.id,
  SPELLS.MULTISHOT_BM.id,
  SPELLS.KILL_COMMAND.id,
  SPELLS.REVIVE_PET_AND_MEND_PET.id,
  SPELLS.A_MURDER_OF_CROWS_TALENT.id,
  SPELLS.BARRAGE_TALENT.id,
];

const FOCUS_COST_REDUCTION = 0.15;
const SLITHERING_SERPENTS_REDUCTION = 2;
const COBRA_SHOT_RANK_2_REDUCTION = 10;
const STARTING_FOCUS = 120;

class RoarOfTheSevenLions extends Analyzer {
  static dependencies = {
    timeFocusCapped: TimeFocusCapped,
  };

  lastFocusCost = 0;
  lastVolleyHit = 0;

  focusSpenderCasts = {
    [SPELLS.COBRA_SHOT.id]: {
      casts: 0,
      focusSaved: 0,
      name: "Cobra Shot",
    },
    [SPELLS.MULTISHOT_BM.id]: {
      casts: 0,
      focusSaved: 0,
      name: "Multishot",
    },
    [SPELLS.KILL_COMMAND.id]: {
      casts: 0,
      focusSaved: 0,
      name: "Kill Command",
    },
    [SPELLS.REVIVE_PET_AND_MEND_PET.id]: {
      casts: 0,
      focusSaved: 0,
      name: "Revive/Mend pet",
    },
    [SPELLS.A_MURDER_OF_CROWS_TALENT.id]: {
      casts: 0,
      focusSaved: 0,
      name: "A Murder of Crows",
    },
    [SPELLS.BARRAGE_TALENT.id]: {
      casts: 0,
      focusSaved: 0,
      name: "Barrage",
    },
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasWaist(ITEMS.ROAR_OF_THE_SEVEN_LIONS.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (!this.selectedCombatant.hasBuff(SPELLS.BESTIAL_WRATH.id)) {
      return;
    }
    //If the spell cast isn't one of the focus spenders of BM, we're not interested in it
    if (LIST_OF_FOCUS_SPENDERS.every(id => spellId !== id)) {
      return;
    }
    this.lastFocusCost = event.classResources[0].cost || 0;
    if (spellId === SPELLS.COBRA_SHOT.id) {
      this.lastFocusCost -= COBRA_SHOT_RANK_2_REDUCTION;
      if (this.selectedCombatant.traitsBySpellId[SPELLS.SLITHERING_SERPENTS_TRAIT.id]) {
        this.lastFocusCost -= this.selectedCombatant.traitsBySpellId[SPELLS.SLITHERING_SERPENTS_TRAIT.id] * SLITHERING_SERPENTS_REDUCTION;
      }
    }
    this.focusSpenderCasts[spellId].casts += 1;
    this.focusSpenderCasts[spellId].focusSaved += this.lastFocusCost * FOCUS_COST_REDUCTION;

  }

  get totalFocusSaved() {
    return LIST_OF_FOCUS_SPENDERS.reduce((total, ability) => total + this.focusSpenderCasts[ability].focusSaved, 0);
  }

  get focusCostCasts() {
    return LIST_OF_FOCUS_SPENDERS.reduce((total, ability) => total + this.focusSpenderCasts[ability].casts, 0);
  }
  get averageFocusCostReduction() {
    return this.totalFocusSaved / this.focusCostCasts;
  }

  item() {
    let tooltipText = `Overall Roar of the Seven Lions saved you an average of ${this.averageFocusCostReduction.toFixed(2)} focus per affected cast, and saved you an equivalent to ${formatPercentage(this.focusSavedPercentOfAvailable)}% of your total available focus over the course of the fight. <br/>This shows a more accurate breakdown of which abilities were cast during Bestial Wrath, and where the various focus reduction occured:<ul>`;
    LIST_OF_FOCUS_SPENDERS.forEach(focusSpender => {
      if (this.focusSpenderCasts[focusSpender].casts > 0) {
        tooltipText += `<li>${this.focusSpenderCasts[focusSpender].name}<ul><li>Casts: ${this.focusSpenderCasts[focusSpender].casts}</li><li>Focus saved: ${formatNumber(this.focusSpenderCasts[focusSpender].focusSaved)}</li></ul></li>`;
      }
    });
    tooltipText += `</ul>`;

    return {
      item: ITEMS.ROAR_OF_THE_SEVEN_LIONS,
      result: (
        <dfn data-tip={tooltipText}>
          saved you a total of {formatNumber(this.totalFocusSaved)} focus
        </dfn>
      ),
    };
  }

  get focusSavedPercentOfAvailable() {
    return this.totalFocusSaved / (this.timeFocusCapped.totalGenerated + STARTING_FOCUS);
  }

  get focusSavedThreshold() {
    if (this.selectedCombatant.hasTalent(SPELLS.ONE_WITH_THE_PACK_TALENT.id)) {
      return {
        actual: this.focusSavedPercentOfAvailable,
        isLessThan: {
          minor: 0.12,
          average: 0.1,
          major: 0.08,
        },
        style: 'percentage',
      };
    } else {
      return {
        actual: this.focusSavedPercentOfAvailable,
        isLessThan: {
          minor: 0.09,
          average: 0.075,
          major: 0.06,
        },
        style: 'percentage',
      };
    }
  }
  suggestions(when) {
    when(this.focusSavedThreshold).addSuggestion((suggest, actual, recommended) => {
      return suggest(<React.Fragment>You didn't save as much focus through <ItemLink id={ITEMS.ROAR_OF_THE_SEVEN_LIONS.id} /> as recommended, try to make sure you enter <SpellLink id={SPELLS.BESTIAL_WRATH.id} /> with a high amount of focus and dump as much focus as you can inside that window. </React.Fragment>)
        .icon(ITEMS.ROAR_OF_THE_SEVEN_LIONS.icon)
        .actual(`${formatPercentage(actual)}% of total available focus was saved through Roar of the Seven Lions`)
        .recommended(`>${formatPercentage(recommended)}% is recommended`);
    });
  }
}

export default RoarOfTheSevenLions;
