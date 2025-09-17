/**
 * Analytics - Simple event logging for telemetry
 * 
 * TODO/Next steps:
 * - Add data export functionality
 * - Implement teacher dashboard
 * - Add performance metrics
 */

export interface AnalyticsEvent {
  key: string;
  data: any;
  timestamp: number;
  sessionId: string;
}

export interface QuestionAnalytics {
  correct: boolean;
  timeMs: number;
  streak: number;
  questionType: string;
  difficulty: string;
  hintsUsed: number;
}

export class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private currentStreak: number = 0;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.loadEvents();
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  logEvent(key: string, data: any = {}): void {
    const event: AnalyticsEvent = {
      key,
      data: {
        ...data,
        sessionId: this.sessionId
      },
      timestamp: Date.now()
    };

    this.events.push(event);
    this.saveEvents();

    // Also log to console for development
    console.log(`[Analytics] ${key}:`, data);
  }

  logQuestion(analytics: QuestionAnalytics): void {
    if (analytics.correct) {
      this.currentStreak++;
    } else {
      this.currentStreak = 0;
    }

    this.logEvent('question_answered', {
      ...analytics,
      streak: this.currentStreak
    });
  }

  logRoomEnter(roomId: string, roomType: string): void {
    this.logEvent('room_enter', {
      roomId,
      roomType,
      timestamp: Date.now()
    });
  }

  logRoomComplete(roomId: string, roomType: string, timeMs: number): void {
    this.logEvent('room_complete', {
      roomId,
      roomType,
      timeMs,
      timestamp: Date.now()
    });
  }

  logRoomFail(roomId: string, roomType: string, reason: string): void {
    this.logEvent('room_fail', {
      roomId,
      roomType,
      reason,
      timestamp: Date.now()
    });
  }

  logBossEncounter(bossId: string, phase: number): void {
    this.logEvent('boss_encounter', {
      bossId,
      phase,
      timestamp: Date.now()
    });
  }

  logBossDefeat(bossId: string, timeMs: number, questionsAnswered: number): void {
    this.logEvent('boss_defeat', {
      bossId,
      timeMs,
      questionsAnswered,
      timestamp: Date.now()
    });
  }

  logHintUsed(roomId: string, hintType: string, cost: number): void {
    this.logEvent('hint_used', {
      roomId,
      hintType,
      cost,
      timestamp: Date.now()
    });
  }

  logPlayerDeath(roomId: string, cause: string): void {
    this.logEvent('player_death', {
      roomId,
      cause,
      timestamp: Date.now()
    });
  }

  logTeleportToHub(fromRoom: string, reason: string): void {
    this.logEvent('teleport_hub', {
      fromRoom,
      reason,
      timestamp: Date.now()
    });
  }

  // Data management
  private saveEvents(): void {
    try {
      localStorage.setItem('analytics_events', JSON.stringify(this.events));
    } catch (error) {
      console.error('Failed to save analytics events:', error);
    }
  }

  private loadEvents(): void {
    try {
      const saved = localStorage.getItem('analytics_events');
      if (saved) {
        this.events = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load analytics events:', error);
      this.events = [];
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  getEventsByKey(key: string): AnalyticsEvent[] {
    return this.events.filter(event => event.key === key);
  }

  getSessionEvents(): AnalyticsEvent[] {
    return this.events.filter(event => event.data.sessionId === this.sessionId);
  }

  // Export functionality
  exportToJSON(): string {
    return JSON.stringify({
      sessionId: this.sessionId,
      events: this.events,
      exportTimestamp: Date.now()
    }, null, 2);
  }

  exportToCSV(): string {
    if (this.events.length === 0) {
      return 'No events to export';
    }

    const headers = ['timestamp', 'key', 'data'];
    const rows = this.events.map(event => [
      new Date(event.timestamp).toISOString(),
      event.key,
      JSON.stringify(event.data)
    ]);

    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }

  // Statistics
  getQuestionStats(): {
    total: number;
    correct: number;
    averageTime: number;
    longestStreak: number;
  } {
    const questionEvents = this.getEventsByKey('question_answered');
    
    if (questionEvents.length === 0) {
      return { total: 0, correct: 0, averageTime: 0, longestStreak: 0 };
    }

    const total = questionEvents.length;
    const correct = questionEvents.filter(e => e.data.correct).length;
    const averageTime = questionEvents.reduce((sum, e) => sum + e.data.timeMs, 0) / total;
    const longestStreak = Math.max(...questionEvents.map(e => e.data.streak || 0));

    return { total, correct, averageTime, longestStreak };
  }

  getRoomStats(): {
    totalRooms: number;
    completedRooms: number;
    averageCompletionTime: number;
  } {
    const roomEnterEvents = this.getEventsByKey('room_enter');
    const roomCompleteEvents = this.getEventsByKey('room_complete');

    const totalRooms = roomEnterEvents.length;
    const completedRooms = roomCompleteEvents.length;
    const averageCompletionTime = roomCompleteEvents.length > 0 
      ? roomCompleteEvents.reduce((sum, e) => sum + e.data.timeMs, 0) / roomCompleteEvents.length
      : 0;

    return { totalRooms, completedRooms, averageCompletionTime };
  }

  clearEvents(): void {
    this.events = [];
    localStorage.removeItem('analytics_events');
  }

  // Session management
  startNewSession(): void {
    this.sessionId = this.generateSessionId();
    this.currentStreak = 0;
    this.logEvent('session_start', { sessionId: this.sessionId });
  }

  endSession(): void {
    this.logEvent('session_end', { 
      sessionId: this.sessionId,
      totalEvents: this.events.length
    });
  }
}
