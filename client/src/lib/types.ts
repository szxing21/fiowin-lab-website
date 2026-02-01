export interface Member {
  id: number;
  nameEn: string;
  nameCn: string;
  role: "PI" | "Postdoc" | "PhD" | "Master" | "Undergraduate" | "Alumni" | "Member";
  title?: string | null;
  year?: string | null;
  researchInterests?: string | null;
  bio?: string | null;
  publications?: number | null;
  citations?: number | null;
  hIndex?: number | null;
  awards?: string | null;
  photoUrl?: string | null;
  email?: string | null;
  displayOrder?: number;
  education?: string | null;
  workExperience?: string | null;
  projects?: string | null;
  researchAreas?: string | null;
  personalWebsite?: string | null;
  googleScholar?: string | null;
  github?: string | null;
  orcid?: string | null;
  identity?: string | null;
  grade?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}
