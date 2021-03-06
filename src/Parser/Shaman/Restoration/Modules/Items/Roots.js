import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import Analyzer from 'Parser/Core/Analyzer';
import AbilityTracker from 'Parser/Core/Modules/AbilityTracker';
import ItemHealingDone from 'Interface/Others/ItemHealingDone';

import CooldownThroughputTracker from '../Features/CooldownThroughputTracker';

class Roots extends Analyzer {
  static dependencies = {
    cooldownThroughputTracker: CooldownThroughputTracker,
    abilityTracker: AbilityTracker,
  };

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasLegs(ITEMS.ROOTS_OF_SHALADRASSIL.id);
  }

  item() {
    const healing = this.abilityTracker.getAbility(SPELLS.ROOTS_OF_SHALADRASSIL_HEAL.id).healingEffective;
    const feeding = this.cooldownThroughputTracker.getIndirectHealing(SPELLS.ROOTS_OF_SHALADRASSIL_HEAL.id);
    return {
      item: ITEMS.ROOTS_OF_SHALADRASSIL,
      result: (
        <dfn
          data-tip={`
            Healing
            <ul>
              <li>${this.owner.formatItemHealingDone(healing)}</li>
            </ul>
            Feeding (Fully overhealed ticks are not included)
            <ul>
              <li>${this.owner.formatItemHealingDone(feeding)}</li>
            </ul>
          `}
        >
          <ItemHealingDone amount={healing+feeding} />
        </dfn>
      ),
    };
  }
}

export default Roots;
