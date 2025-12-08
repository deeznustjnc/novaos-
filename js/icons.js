import { useEffect, useRef } from 'https://esm.sh/react@18.2.0';

export function Icon({ name, size = 24, color = 'white', ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && window.lucide) {
      const el = window.lucide.createElement(window.lucide[name]);
      if (el) {
        el.setAttribute('stroke', color);
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke-width', '2');
        ref.current.innerHTML = '';
        ref.current.appendChild(el);
      }
    }
  }, [name, color]);
  return React.createElement('i', {
    ref,
    'data-lucide': name,
    style: { width: size, height: size, display: 'inline-block', color },
    ...rest
  });
}