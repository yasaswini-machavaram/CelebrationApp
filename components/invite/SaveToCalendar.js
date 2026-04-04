'use client';

export default function SaveToCalendar({ events, groomName, brideName }) {
  const generateICS = (event) => {
    const formatICSDate = (dateStr, timeStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');

      if (timeStr) {
        const [h, m] = timeStr.split(':');
        return `${year}${month}${day}T${h}${m}00`;
      }
      return `${year}${month}${day}T100000`;
    };

    const start = formatICSDate(event.date, event.time);
    // Default 3 hour event
    const endDate = new Date(event.date);
    endDate.setHours(endDate.getHours() + 3);
    const end = formatICSDate(endDate.toISOString().split('T')[0], event.time ? 
      `${String(parseInt(event.time.split(':')[0]) + 3).padStart(2, '0')}:${event.time.split(':')[1]}` : null
    );

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//CelebrationApp//Wedding//EN',
      'BEGIN:VEVENT',
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.name} - ${groomName} & ${brideName}`,
      `DESCRIPTION:${event.name} of ${groomName} & ${brideName}`,
      `LOCATION:${event.venue || ''}${event.venueAddress ? ', ' + event.venueAddress : ''}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.name.replace(/\s+/g, '_')}_${groomName}_${brideName}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={() => {
        if (events && events.length > 0) {
          events.forEach((e) => {
            if (e.date) generateICS(e);
          });
        }
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1.5rem',
        background: 'rgba(212, 175, 55, 0.1)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '9999px',
        color: '#D4AF37',
        fontSize: '0.85rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: "'Inter', sans-serif",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      📅 Save to Calendar
    </button>
  );
}
