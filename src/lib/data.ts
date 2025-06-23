import { LayoutDashboard, FolderKanban, Users, Calendar, Settings, BarChart, BadgeCheck, Anchor } from "lucide-react";

export const navLinks = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/documents", label: "Documents", icon: FolderKanban },
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

export type Document = {
    id: string;
    name: string;
    entityName: string;
    category: string;
    uploadDate: string;
    expiryDate: string | null;
    status: 'Active' | 'Expiring Soon' | 'Expired';
    cost: number;
    version: number;
    fileUrl: string;
};

export const documents: Document[] = [
    {
        id: 'doc1',
        name: 'Forklift License',
        entityName: 'John Doe',
        category: 'Licenses',
        uploadDate: '2023-05-15',
        expiryDate: '2024-08-20',
        status: 'Expiring Soon',
        cost: 150,
        version: 2,
        fileUrl: 'https://placehold.co/800x1100.png'
    },
    {
        id: 'doc2',
        name: 'Passport',
        entityName: 'Jane Smith',
        category: 'Passports',
        uploadDate: '2022-01-20',
        expiryDate: '2027-01-19',
        status: 'Active',
        cost: 110,
        version: 1,
        fileUrl: 'https://placehold.co/800x1100.png'
    },
    {
        id: 'doc3',
        name: 'First Aid Certificate',
        entityName: 'John Doe',
        category: 'Certificates',
        uploadDate: '2023-10-01',
        expiryDate: '2024-07-01',
        status: 'Expired',
        cost: 75,
        version: 1,
        fileUrl: 'https://placehold.co/800x1100.png'
    },
    {
        id: 'doc4',
        name: 'Employment Contract',
        entityName: 'Metco Marine',
        category: 'Contracts',
        uploadDate: '2021-06-01',
        expiryDate: null,
        status: 'Active',
        cost: 0,
        version: 3,
        fileUrl: 'https://placehold.co/800x1100.png'
    },
    {
        id: 'doc5',
        name: 'Work Visa',
        entityName: 'Michael Brown',
        category: 'Visas',
        uploadDate: '2023-09-01',
        expiryDate: '2025-09-01',
        status: 'Active',
        cost: 500,
        version: 1,
        fileUrl: 'https://placehold.co/800x1100.png'
    },
    {
        id: 'doc6',
        name: 'Seaman Book',
        entityName: 'Jane Smith',
        category: 'Licenses',
        uploadDate: '2024-01-10',
        expiryDate: '2029-01-09',
        status: 'Active',
        cost: 200,
        version: 1,
        fileUrl: 'https://placehold.co/800x1100.png'
    }
];

const entityNames = [...new Set(documents.map(doc => doc.entityName))];
export const documentEntities = entityNames.map((name, index) => ({
    id: `ent${index + 1}`,
    name,
}));

export const teamMembers = [
    { id: 'user1', name: 'Admin User', email: 'admin@hrdocs.com', role: 'Admin' },
    { id: 'user2', name: 'Maria Garcia', email: 'maria.g@hrdocs.com', role: 'HR Manager' },
    { id: 'user3', name: 'David Smith', email: 'david.s@hrdocs.com', role: 'Staff' },
    { id: 'user4', name: 'Olivia Chen', email: 'olivia.c@hrdocs.com', role: 'Staff' },
];

export const recentActivity = documents.slice(0, 3);
export const expiringSoon = documents.filter(d => d.status === 'Expiring Soon');
