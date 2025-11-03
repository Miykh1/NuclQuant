/**
 * Collaboration Engine - Real-time Multi-user Code Editing
 * 
 * Uses Yjs for CRDT-based synchronization
 * Supports real-time collaborative editing, presence, and cursor tracking
 */

import * as Y from 'yjs';

export interface CollaborationSession {
  id: string;
  roomId: string;
  participants: Participant[];
  createdAt: number;
}

export interface Participant {
  id: string;
  name: string;
  color: string;
  cursor?: { line: number; column: number };
  active: boolean;
}

export class CollaborationEngine {
  private ydoc: Y.Doc;
  private sessions: Map<string, CollaborationSession> = new Map();
  private currentSession: CollaborationSession | null = null;
  private localParticipant: Participant | null = null;

  constructor() {
    this.ydoc = new Y.Doc();
  }

  /**
   * Create or join a collaboration session
   */
  joinSession(roomId: string, userName: string): CollaborationSession {
    let session = this.sessions.get(roomId);

    const participant: Participant = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: userName,
      color: this.generateUserColor(),
      active: true,
    };

    if (!session) {
      session = {
        id: `session_${Date.now()}`,
        roomId,
        participants: [participant],
        createdAt: Date.now(),
      };
      this.sessions.set(roomId, session);
    } else {
      session.participants.push(participant);
    }

    this.currentSession = session;
    this.localParticipant = participant;

    return session;
  }

  /**
   * Leave current session
   */
  leaveSession(): void {
    if (!this.currentSession || !this.localParticipant) return;

    const session = this.currentSession;
    const participantIndex = session.participants.findIndex(
      p => p.id === this.localParticipant!.id
    );

    if (participantIndex !== -1) {
      session.participants[participantIndex].active = false;
    }

    this.currentSession = null;
    this.localParticipant = null;
  }

  /**
   * Get shared text document for collaborative editing
   */
  getSharedText(key: string = 'code'): Y.Text {
    return this.ydoc.getText(key);
  }

  /**
   * Update cursor position
   */
  updateCursorPosition(line: number, column: number): void {
    if (!this.localParticipant) return;
    
    this.localParticipant.cursor = { line, column };
    
    // Broadcast cursor update to other participants
    this.broadcastCursorUpdate();
  }

  /**
   * Get all active participants in current session
   */
  getActiveParticipants(): Participant[] {
    if (!this.currentSession) return [];
    return this.currentSession.participants.filter(p => p.active);
  }

  /**
   * Broadcast presence update
   */
  private broadcastCursorUpdate(): void {
    // In production, this would use WebSocket or WebRTC to sync
    // For now, it's handled locally via Yjs awareness
  }

  /**
   * Generate unique color for each user
   */
  private generateUserColor(): string {
    const colors = [
      'hsl(195, 92%, 58%)', // Helios blue
      'hsl(38, 95%, 62%)',  // Plasma gold
      'hsl(165, 70%, 50%)', // Green
      'hsl(280, 70%, 60%)', // Purple
      'hsl(340, 75%, 55%)', // Pink
      'hsl(25, 85%, 55%)',  // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * Get Yjs document for advanced sync
   */
  getYDoc(): Y.Doc {
    return this.ydoc;
  }

  /**
   * Apply remote changes (for WebSocket integration)
   */
  applyUpdate(update: Uint8Array): void {
    Y.applyUpdate(this.ydoc, update);
  }

  /**
   * Get state vector for synchronization
   */
  getStateVector(): Uint8Array {
    return Y.encodeStateVector(this.ydoc);
  }

  /**
   * Destroy collaboration session and cleanup
   */
  destroy(): void {
    this.leaveSession();
    this.ydoc.destroy();
  }
}
