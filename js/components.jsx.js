import { Icon } from './icons.js';

export function Modal({ children, onClose }) {
  return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
    React.createElement('div', { className: 'modal', onClick: e => e.stopPropagation() },
      children,
      React.createElement('button', { onClick: onClose, style: { marginTop: '16px' } }, 'Close')
    )
  );
}

export function ContextMenu({ items, pos, onClose }) {
  return React.createElement('div', {
    className: 'context-menu',
    style: { left: pos.x, top: pos.y },
    onClick: e => e.stopPropagation()
  },
    ...items.map((it, i) =>
      it.divider
        ? React.createElement('div', { key: i, className: 'context-menu-divider' })
        : React.createElement('div', {
            key: i,
            className: 'context-menu-item',
            onClick: () => { it.action(); onClose(); }
          },
            it.icon && React.createElement(Icon, { name: it.icon, size: 16 }),
            it.label
          )
    )
  );
}