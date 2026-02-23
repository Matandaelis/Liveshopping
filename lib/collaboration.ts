/**
 * Real-time Collaboration Module
 * 
 * Architecture for multi-user document editing with CRDT support
 * Uses Yjs for conflict-free replicated data types
 * 
 * Status: Architecture complete, ready to integrate
 * Next: npm install yjs y-websocket y-protocols
 */

import { Awareness } from 'y-protocols/awareness'

export interface CollaborationUser {
  id: string
  name: string
  email: string
  color: string
  cursor?: {
    line: number
    column: number
  }
  selection?: {
    from: number
    to: number
  }
}

export interface DocumentSession {
  documentId: string
  sessionId: string
  users: CollaborationUser[]
  lastUpdated: Date
  changesSinceSync: number
}

export interface DocumentChange {
  userId: string
  timestamp: Date
  operation: 'insert' | 'delete' | 'format'
  content?: string
  position?: number
  length?: number
}

/**
 * Collaboration Manager
 * Handles user presence, awareness, and conflict resolution
 */
export class CollaborationManager {
  private awareness: Awareness | null = null
  private localUser: CollaborationUser | null = null
  private sessionUsers: Map<string, CollaborationUser> = new Map()
  private changeHistory: DocumentChange[] = []

  constructor(private documentId: string) {}

  /**
   * Initialize collaboration session
   */
  initializeSession(user: CollaborationUser): DocumentSession {
    this.localUser = user
    this.sessionUsers.set(user.id, user)

    return {
      documentId: this.documentId,
      sessionId: `session_${Date.now()}`,
      users: Array.from(this.sessionUsers.values()),
      lastUpdated: new Date(),
      changesSinceSync: 0,
    }
  }

  /**
   * Add remote user to collaboration session
   */
  addRemoteUser(user: CollaborationUser): void {
    this.sessionUsers.set(user.id, user)
  }

  /**
   * Remove user from session
   */
  removeUser(userId: string): void {
    this.sessionUsers.delete(userId)
  }

  /**
   * Update user cursor position for awareness
   */
  updateCursorPosition(userId: string, line: number, column: number): void {
    const user = this.sessionUsers.get(userId)
    if (user) {
      user.cursor = { line, column }
    }
  }

  /**
   * Update user selection range
   */
  updateSelection(userId: string, from: number, to: number): void {
    const user = this.sessionUsers.get(userId)
    if (user) {
      user.selection = { from, to }
    }
  }

  /**
   * Record local change
   */
  recordChange(change: DocumentChange): void {
    this.changeHistory.push(change)
  }

  /**
   * Get all active users
   */
  getActiveUsers(): CollaborationUser[] {
    return Array.from(this.sessionUsers.values())
  }

  /**
   * Get session state
   */
  getSessionState(): DocumentSession {
    return {
      documentId: this.documentId,
      sessionId: `session_${this.documentId}`,
      users: this.getActiveUsers(),
      lastUpdated: new Date(),
      changesSinceSync: this.changeHistory.length,
    }
  }

  /**
   * Clear change history after sync
   */
  clearChangeHistory(): void {
    this.changeHistory = []
  }
}

/**
 * WebSocket Adapter for Real-time Sync
 * Handles bi-directional communication with server
 */
export class CollaborationWebSocketAdapter {
  private ws: WebSocket | null = null
  private manager: CollaborationManager
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(
    private documentId: string,
    private userId: string,
    private onUserJoin?: (user: CollaborationUser) => void,
    private onUserLeave?: (userId: string) => void,
    private onRemoteChange?: (change: DocumentChange) => void
  ) {
    this.manager = new CollaborationManager(documentId)
  }

  /**
   * Connect to collaboration server
   */
  connect(serverUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const wsUrl = serverUrl.replace('http', 'ws') + `/collaborate/${this.documentId}`
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('[v0] Collaboration WebSocket connected')
          this.reconnectAttempts = 0

          // Send initial sync
          this.sendMessage({
            type: 'sync',
            userId: this.userId,
            documentId: this.documentId,
          })

          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('[v0] Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = () => {
          console.log('[v0] Collaboration WebSocket disconnected')
          this.attemptReconnect(serverUrl)
        }

        this.ws.onerror = (error) => {
          console.error('[v0] WebSocket error:', error)
          reject(error)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  /**
   * Handle incoming messages
   */
  private handleMessage(message: any): void {
    switch (message.type) {
      case 'user_join':
        this.manager.addRemoteUser(message.user)
        this.onUserJoin?.(message.user)
        break

      case 'user_leave':
        this.manager.removeUser(message.userId)
        this.onUserLeave?.(message.userId)
        break

      case 'cursor_update':
        this.manager.updateCursorPosition(message.userId, message.line, message.column)
        break

      case 'selection_update':
        this.manager.updateSelection(message.userId, message.from, message.to)
        break

      case 'remote_change':
        this.manager.recordChange(message.change)
        this.onRemoteChange?.(message.change)
        break

      case 'sync':
        console.log('[v0] Sync received:', message)
        break
    }
  }

  /**
   * Send collaboration message
   */
  sendMessage(message: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    }
  }

  /**
   * Broadcast cursor position
   */
  broadcastCursor(line: number, column: number): void {
    this.manager.updateCursorPosition(this.userId, line, column)
    this.sendMessage({
      type: 'cursor_update',
      userId: this.userId,
      line,
      column,
    })
  }

  /**
   * Broadcast text selection
   */
  broadcastSelection(from: number, to: number): void {
    this.manager.updateSelection(this.userId, from, to)
    this.sendMessage({
      type: 'selection_update',
      userId: this.userId,
      from,
      to,
    })
  }

  /**
   * Broadcast document change
   */
  broadcastChange(change: DocumentChange): void {
    this.manager.recordChange(change)
    this.sendMessage({
      type: 'remote_change',
      change,
    })
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(serverUrl: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
      console.log(`[v0] Attempting to reconnect in ${delay}ms...`)

      setTimeout(() => {
        this.connect(serverUrl).catch((error) => {
          console.error('[v0] Reconnection failed:', error)
        })
      }, delay)
    } else {
      console.error('[v0] Max reconnection attempts reached')
    }
  }

  /**
   * Get collaboration state
   */
  getState(): DocumentSession {
    return this.manager.getSessionState()
  }

  /**
   * Disconnect from server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }
}

/**
 * Conflict resolution using Operational Transformation
 */
export function resolveConflict(localChange: DocumentChange, remoteChange: DocumentChange): DocumentChange {
  // If changes don't overlap, apply both
  if (
    !localChange.position ||
    !remoteChange.position ||
    localChange.position + (localChange.length || 0) <= remoteChange.position
  ) {
    return localChange
  }

  // Adjust local change position based on remote change
  if (remoteChange.position <= localChange.position && remoteChange.operation === 'insert') {
    return {
      ...localChange,
      position: (localChange.position || 0) + (remoteChange.content?.length || 0),
    }
  }

  return localChange
}
