import { createMMKV, type MMKV } from 'react-native-mmkv';

const storage: MMKV = createMMKV();
const SHADOW_BUFFER_KEY = 'system.shadowBuffer.lessons';
let isSyncingActive = false; // Evitar múltiples sincronizaciones simultáneas

export interface BufferedLesson {
  queueId: string;
  lessonId: string;
  payload: unknown;
  timestamp: number;
  status: 'pending' | 'syncing' | 'failed';
}

export const ShadowBufferService = {
  getBuffer(): BufferedLesson[] {
    const dataString = storage.getString(SHADOW_BUFFER_KEY);
    if (!dataString) return [];

    try {
      const parsed = JSON.parse(dataString);
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Migrar entradas antiguas (id -> lessonId, asignar queueId si falta)
      let needsSave = false;
      const migrated: BufferedLesson[] = parsed.map((item: any) => {
        let modified = false;
        if ('id' in item && !('lessonId' in item)) {
          item.lessonId = item.id;
          delete item.id;
          modified = true;
        }
        if (!item.queueId) {
          item.queueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
          modified = true;
        }
        if (modified) needsSave = true;
        return item as BufferedLesson;
      });

      if (needsSave) {
        this._saveBuffer(migrated);
      }

      return migrated;
    } catch {
      // JSON corrupto: conservar copia y reiniciar
      const backupKey = `${SHADOW_BUFFER_KEY}.corrupted_${Date.now()}`;
      storage.set(backupKey, dataString);
      return [];
    }
  },

  _saveBuffer(buffer: BufferedLesson[]): void {
    storage.set(SHADOW_BUFFER_KEY, JSON.stringify(buffer));
  },

  saveLessonOffline(lessonId: string, payload: unknown): void {
    const buffer = this.getBuffer();
    const queueId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    buffer.push({
      queueId,
      lessonId,
      payload,
      timestamp: Date.now(),
      status: 'pending',
    });
    
    this._saveBuffer(buffer);
  },

  async syncPendingLessons(syncFn?: (lesson: BufferedLesson) => Promise<boolean>): Promise<void> {
    if (!syncFn || isSyncingActive) return;

    isSyncingActive = true;
    try {
      let buffer = this.getBuffer();
      
      const pendingItems = buffer.filter(
        (b) => b.status === 'pending' || b.status === 'failed' || b.status === 'syncing'
      );

      if (pendingItems.length === 0) return;

      for (const item of pendingItems) {
        buffer = this.getBuffer();
        const currentIdx = buffer.findIndex((b) => b.queueId === item.queueId);
        if (currentIdx === -1) continue; 

        buffer[currentIdx].status = 'syncing';
        this._saveBuffer(buffer);

        let success = false;
        try {
          // Si payload es unknown, asumimos que el syncFn lo valida
          success = await syncFn(buffer[currentIdx]);
        } catch {
          success = false;
        }

        buffer = this.getBuffer();
        const afterIdx = buffer.findIndex((b) => b.queueId === item.queueId);
        
        if (afterIdx > -1) {
          if (success) {
            buffer.splice(afterIdx, 1);
          } else {
            buffer[afterIdx].status = 'failed';
          }
          this._saveBuffer(buffer);
        }
      }
    } finally {
      isSyncingActive = false;
    }
  },
};
