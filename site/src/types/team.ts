export type TeamRole = 'studio-lead' | '3d-artist';

export type TeamResponsibility =
  | 'programming'
  | 'project-management'
  | 'marketing'
  | '3d-art';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  responsibilities: readonly TeamResponsibility[];
  profileImage: string | null;
  profileImageWebp: readonly { src: string; width: 640 | 1024 }[];
}
