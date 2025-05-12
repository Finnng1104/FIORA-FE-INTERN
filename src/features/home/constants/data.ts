import { MODULE } from '@/shared/constants';
import { NavItem } from '../types/Nav.types';

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: [],
    module: MODULE.HOME,
  },
  {
    title: 'Invoices',
    url: '/invoice-creation',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['i', 'v'],
    module: MODULE.HOME,

    items: [
      {
        title: 'invoice',
        url: '/next-previous',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['i', 'd'],
        items: [],
        module: MODULE.HOME,
      },
    ],
  },
];
