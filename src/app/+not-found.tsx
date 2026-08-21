import { EmptyState } from '@/components/empty-state';
import { ScreenContainer } from '@/components/screen-container';

export default function NotFoundRoute() {
  return (
    <ScreenContainer title="LinguaFox">
      <EmptyState title="Página no encontrada" message="La pantalla solicitada no existe." />
    </ScreenContainer>
  );
}
