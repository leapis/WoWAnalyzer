import React from 'react';
import Analyzer from 'Parser/Core/Analyzer';
import SPELLS from 'common/SPELLS';
import SpellLink from 'common/SpellLink';
import calculateEffectiveDamage from 'Parser/Core/calculateEffectiveDamage';
import CorePets from 'Parser/Core/Modules/Pets';
import PETS from 'common/PETS';
import ItemDamageDone from 'Interface/Others/ItemDamageDone';

const BLINK_STRIKES_MELEE_MODIFIER = 1;
const DIRE_BEAST_DURATION = 8000;

const BLINK_STRIKES_NOT_AFFECTED_PETS = [
  PETS.HATI.id,
  PETS.HATI_2.id,
  PETS.HATI_3.id,
  PETS.HATI_4.id,
  PETS.HATI_5.id,
  PETS.HATI_6.id,
  PETS.HATI_7.id,
];

/**
 * Your pet's Basic Attack deals 100% increased damage, can now be used from 30 yards away, and will instantly teleport your pet behind its
 * target. Your pet can teleport only once per 20 sec.
 */
class BlinkStrikes extends Analyzer {
  static dependencies = {
    pets: CorePets,
  };

  damage = 0;
  currentDireBeasts = [];

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.BLINK_STRIKES_TALENT.id);
  }

  on_byPlayer_summon(event) {
    const spellID = event.ability.guid;
    if (spellID === SPELLS.COBRA_COMMANDER.id) {
      return;
    }
    this.currentDireBeasts.push({
      end: event.timestamp + DIRE_BEAST_DURATION,
      ID: event.targetID,
      instance: event.targetInstance,
    });
  }

  on_byPlayerPet_damage(event) {
    const spellId = event.ability.guid;
    if (spellId !== SPELLS.MELEE.id) {
      return;
    }
    const index = this.currentDireBeasts.findIndex(direBeast => direBeast.ID === event.sourceID && direBeast.instance === event.sourceInstance);
    const selectedDireBeast = this.currentDireBeasts[index];
    if (selectedDireBeast) {
      return;
    }
    const pet = this.pets.getSourceEntity(event);
    if (BLINK_STRIKES_NOT_AFFECTED_PETS.some(id => pet.guid === id)) {
      return;
    }
    this.damage += calculateEffectiveDamage(event, BLINK_STRIKES_MELEE_MODIFIER);
  }

  subStatistic() {
    if (this.damage > 0) {
      // TODO: Remove this if-statement since rendering should be consistent regardless of cast count OR document why this is an exception
      return (
        <div className="flex">
          <div className="flex-main">
            <SpellLink id={SPELLS.BLINK_STRIKES_TALENT.id} />
          </div>
          <div className="flex-sub text-right">
            <ItemDamageDone amount={this.damage} />
          </div>
        </div>
      );
    }
    return null;
  }
}

export default BlinkStrikes;
