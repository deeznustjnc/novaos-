import { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { Icon } from './icons.js';

export function Browser() {
  const [tabs, setTabs] = useState([{ id: 1, title: 'New Tab', url: 'https://www.google.com', history: ['https://www.google.com'], historyIndex: 0 }]);
  const [active, setActive] = useState(1);
  const [next, setNext] = useState(2);
  const [showHist, setShowHist] = useState(false);

  const cur = tabs.find(t => t.id === active) || tabs[0];

  const addTab = () => {
    const nt = { id: next, title: 'New Tab', url: 'https://www.google.com', history: ['https://www.google.com'], historyIndex: 0 };
    setTabs([...tabs, nt]);
    setActive(next);
    setNext(next + 1);
  };
  const closeTab = (id, e) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const nt = tabs.filter(t => t.id !== id);
    setTabs(nt);
    if (active === id) setActive(nt[0].id);
  };
  const nav = (url) => {
    let u = url || cur.url;
    if (!u.startsWith('http')) u = 'https://' + u;
    setTabs(tabs.map(t =>
      t.id === active
        ? { ...t, url: u, title: new URL(u).hostname, history: [...t.history.slice(0, t.historyIndex + 1), u], historyIndex: t.historyIndex + 1 }
        : t
    ));
  };
  const back = () => {
    if (cur.historyIndex > 0) {
      setTabs(tabs.map(t =>
        t.id === active ? { ...t, url: t.history[t.historyIndex - 1], historyIndex: t.historyIndex - 1 } : t
      ));
    }
  };
  const fwd = () => {
    if (cur.historyIndex < cur.history.length - 1) {
      setTabs(tabs.map(t =>
        t.id === active ? { ...t, url: t.history[t.historyIndex + 1], historyIndex: t.historyIndex + 1 } : t
      ));
    }
  };
  const refresh = () => {
    setTabs(tabs.map(t =>
      t.id === active ? { ...t, url: t.url + '?refresh=' + Date.now() } : t
    ));
  };

  return React.createElement('div', { className: 'browser-chrome' },
    React.createElement('div', { className: 'browser-tabs' },
      ...tabs.map(tab => React.createElement('div', {
        key: tab.id,
        className: `browser-tab ${tab.id === active ? 'active' : ''}`,
        onClick: () => setActive(tab.id)
      },
        React.createElement('span', {}, tab.title.substring(0, 20)),
        React.createElement('span', {
          className: 'browser-tab-close',
          onClick: e => closeTab(tab.id, e)
        }, '×')
      )),
      React.createElement('div', {
        className: 'browser-tab',
        onClick: addTab,
        style: { minWidth: '40px', justifyContent: 'center' }
      }, '+')
    ),
    React.createElement('div', { className: 'browser-toolbar' },
      React.createElement('button', { className: 'browser-button', onClick: back, disabled: cur.historyIndex <= 0 }, '←'),
      React.createElement('button', { className: 'browser-button', onClick: fwd, disabled: cur.historyIndex >= cur.history.length - 1 }, '→'),
      React.createElement('button', { className: 'browser-button', onClick: refresh }, '⟳'),
      React.createElement('input', {
        className: 'browser-urlbar',
        value: cur.url,
        onChange: e => setTabs(tabs.map(t => t.id === active ? { ...t, url: e.target.value } : t)),
        onKeyPress: e => e.key === 'Enter' && nav(),
        placeholder: 'Search or enter URL'
      }),
      React.createElement('button', {
        className: 'browser-button',
        onClick: e => { e.stopPropagation(); setShowHist(!showHist); }
      }, '⋯')
    ),
    showHist && React.createElement('div', {
      style: {
        position: 'absolute', right: '8px', top: '88px', background: 'rgba(15,23,42,.98)',
        backdropFilter: 'blur(20px)', border: '1px solid rgba(139,92,246,.3)', borderRadius: '8px',
        padding: '12px', minWidth: '300px', maxHeight: '400px', overflowY: 'auto', boxShadow: '0 8px 24px rgba(0,0,0,.4)', zIndex: 1000
      },
      onClick: e => e.stopPropagation()
    },
      React.createElement('div', { style: { color: 'white', fontWeight: 600, marginBottom: '12px' } }, '📜 History'),
      cur.history.slice().reverse().map((url, i) =>
        React.createElement('div', {
          key: i,
          style: { color: '#cbd5e1', padding: '8px 12px', marginBottom: '4px', borderRadius: '6px', cursor: 'pointer', background: i === (cur.history.length - cur.historyIndex - 1) ? 'rgba(139,92,246,.2)' : 'transparent', fontSize: '12px' },
          onMouseEnter: e => e.currentTarget.style.background = 'rgba(139,92,246,.3)',
          onMouseLeave: e => e.currentTarget.style.background = i === (cur.history.length - cur.historyIndex - 1) ? 'rgba(139,92,246,.2)' : 'transparent',
          onClick: () => {
            const idx = cur.history.length - i - 1;
            setTabs(tabs.map(t => t.id === active ? { ...t, url: url, historyIndex: idx } : t));
            setShowHist(false);
          }
        }, url.replace('https://', '').substring(0, 40) + (url.length > 43 ? '...' : ''))
      ) || React.createElement('div', { style: { color: '#94a3b8', fontSize: '12px', textAlign: 'center', padding: '20px' } }, 'No history yet')
    ),
    React.createElement('div', { className: 'browser-body' },
      React.createElement('iframe', { key: cur.id, src: cur.url, title: 'browser-iframe' })
    )
  );
}