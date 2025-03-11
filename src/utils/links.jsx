import { FolderKanban, LayoutDashboard, ShoppingBag } from 'lucide-react'
import React from 'react'

export const sidebarLinkAdmin = [
    {label: "Dashboard",link: "/", icon : <LayoutDashboard/>},
    {label: "Manage",link: "/manage", icon : <FolderKanban/>},
    {label: "Transaction",link: "/Transaction", icon : <ShoppingBag />},

    // "Dashboard", "Manage", "Transaction", "Delivery Team", "Sellers"
]

export const sidebarLinkUser = [
    {label: "Dashboard",link: "/", icon : <LayoutDashboard/>},
    {label: "Books",link: "/books", icon : <FolderKanban/>},
    {label: "Me",link: "/me", icon : <FolderKanban/>},
]