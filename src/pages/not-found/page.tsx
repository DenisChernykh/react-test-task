import { routes } from '@/shared/lib/routing/routes';
import { AsyncState } from '@/shared/ui/async-state';

export default function NotFoundPage() {
  return (
    <AsyncState
      action={{ label: 'Вернуться в каталог', to: routes.home() }}
      description="Маршрут не найден. Вернитесь в каталог и продолжите работу с товарами."
      title="Страница не найдена"
      variant="notFound"
    />
  );
}
