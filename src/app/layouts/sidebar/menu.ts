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
                label: 'Track Type',
                link: '/master-setup/track-type',
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
                label: 'Gas Station',
                link: '/master-setup/gas-station',
                parentId: 2
            },
            
        ]
    },


    {
        id: 3,
        label: 'Daily Acc',
        icon: 'mdi mdi-calendar-month',
        subItems: [
            {
                id: 9,
                label: 'Daily Plan',
                link: '/master-setup/daily-plan',
                parentId: 3
            },
            {
                id: 10,
                label: 'Daily Gate Acc',
                link: '/daily-acc/daily-gate-acc',
                parentId: 3
            },
            {
                id: 13,
                label: 'Trip Acc',
                link: '/daily-acc/trip-acc-list',
                parentId: 3
            },
           
            {
                id: 14,
                label: 'Trip Expense',
                link: '/daily-acc/trip-expense',
                parentId: 3
            },

            {
                id: 15,
                label: 'Trip Income',
                link: '/daily-acc/trip-income',
                parentId: 3
            },
            
        ]
    },

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

