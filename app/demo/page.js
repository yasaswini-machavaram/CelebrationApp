'use client';

import EinviteTemplate1 from '@/components/templates/EinviteTemplate1';
import invitationData from '@/lib/data/hardcoded-invitation.json';

export default function DemoPage() {
  return (
    <div style={{ position: 'relative' }}>
      <EinviteTemplate1 invitation={invitationData} />
    </div>
  );
}
