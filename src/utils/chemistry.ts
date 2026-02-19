import type { PlacedAtom, Bond, ElementData, AppState } from '../types';
import { KNOWN_COMPOUNDS } from '../data/compounds';

export function computeFormula(atoms: PlacedAtom[]): string {
  const counts: Record<string, number> = {};
  for (const a of atoms) {
    counts[a.element.symbol] = (counts[a.element.symbol] || 0) + 1;
  }
  const order = Object.keys(counts).sort((a, b) => {
    if (a === 'C') return -1;
    if (b === 'C') return 1;
    if (a === 'H') return -1;
    if (b === 'H') return 1;
    return a.localeCompare(b);
  });
  return order.map(s => (counts[s] > 1 ? `${s}${counts[s]}` : s)).join('');
}

export function detectBonds(atoms: PlacedAtom[]): Bond[] {
  const bonds: Bond[] = [];
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const a = atoms[i];
      const b = atoms[j];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (dist < 130) {
        const aIsMetal = a.element.isMetal;
        const bIsMetal = b.element.isMetal;
        let bondType: Bond['type'];
        if (aIsMetal && bIsMetal) bondType = 'metallic';
        else if (aIsMetal !== bIsMetal) bondType = 'ionic';
        else bondType = 'covalent';

        const sharedPairs = Math.min(
          Math.floor((8 - a.element.valenceElectrons) / 2),
          Math.floor((8 - b.element.valenceElectrons) / 2),
        );
        const order = Math.max(1, Math.min(3, sharedPairs));
        bonds.push({ from: a.id, to: b.id, type: bondType, order });
      }
    }
  }
  return bonds;
}

export function validateBond(a: ElementData, b: ElementData): { valid: boolean; reason: string } {
  if (a.category === 'noble-gas' || b.category === 'noble-gas') {
    const ng = a.category === 'noble-gas' ? a : b;
    return { valid: false, reason: `${ng.name} is a noble gas and rarely forms bonds (stable octet).` };
  }
  return { valid: true, reason: '' };
}

export function generateFeedback(
  atoms: PlacedAtom[],
  bonds: Bond[],
  formula: string,
): { msg: string; type: AppState['feedbackType'] } {
  if (atoms.length === 0)
    return { msg: 'Drag atoms from the periodic table into the sandbox to begin building molecules!', type: 'info' };
  if (atoms.length === 1)
    return {
      msg: `${atoms[0].element.name} added. Add more atoms to form bonds. Valence electrons: ${atoms[0].element.valenceElectrons}`,
      type: 'info',
    };

  const compound = KNOWN_COMPOUNDS[formula];
  if (compound) {
    const bondTypes = [...new Set(bonds.map(b => b.type))];
    return {
      msg: `✨ ${compound.name} (${formula}) — ${bondTypes.join(' & ')} bonding | Geometry: ${compound.geometry} | Bond Angle: ${compound.bondAngle}`,
      type: 'success',
    };
  }

  if (bonds.length === 0 && atoms.length > 1)
    return { msg: `${atoms.length} atoms present but no bonds detected. Bring atoms closer together (within 130px).`, type: 'warning' };

  const ionicBonds = bonds.filter(b => b.type === 'ionic');
  const covalentBonds = bonds.filter(b => b.type === 'covalent');

  if (ionicBonds.length > 0 && covalentBonds.length === 0)
    return { msg: `Formula: ${formula} — Ionic bonding detected (metal + nonmetal electron transfer).`, type: 'info' };

  if (covalentBonds.length > 0 && ionicBonds.length === 0) {
    const doubleBonds = bonds.filter(b => b.order === 2).length;
    const tripleBonds = bonds.filter(b => b.order === 3).length;
    let desc = 'Covalent bonding (electron sharing)';
    if (tripleBonds > 0) desc += ` | ${tripleBonds} triple bond(s)`;
    else if (doubleBonds > 0) desc += ` | ${doubleBonds} double bond(s)`;
    return { msg: `Formula: ${formula} — ${desc}.`, type: 'info' };
  }

  return { msg: `Formula: ${formula} — ${bonds.length} bond(s) detected (mixed ionic/covalent).`, type: 'info' };
}
