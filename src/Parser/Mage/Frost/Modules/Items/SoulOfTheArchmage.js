import React from 'react';

import ITEMS from 'common/ITEMS';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import ItemLink from 'common/ItemLink';
import Analyzer from 'Parser/Core/Analyzer';
import SUGGESTION_IMPORTANCE from 'Parser/Core/ISSUE_IMPORTANCE';

/**
 * Soul of the Archmage:
 * Gain the Frozen Touch talent
 */
class SoulOfTheArchmage extends Analyzer {

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasFinger(ITEMS.SOUL_OF_THE_ARCHMAGE.id);
    this.hasPickedOtherTalent = this.selectedCombatant.hasTalent(SPELLS.ICE_NOVA_TALENT.id) || this.selectedCombatant.hasTalent(SPELLS.SPLITTING_ICE_TALENT.id);
  }

  item() {
    return {
      item: ITEMS.SOUL_OF_THE_ARCHMAGE,
      result: <React.Fragment>This gave you <SpellLink id={SPELLS.FROZEN_TOUCH_TALENT.id} />.</React.Fragment>,
    };
  }

  suggestions(when) {
    when(this.hasPickedOtherTalent).isFalse()
      .addSuggestion((suggest) => {
        return suggest(<React.Fragment>When using <ItemLink id={ITEMS.SOUL_OF_THE_ARCHMAGE.id} /> please make sure to pick another talent in the same talent row. Your choices are <SpellLink id={SPELLS.ICE_NOVA_TALENT.id} /> or <SpellLink id={SPELLS.SPLITTING_ICE_TALENT.id} />.</React.Fragment>)
          .icon(ITEMS.SOUL_OF_THE_ARCHMAGE.icon)
          .staticImportance(SUGGESTION_IMPORTANCE.MAJOR);
      });
  }
}

export default SoulOfTheArchmage;
