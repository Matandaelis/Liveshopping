'use client'

import { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Wifi, WifiOff } from 'lucide-react'
import type { CollaborationUser } from '@/lib/collaboration'

interface CollaborationIndicatorProps {
  isConnected: boolean
  activeUsers: CollaborationUser[]
  currentUser: CollaborationUser
}

/**
 * Displays active collaborators and connection status
 */
export function CollaborationIndicator({
  isConnected,
  activeUsers,
  currentUser,
}: CollaborationIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Connection Status */}
      <div className="flex items-center gap-1">
        {isConnected ? (
          <>
            <Wifi className="h-4 w-4 text-green-600" />
            <span className="text-xs text-green-600">Live</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-600" />
            <span className="text-xs text-red-600">Offline</span>
          </>
        )}
      </div>

      {/* Active Users */}
      <div className="flex items-center gap-1">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{activeUsers.length} editing</span>
      </div>

      {/* User Avatars */}
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 3).map((user) => (
          <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
            <AvatarFallback style={{ backgroundColor: user.color }} className="text-white text-xs">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
        {activeUsers.length > 3 && (
          <Avatar className="h-6 w-6 border-2 border-background bg-muted">
            <AvatarFallback className="text-xs">+{activeUsers.length - 3}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  )
}

interface CollaboratorsPanelProps {
  activeUsers: CollaborationUser[]
  currentUser: CollaborationUser
}

/**
 * Panel showing detailed information about active collaborators
 */
export function CollaboratorsPanel({ activeUsers, currentUser }: CollaboratorsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="h-4 w-4" />
          Active Collaborators ({activeUsers.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2 rounded hover:bg-muted">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                <AvatarFallback style={{ backgroundColor: user.color }} className="text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {user.id === currentUser.id ? `${user.name} (You)` : user.name}
                </p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {user.cursor && (
              <Badge variant="outline" className="text-xs">
                Line {user.cursor.line}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

interface CursorIndicatorProps {
  user: CollaborationUser
  isRemote?: boolean
}

/**
 * Visual indicator for user cursor position
 */
export function CursorIndicator({ user, isRemote = true }: CursorIndicatorProps) {
  if (!user.cursor || !isRemote) return null

  return (
    <div
      className="absolute w-0.5 h-5 animate-pulse pointer-events-none"
      style={{
        backgroundColor: user.color,
        opacity: 0.7,
      }}
      title={user.name}
    />
  )
}

interface RemoteSelectionProps {
  user: CollaborationUser
  isRemote?: boolean
}

/**
 * Visual indicator for user selection range
 */
export function RemoteSelection({ user, isRemote = true }: RemoteSelectionProps) {
  if (!user.selection || !isRemote) return null

  return (
    <div
      className="absolute pointer-events-none opacity-30"
      style={{
        backgroundColor: user.color,
      }}
      title={`${user.name}'s selection`}
    />
  )
}

interface CollaborationStatusProps {
  isConnected: boolean
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor'
  lastSyncTime: Date | null
  pendingChanges: number
}

/**
 * Displays collaboration connection details
 */
export function CollaborationStatus({
  isConnected,
  connectionQuality,
  lastSyncTime,
  pendingChanges,
}: CollaborationStatusProps) {
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'fair':
        return 'text-yellow-600'
      case 'poor':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <Card className="text-sm">
      <CardContent className="pt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Status:</span>
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Quality:</span>
          <span className={getQualityColor(connectionQuality)}>
            {connectionQuality.charAt(0).toUpperCase() + connectionQuality.slice(1)}
          </span>
        </div>
        {lastSyncTime && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Last sync:</span>
            <span className="text-foreground">{lastSyncTime.toLocaleTimeString()}</span>
          </div>
        )}
        {pendingChanges > 0 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Pending changes:</span>
            <Badge variant="secondary">{pendingChanges}</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
