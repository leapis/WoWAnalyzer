import React from 'react';

import SPELLS from 'common/SPELLS';
import ITEMS from 'common/ITEMS';
import { calculatePrimaryStat } from 'common/stats';
import Analyzer from 'Parser/Core/Analyzer';
import SpellManaCost from 'Parser/Core/Modules/SpellManaCost';
import ItemManaGained from 'Interface/Others/ItemManaGained';

const debug = false;

const BASE_PROMISES_ITEM_LEVEL = 180;
const BASE_MANA_REDUCTION_PER_CARD = {
  191615: 30, // Ace
  191616: 41, // 2
  191617: 53, // 3
  191618: 64, // 4
  191619: 75, // 5
  191620: 86, // 6
  191621: 98, // 7
  191622: 120, // 8
};

/**
 * Darkmoon Deck: Promises -
 * Equip: Reduces the base mana cost of your spells by 604-2,415. The amount of mana reduction depends on the topmost card in the deck.
 * Equip: Periodically shuffle the deck while in combat.
 */
class DarkmoonDeckPromises extends Analyzer {
  static dependencies = {
    spellManaCost: SpellManaCost, // we need this to add `manaCost` to the `event`
  };

  MANA_REDUCTION_PER_CARD = {};
  currentManaReduction = 0; // Start the fight at average, this should cause for the smallest discrepancy

  manaGained = 0;

  constructor(...args) {
    super(...args);
    const selectedCombatant = this.selectedCombatant;
    this.active = selectedCombatant.hasTrinket(ITEMS.DARKMOON_DECK_PROMISES.id);

    if (this.active) {
      const item = (selectedCombatant.trinket1 && selectedCombatant.trinket1.id === ITEMS.DARKMOON_DECK_PROMISES.id) ? selectedCombatant.trinket1 : selectedCombatant.trinket2;

      let average = 0;
      Object.keys(BASE_MANA_REDUCTION_PER_CARD).forEach((key) => {
        // DMD: Promises mana reduction uses primary stat formula unlike most trinket secondaries, confirmed confirmed
        const manaReduction = calculatePrimaryStat(BASE_PROMISES_ITEM_LEVEL, BASE_MANA_REDUCTION_PER_CARD[key], item.itemLevel);
        this.MANA_REDUCTION_PER_CARD[key] = manaReduction;
        average += manaReduction;
      });
      this.currentManaReduction = average / Object.keys(BASE_MANA_REDUCTION_PER_CARD).length;
    }
  }

  on_byPlayer_applybuff(event) {
    const spellId = event.ability.guid;
    const card = this.MANA_REDUCTION_PER_CARD[spellId];
    if (!card) {
      return;
    }
    this.currentManaReduction = card;
  }

  getManaSaved(event) {
    const manaCost = event.manaCost;
    if (!manaCost) {
      return 0;
    }

    return Math.min(this.currentManaReduction, manaCost);
  }

  on_byPlayer_cast(event) {
    const manaSaved = this.getManaSaved(event);
    if (!manaSaved) {
      return;
    }
    const spellId = event.ability.guid;

    if (!event.isManaCostNullified) {
      debug && console.log('Promises saved', manaSaved, 'mana on', SPELLS[spellId].name, 'costing', event.manaCost, event);
      this.manaGained += manaSaved;
    } else {
      debug && console.log('Promises saved 0 mana on', SPELLS[spellId].name, 'costing', event.manaCost, 'since Innervate or Symbol of Hope is active (normally ', manaSaved, ' mana)', event);
    }

    // Update the mana cost on the cast so that it's accurate for other modules
    event.manaCost = Math.max(0, event.manaCost - manaSaved);
  }

  item() {
    return {
      item: ITEMS.DARKMOON_DECK_PROMISES,
      result: <ItemManaGained amount={this.manaGained} />,
    };
  }
}

export default DarkmoonDeckPromises;
