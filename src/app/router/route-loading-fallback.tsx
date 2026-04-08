import { Card, CardHeader, CardTitle } from '@/shared/ui/components/card';
import { Spinner } from '@/shared/ui/components/spinner';
import { AsyncState } from '@/shared/ui/async-state';

type RouteLoadingFallbackProps =
  | {
      title: string;
      description?: string;
      skeletonPreset: 'catalog' | 'product' | 'cart';
    }
  | {
      title: string;
      description?: string;
      skeletonPreset?: undefined;
    };

export function RouteLoadingFallback(props: RouteLoadingFallbackProps) {
  if (props.skeletonPreset) {
    return (
      <AsyncState
        description={props.description}
        skeletonPreset={props.skeletonPreset}
        title={props.title}
        variant="loading"
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <Spinner className="size-6" />
        <CardTitle>{props.title}</CardTitle>
        {props.description ? (
          <p className="text-sm text-muted-foreground">{props.description}</p>
        ) : null}
      </CardHeader>
    </Card>
  );
}
