import { MagnifyingGlass, Plus, Heart, ChatCircle, ShareFat, BookmarkSimple, DotsThree, Fire } from '@phosphor-icons/react';
import { TopHeader } from '../components/TopHeader';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CATEGORIES = ['Trending', 'Placement', 'Study', 'Career', 'Alumni'];

const STORIES = [
  { initials: 'AP', name: 'You', isMe: true },
  { initials: 'SJ', name: 'Sarah J.' },
  { initials: 'TK', name: 'Tom K.' },
  { initials: 'PR', name: 'Priya R.' },
  { initials: 'MC', name: 'Matt C.' },
  { initials: 'AD', name: 'Alex D.' },
];

const POSTS = [
  {
    id: 1,
    initials: 'SJ',
    author: 'Sarah J.',
    role: 'CS · 6th Sem',
    time: '2h',
    liked: true,
    likes: 124,
    comments: 18,
    text: 'Me before college: "I will get into FAANG"\nTrajectory Engine showing my behavioral score:',
    highlight: { label: '48/100 😭', color: 'var(--red)' },
    tags: ['#placement', '#cshumor', '#trajectoryengine'],
  },
  {
    id: 2,
    initials: 'PR',
    author: 'Priya R.',
    role: 'Info Sci · 4th Sem',
    time: '4h',
    liked: false,
    likes: 89,
    comments: 5,
    text: 'POV: You finally close Instagram for 2 hours.',
    highlight: { label: 'Focus score: 📈📈📈', color: 'var(--accent)' },
    tags: ['#focus', '#digitalwellbeing'],
  },
  {
    id: 3,
    initials: 'TK',
    author: 'Tom K.',
    role: 'Alumni · Software Engineer',
    time: '1d',
    liked: false,
    likes: 203,
    comments: 34,
    text: 'Got the Google offer. Trajectory score was 91/100 when I applied. It works.',
    highlight: { label: '91/100 ✅ FAANG', color: '#22c55e' },
    tags: ['#alumni', '#placed', '#google'],
  },
];

// ── Story circle ──────────────────────────────────────────────
function StoryCircle({ initials, name, isMe }: { initials: string; name: string; isMe?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', minWidth: '58px', flexShrink: 0 }}>
      <div style={{ position: 'relative' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', flexShrink: 0,
          border: isMe ? '1px dashed rgba(255,255,255,0.2)' : '2px solid rgba(255,255,255,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: isMe ? 'transparent' : 'rgba(255,255,255,0.05)',
        }}>
          {isMe ? (
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plus size={14} color="rgba(255,255,255,0.5)" />
            </div>
          ) : (
            <span className="font-mono" style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.03em' }}>{initials}</span>
          )}
        </div>
      </div>
      <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.2 }}>{name}</span>
    </div>
  );
}

// ── Feed post card ─────────────────────────────────────────────
function PostCard({ post, delay }: { post: typeof POSTS[0]; delay: number }) {
  const [liked, setLiked] = useState(post.liked);
  const [likes, setLikes] = useState(post.likes);
  const [saved, setSaved] = useState(false);

  const toggleLike = () => {
    setLiked(p => !p);
    setLikes(p => liked ? p - 1 : p + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}
    >
      {/* Post header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.15)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span className="font-mono" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', letterSpacing: '0.04em' }}>{post.initials}</span>
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#fff' }}>{post.author}</span>
            <span className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.05em' }}>{post.role} · {post.time} ago</span>
          </div>
        </div>
        <DotsThree size={20} color="rgba(255,255,255,0.3)" className="clickable-icon" />
      </div>

      {/* Post body — styled text content, no placeholder images */}
      <div style={{
        margin: '0 16px',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderRadius: '12px',
      }}>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: '0 0 16px', whiteSpace: 'pre-line' }}>
          {post.text}
        </p>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          backgroundColor: `${post.highlight.color}18`,
          border: `1px solid ${post.highlight.color}40`,
          borderRadius: '8px', padding: '6px 14px',
        }}>
          <span className="font-mono" style={{ fontSize: '13px', color: post.highlight.color, fontWeight: 700, letterSpacing: '0.04em' }}>
            {post.highlight.label}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', padding: '12px 16px 0' }}>
        {post.tags.map(tag => (
          <span key={tag} className="font-mono" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.04em' }}>{tag}</span>
        ))}
      </div>

      {/* Action row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            onClick={toggleLike}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}
          >
            <Heart size={20} color={liked ? 'var(--red)' : 'rgba(255,255,255,0.4)'} weight={liked ? 'fill' : 'regular'} />
            <span className="font-mono" style={{ fontSize: '12px', color: liked ? 'var(--red)' : 'rgba(255,255,255,0.4)' }}>{likes}</span>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
            <ChatCircle size={20} color="rgba(255,255,255,0.4)" />
            <span className="font-mono" style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{post.comments}</span>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0 }}>
            <ShareFat size={20} color="rgba(255,255,255,0.4)" />
          </button>
        </div>
        <button onClick={() => setSaved(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <BookmarkSimple size={20} color={saved ? '#fff' : 'rgba(255,255,255,0.3)'} weight={saved ? 'fill' : 'regular'} />
        </button>
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────
export default function MemeFeed() {
  const [scrolled, setScrolled] = useState(false);
  const [activeChip, setActiveChip] = useState('Trending');

  useEffect(() => {
    const el = document.querySelector('.scroll-container');
    if (!el) return;
    const handler = (e: Event) => setScrolled((e.target as HTMLElement).scrollTop > 10);
    el.addEventListener('scroll', handler);
    return () => el.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="page-enter" style={{ paddingBottom: '100px' }}>

      {/* ── Header ──────────────────────────────────────── */}
      <TopHeader
        scrolled={scrolled}
        left={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Fire size={18} color="var(--red)" weight="fill" />
            <span className="font-display font-bold" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>Feed</span>
          </div>
        }
        center={null}
        right={
          <div style={{ display: 'flex', gap: '10px' }}>
            <MagnifyingGlass size={22} color="rgba(255,255,255,0.6)" className="clickable-icon" />
            <div className="clickable" style={{
              width: '28px', height: '28px', borderRadius: '7px',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Plus size={16} color="rgba(255,255,255,0.8)" weight="bold" />
            </div>
          </div>
        }
      />

      {/* ── Category chips ─────────────────────────────── */}
      <div
        style={{
          position: 'sticky', top: '44px', zIndex: 40,
          padding: '10px var(--bg-margin)',
          gap: '8px', display: 'flex',
          overflowX: 'auto', scrollbarWidth: 'none',
          backgroundColor: 'rgba(5,5,5,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : 'none',
        }}
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveChip(cat)}
            className="clickable"
            style={{
              whiteSpace: 'nowrap',
              backgroundColor: activeChip === cat ? '#fff' : 'transparent',
              color: activeChip === cat ? '#000' : 'rgba(255,255,255,0.45)',
              padding: '6px 14px',
              borderRadius: '6px',
              border: activeChip === cat ? '1px solid #fff' : '1px solid rgba(255,255,255,0.12)',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.06em',
              fontWeight: activeChip === cat ? 700 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
        <div style={{ minWidth: '8px', flexShrink: 0 }} />
      </div>

      {/* ── Stories row ─────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: '14px', overflowX: 'auto',
        padding: '24px var(--bg-margin) 8px',
        scrollbarWidth: 'none',
      }}>
        {STORIES.map((s, i) => <StoryCircle key={i} {...s} />)}
      </div>

      {/* ── Feed posts ──────────────────────────────────── */}
      <div style={{ padding: '20px var(--bg-margin) 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {POSTS.map((post, i) => (
          <PostCard key={post.id} post={post} delay={0.1 + i * 0.08} />
        ))}
      </div>
    </div>
  );
}
