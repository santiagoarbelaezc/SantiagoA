import { Injectable } from '@angular/core';

interface VideoSource {
  id: string;
  filename: string;
  path: string;
}

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private videoBasePath = 'assets/videos/';
  
  // Registro de videos disponibles
  private availableVideos: Map<string, string> = new Map([
    ['plaxtilineas', 'plaxtilineas.mp4'],
    ['todotech', 'todotech.mp4']
  ]);

  constructor() {}

  /**
   * Obtiene la ruta completa de un video por su ID
   */
  getVideoUrl(videoId: string): string {
    const filename = this.availableVideos.get(videoId);
    if (!filename) {
      console.warn(`Video no encontrado: ${videoId}`);
      return '';
    }
    return `${this.videoBasePath}${filename}`;
  }

  /**
   * Obtiene todos los videos disponibles
   */
  getAllVideos(): Array<{id: string; filename: string}> {
    return Array.from(this.availableVideos.entries()).map(([id, filename]) => ({
      id,
      filename
    }));
  }

  /**
   * Verifica si un video existe en el registro
   */
  videoExists(videoId: string): boolean {
    return this.availableVideos.has(videoId);
  }
}
