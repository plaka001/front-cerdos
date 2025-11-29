import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private supabase = inject(SupabaseService).client;
  private readonly BUCKET = 'comprobantes';

  /**
   * Sube un archivo al bucket 'comprobantes' y retorna la URL pública.
   * @param file Archivo a subir
   * @param folder Carpeta dentro del bucket (default: 'transacciones')
   * @returns URL pública del archivo o null si hubo error
   */
  async uploadFile(file: File, folder: string = 'transacciones'): Promise<string | null> {
    try {
      // Generar nombre único: timestamp_random.ext
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // Subir archivo
      const { error: uploadError } = await this.supabase.storage
        .from(this.BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Obtener URL pública
      const { data } = this.supabase.storage
        .from(this.BUCKET)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Storage Service Error:', error);
      return null;
    }
  }
}
