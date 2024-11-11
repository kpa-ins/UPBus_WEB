import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [

    {
        id: 1,
        label: 'Dashboard',
        icon: 'mdi mdi-home',
        link: '/dashboards/default',
    },

    {
        id: 2,
        label: 'Master Setup',
        icon: 'bx bx-cog',
        subItems: [
            {
                id: 3,
                label: 'Bus',
                link: '/master-setup/bus',
                parentId: 2
            },
            {
                id: 4,
                label: 'Gate',
                link: '/master-setup/gate',
                parentId: 2
            },
            {
                id: 5,
                label: 'Trip Type',
                link: '/master-setup/trip-type',
                parentId: 2
            },
            {
                id: 6,
                label: 'Expense Type',
                link: '/master-setup/expense-type',
                parentId: 2
            },
            {
                id: 7,
                label: 'Income Type',
                link: '/master-setup/income-type',
                parentId: 2
            },
            {
                id: 8,
                label: 'Daily Plan',
                link: '/master-setup/daily-plan',
                parentId: 2
            },
            {
                id: 9,
                label: 'Station',
                link: '/master-setup/station',
                parentId: 2
            },
            
        ]
    },

    // {
    //     id: 12,
    //     label: 'MENUITEMS.FILEMANAGER.TEXT',
    //     icon: 'bx-file',
    //     link: '/filemanager',
    // },
    {
        id: 22,
        label: 'Utility',
        icon: 'mdi mdi-clipboard-account-outline',
        subItems: [
            {
              id: 27,
              label: 'User Management',
              icon: 'mdi mdi-clipboard-account-outline',
              link: '/accounts/register',
              parentId: 22
            },
          
    
        ],
      },
];

