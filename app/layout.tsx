import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"RefrigLab — Thermal Research Workspace", description:"Analyze, compare, and report vapor-compression refrigeration experiments." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
