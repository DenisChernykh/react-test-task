import type { ReactNode } from 'react';
import { Badge } from '@/shared/ui/components/badge';

type ProductOptionGroupProps = {
  badgeLabel: string;
  children: ReactNode;
  label: string;
  leadingIcon: ReactNode;
};

export function ProductOptionGroup({
  badgeLabel,
  children,
  label,
  leadingIcon,
}: ProductOptionGroupProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {leadingIcon}
          {label}
        </div>
        <Badge variant="outline">{badgeLabel}</Badge>
      </div>
      {children}
    </div>
  );
}
