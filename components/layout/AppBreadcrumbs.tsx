"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";

function titleize(segment: string) {
  if (segment === "member" || segment === "members") return "Members";
  return segment
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function AppBreadcrumbs() {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const hrefs = parts.map((_, i) => "/" + parts.slice(0, i + 1).join("/"));

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {parts.map((part, i) => (
          <React.Fragment key={`crumb-${i}`}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {i === parts.length - 1 ? (
                <BreadcrumbPage>{titleize(part)}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={
                    part === "member"
                      ? "/members"
                      : parts[i - 1] === "member"
                      ? parts[i + 1] === "edit"
                        ? `/member/${part}/edit`
                        : "/members"
                      : hrefs[i]
                  }>
                    {titleize(part)}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}