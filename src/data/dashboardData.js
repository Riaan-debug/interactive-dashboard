import { TrendingUp, Users, DollarSign, ShoppingBag, Monitor, Smartphone, Tablet } from 'lucide-react'

export const stats = [
  {
    title: 'Total Sales',
    value: 'R24,780',
    numericValue: 24780,
    change: '+12.5%',
    changeType: 'positive',
    icon: DollarSign,
    iconClass: 'metric-icon-sales',
    description: 'vs. last period',
    prefix: 'R',
  },
  {
    title: 'Total Users',
    value: '1,234',
    numericValue: 1234,
    change: '+8.2%',
    changeType: 'positive',
    icon: Users,
    iconClass: 'metric-icon-users',
    description: 'vs. last period',
    prefix: '',
  },
  {
    title: 'Conversion Rate',
    value: '3.24%',
    numericValue: 3.24,
    change: '-1.2%',
    changeType: 'negative',
    icon: TrendingUp,
    iconClass: 'metric-icon-conversion',
    description: 'vs. last period',
    prefix: '',
    suffix: '%',
  },
  {
    title: 'Orders',
    value: '456',
    numericValue: 456,
    change: '+15.3%',
    changeType: 'positive',
    icon: ShoppingBag,
    iconClass: 'metric-icon-orders',
    description: 'vs. last period',
    prefix: '',
  },
]

export const deviceData = [
  { name: 'Desktop', value: 300, icon: Monitor, color: 'text-accent-600' },
  { name: 'Mobile', value: 150, icon: Smartphone, color: 'text-success-600' },
  { name: 'Tablet', value: 100, icon: Tablet, color: 'text-warning-600' },
]

export const activities = [
  { action: 'New order received', time: '2 minutes ago', amount: 'R299.00', type: 'order' },
  { action: 'Payment processed', time: '5 minutes ago', amount: 'R1,299.00', type: 'payment' },
  { action: 'New user registered', time: '12 minutes ago', amount: '', type: 'user' },
  { action: 'Product updated', time: '1 hour ago', amount: '', type: 'update' },
  { action: 'Refund processed', time: '2 hours ago', amount: 'R99.00', type: 'refund' },
]

export const salesData = {
  week: {
    revenue: [120, 190, 30, 50, 20, 30, 70],
    volume: [12, 19, 3, 5, 2, 3, 7],
    profit: [20, 35, 5, 8, 3, 5, 12],
    customers: [8, 15, 2, 4, 1, 2, 6]
  },
  month: {
    revenue: [650, 590, 800, 810, 560, 550, 400, 450, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780, 890, 900, 670, 780],
    volume: [65, 59, 80, 81, 56, 55, 40, 45, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78, 89, 90, 67, 78],
    profit: [110, 100, 136, 138, 95, 94, 68, 77, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133, 151, 153, 114, 133],
    customers: [45, 41, 56, 57, 39, 38, 28, 32, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55, 63, 64, 47, 55]
  },
  year: {
    revenue: [1200, 1900, 3000, 5000, 2000, 3000, 7000, 8000, 9000, 10000, 11000, 12000],
    volume: [120, 190, 300, 500, 200, 300, 700, 800, 900, 1000, 1100, 1200],
    profit: [204, 323, 510, 850, 340, 510, 1190, 1360, 1530, 1700, 1870, 2040],
    customers: [84, 133, 210, 350, 140, 210, 490, 560, 630, 700, 770, 840]
  }
}

export const barData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue',
      data: [65, 59, 80, 81],
      backgroundColor: [
        'rgba(59, 130, 246, 0.9)',   // Blue with opacity
        'rgba(34, 197, 94, 0.9)',    // Green with opacity
        'rgba(245, 158, 11, 0.9)',   // Yellow with opacity
        'rgba(239, 68, 68, 0.9)',    // Red with opacity
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',     // Solid blue border
        'rgba(34, 197, 94, 1)',      // Solid green border
        'rgba(245, 158, 11, 1)',     // Solid yellow border
        'rgba(239, 68, 68, 1)',      // Solid red border
      ],
      borderWidth: 2,
      borderRadius: 6,
      borderSkipped: false,
      hoverBackgroundColor: [
        'rgba(59, 130, 246, 1)',     // Solid blue on hover
        'rgba(34, 197, 94, 1)',      // Solid green on hover
        'rgba(245, 158, 11, 1)',     // Solid yellow on hover
        'rgba(239, 68, 68, 1)',      // Solid red on hover
      ],
      hoverBorderColor: [
        'rgba(37, 99, 235, 1)',      // Darker blue on hover
        'rgba(22, 163, 74, 1)',      // Darker green on hover
        'rgba(217, 119, 6, 1)',      // Darker yellow on hover
        'rgba(220, 38, 38, 1)',      // Darker red on hover
      ],
      hoverBorderWidth: 3,
    },
  ],
}

export const doughnutData = {
  labels: ['Desktop', 'Mobile', 'Tablet'],
  datasets: [
    {
      data: [300, 150, 100],
      backgroundColor: [
        'rgba(59, 130, 246, 0.9)',
        'rgba(34, 197, 94, 0.9)',
        'rgba(245, 158, 11, 0.9)',
      ],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
}
