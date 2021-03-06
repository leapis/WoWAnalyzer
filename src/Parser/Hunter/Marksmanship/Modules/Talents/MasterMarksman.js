import React from 'react';

import Analyzer from 'Parser/Core/Analyzer';

import SPELLS from 'common/SPELLS';
import StatisticBox from 'Interface/Others/StatisticBox';
import SpellIcon from 'common/SpellIcon';

/**
 * Aimed Shot has a 100% chance to reduce the focus cost of your next Arcane Shot or Multi-Shot by 100%.
 */

const FOCUS_COST = 15;

class MasterMarksman extends Analyzer {

  overwrittenBuffs = 0;
  usedProcs = 0;

  affectedSpells = {
    [SPELLS.ARCANE_SHOT.id]: {
      casts: 0,
      name: SPELLS.ARCANE_SHOT.name,
    },
    [SPELLS.MULTISHOT_MM.id]: {
      casts: 0,
      name: SPELLS.MULTISHOT_MM.name,
    },
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.MASTER_MARKSMAN_TALENT.id);
  }

  on_byPlayer_cast(event) {
    const spellId = event.ability.guid;
    if (!this.selectedCombatant.hasBuff(SPELLS.MASTER_MARKSMAN_BUFF.id, event.timestamp) || (spellId !== SPELLS.ARCANE_SHOT.id && spellId !== SPELLS.MULTISHOT_MM.id && spellId !== SPELLS.AIMED_SHOT.id)) {
      return;
    }
    if (spellId === SPELLS.AIMED_SHOT.id) {
      this.overwrittenBuffs++;
      return;
    }
    this.usedProcs++;
    this.affectedSpells[spellId].casts++;
  }

  get totalProcs() {
    return this.overwrittenBuffs + this.usedProcs;
  }

  statistic() {
    let tooltipText = `You gained a total of ${this.totalProcs} procs, and utilised ${this.usedProcs} of them.<ul>`;
    tooltipText += this.affectedSpells[SPELLS.ARCANE_SHOT.id].casts > 0 ? `<li>Out of the total procs, you used ${this.affectedSpells[SPELLS.ARCANE_SHOT.id].casts} of them on ${this.affectedSpells[SPELLS.ARCANE_SHOT.id].name}. <ul><li>This saved you a total of ${this.affectedSpells[SPELLS.ARCANE_SHOT.id].casts * FOCUS_COST} focus.</li></ul></li>` : ``;
    tooltipText += this.affectedSpells[SPELLS.MULTISHOT_MM.id].casts > 0 ? `<li>Out of the total procs, you used ${this.affectedSpells[SPELLS.MULTISHOT_MM.id].casts} of them on ${this.affectedSpells[SPELLS.MULTISHOT_MM.id].name}.<ul><li>This saved you a total of ${this.affectedSpells[SPELLS.MULTISHOT_MM.id].casts * FOCUS_COST} focus.</li></ul></li>` : ``;
    tooltipText += `</ul>`;
    return (
      <StatisticBox
        icon={<SpellIcon id={SPELLS.MASTER_MARKSMAN_TALENT.id} />}
        value={`${this.usedProcs}/${this.totalProcs}`}
        label="utilised MM buffs"
        tooltip={tooltipText} />
    );
  }

}

export default MasterMarksman;
