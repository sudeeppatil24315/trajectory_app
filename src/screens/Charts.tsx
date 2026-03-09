import { useState, useEffect } from 'react';
import { MagnifyingGlass, PencilSimpleLine, ArrowRight } from '@phosphor-icons/react';
import { TopHeader } from '../components/TopHeader';
import { motion, AnimatePresence } from 'framer-motion';

const CONTACTS = [
  { id: 1,  initials: 'AH', name: 'Alex Harper',       tag: 'PEER_01',   msg: 'Check out my LeetCode streak',   time: '1m',  unread: 2,   status: 'online'  },
  { id: 2,  initials: 'DT', name: 'Design Team',       tag: 'GRP_02',    msg: 'Sprint review at 10AM tomorrow', time: '2h',  unread: 5,   status: 'busy'    },
  { id: 3,  initials: 'JL', name: 'Jordan Lee',        tag: 'PEER_03',   msg: 'Reacted to your message',         time: '4h',  unread: 0,   status: 'offline' },
  { id: 4,  initials: 'SC', name: 'Sarah Connor',      tag: 'PEER_04',   msg: 'The new UI looks insane 🔥',     time: '5h',  unread: 0,   status: 'online'  },
  { id: 5,  initials: 'ES', name: 'Engineering Sync',  tag: 'GRP_05',    msg: 'Deploy pipeline successful',      time: '1d',  unread: 0,   status: 'offline' },
  { id: 6,  initials: 'MR', name: 'Mike Ross',         tag: 'PEER_06',   msg: 'Can you send the latest files?', time: '2d',  unread: 0,   status: 'offline' },
  { id: 7,  initials: 'JP', name: 'Jessica Pearson',   tag: 'PEER_07',   msg: 'Great work on the presentation', time: '3d',  unread: 0,   status: 'offline' },
  { id: 8,  initials: 'HS', name: 'Harvey Specter',    tag: 'PEER_08',   msg: 'We need to talk.',               time: '1w',  unread: 0,   status: 'offline' },
];

const STATUS_COLOR: Record<string, string> = {
  online:  'var(--accent)',
  busy:    'var(--red)',
  offline: 'rgba(255,255,255,0.15)',
};

function MonoAvatar({ initials, size = 46, unread }: { initials: string; size?: number; unread: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      backgroundColor: unread > 0 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)',
      border: unread > 0 ? '1.5px solid rgba(255,255,255,0.3)' : '1.5px solid rgba(255,255,255,0.07)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span className="font-mono" style={{
        fontSize: `${size * 0.3}px`,
        color: unread > 0 ? '#fff' : 'rgba(255,255,255,0.4)',
        letterSpacing: '0.04em',
      }}>
        {initials}
      </span>
    </div>
  );
}

export default function Charts() {
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const el = document.querySelector('.scroll-container');
    if (!el) return;
    const handler = (e: Event) => setScrolled((e.target as HTMLElement).scrollTop > 10);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.msg.toLowerCase().includes(query.toLowerCase())
  );

  const totalUnread = CONTACTS.reduce((a, c) => a + c.unread, 0);

  return (
    <div className="page-enter" style={{ paddingBottom: '100px' }}>

      {/* ── Header ──────────────────────────────────────────────── */}
      <TopHeader
        scrolled={scrolled}
        left={
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span className="font-mono" style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'var(--red)', textTransform: 'uppercase' }}>
              COMM_LINK
            </span>
            <span className="font-display font-bold" style={{ fontSize: '20px', color: '#fff', letterSpacing: '-0.02em', lineHeight: 1 }}>
              Messages
            </span>
          </div>
        }
        center={null}
        right={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {totalUnread > 0 && (
              <div style={{ backgroundColor: 'var(--red)', borderRadius: '4px', padding: '2px 7px' }}>
                <span className="font-mono" style={{ fontSize: '10px', color: '#fff', letterSpacing: '0.05em' }}>{totalUnread} NEW</span>
              </div>
            )}
            <div className="clickable" style={{ padding: '6px' }}>
              <PencilSimpleLine size={20} color="rgba(255,255,255,0.6)" />
            </div>
          </div>
        }
      />

      <div className="content-padded" style={{ marginTop: '16px' }}>

        {/* ── Search ──────────────────────────────────────────────── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '10px', padding: '10px 14px', marginBottom: '28px',
        }}>
          <MagnifyingGlass size={16} color="rgba(255,255,255,0.3)" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{
              flex: 1, backgroundColor: 'transparent', border: 'none',
              color: '#fff', fontSize: '13px', outline: 'none',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.03em',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 0, fontSize: '16px' }}>
              ×
            </button>
          )}
        </div>

        {/* ── Section label ───────────────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span className="font-mono" style={{ fontSize: '9px', letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Active Contacts — {filtered.length}
          </span>
          <span className="font-mono clickable" style={{ fontSize: '9px', letterSpacing: '0.15em', color: 'var(--red)', textTransform: 'uppercase' }}>
            Requests
          </span>
        </div>

        {/* ── Contact list ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <AnimatePresence>
            {filtered.map((contact, i) => (
              <motion.div
                key={contact.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: 'easeOut' }}
                className="clickable"
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 14px', borderRadius: '12px',
                  backgroundColor: contact.unread > 0 ? 'rgba(255,255,255,0.03)' : 'transparent',
                  border: contact.unread > 0 ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
                }}
              >
                {/* Avatar + status dot */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <MonoAvatar initials={contact.initials} size={46} unread={contact.unread} />
                  <div style={{
                    position: 'absolute', bottom: 1, right: 1,
                    width: '8px', height: '8px', borderRadius: '50%',
                    backgroundColor: STATUS_COLOR[contact.status],
                    border: '1.5px solid var(--base)',
                  }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '3px' }}>
                    <span className="font-mono" style={{ fontSize: '13px', color: contact.unread > 0 ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: contact.unread > 0 ? 600 : 400, letterSpacing: '0.02em' }}>
                      {contact.name}
                    </span>
                    <span className="font-mono" style={{ fontSize: '9px', color: 'rgba(255,0,49,0.55)', letterSpacing: '0.1em', flexShrink: 0 }}>
                      {contact.tag}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: contact.unread > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.22)', margin: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontWeight: contact.unread > 0 ? 500 : 400 }}>
                    {contact.msg}
                  </p>
                </div>

                {/* Right meta */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                  <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>
                    {contact.time}
                  </span>
                  {contact.unread > 0 ? (
                    <div style={{
                      backgroundColor: 'var(--red)', borderRadius: '4px',
                      minWidth: '20px', height: '18px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                    }}>
                      <span className="font-mono" style={{ fontSize: '10px', color: '#fff' }}>{contact.unread}</span>
                    </div>
                  ) : (
                    <ArrowRight size={12} color="rgba(255,255,255,0.12)" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <span className="font-mono" style={{ fontSize: '11px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
                No contacts found
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
