const getTreatment = (pciScore: number | undefined | null) => {
  if (!pciScore) return 'N/A';

  if (pciScore >= 90) {
    return 'Rejuvenation';
  } else if (pciScore >= 70) {
    return 'Maintenance';
  } else if (pciScore >= 50) {
    return 'Preservation';
  } else if (pciScore >= 30) {
    return 'Structural';
  } else {
    return 'Rehabilitation';
  }
};

const useTreatmentFromScore = (pciScore: number | undefined) => {
  return getTreatment(pciScore); //TODO: replace the static mapping with the dynamic one coming from:
  // augmentedProject.detail.processing_configurations['version'].mappings.treatment_pci
};

export { getTreatment, useTreatmentFromScore };
