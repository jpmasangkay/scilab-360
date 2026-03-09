export interface BondingEntry {
  id: number;
  formula: string;
  name: string;
  bondType: 'covalent' | 'ionic' | 'metallic' | 'polar-covalent' | 'coordinate';
  atoms: string[];
  description: string;
  properties: string;
  electronegativityDiff: number;
  molarMass: number;
  state: 'solid' | 'liquid' | 'gas';
  category: 'organic' | 'inorganic' | 'acid' | 'base' | 'salt' | 'oxide' | 'hydride' | 'other';
}

export const BONDING_DATA: BondingEntry[] = [
  // ── COVALENT ──────────────────────────────────────────────────
  {
    id: 1, formula: 'H₂', name: 'Hydrogen Gas', bondType: 'covalent',
    atoms: ['H', 'H'], electronegativityDiff: 0, molarMass: 2.016, state: 'gas', category: 'other',
    description: 'Two hydrogen atoms share a single pair of electrons forming the simplest covalent bond. H₂ is the lightest and most abundant molecule in the universe.',
    properties: 'Colorless, odorless, highly flammable gas. Used as rocket fuel, in fuel cells, and ammonia production.',
  },
  {
    id: 2, formula: 'O₂', name: 'Oxygen Gas', bondType: 'covalent',
    atoms: ['O', 'O'], electronegativityDiff: 0, molarMass: 31.998, state: 'gas', category: 'other',
    description: 'Two oxygen atoms share two pairs of electrons forming a double bond. Essential for aerobic respiration in living organisms.',
    properties: 'Colorless, odorless gas. Supports combustion. Makes up ~21% of Earth\'s atmosphere.',
  },
  {
    id: 3, formula: 'N₂', name: 'Nitrogen Gas', bondType: 'covalent',
    atoms: ['N', 'N'], electronegativityDiff: 0, molarMass: 28.014, state: 'gas', category: 'other',
    description: 'Two nitrogen atoms share three pairs of electrons forming a very strong triple bond. The N≡N bond is one of the strongest bonds in chemistry (945 kJ/mol).',
    properties: 'Colorless, odorless, inert gas. Makes up ~78% of Earth\'s atmosphere. Used in cryogenics and as an inert atmosphere.',
  },
  {
    id: 4, formula: 'Cl₂', name: 'Chlorine Gas', bondType: 'covalent',
    atoms: ['Cl', 'Cl'], electronegativityDiff: 0, molarMass: 70.906, state: 'gas', category: 'other',
    description: 'Two chlorine atoms share one electron pair. Chlorine is a diatomic halogen with a pungent, suffocating odor.',
    properties: 'Yellow-green gas with a strong smell. Highly toxic. Used in water purification and as a disinfectant.',
  },
  {
    id: 5, formula: 'F₂', name: 'Fluorine Gas', bondType: 'covalent',
    atoms: ['F', 'F'], electronegativityDiff: 0, molarMass: 37.997, state: 'gas', category: 'other',
    description: 'Two fluorine atoms share one electron pair. Fluorine is the most electronegative and reactive of all elements.',
    properties: 'Pale yellow gas. Extremely reactive and corrosive. Reacts with almost all elements and compounds.',
  },
  {
    id: 6, formula: 'CH₄', name: 'Methane', bondType: 'covalent',
    atoms: ['C', 'H', 'H', 'H', 'H'], electronegativityDiff: 0.35, molarMass: 16.043, state: 'gas', category: 'organic',
    description: 'Carbon forms four single covalent bonds with hydrogen atoms in a tetrahedral geometry. The simplest hydrocarbon and primary component of natural gas.',
    properties: 'Colorless, odorless gas. Highly flammable. Potent greenhouse gas (~80x more warming than CO₂ over 20 years).',
  },
  {
    id: 7, formula: 'C₂H₆', name: 'Ethane', bondType: 'covalent',
    atoms: ['C', 'C', 'H', 'H', 'H', 'H', 'H', 'H'], electronegativityDiff: 0.35, molarMass: 30.07, state: 'gas', category: 'organic',
    description: 'Two carbon atoms linked by a single C-C bond, each bonded to three hydrogen atoms. Second-simplest alkane.',
    properties: 'Colorless, odorless gas. Found in natural gas. Used to produce ethylene for plastics.',
  },
  {
    id: 8, formula: 'C₂H₄', name: 'Ethylene', bondType: 'covalent',
    atoms: ['C', 'C', 'H', 'H', 'H', 'H'], electronegativityDiff: 0.35, molarMass: 28.054, state: 'gas', category: 'organic',
    description: 'Two carbon atoms share a double bond (C=C), each bonded to two hydrogens. The simplest alkene with planar geometry.',
    properties: 'Colorless gas with faint sweet odor. Most-produced organic compound worldwide. Used to make polyethylene plastics.',
  },
  {
    id: 9, formula: 'C₂H₂', name: 'Acetylene', bondType: 'covalent',
    atoms: ['C', 'C', 'H', 'H'], electronegativityDiff: 0.35, molarMass: 26.038, state: 'gas', category: 'organic',
    description: 'Two carbon atoms share a triple bond (C≡C), each bonded to one hydrogen. The simplest alkyne with linear geometry.',
    properties: 'Colorless gas. Burns at ~3,300°C in oxyacetylene torches. Used in welding and cutting metals.',
  },
  {
    id: 10, formula: 'CO₂', name: 'Carbon Dioxide', bondType: 'covalent',
    atoms: ['C', 'O', 'O'], electronegativityDiff: 0.89, molarMass: 44.009, state: 'gas', category: 'oxide',
    description: 'Carbon forms two double bonds with oxygen (O=C=O) in a linear geometry. A product of combustion and cellular respiration.',
    properties: 'Colorless, odorless gas. Greenhouse gas causing climate change. Used in carbonated drinks, fire extinguishers, and dry ice.',
  },
  {
    id: 11, formula: 'CO', name: 'Carbon Monoxide', bondType: 'covalent',
    atoms: ['C', 'O'], electronegativityDiff: 0.89, molarMass: 28.01, state: 'gas', category: 'oxide',
    description: 'Carbon and oxygen share a triple bond (one σ + two π bonds), with a lone pair on carbon. Contains one coordinate (dative) bond.',
    properties: 'Colorless, odorless, deadly poison. Binds to hemoglobin 200x stronger than O₂. Produced by incomplete combustion.',
  },
  {
    id: 12, formula: 'NH₃', name: 'Ammonia', bondType: 'covalent',
    atoms: ['N', 'H', 'H', 'H'], electronegativityDiff: 0.84, molarMass: 17.031, state: 'gas', category: 'base',
    description: 'Nitrogen forms three covalent bonds with hydrogen, leaving one lone pair. Trigonal pyramidal geometry with 107° bond angle.',
    properties: 'Colorless gas with sharp, pungent odor. Essential for fertilizers (Haber process). Used in cleaning products.',
  },
  {
    id: 13, formula: 'H₂S', name: 'Hydrogen Sulfide', bondType: 'covalent',
    atoms: ['H', 'S', 'H'], electronegativityDiff: 0.38, molarMass: 34.08, state: 'gas', category: 'other',
    description: 'Sulfur forms two covalent bonds with hydrogen atoms, similar to water but with weaker bonds. Bent geometry with 92° angle.',
    properties: 'Colorless gas with rotten egg smell. Highly toxic — can cause death at 500 ppm. Found in volcanic emissions.',
  },
  {
    id: 14, formula: 'SO₂', name: 'Sulfur Dioxide', bondType: 'covalent',
    atoms: ['S', 'O', 'O'], electronegativityDiff: 0.86, molarMass: 64.066, state: 'gas', category: 'oxide',
    description: 'Sulfur forms double bonds with two oxygen atoms in a bent geometry (~119°). Contains delocalized π electrons.',
    properties: 'Colorless gas with choking odor. Major air pollutant causing acid rain. Used as preservative (E220) in wine.',
  },
  {
    id: 15, formula: 'SO₃', name: 'Sulfur Trioxide', bondType: 'covalent',
    atoms: ['S', 'O', 'O', 'O'], electronegativityDiff: 0.86, molarMass: 80.06, state: 'gas', category: 'oxide',
    description: 'Sulfur bonds to three oxygen atoms in a trigonal planar geometry (120°). Reacts violently with water to form sulfuric acid.',
    properties: 'Colorless liquid/gas. Extremely corrosive. Key intermediate in sulfuric acid production (contact process).',
  },
  {
    id: 16, formula: 'NO₂', name: 'Nitrogen Dioxide', bondType: 'covalent',
    atoms: ['N', 'O', 'O'], electronegativityDiff: 0.4, molarMass: 46.006, state: 'gas', category: 'oxide',
    description: 'Nitrogen bonds to two oxygen atoms with one unpaired electron (free radical). Bent geometry. Brown colored gas.',
    properties: 'Reddish-brown gas with acrid odor. Air pollutant from car exhausts. Contributes to smog and acid rain.',
  },

  // ── POLAR COVALENT ────────────────────────────────────────────
  {
    id: 17, formula: 'H₂O', name: 'Water', bondType: 'polar-covalent',
    atoms: ['H', 'O', 'H'], electronegativityDiff: 1.24, molarMass: 18.015, state: 'liquid', category: 'other',
    description: 'Oxygen shares electrons with two hydrogen atoms, but oxygen\'s high electronegativity pulls them closer, creating a polar molecule. Bent geometry (104.5°).',
    properties: 'Universal solvent. High specific heat (4.184 J/g·°C). Expands when frozen. Essential for all known life.',
  },
  {
    id: 18, formula: 'HF', name: 'Hydrogen Fluoride', bondType: 'polar-covalent',
    atoms: ['H', 'F'], electronegativityDiff: 1.78, molarMass: 20.006, state: 'gas', category: 'acid',
    description: 'The most polar covalent bond possible. Fluorine\'s extreme electronegativity (3.98) creates a strong dipole. Forms strong hydrogen bonds.',
    properties: 'Colorless gas/liquid. Dissolves glass (SiO₂). Extremely corrosive. Used in semiconductor manufacturing.',
  },
  {
    id: 19, formula: 'HCl', name: 'Hydrogen Chloride', bondType: 'polar-covalent',
    atoms: ['H', 'Cl'], electronegativityDiff: 0.96, molarMass: 36.461, state: 'gas', category: 'acid',
    description: 'Hydrogen and chlorine share electrons unequally. Dissolves in water to form hydrochloric acid (strong acid).',
    properties: 'Colorless gas with sharp odor. The acid in your stomach (pH ~1.5). Used in steel pickling and PVC production.',
  },
  {
    id: 20, formula: 'HBr', name: 'Hydrogen Bromide', bondType: 'polar-covalent',
    atoms: ['H', 'Br'], electronegativityDiff: 0.76, molarMass: 80.912, state: 'gas', category: 'acid',
    description: 'Polar covalent bond between hydrogen and bromine. Less polar than HCl but still a strong acid in water.',
    properties: 'Colorless gas. Strong acid when dissolved. Used to produce bromide compounds in pharmaceuticals.',
  },
  {
    id: 21, formula: 'H₂O₂', name: 'Hydrogen Peroxide', bondType: 'polar-covalent',
    atoms: ['H', 'O', 'O', 'H'], electronegativityDiff: 1.24, molarMass: 34.014, state: 'liquid', category: 'other',
    description: 'Contains an O-O single bond plus two O-H polar covalent bonds. The O-O bond is weak (146 kJ/mol), making it a strong oxidizer.',
    properties: 'Pale blue liquid. Decomposes into water + oxygen. Used as disinfectant (3%), hair bleach (6%), and rocket propellant (>70%).',
  },
  {
    id: 22, formula: 'C₆H₁₂O₆', name: 'Glucose', bondType: 'polar-covalent',
    atoms: ['C', 'H', 'O'], electronegativityDiff: 0.89, molarMass: 180.156, state: 'solid', category: 'organic',
    description: 'A monosaccharide with a ring structure containing C-C, C-H, C-O, and O-H polar covalent bonds. Primary energy source for cells.',
    properties: 'White crystalline solid. Sweet taste. Blood sugar level typically 70-100 mg/dL. Photosynthesis product (6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂).',
  },
  {
    id: 23, formula: 'C₂H₅OH', name: 'Ethanol', bondType: 'polar-covalent',
    atoms: ['C', 'C', 'H', 'O', 'H'], electronegativityDiff: 1.24, molarMass: 46.069, state: 'liquid', category: 'organic',
    description: 'Contains C-C, C-H covalent bonds and a polar O-H hydroxyl group. The O-H bond makes it miscible with water.',
    properties: 'Colorless liquid with characteristic odor. Boiling point 78.37°C. Active ingredient in alcoholic beverages. Biofuel additive.',
  },
  {
    id: 24, formula: 'CH₃COOH', name: 'Acetic Acid', bondType: 'polar-covalent',
    atoms: ['C', 'C', 'H', 'O', 'O', 'H'], electronegativityDiff: 0.89, molarMass: 60.052, state: 'liquid', category: 'acid',
    description: 'Contains a carboxyl group (-COOH) with C=O double bond and O-H bond. The O-H proton is easily donated, making it a weak acid (pKa = 4.76).',
    properties: 'Colorless liquid with strong pungent odor. Vinegar is 4-8% acetic acid. Used in food preservation and chemical synthesis.',
  },
  {
    id: 25, formula: 'H₂CO₃', name: 'Carbonic Acid', bondType: 'polar-covalent',
    atoms: ['H', 'O', 'C', 'O', 'O', 'H'], electronegativityDiff: 0.89, molarMass: 62.025, state: 'liquid', category: 'acid',
    description: 'Formed when CO₂ dissolves in water. A weak, diprotic acid that exists in equilibrium: CO₂ + H₂O ⇌ H₂CO₃. Important in blood pH buffering.',
    properties: 'Unstable, exists mainly in solution. Carbonate buffer system maintains blood pH at 7.35-7.45. Found in carbonated beverages.',
  },
  {
    id: 26, formula: 'H₂SO₄', name: 'Sulfuric Acid', bondType: 'polar-covalent',
    atoms: ['H', 'O', 'S', 'O', 'O', 'O', 'H'], electronegativityDiff: 0.86, molarMass: 98.079, state: 'liquid', category: 'acid',
    description: 'Strong diprotic acid with S=O and S-OH bonds. Sulfur is in +6 oxidation state. Most produced chemical worldwide (~260 million tonnes/year).',
    properties: 'Colorless, oily liquid. Extremely corrosive. Exothermic when mixed with water. Used in batteries, fertilizers, and oil refining.',
  },
  {
    id: 27, formula: 'HNO₃', name: 'Nitric Acid', bondType: 'polar-covalent',
    atoms: ['H', 'O', 'N', 'O', 'O'], electronegativityDiff: 0.4, molarMass: 63.012, state: 'liquid', category: 'acid',
    description: 'Strong monobasic acid with N=O and N-OH bonds. Nitrogen is in +5 oxidation state. Powerful oxidizing acid.',
    properties: 'Colorless liquid that turns yellow from decomposition. Reacts with metals producing brown NO₂ gas. Used in explosives (TNT) and fertilizers.',
  },
  {
    id: 28, formula: 'H₃PO₄', name: 'Phosphoric Acid', bondType: 'polar-covalent',
    atoms: ['H', 'O', 'P', 'O', 'O', 'O', 'H', 'H'], electronegativityDiff: 1.25, molarMass: 97.994, state: 'liquid', category: 'acid',
    description: 'Triprotic acid with three P-OH bonds and one P=O bond. Phosphorus in +5 oxidation state. Weaker than sulfuric/nitric acid.',
    properties: 'Colorless, odorless syrupy liquid. Used in cola beverages (E338), rust removal, and as fertilizer.',
  },

  // ── IONIC ─────────────────────────────────────────────────────
  {
    id: 29, formula: 'NaCl', name: 'Sodium Chloride', bondType: 'ionic',
    atoms: ['Na', 'Cl'], electronegativityDiff: 2.23, molarMass: 58.44, state: 'solid', category: 'salt',
    description: 'Sodium (metal) completely transfers its valence electron to chlorine (nonmetal), forming Na⁺ and Cl⁻ ions. Classic ionic bond example.',
    properties: 'White crystalline solid. Melting point 801°C. Soluble in water. Table salt. Essential for nerve/muscle function.',
  },
  {
    id: 30, formula: 'KCl', name: 'Potassium Chloride', bondType: 'ionic',
    atoms: ['K', 'Cl'], electronegativityDiff: 2.34, molarMass: 74.551, state: 'solid', category: 'salt',
    description: 'Potassium transfers its electron to chlorine forming K⁺ and Cl⁻ ions in a face-centered cubic crystal lattice.',
    properties: 'White crystalline solid. Melting point 770°C. Salt substitute for low-sodium diets. Used in fertilizers.',
  },
  {
    id: 31, formula: 'NaOH', name: 'Sodium Hydroxide', bondType: 'ionic',
    atoms: ['Na', 'O', 'H'], electronegativityDiff: 2.51, molarMass: 39.997, state: 'solid', category: 'base',
    description: 'Na⁺ ion paired with hydroxide (OH⁻) ion. The O-H bond within hydroxide is covalent, but the Na-OH bond is ionic. Strong base.',
    properties: 'White, waxy solid. Highly caustic (lye). Dissolves in water exothermically. Used in soap making, drain cleaners, and paper production.',
  },
  {
    id: 32, formula: 'KOH', name: 'Potassium Hydroxide', bondType: 'ionic',
    atoms: ['K', 'O', 'H'], electronegativityDiff: 2.67, molarMass: 56.106, state: 'solid', category: 'base',
    description: 'K⁺ ion with hydroxide (OH⁻) ion. Similar to NaOH but more soluble in water. Strong base.',
    properties: 'White solid, very hygroscopic. Used in liquid soaps, batteries (alkaline), and biodiesel production.',
  },
  {
    id: 33, formula: 'CaCl₂', name: 'Calcium Chloride', bondType: 'ionic',
    atoms: ['Ca', 'Cl', 'Cl'], electronegativityDiff: 2.16, molarMass: 110.98, state: 'solid', category: 'salt',
    description: 'Calcium transfers two electrons to two chlorine atoms forming Ca²⁺ and 2Cl⁻. Highly hygroscopic ionic compound.',
    properties: 'White solid, very soluble in water. Releases heat upon dissolving. Used as road de-icer and in cheese making.',
  },
  {
    id: 34, formula: 'MgO', name: 'Magnesium Oxide', bondType: 'ionic',
    atoms: ['Mg', 'O'], electronegativityDiff: 2.13, molarMass: 40.304, state: 'solid', category: 'oxide',
    description: 'Magnesium transfers two electrons to oxygen forming Mg²⁺ and O²⁻. Very high lattice energy due to small, doubly-charged ions.',
    properties: 'White solid. Extremely high melting point (2,852°C). Used in refractory bricks, antacids (milk of magnesia), and fireproofing.',
  },
  {
    id: 35, formula: 'CaO', name: 'Calcium Oxide', bondType: 'ionic',
    atoms: ['Ca', 'O'], electronegativityDiff: 2.44, molarMass: 56.077, state: 'solid', category: 'oxide',
    description: 'Calcium transfers two electrons to oxygen forming Ca²⁺ and O²⁻. Known as quicklime. Reacts vigorously with water.',
    properties: 'White solid. Melting point 2,613°C. Reacts with water to form Ca(OH)₂ (slaked lime). Used in cement and steel production.',
  },
  {
    id: 36, formula: 'Na₂O', name: 'Sodium Oxide', bondType: 'ionic',
    atoms: ['Na', 'Na', 'O'], electronegativityDiff: 2.51, molarMass: 61.979, state: 'solid', category: 'oxide',
    description: 'Two sodium atoms each donate one electron to oxygen forming 2Na⁺ and O²⁻. Strong basic oxide.',
    properties: 'White solid. Reacts violently with water to form NaOH. Used in ceramics and glass manufacturing.',
  },
  {
    id: 37, formula: 'Al₂O₃', name: 'Aluminum Oxide', bondType: 'ionic',
    atoms: ['Al', 'Al', 'O', 'O', 'O'], electronegativityDiff: 1.83, molarMass: 101.96, state: 'solid', category: 'oxide',
    description: 'Aluminum transfers three electrons per atom to oxygen. Known as alumina or corundum. Amphoteric oxide (reacts with acids and bases).',
    properties: 'White solid. Extremely hard (Mohs 9). Melting point 2,072°C. Ruby and sapphire are Al₂O₃ with trace impurities.',
  },
  {
    id: 38, formula: 'Fe₂O₃', name: 'Iron(III) Oxide', bondType: 'ionic',
    atoms: ['Fe', 'Fe', 'O', 'O', 'O'], electronegativityDiff: 1.61, molarMass: 159.687, state: 'solid', category: 'oxide',
    description: 'Iron in +3 oxidation state bonded ionically to oxygen. Common rust component. Hematite is a major iron ore.',
    properties: 'Red-brown solid. Insoluble in water. The main component of rust (4Fe + 3O₂ → 2Fe₂O₃). Used as pigment and iron ore.',
  },
  {
    id: 39, formula: 'CaCO₃', name: 'Calcium Carbonate', bondType: 'ionic',
    atoms: ['Ca', 'C', 'O', 'O', 'O'], electronegativityDiff: 2.44, molarMass: 100.086, state: 'solid', category: 'salt',
    description: 'Ca²⁺ ion with carbonate (CO₃²⁻) polyatomic ion. The C-O bonds within carbonate are covalent with delocalized π electrons.',
    properties: 'White solid. Found as limestone, chalk, marble, and seashells. Reacts with acid (effervesces). Antacid ingredient (Tums).',
  },
  {
    id: 40, formula: 'NaHCO₃', name: 'Sodium Bicarbonate', bondType: 'ionic',
    atoms: ['Na', 'H', 'C', 'O', 'O', 'O'], electronegativityDiff: 2.51, molarMass: 84.006, state: 'solid', category: 'salt',
    description: 'Na⁺ ion with bicarbonate (HCO₃⁻) ion. The bicarbonate ion has covalent C-O and O-H bonds. Amphoteric — acts as acid or base.',
    properties: 'White crystalline powder. Baking soda. Reacts with acids to produce CO₂ (leavening). Used in antacids and fire extinguishers.',
  },
  {
    id: 41, formula: 'Na₂SO₄', name: 'Sodium Sulfate', bondType: 'ionic',
    atoms: ['Na', 'Na', 'S', 'O', 'O', 'O', 'O'], electronegativityDiff: 2.51, molarMass: 142.04, state: 'solid', category: 'salt',
    description: '2Na⁺ ions with sulfate (SO₄²⁻) polyatomic ion. Sulfur is tetrahedrally bonded to four oxygen atoms via covalent bonds.',
    properties: 'White solid, highly soluble. Known as Glauber\'s salt (decahydrate). Used in detergents, paper/glass manufacturing.',
  },
  {
    id: 42, formula: 'KNO₃', name: 'Potassium Nitrate', bondType: 'ionic',
    atoms: ['K', 'N', 'O', 'O', 'O'], electronegativityDiff: 2.34, molarMass: 101.103, state: 'solid', category: 'salt',
    description: 'K⁺ ion with nitrate (NO₃⁻) polyatomic ion. Nitrogen is bonded to three equivalent oxygen atoms via delocalized bonds.',
    properties: 'White crystalline solid. Known as saltpeter. Used in fertilizers, food preservation, and historically in gunpowder.',
  },
  {
    id: 43, formula: 'AgNO₃', name: 'Silver Nitrate', bondType: 'ionic',
    atoms: ['Ag', 'N', 'O', 'O', 'O'], electronegativityDiff: 0.73, molarMass: 169.873, state: 'solid', category: 'salt',
    description: 'Ag⁺ ion with nitrate (NO₃⁻) ion. Silver achieves a stable +1 oxidation state by losing its 5s electron.',
    properties: 'White crystalline solid. Light-sensitive (turns black). Used in photography, mirrors, wound cauterization, and analytical chemistry.',
  },
  {
    id: 44, formula: 'BaSO₄', name: 'Barium Sulfate', bondType: 'ionic',
    atoms: ['Ba', 'S', 'O', 'O', 'O', 'O'], electronegativityDiff: 2.55, molarMass: 233.38, state: 'solid', category: 'salt',
    description: 'Ba²⁺ ion with sulfate (SO₄²⁻) ion. Extremely insoluble in water (Ksp = 1.1 × 10⁻¹⁰).',
    properties: 'White solid. Insoluble in water. Used as X-ray contrast agent ("barium meal") because it\'s opaque to X-rays and non-toxic when insoluble.',
  },
  {
    id: 45, formula: 'CuSO₄', name: 'Copper(II) Sulfate', bondType: 'ionic',
    atoms: ['Cu', 'S', 'O', 'O', 'O', 'O'], electronegativityDiff: 1.57, molarMass: 159.609, state: 'solid', category: 'salt',
    description: 'Cu²⁺ ion with sulfate (SO₄²⁻) ion. The hydrated form (CuSO₄·5H₂O) is bright blue due to d-d electron transitions in Cu²⁺.',
    properties: 'Anhydrous: white powder. Pentahydrate: vivid blue crystals. Used in Bordeaux mixture (fungicide), electroplating, and test for water.',
  },
  {
    id: 46, formula: 'ZnO', name: 'Zinc Oxide', bondType: 'ionic',
    atoms: ['Zn', 'O'], electronegativityDiff: 1.79, molarMass: 81.38, state: 'solid', category: 'oxide',
    description: 'Zn²⁺ and O²⁻ ions. Amphoteric oxide. Semiconductor with wide band gap (3.37 eV). Wurtzite crystal structure.',
    properties: 'White powder (turns yellow when hot). Insoluble in water. Used in sunscreen (UV blocker), rubber vulcanization, and paints.',
  },

  // ── COORDINATE / DATIVE ───────────────────────────────────────
  {
    id: 47, formula: 'NH₄⁺', name: 'Ammonium Ion', bondType: 'coordinate',
    atoms: ['N', 'H', 'H', 'H', 'H'], electronegativityDiff: 0.84, molarMass: 18.039, state: 'solid', category: 'other',
    description: 'NH₃ donates its lone pair to H⁺, forming a coordinate (dative) bond. All four N-H bonds become equivalent in tetrahedral geometry.',
    properties: 'Exists in salts like NH₄Cl, NH₄NO₃. Found in smelling salts. Important in nitrogen cycle and fertilizers.',
  },
  {
    id: 48, formula: 'H₃O⁺', name: 'Hydronium Ion', bondType: 'coordinate',
    atoms: ['H', 'O', 'H', 'H'], electronegativityDiff: 1.24, molarMass: 19.023, state: 'liquid', category: 'acid',
    description: 'Water molecule donates a lone pair to H⁺ via coordinate bond. The actual form of "H⁺" in aqueous solutions. Trigonal pyramidal geometry.',
    properties: 'Exists in all acidic solutions. pH = -log[H₃O⁺]. Responsible for acidic properties. Pure water has [H₃O⁺] = 10⁻⁷ M.',
  },
  {
    id: 49, formula: 'BF₄⁻', name: 'Tetrafluoroborate', bondType: 'coordinate',
    atoms: ['B', 'F', 'F', 'F', 'F'], electronegativityDiff: 1.94, molarMass: 86.81, state: 'solid', category: 'other',
    description: 'BF₃ (Lewis acid, electron-deficient) accepts a lone pair from F⁻ (Lewis base) via coordinate bond. Boron goes from 3 to 4 bonds.',
    properties: 'Tetrahedral anion. Used as non-coordinating counterion. Found in electrochemistry and rocket propellant (NaBF₄).',
  },
  {
    id: 50, formula: '[Cu(NH₃)₄]²⁺', name: 'Tetraamminecopper(II)', bondType: 'coordinate',
    atoms: ['Cu', 'N', 'H'], electronegativityDiff: 0.84, molarMass: 127.63, state: 'liquid', category: 'other',
    description: 'Four NH₃ molecules donate lone pairs to Cu²⁺ forming four coordinate bonds. Square planar complex with vivid deep blue color.',
    properties: 'Deep blue solution (Schweizer\'s reagent). Dissolves cellulose. Formed when excess NH₃ is added to Cu²⁺ solutions.',
  },

  // ── METALLIC ──────────────────────────────────────────────────
  {
    id: 51, formula: 'Fe', name: 'Iron (Metallic)', bondType: 'metallic',
    atoms: ['Fe'], electronegativityDiff: 0, molarMass: 55.845, state: 'solid', category: 'other',
    description: 'Iron atoms in a body-centered cubic (BCC) lattice share delocalized valence electrons in an "electron sea." This metallic bonding allows atomic planes to slide easily.',
    properties: 'Silvery-gray metal. Melting point 1,538°C. Ferromagnetic. Most used metal worldwide. Corrodes (rusts) in moist air.',
  },
  {
    id: 52, formula: 'Cu', name: 'Copper (Metallic)', bondType: 'metallic',
    atoms: ['Cu'], electronegativityDiff: 0, molarMass: 63.546, state: 'solid', category: 'other',
    description: 'Copper atoms in a face-centered cubic (FCC) lattice with delocalized electrons. Excellent electrical conductor due to the single 4s electron contributing to the electron sea.',
    properties: 'Reddish-orange metal. Excellent conductor (2nd to silver). Ductile and malleable. Used in wiring, plumbing, and coins.',
  },
  {
    id: 53, formula: 'Au', name: 'Gold (Metallic)', bondType: 'metallic',
    atoms: ['Au'], electronegativityDiff: 0, molarMass: 196.967, state: 'solid', category: 'other',
    description: 'Gold atoms in FCC lattice with strong metallic bonds. Its yellow color comes from relativistic effects on electron orbital energies, absorbing blue light.',
    properties: 'Yellow, lustrous metal. Most malleable metal (1g → 1m² sheet). Does not tarnish. Used in jewelry, electronics, and currency.',
  },
  {
    id: 54, formula: 'Al', name: 'Aluminum (Metallic)', bondType: 'metallic',
    atoms: ['Al'], electronegativityDiff: 0, molarMass: 26.982, state: 'solid', category: 'other',
    description: 'Aluminum atoms in FCC lattice contribute 3 valence electrons to the electron sea, giving strong metallic bonds. Forms a protective Al₂O₃ layer.',
    properties: 'Lightweight silvery metal. Density 2.7 g/cm³ (⅓ of steel). Excellent corrosion resistance. Used in aircraft, cans, and foil.',
  },
  {
    id: 55, formula: 'Na', name: 'Sodium (Metallic)', bondType: 'metallic',
    atoms: ['Na'], electronegativityDiff: 0, molarMass: 22.99, state: 'solid', category: 'other',
    description: 'Sodium atoms in BCC lattice share a single valence electron per atom. Weak metallic bonds make it soft enough to cut with a knife.',
    properties: 'Soft, silvery metal. Reacts violently with water (2Na + 2H₂O → 2NaOH + H₂↑). Stored in mineral oil. Used in sodium vapor lamps.',
  },

  // ── MORE COMPOUNDS ────────────────────────────────────────────
  {
    id: 56, formula: 'SiO₂', name: 'Silicon Dioxide', bondType: 'covalent',
    atoms: ['Si', 'O'], electronegativityDiff: 1.54, molarMass: 60.083, state: 'solid', category: 'oxide',
    description: 'Silicon forms a continuous 3D network of Si-O covalent bonds with tetrahedral geometry. Each Si bonds to 4 O atoms, each O bridges 2 Si atoms.',
    properties: 'Hard solid (Mohs 7). Melting point 1,713°C. Quartz, sand, and glass are forms. Used in semiconductors and fiber optics.',
  },
  {
    id: 57, formula: 'P₄O₁₀', name: 'Phosphorus Pentoxide', bondType: 'covalent',
    atoms: ['P', 'O'], electronegativityDiff: 1.25, molarMass: 283.889, state: 'solid', category: 'oxide',
    description: 'Cage-like molecule with P-O-P bridges and P=O terminal bonds. One of the most powerful desiccants (drying agents) known.',
    properties: 'White solid. Absorbs water violently. Used as drying agent, dehydrating agent, and in phosphoric acid production.',
  },
  {
    id: 58, formula: 'NaF', name: 'Sodium Fluoride', bondType: 'ionic',
    atoms: ['Na', 'F'], electronegativityDiff: 3.05, molarMass: 41.988, state: 'solid', category: 'salt',
    description: 'Sodium transfers its electron to fluorine forming Na⁺ and F⁻. Highest electronegativity difference of any common binary ionic compound.',
    properties: 'White solid. Prevents tooth decay (toothpaste). Toxic in large amounts. Used in water fluoridation.',
  },
  {
    id: 59, formula: 'LiF', name: 'Lithium Fluoride', bondType: 'ionic',
    atoms: ['Li', 'F'], electronegativityDiff: 3.0, molarMass: 25.939, state: 'solid', category: 'salt',
    description: 'Smallest cation (Li⁺) with smallest anion (F⁻) creating very strong lattice energy (1037 kJ/mol). Highest lattice energy of alkali halides.',
    properties: 'White solid. Very high melting point (848°C). Low solubility. Used in UV optics (transparent to UV light) and radiation detectors.',
  },
  {
    id: 60, formula: 'MgCl₂', name: 'Magnesium Chloride', bondType: 'ionic',
    atoms: ['Mg', 'Cl', 'Cl'], electronegativityDiff: 1.81, molarMass: 95.211, state: 'solid', category: 'salt',
    description: 'Magnesium transfers two electrons to two chlorine atoms forming Mg²⁺ and 2Cl⁻. Found naturally in seawater and brine deposits.',
    properties: 'White solid. Hygroscopic. Used as road de-icer, dust suppressant, and tofu coagulant. Source of magnesium metal.',
  },
];

export const BOND_TYPE_INFO: Record<string, { label: string; color: string; description: string }> = {
  'covalent':       { label: 'Covalent',       color: '#14b8a6', description: 'Atoms share electron pairs equally' },
  'polar-covalent': { label: 'Polar Covalent', color: '#8b5cf6', description: 'Atoms share electrons unequally due to electronegativity difference' },
  'ionic':          { label: 'Ionic',          color: '#f43f5e', description: 'Electrons are transferred from metal to nonmetal' },
  'metallic':       { label: 'Metallic',       color: '#3b82f6', description: 'Delocalized electrons shared among metal atoms' },
  'coordinate':     { label: 'Coordinate',     color: '#f59e0b', description: 'One atom donates both electrons in the shared pair' },
};
