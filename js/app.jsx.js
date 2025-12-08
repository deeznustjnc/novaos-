import React from "https://esm.sh/react@18.2.0";
import React from "https://esm.sh/react@18.2.0";
import React from "https://esm.sh/react@18.2.0";
import React from 'https://esm.sh/react@18.2.0';
import { useState, useEffect } from 'https://esm.sh/react@18.2.0';
import { Icon } from './icons.js';
import { Modal, ContextMenu } from './components.jsx.js';
import { Browser } from './browser.jsx.js';
import { formatTime, formatDate } from './utils.js';

const apps = [
  { name: 'Browser', icon: 'Globe', content: React.createElement(Browser) },
  { name: 'Files', icon: 'Folder', content: React.createElement('div', { className: 'app-content' }, 'Files app placeholder') },
  { name: 'Terminal', icon: 'Terminal', content: React.createElement('div', { className: 'app-content' }, 'Terminal placeholder') },
  { name: 'Settings', icon: 'Settings', content: React.createElement('div', { className: 'app-content' }, 'Settings placeholder') }
];

export function NovaOS() {
  const [time, setTime] = useState(new Date());
  const [windows, setWindows] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [dragging, setDragging] = useState(null);
  const [context, setContext] = useState(null);
  const [modal, setModal] = useState(null);
  const [volume, setVolume] = useState(70);
  const [battery, setBattery] = useState(85);
  const [showVol, setShowVol] = useState(false);
  const [showBat, setShowBat] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [boot, setBoot] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setBoot(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    const b = setInterval(() => setBattery(p => (p - 0.1 < 5 ? 100 : p - 0.1)), 30000);
    return () => { clearInterval(i); clearInterval(b); };
  }, []);

  /* … drag, openApp, closeWindow, minimize, maximize same as original … */
  const openApp = (app) => {
    const ex = windows.find(w => w.name === app.name && !w.minimized);
    if (ex) { setWindows(windows.map(w => ({ ...w, focused: w.id === ex.id }))); return; }
    const minimized = windows.find(w => w.name === app.name && w.minimized);
    if (minimized) { setWindows(windows.map(w => ({ ...w, minimized: w.id === minimized.id ? false : w.minimized, focused: w.id === minimized.id }))); return; }
    const win = {
      id: nextId,
      name: app.name,
      icon: app.icon,
      content: app.content,
      x: 100 + nextId * 30,
      y: 80 + nextId * 30,
      width: 900,
      height: 600,
      maximized: false,
      minimized: false,
      focused: true
    };
    setWindows([...windows.map(w => ({ ...w, focused: false })), win]);
    setNextId(nextId + 1);
  };
  const closeWindow = id => setWindows(windows.filter(w => w.id !== id));
  const minimizeWindow = id => setWindows(windows.map(w => (w.id === id ? { ...w, minimized: true, focused: false } : w)));
  const maximizeWindow = id => setWindows(windows.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w)));

  const volIcon = volume === 0 ? 'VolumeX' : volume < 30 ? 'Volume' : volume < 70 ? 'Volume1' : 'Volume2';
  const batIcon = battery > 80 ? 'BatteryFull' : battery > 50 ? 'BatteryMedium' : battery > 20 ? 'BatteryLow' : 'BatteryWarning';

  const onContext = e => { e.preventDefault(); setContext({ x: e.clientX, y: e.clientY }); };

  const contextItems = [
    { label: 'New Folder', icon: 'FolderPlus', action: () => openApp(apps[1]) },
    { label: 'About Nova', icon: 'Info', action: () => setModal('about') }
  ];

  return React.createElement('div', {
    className: 'desktop',
    onContextMenu: onContext,
    onClick: () => { setContext(null); setShowVol(false); setShowBat(false); setShowCal(false); }
  },
    boot && React.createElement('div', { className: 'boot-screen' },
      React.createElement('div', { className: 'boot-logo' }, '✦'),
      React.createElement('div', { className: 'boot-title' }, 'Nova OS'),
      React.createElement('div', { className: 'boot-version' }, 'Version 1.0.0'),
      React.createElement('div', { className: 'boot-loader' }, React.createElement('div', { className: 'boot-loader-fill' })),
      React.createElement('div', { className: 'boot-text' }, 'Starting system', React.createElement('span', { className: 'boot-dots' }))
    ),
    React.createElement('div', { className: 'animated-background' },
      React.createElement('div', { className: 'floating-shape shape-1' }),
      React.createElement('div', { className: 'floating-shape shape-2' }),
      React.createElement('div', { className: 'floating-shape shape-3' }),
      React.createElement('div', { className: 'floating-shape shape-4' })
    ),
    React.createElement('div', { className: 'desktop-content' },
      React.createElement('div', { className: 'topbar' },
        React.createElement('div', { className: 'topbar-left' },
          React.createElement('div', { className: 'topbar-item nova-logo' }, '✦ Nova'),
          ['File', 'Edit', 'View', 'Help'].map(m => React.createElement('div', { key: m, className: 'topbar-item' }, m))
        ),
        React.createElement('div', { className: 'topbar-right' },
          React.createElement('div', { className: 'topbar-item system-icon', onClick: e => { e.stopPropagation(); setShowVol(!showVol); } }, React.createElement(Icon, { name: volIcon, size: 18 }), Math.round(volume) + '%'),
          React.createElement('div', { className: 'topbar-item system-icon', onClick: e => { e.stopPropagation(); setShowBat(!showBat); } }, React.createElement(Icon, { name: batIcon, size: 18 }), Math.round(battery) + '%'),
          React.createElement('div', { className: 'topbar-item time-display', onClick: e => { e.stopPropagation(); setShowCal(!showCal); } },
            React.createElement('div', {},
              React.createElement('div', { className: 'time-display-time' }, formatTime(time)),
              React.createElement('div', { className: 'time-display-date' }, formatDate(time))
            )
          )
        )
      ),
      showVol && React.createElement('div', { className: 'volume-slider-popup', onClick: e => e.stopPropagation() },
        React.createElement('h3', {}, React.createElement(Icon, { name: volIcon, size: 16 }), 'Volume'),
        React.createElement('input', {
          type: 'range', min: 0, max: 100, value: volume, className: 'volume-slider',
          onChange: e => setVolume(parseInt(e.target.value))
        }),
        React.createElement('div', { className: 'volume-level' }, Math.round(volume) + '%')
      ),
      showBat && React.createElement('div', { className: 'battery-info-popup', onClick: e => e.stopPropagation() },
        React.createElement('h3', {}, React.createElement(Icon, { name: batIcon, size: 16 }), 'Battery'),
        React.createElement('div', { className: 'battery-level' }, Math.round(battery) + '%'),
        React.createElement('p', {}, React.createElement('span', {}, 'Status'), React.createElement('strong', {}, battery > 20 ? 'Good' : 'Low')),
        React.createElement('div', { className: 'battery-bar' }, React.createElement('div', { className: 'battery-fill', style: { width: battery + '%' } }))
      ),
      showCal && React.createElement('div', { className: 'calendar-popup', onClick: e => e.stopPropagation() },
        React.createElement('h3', {}, React.createElement(Icon, { name: 'Clock', size: 18 }), 'Clock & Calendar'),
        React.createElement('div', { className: 'calendar-current-time' }, time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
        React.createElement('div', { className: 'calendar-current-date' }, time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
      ),
      React.createElement('div', { className: 'desktop-area' },
        ...apps.map((app, i) => React.createElement('div', {
          key: i,
          className: 'desktop-icon',
          onDoubleClick: () => openApp(app)
        },
          React.createElement('div', { className: 'desktop-icon-image' }, React.createElement(Icon, { name: app.icon, size: 48, color: 'white' })),
          React.createElement('div', { className: 'desktop-icon-label' }, app.name)
        ))
      ),
      ...windows.filter(w => !w.minimized).map(win => React.createElement('div', {
        key: win.id,
        className: `window ${win.maximized ? 'maximized' : ''}`,
        style: {
          left: win.maximized ? 0 : win.x,
          top: win.maximized ? 32 : win.y,
          width: win.maximized ? '100%' : win.width,
          height: win.maximized ? 'calc(100% - 104px)' : win.height,
          zIndex: win.focused ? 1000 : 100
        },
        onClick: () => setWindows(windows.map(w => ({ ...w, focused: w.id === win.id })))
      },
        React.createElement('div', {
          className: 'window-titlebar',
          onMouseDown: e => {
            if (!win.maximized && e.target.className === 'window-titlebar') {
              setDragging({ id: win.id, offsetX: e.clientX - win.x, offsetY: e.clientY - win.y });
            }
            setWindows(windows.map(w => ({ ...w, focused: w.id === win.id })));
          }
        },
          React.createElement('div', { className: 'window-title' }, React.createElement(Icon, { name: win.icon, size: 16 }), win.name),
          React.createElement('div', { className: 'window-controls' },
            React.createElement('div', { className: 'window-control close', onClick: e => { e.stopPropagation(); closeWindow(win.id); } }),
            React.createElement('div', { className: 'window-control minimize', onClick: e => { e.stopPropagation(); minimizeWindow(win.id); } }),
            React.createElement('div', { className: 'window-control maximize', onClick: e => { e.stopPropagation(); maximizeWindow(win.id); } })
          )
        ),
        React.createElement('div', { className: 'window-content' }, win.content)
      )),
      React.createElement('div', { className: 'dock' },
        ...apps.map((app, i) => React.createElement('div', {
          key: i,
          className: `dock-icon ${windows.some(w => w.name === app.name) ? 'active' : ''}`,
          onClick: () => openApp(app),
          title: app.name
        }, React.createElement(Icon, { name: app.icon, size: 32, color: 'white' })))
      )
    ),
    context && React.createElement(ContextMenu, { items: contextItems, pos: context, onClose: () => setContext(null) }),
    modal && React.createElement(Modal, { onClose: () => setModal(null) },
      modal === 'about' && React.createElement('div', {},
        React.createElement('h2', {}, '✦ Nova OS'),
        React.createElement('p', {}, 'Version 1.0.0 – a browser-based desktop demo.')
      )
    )
  );
}