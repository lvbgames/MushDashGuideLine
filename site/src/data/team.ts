import type { TeamMember } from '../types/team';

export const teamMembers: readonly TeamMember[] = [
  {
    id: 'member-01',
    name: '박재민',
    role: 'studio-lead',
    responsibilities: ['programming', 'project-management', 'marketing'],
    profileImage: '/team/profiles/park-jaemin.png'
  },
  {
    id: 'member-02',
    name: '정보건',
    role: '3d-artist',
    responsibilities: ['3d-art'],
    profileImage: '/team/profiles/jeong-bogeon.png'
  }
];
