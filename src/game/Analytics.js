/**
 * Analytics - Simple event logging for telemetry
 *
 * TODO/Next steps:
 * - Add data export functionality
 * - Implement teacher dashboard
 * - Add performance metrics
 */
export class Analytics {
    constructor() {
        this.events = [];
        this.currentStreak = 0;
        this.sessionId = this.generateSessionId();
        this.loadEvents();
    }
    static getInstance() {
        if (!Analytics.instance) {
            Analytics.instance = new Analytics();
        }
        return Analytics.instance;
    }
    generateSessionId() {
        return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    logEvent(key, data = {}) {
        const event = {
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
    logQuestion(analytics) {
        if (analytics.correct) {
            this.currentStreak++;
        }
        else {
            this.currentStreak = 0;
        }
        this.logEvent('question_answered', {
            ...analytics,
            streak: this.currentStreak
        });
    }
    logRoomEnter(roomId, roomType) {
        this.logEvent('room_enter', {
            roomId,
            roomType,
            timestamp: Date.now()
        });
    }
    logRoomComplete(roomId, roomType, timeMs) {
        this.logEvent('room_complete', {
            roomId,
            roomType,
            timeMs,
            timestamp: Date.now()
        });
    }
    logRoomFail(roomId, roomType, reason) {
        this.logEvent('room_fail', {
            roomId,
            roomType,
            reason,
            timestamp: Date.now()
        });
    }
    logBossEncounter(bossId, phase) {
        this.logEvent('boss_encounter', {
            bossId,
            phase,
            timestamp: Date.now()
        });
    }
    logBossDefeat(bossId, timeMs, questionsAnswered) {
        this.logEvent('boss_defeat', {
            bossId,
            timeMs,
            questionsAnswered,
            timestamp: Date.now()
        });
    }
    logHintUsed(roomId, hintType, cost) {
        this.logEvent('hint_used', {
            roomId,
            hintType,
            cost,
            timestamp: Date.now()
        });
    }
    logPlayerDeath(roomId, cause) {
        this.logEvent('player_death', {
            roomId,
            cause,
            timestamp: Date.now()
        });
    }
    logTeleportToHub(fromRoom, reason) {
        this.logEvent('teleport_hub', {
            fromRoom,
            reason,
            timestamp: Date.now()
        });
    }
    // Data management
    saveEvents() {
        try {
            localStorage.setItem('analytics_events', JSON.stringify(this.events));
        }
        catch (error) {
            console.error('Failed to save analytics events:', error);
        }
    }
    loadEvents() {
        try {
            const saved = localStorage.getItem('analytics_events');
            if (saved) {
                this.events = JSON.parse(saved);
            }
        }
        catch (error) {
            console.error('Failed to load analytics events:', error);
            this.events = [];
        }
    }
    getEvents() {
        return [...this.events];
    }
    getEventsByKey(key) {
        return this.events.filter(event => event.key === key);
    }
    getSessionEvents() {
        return this.events.filter(event => event.data.sessionId === this.sessionId);
    }
    // Export functionality
    exportToJSON() {
        return JSON.stringify({
            sessionId: this.sessionId,
            events: this.events,
            exportTimestamp: Date.now()
        }, null, 2);
    }
    exportToCSV() {
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
    getQuestionStats() {
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
    getRoomStats() {
        const roomEnterEvents = this.getEventsByKey('room_enter');
        const roomCompleteEvents = this.getEventsByKey('room_complete');
        const totalRooms = roomEnterEvents.length;
        const completedRooms = roomCompleteEvents.length;
        const averageCompletionTime = roomCompleteEvents.length > 0
            ? roomCompleteEvents.reduce((sum, e) => sum + e.data.timeMs, 0) / roomCompleteEvents.length
            : 0;
        return { totalRooms, completedRooms, averageCompletionTime };
    }
    clearEvents() {
        this.events = [];
        localStorage.removeItem('analytics_events');
    }
    // Session management
    startNewSession() {
        this.sessionId = this.generateSessionId();
        this.currentStreak = 0;
        this.logEvent('session_start', { sessionId: this.sessionId });
    }
    endSession() {
        this.logEvent('session_end', {
            sessionId: this.sessionId,
            totalEvents: this.events.length
        });
    }
}
