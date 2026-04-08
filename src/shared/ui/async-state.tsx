import type { ReactNode } from 'react';
import { AlertCircleIcon, BoxIcon, SearchXIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/shared/ui/components/alert';
import { Button, buttonVariants } from '@/shared/ui/components/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/ui/components/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/ui/components/empty';
import { Skeleton } from '@/shared/ui/components/skeleton';
import { Spinner } from '@/shared/ui/components/spinner';

type AsyncStateAction =
  | {
      label: string;
      to: string;
      onClick?: never;
    }
  | {
      label: string;
      onClick: () => void;
      to?: never;
    };

type LoadingAsyncStateProps = {
  variant: 'loading';
  title?: string;
  description?: string;
  skeletonPreset: 'catalog' | 'product' | 'cart';
  className?: string;
};

type FeedbackAsyncStateProps = {
  variant: 'error' | 'empty' | 'notFound';
  title: string;
  description?: string;
  action?: AsyncStateAction;
  icon?: ReactNode;
  className?: string;
};

export type AsyncStateProps = LoadingAsyncStateProps | FeedbackAsyncStateProps;

function StateAction({ action }: { action: AsyncStateAction }) {
  if (action.to) {
    return (
      <Link
        className={buttonVariants({
          variant: 'contrast',
        })}
        to={action.to}
      >
        <span className="text-background">{action.label}</span>
      </Link>
    );
  }

  return <Button onClick={action.onClick}>{action.label}</Button>;
}

function CatalogSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <Card key={index}>
          <CardContent className="flex flex-col gap-4 px-6">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Skeleton className="h-9 w-36 rounded-md" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/5] w-full rounded-[2rem]" />
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton className="aspect-square w-full rounded-xl" key={index} />
          ))}
        </div>
      </div>
      <Card>
        <CardHeader className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-6 w-1/4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton className="h-9 w-24 rounded-full" key={index} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <div className="flex flex-wrap gap-3">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton className="h-9 w-16 rounded-md" key={index} />
              ))}
            </div>
          </div>
          <Skeleton className="h-11 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {Array.from({ length: 2 }, (_, index) => (
          <Card key={index}>
            <CardContent className="grid gap-4 px-6 md:grid-cols-[140px_1fr]">
              <Skeleton className="aspect-square w-full rounded-xl" />
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}

function LoadingPreset({
  preset,
}: {
  preset: LoadingAsyncStateProps['skeletonPreset'];
}) {
  const Component =
    preset === 'product'
      ? ProductSkeleton
      : preset === 'cart'
        ? CartSkeleton
        : CatalogSkeleton;

  return <Component />;
}

export function AsyncState(props: AsyncStateProps) {
  if (props.variant === 'loading') {
    return (
      <div className={cn('flex w-full flex-col gap-6', props.className)}>
        <Card>
          <CardHeader className="items-center text-center">
            <Spinner className="size-6" />
            <CardTitle>{props.title ?? 'Загрузка данных'}</CardTitle>
            {props.description ? (
              <p className="text-sm text-muted-foreground">
                {props.description}
              </p>
            ) : null}
          </CardHeader>
        </Card>
        <LoadingPreset preset={props.skeletonPreset} />
      </div>
    );
  }

  if (props.variant === 'error') {
    return (
      <div className={cn('flex w-full flex-col gap-4', props.className)}>
        <Alert variant="destructive">
          {props.icon ?? <AlertCircleIcon />}
          <AlertTitle>{props.title}</AlertTitle>
          <AlertDescription>
            {props.description ? <p>{props.description}</p> : null}
            {props.action ? <StateAction action={props.action} /> : null}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const fallbackIcon =
    props.variant === 'notFound' ? (
      <SearchXIcon />
    ) : (
      (props.icon ?? <BoxIcon />)
    );

  return (
    <Empty
      className={cn(
        'w-full rounded-3xl border bg-card shadow-sm',
        props.className,
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">{fallbackIcon}</EmptyMedia>
        <EmptyTitle>{props.title}</EmptyTitle>
        {props.description ? (
          <EmptyDescription>{props.description}</EmptyDescription>
        ) : null}
      </EmptyHeader>
      {props.action ? (
        <EmptyContent>
          <StateAction action={props.action} />
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
