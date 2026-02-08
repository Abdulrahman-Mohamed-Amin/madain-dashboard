export interface Project {
  id: number;
  arTitle: string;
  arDescription: string;
  enTitle: string;
  enDescription: string;

  arLocationName: string;
  enLocationName: string;
  arLocationDescription: string;
  enLocationDescription: string;

  locationUrl: string;
  latitude: number;
  longitude: number;

  isSealed: boolean;

  surfaceArea: string;
  groundArea: string;
  buildingCount: number;
  unitsCount: number;

  videoFile: string;
  videoPath: string;

  imageFiles: string[];
  projectImages: string[];

  projectStatusId: number;
  projectStatusArName: string;
projectStatusEnName: string

  projectTypeId: number;
  projectType: ProjectType;

  interfaceImageFile: string;
  interfaceImagePath: string;

  proposalFile: string;
  proposalFilePath: string;

  buildings: Building[];
  units: Unit[];

  projectCategory: number;
  arProjectCategory:string,

  warranties: Warranty[];
}
export interface Unit {
  id: number;
  arTitle: string;
  enTitle: string;
  arDescription: string;
  enDescription: string;
  price: number;
  floor: string;
  isSealed: boolean;
  area: string;
  buildingId: number;
  building: string;
  imagePath: string;
}
export interface Warranty {
  id: number;
  warrantyType: number;
  arDetails: string;
  enDetails: string;
  projectId: number;
  project: string;
}

export interface Building {
  id: number;
  arTitle: string;
  arDescription: string;
  enTitle: string;
  enDescription: string;
  imagePath: string;
  projectId: number;
  project: string;
  units: Unit[];
}

export interface ProjectImage {
  id: number;
  imagePath: string;
  projectId: number;
}
export interface ProjectStatus {
  id: number;
  enName: string;
  arName: string;
}
export interface ProjectType {
  id: number;
  enName: string;
  arName: string;
}

