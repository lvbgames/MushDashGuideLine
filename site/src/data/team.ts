import type { TeamMember } from '../types/team';

export const teamMembers: readonly TeamMember[] = [
  {
    id: 'member-01',
    name: '박재민',
    role: 'studio-lead',
    responsibilities: ['programming', 'project-management', 'marketing'],
    profileImage: '/team/profiles/park-jaemin.png',
    profileImageWebp: [
      { src: '/team/profiles/park-jaemin-640.webp', width: 640 },
      { src: '/team/profiles/park-jaemin-1024.webp', width: 1024 }
    ]
  },
  {
    id: 'member-02',
    name: '정보건',
    role: '3d-artist',
    responsibilities: ['3d-art'],
    profileImage: '/team/profiles/jeong-bogeon.png',
    profileImageWebp: [
      { src: '/team/profiles/jeong-bogeon-640.webp', width: 640 },
      { src: '/team/profiles/jeong-bogeon-1024.webp', width: 1024 }
    ]
  }
];
