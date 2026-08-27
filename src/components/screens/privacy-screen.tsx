import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppColors } from '@/constants/app-theme';

const LAST_UPDATED = '27 de agosto de 2026';
const CONTACT_EMAIL = 'pedrobilbao93@gmail.com';

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {typeof children === 'string' ? (
        <Text style={styles.sectionText}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

export function PrivacyScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable onPress={() => router.back()} accessibilityRole="button" accessibilityLabel="Volver">
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>

        <Text style={styles.title}>Política de Privacidad</Text>
        <Text style={styles.updated}>Última actualización: {LAST_UPDATED}</Text>

        {/* 1. Responsable y contacto */}
        <Section title="1. Responsable y contacto">
          <Text style={styles.sectionText}>
            {'El responsable de esta aplicación es su desarrollador independiente. Para cualquier consulta relacionada con privacidad, puedes escribir a:\n'}
          </Text>
          <Text selectable style={styles.emailText}>{CONTACT_EMAIL}</Text>
        </Section>

        {/* 2. Datos almacenados */}
        <Section title="2. Datos almacenados">
          <Text style={styles.sectionText}>
            LinguaFox guarda en tu dispositivo, mediante el almacenamiento local de la aplicación (AsyncStorage), únicamente los datos necesarios para el funcionamiento de la app:
          </Text>
          <Text style={styles.sectionText}>
            {'\n• Idioma nativo e idioma objetivo seleccionados.'
            + '\n• Estado del proceso de bienvenida (onboarding completado: sí/no).'
            + '\n• Progreso en lecciones: lecciones completadas y resultados obtenidos.'
            + '\n• XP acumulado, estrellas y racha de días de uso.'
            + '\n• Preferencias de la aplicación (por ejemplo, activación de subtítulos).'
            + '\n• Historial de conversaciones con el tutor local, almacenado únicamente en el dispositivo.'}
          </Text>
          <Text style={[styles.sectionText, styles.notice]}>
            {'\nLinguaFox no solicita ni recoge nombre, correo electrónico, número de teléfono, ubicación ni ningún otro dato de identificación personal.'}
          </Text>
        </Section>

        {/* 3. Finalidad */}
        <Section title="3. Finalidad">
          LinguaFox utiliza estos datos exclusivamente para mostrarte tu progreso, calcular tu racha de días, presentar el contenido adaptado a tu idioma objetivo y recordar tus preferencias entre sesiones. No se emplean para ninguna otra finalidad.
        </Section>

        {/* 4. Almacenamiento y conservación */}
        <Section title="4. Almacenamiento y conservación">
          <Text style={styles.sectionText}>
            Todos los datos se almacenan localmente en tu dispositivo. LinguaFox no dispone de servidores propios ni almacena información tuya en la nube.
          </Text>
          <Text style={[styles.sectionText, { marginTop: 8 }]}>
            Puedes eliminar los datos de la aplicación en cualquier momento desde los ajustes de tu dispositivo Android (Ajustes → Aplicaciones → LinguaFox → Borrar datos). También puedes desinstalar la aplicación para eliminar sus datos.
          </Text>
          <Text style={[styles.sectionText, styles.notice, { marginTop: 8 }]}>
            Aviso: dependiendo de la configuración de tu dispositivo y de tu cuenta de Google, Android puede realizar copias de seguridad automáticas de los datos de las aplicaciones. LinguaFox no controla estas copias ni la posible restauración de datos gestionadas por Android o Google, que están sujetas a las políticas de privacidad de Google.
          </Text>
        </Section>

        {/* 5. Servicios de terceros */}
        <Section title="5. Servicios de terceros">
          <Text style={styles.sectionText}>
            {'La V1 de LinguaFox no incluye:\n'
            + '• Publicidad de ningún tipo.\n'
            + '• Compras dentro de la aplicación.\n'
            + '• SDKs de analítica de terceros (Firebase, Amplitude, Mixpanel, etc.).\n'
            + '• Telemetría propia del desarrollador.\n'
            + '• Integración con redes sociales.'}
          </Text>
          <Text style={[styles.sectionText, { marginTop: 8 }]}>
            La distribución de la aplicación se realiza a través de Google Play Store, cuya recopilación de datos (incluyendo información de instalación, uso de la tienda y datos de facturación) está regulada por la Política de Privacidad de Google, que es independiente de esta política.
          </Text>
        </Section>

        {/* 6. Voz y conversaciones */}
        <Section title="6. Voz y conversaciones">
          <Text style={styles.sectionText}>
            {'LinguaFox no solicita acceso al micrófono. No se graba ni se analiza audio en ningún momento. La V1 no realiza reconocimiento ni evaluación de pronunciación.\n\n'
            + 'La reproducción de frases se delega al motor de síntesis de voz instalado o configurado en el dispositivo. Según el sistema operativo, el idioma y el proveedor elegido por el usuario, este motor puede procesar las frases localmente o utilizar servicios de red sujetos a la política de privacidad de su proveedor. LinguaFox no controla ese procesamiento ni utiliza el audio generado para otros fines.\n\n'
            + 'Las conversaciones con el tutor Fox se procesan de forma completamente local, dentro del dispositivo. No se envía ningún mensaje, texto ni datos a OpenAI ni a ningún servicio externo.'}
          </Text>
        </Section>

        {/* 7. Menores */}
        <Section title="7. Menores de edad">
          <Text style={styles.sectionText}>
            LinguaFox no solicita ningún dato personal (nombre, correo, teléfono, ubicación ni similares) a ningún usuario, independientemente de su edad. No se recopilan deliberadamente datos personales de menores de edad.
          </Text>
          <Text style={[styles.sectionText, { marginTop: 8 }]}>
            Si eres padre, madre o tutor legal y crees que la aplicación ha podido recoger algún dato de un menor sin consentimiento, contacta con nosotros en{' '}
            <Text selectable style={styles.emailText}>{CONTACT_EMAIL}</Text>
            {' y lo resolveremos a la mayor brevedad posible.'}
          </Text>
        </Section>

        {/* 8. Derechos y eliminación */}
        <Section title="8. Derechos y eliminación de datos">
          Dado que LinguaFox no recopila datos personales identificables en servidores propios, no es posible gestionar solicitudes de acceso, rectificación o supresión de datos desde nuestra parte. Toda la información reside en tu dispositivo y puedes eliminarla directamente borrando los datos de la aplicación o desinstalándola.
        </Section>

        {/* 9. Cambios en esta política */}
        <Section title="9. Cambios en esta política">
          Si se producen cambios relevantes en esta política (por ejemplo, al añadir funciones que impliquen tratamiento de datos), se actualizará la fecha de modificación en la parte superior y, si la magnitud del cambio lo requiere, se notificará dentro de la aplicación.
        </Section>

        {/* 10. Contacto */}
        <Section title="10. Contacto">
          <Text style={styles.sectionText}>
            {'Para cualquier consulta relacionada con esta política de privacidad:\n'}
          </Text>
          <Text selectable style={styles.emailText}>{CONTACT_EMAIL}</Text>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  page: { padding: 20, gap: 6, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  back: { color: AppColors.primaryBright, fontWeight: '800', marginBottom: 8 },
  title: { color: AppColors.text, fontSize: 26, fontWeight: '900', marginBottom: 2 },
  updated: { color: AppColors.textMuted, fontSize: 13, marginBottom: 20 },
  section: { marginBottom: 18 },
  sectionTitle: { color: AppColors.primaryBright, fontSize: 15, fontWeight: '800', marginBottom: 4 },
  sectionText: { color: AppColors.text, fontSize: 15, lineHeight: 23 },
  notice: { color: AppColors.textMuted, fontSize: 13, lineHeight: 20 },
  emailText: { color: AppColors.primaryBright, fontSize: 15, fontWeight: '700', marginTop: 4 },
});
