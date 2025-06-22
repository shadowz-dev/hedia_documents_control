import { FileText, Users, Calendar, Settings, BarChart, HardHat, Passport, BadgeCheck } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Dashboard", icon: FileText },
  { href: "/documents", label: "Documents", icon: HardHat },
  { href: "/categories", label: "Categories", icon: BadgeCheck },
  { href: "/reports", label: "Reports", icon: BarChart },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/team", label: "Team", icon: Users },
  { href: "/settings", label: "Settings", icon: Settings },
];

export const documentCategories = [
    { id: 'cat1', name: 'Licenses', description: 'All types of professional licenses.' },
    { id: 'cat2', name: 'Passports', description: 'Employee passport documents.' },
    { id: 'cat3', name: 'Certificates', description: 'Training and skill certificates.' },
    { id: 'cat4', name: 'Contracts', description: 'Employment contracts and agreements.' },
    { id: 'cat5', name: 'Visas', description: 'Work and travel visa documents.' },
];

export const documents = [
    {
        id: 'doc1',
        name: 'John Doe - Forklift License',
        category: 'Licenses',
        uploadDate: '2023-05-15',
        expiryDate: '2024-08-20',
        status: 'Expiring Soon',
        cost: 150,
        version: 2,
    },
    {
        id: 'doc2',
        name: 'Jane Smith - Passport',
        category: 'Passports',
        uploadDate: '2022-01-20',
        expiryDate: '2027-01-19',
        status: 'Active',
        cost: 110,
        version: 1,
    },
    {
        id: 'doc3',
        name: 'Peter Jones - First Aid Certificate',
        category: 'Certificates',
        uploadDate: '2023-10-01',
        expiryDate: '2024-07-01',
        status: 'Expired',
        cost: 75,
        version: 1,
    },
    {
        id: 'doc4',
        name: 'Emily White - Employment Contract',
        category: 'Contracts',
        uploadDate: '2021-06-01',
        expiryDate: null,
        status: 'Active',
        cost: 0,
        version: 3,
    },
    {
        id: 'doc5',
        name: 'Michael Brown - Work Visa',
        category: 'Visas',
        uploadDate: '2023-09-01',
        expiryDate: '2025-09-01',
        status: 'Active',
        cost: 500,
        version: 1,
    }
];

export const teamMembers = [
    { id: 'user1', name: 'Admin User', email: 'admin@hrdocs.com', role: 'Admin' },
    { id: 'user2', name: 'Maria Garcia', email: 'maria.g@hrdocs.com', role: 'HR Manager' },
    { id: 'user3', name: 'David Smith', email: 'david.s@hrdocs.com', role: 'Staff' },
    { id: 'user4', name: 'Olivia Chen', email: 'olivia.c@hrdocs.com', role: 'Staff' },
];

export const recentActivity = documents.slice(0, 3);
export const expiringSoon = documents.filter(d => d.status === 'Expiring Soon');
