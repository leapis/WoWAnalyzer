import SPECS from 'common/SPECS';
import traitIdMap from 'common/TraitIdMap';

import Entity from './Entity';

export const TALENT_ROWS = {
  LV15: 0,
  LV30: 1,
  LV45: 2,
  LV60: 3,
  LV75: 4,
  LV90: 5,
  LV100: 6,
};
export const GEAR_SLOTS = {
  HEAD: 0,
  NECK: 1,
  SHOULDER: 2,
  SHIRT: 3,
  CHEST: 4,
  WAIST: 5,
  LEGS: 6,
  FEET: 7,
  WRISTS: 8,
  HANDS: 9,
  FINGER1: 10,
  FINGER2: 11,
  TRINKET1: 12,
  TRINKET2: 13,
  BACK: 14,
  MAINHAND: 15,
  OFFHAND: 16,
  TABARD: 17,
};

class Combatant extends Entity {
  get name() {
    return this._combatantInfo.name;
  }
  get specId() {
    return this._combatantInfo.specID;
  }
  get spec() {
    return SPECS[this.specId];
  }

  _combatantInfo = null;
  constructor(parser, combatantInfo) {
    super(parser);

    const playerInfo = parser.playersById[combatantInfo.sourceID];
    this._combatantInfo = {
      // In super rare cases `playerInfo` can be undefined, not taking this into account would cause the log to be unparsable
      name: playerInfo && playerInfo.name,
      ...combatantInfo,
    };

    this._parseTalents(combatantInfo.talents);
    this._parseTraits(combatantInfo.artifact);
    this._parseGear(combatantInfo.gear);
  }

  // region Talents
  _talentsByRow = {};
  _parseTalents(talents) {
    talents.forEach(({ id }, index) => {
      this._talentsByRow[index] = id;
    });
  }
  get talents() {
    return Object.values(this._talentsByRow);
  }
  _getTalent(row) {
    return this._talentsByRow[row];
  }
  get lv15Talent() {
    return this._getTalent(TALENT_ROWS.LV15);
  }
  get lv30Talent() {
    return this._getTalent(TALENT_ROWS.LV30);
  }
  get lv45Talent() {
    return this._getTalent(TALENT_ROWS.LV45);
  }
  get lv60Talent() {
    return this._getTalent(TALENT_ROWS.LV60);
  }
  get lv75Talent() {
    return this._getTalent(TALENT_ROWS.LV75);
  }
  get lv90Talent() {
    return this._getTalent(TALENT_ROWS.LV90);
  }
  get lv100Talent() {
    return this._getTalent(TALENT_ROWS.LV100);
  }
  hasTalent(spellId) {
    return !!Object.keys(this._talentsByRow).find(row => this._talentsByRow[row] === spellId);
  }
  // endregion

  // region Traits
  traitsBySpellId = {};
  _parseTraits(traits) {
    traits.forEach(({ traitID, rank }) => {
      const spellId = traitIdMap[traitID];
      if (!this.traitsBySpellId[spellId]) {
        this.traitsBySpellId[spellId] = [];
      }
      this.traitsBySpellId[spellId].push(rank);
    });
  }
  hasTrait(spellId) {
    return !!this.traitsBySpellId[spellId];
  }
  traitRanks(spellId) {
    return this.traitsBySpellId[spellId];
  }
  // endregion

  // region Gear
  _gearItemsBySlotId = {};
  _parseGear(gear) {
    gear.forEach((item, index) => {
      this._gearItemsBySlotId[index] = item;
    });
  }
  _getGearItemBySlotId(slotId) {
    return this._gearItemsBySlotId[slotId];
  }
  get gear() {
    return Object.values(this._gearItemsBySlotId);
  }
  get head() {
    return this._getGearItemBySlotId(GEAR_SLOTS.HEAD);
  }
  hasHead(itemId) {
    return this.head && this.head.id === itemId;
  }
  get neck() {
    return this._getGearItemBySlotId(GEAR_SLOTS.NECK);
  }
  hasNeck(itemId) {
    return this.neck && this.neck.id === itemId;
  }
  get shoulder() {
    return this._getGearItemBySlotId(GEAR_SLOTS.SHOULDER);
  }
  hasShoulder(itemId) {
    return this.shoulder && this.shoulder.id === itemId;
  }
  get back() {
    return this._getGearItemBySlotId(GEAR_SLOTS.BACK);
  }
  hasBack(itemId) {
    return this.back && this.back.id === itemId;
  }
  get chest() {
    return this._getGearItemBySlotId(GEAR_SLOTS.CHEST);
  }
  hasChest(itemId) {
    return this.chest && this.chest.id === itemId;
  }
  get wrists() {
    return this._getGearItemBySlotId(GEAR_SLOTS.WRISTS);
  }
  hasWrists(itemId) {
    return this.wrists && this.wrists.id === itemId;
  }
  get hands() {
    return this._getGearItemBySlotId(GEAR_SLOTS.HANDS);
  }
  hasHands(itemId) {
    return this.hands && this.hands.id === itemId;
  }
  get waist() {
    return this._getGearItemBySlotId(GEAR_SLOTS.WAIST);
  }
  hasWaist(itemId) {
    return this.waist && this.waist.id === itemId;
  }
  get legs() {
    return this._getGearItemBySlotId(GEAR_SLOTS.LEGS);
  }
  hasLegs(itemId) {
    return this.legs && this.legs.id === itemId;
  }
  get feet() {
    return this._getGearItemBySlotId(GEAR_SLOTS.FEET);
  }
  hasFeet(itemId) {
    return this.feet && this.feet.id === itemId;
  }
  get finger1() {
    return this._getGearItemBySlotId(GEAR_SLOTS.FINGER1);
  }
  get finger2() {
    return this._getGearItemBySlotId(GEAR_SLOTS.FINGER2);
  }
  getFinger(itemId) {
    if (this.finger1 && this.finger1.id === itemId) {
      return this.finger1;
    }
    if (this.finger2 && this.finger2.id === itemId) {
      return this.finger2;
    }

    return undefined;
  }
  hasFinger(itemId) {
    return this.getFinger(itemId) !== undefined;
  }
  get trinket1() {
    return this._getGearItemBySlotId(GEAR_SLOTS.TRINKET1);
  }
  get trinket2() {
    return this._getGearItemBySlotId(GEAR_SLOTS.TRINKET2);
  }
  getTrinket(itemId) {
    if (this.trinket1 && this.trinket1.id === itemId) {
      return this.trinket1;
    }
    if (this.trinket2 && this.trinket2.id === itemId) {
      return this.trinket2;
    }

    return undefined;
  }
  hasTrinket(itemId) {
    return this.getTrinket(itemId) !== undefined;
  }
  getItem(itemId) {
    return Object.keys(this._gearItemsBySlotId)
      .map(key => this._gearItemsBySlotId[key])
      .find(item => item.id === itemId);
  }
  // endregion
}

export default Combatant;
