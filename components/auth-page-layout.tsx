"use client";

import Link from "next/link";

export interface AuthPageLayoutProps {
  topRightLink?: { href: string; label: string };
  children: React.ReactNode;
}

export function AuthPageLayout({ topRightLink, children }: AuthPageLayoutProps) {
  return (
    <div className="auth-ui-page">
      {topRightLink && (
        <Link
          href={topRightLink.href}
          className="auth-ui-top-link"
        >
          {topRightLink.label}
        </Link>
      )}
      <div className="auth-ui-page-inner">
        {children}
      </div>
    </div>
  );
}
