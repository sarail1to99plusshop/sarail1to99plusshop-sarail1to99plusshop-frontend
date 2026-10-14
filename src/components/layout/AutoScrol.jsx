import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AutoScrol = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const scroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return true;
        }
        return false;
      };

      if (!scroll()) {
        const t1 = setTimeout(scroll, 100);
        const t2 = setTimeout(scroll, 300);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

export default AutoScrol;