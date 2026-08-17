import { NavLink } from 'react-router-dom';
import Icon from '@/components/ui/Icon';
import { bottomNav } from '@/data/navData';

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100">
      <div className="flex items-stretch justify-around max-w-md mx-auto">
        {bottomNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 px-1 flex-1 min-w-0"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-brand-600" />
                )}
                <Icon
                  name={item.icon}
                  size={22}
                  className={isActive ? 'text-brand-600' : 'text-ink-600'}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span
                  className={`text-[10px] font-semibold leading-none truncate w-full text-center ${
                    isActive ? 'text-brand-600' : 'text-ink-600'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
