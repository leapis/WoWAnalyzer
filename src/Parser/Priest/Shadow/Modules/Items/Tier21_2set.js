import React from 'react';

import SPELLS from 'common/SPELLS';
import SpellIcon from 'common/SpellIcon';
import SpellLink from 'common/SpellLink';
import Analyzer from 'Parser/Core/Analyzer';
import HIT_TYPES from 'Parser/Core/HIT_TYPES';
import calculateEffectiveDamage from 'Parser/Core/calculateEffectiveDamage';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';

const REGULAR_CRIT_MODIFIER = 2;
const SET_CRIT_MODIFIER = 2.5;
const SET_DAMAGE_INCREASE_MODIFIER = SET_CRIT_MODIFIER / REGULAR_CRIT_MODIFIER - 1;

class Tier21_2set extends Analyzer {
  bonusDamage = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasBuff(SPELLS.SHADOW_PRIEST_T21_2SET_BONUS_PASSIVE.id);
  }

  on_byPlayer_damage(event) {
    const spellId = event.ability.guid;
    if (event.hitType !== HIT_TYPES.CRIT) return;
    if (spellId !== SPELLS.MIND_BLAST.id && spellId !== SPELLS.MIND_FLAY.id) return;

    this.bonusDamage += calculateEffectiveDamage(event, SET_DAMAGE_INCREASE_MODIFIER);
  }

  item() {
    return {
      id: `spell-${SPELLS.SHADOW_PRIEST_T21_2SET_BONUS_PASSIVE.id}`,
      icon: <SpellIcon id={SPELLS.SHADOW_PRIEST_T21_2SET_BONUS_PASSIVE.id} />,
      title: <SpellLink id={SPELLS.SHADOW_PRIEST_T21_2SET_BONUS_PASSIVE.id} icon={false} />,
      result: <ItemDamageDone amount={this.bonusDamage} />,
    };
  }
}

export default Tier21_2set;
