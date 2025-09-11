export interface Road {
  videoLink: string;
  roadName: string;
  section: string;
  from: string;
  to: string;
  length: number;
  width: number;
  area: number;
  functionalClass: string;
  surface: string;
  lanes: number;
  shoulder: string;
  ward: number;
  uidSUniqueId: string;
  videoName: string;
  videoUrl: string;
  pci2025: number | null;
  condition: string | null;
  comments: string | null;
  pciPmg: number | null;
  conditionPmg: string | null;
}

export interface Project {
  roads: Road[];
}
