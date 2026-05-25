'use client';

import EinviteTemplate1 from '@/components/templates/EinviteTemplate1';
import invitationData from '@/data/invitation.json';

export default function Home() {
  return (
    <div style={{ position: 'relative' }}>
      <EinviteTemplate1 invitation={invitationData} />
    </div>
  );
}
