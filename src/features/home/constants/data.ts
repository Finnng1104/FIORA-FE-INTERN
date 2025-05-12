import { MODULE } from '@/shared/constants';
import { NavItem } from '../types/Nav.types';

//Info: Sidebar menu có phân cấp cha – con
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
        title: 'InvoicesDetails',
        url: '/invoice-details',
        icon: 'dashboard',
        isActive: false,
        shortcut: ['i', 'd'],
        items: [],
        module: MODULE.HOME,
      },
    ],
  },
];
