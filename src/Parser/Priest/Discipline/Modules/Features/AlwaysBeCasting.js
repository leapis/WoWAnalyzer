import SPELLS from 'common/SPELLS';
import CoreAlwaysBeCastingHealing from 'Parser/Core/Modules/AlwaysBeCastingHealing';
import { formatPercentage } from 'common/format';

import SuggestionThresholds from '../../SuggestionThresholds';

const debug = false;

/** The amount of time during which it's impossible a second Penance could have started */
const PENANCE_CHANNEL_TIME_BUFFER = 2500;

class AlwaysBeCasting extends CoreAlwaysBeCastingHealing {
// counting damaging abilities here because of atonement mechanics
  static HEALING_ABILITIES_ON_GCD = [
    SPELLS.POWER_WORD_SHIELD.id,
    SPELLS.POWER_WORD_RADIANCE.id,
    SPELLS.SHADOW_MEND.id,
    SPELLS.HALO_TALENT.id,
    SPELLS.DIVINE_STAR_TALENT.id,
    SPELLS.MASS_DISPEL.id,
    SPELLS.DISPEL_MAGIC.id,
    SPELLS.POWER_WORD_BARRIER_CAST.id,
    SPELLS.PURIFY.id,
    SPELLS.POWER_WORD_SOLACE_TALENT.id,
    SPELLS.CLARITY_OF_WILL_TALENT.id,
    SPELLS.SHADOW_COVENANT_TALENT.id,
    SPELLS.EVANGELISM_TALENT.id,
  ];

  lastPenanceStartTimestamp = null;

  // TODO: Fix me
  recordCastTime(
    castStartTimestamp,
    globalCooldown,
    begincast,
    cast,
    spellId
  ) {
    if (spellId === SPELLS.PENANCE.id || spellId === SPELLS.PENANCE_HEAL.id) {
      if (!this.lastPenanceStartTimestamp || (castStartTimestamp - this.lastPenanceStartTimestamp) > PENANCE_CHANNEL_TIME_BUFFER) {
        debug && console.log('%cABC: New penance channel started', 'color: orange');
        this.lastPenanceStartTimestamp = castStartTimestamp;
      } else {
        // This is a follow up from an existing Penance channel, it doesn't start its own GCD but the last cast is always after the initial GCD. This makes it so the last cast is still considered a valid cast.
        debug && console.log('%cABC: Follow up penance cast, ignoring time wasted', 'color: gray');
        this._lastCastFinishedTimestamp = Math.max(this._lastCastFinishedTimestamp, cast.timestamp);
        return; // by returning here we don't get an invalid time wasted added
      }
    }

    super.recordCastTime(
      castStartTimestamp,
      globalCooldown,
      begincast,
      cast,
      spellId
    );
  }

  suggestions(when) {
    const deadTimePercentage = this.totalTimeWasted / this.owner.fightDuration;

    when(deadTimePercentage).isGreaterThan(SuggestionThresholds.ABC_NOT_CASTING.minor)
      .addSuggestion((suggest, actual, recommended) => {
        return suggest('Your downtime can be improved. Try to Always Be Casting (ABC); try to reduce the delay between casting spells and when you\'re not healing try to contribute some damage.')
          .icon('spell_mage_altertime')
          .actual(`${formatPercentage(actual)}% downtime`)
          .recommended(`<${formatPercentage(recommended)}% is recommended`)
          .regular(SuggestionThresholds.ABC_NOT_CASTING.regular).major(SuggestionThresholds.ABC_NOT_CASTING.major);
      });
  }
}

export default AlwaysBeCasting;
