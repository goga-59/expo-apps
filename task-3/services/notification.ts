import { MarkerSelect } from '@/database/schema';
import * as Notifications from 'expo-notifications';

interface ActiveNotification {
    markerId: string;
    notificationId: string;
    timestamp: number;
}

class NotificationManager {
    private activeNotifications: Map<string, ActiveNotification>;
    private pendingNotifications: Set<string>;

    constructor() {
        this.activeNotifications = new Map();
        this.pendingNotifications = new Set();

        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldPlaySound: true,
                shouldSetBadge: false,
                shouldShowBanner: true,
                shouldShowList: true,
            }),
        })
    }

    public async requestNotificationPermissions() {
        const { status } = await Notifications.requestPermissionsAsync();

        if (status !== 'granted') {
            throw new Error('Notification permission denied');
        }
    }

    public async showNotification(marker: MarkerSelect): Promise<void> {
        const isActive = this.activeNotifications.has(marker.id);
        const isPending = this.pendingNotifications.has(marker.id);
        if (isActive || isPending) {
            return;
        }

        this.pendingNotifications.add(marker.id);

        try {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: {
                    title: "Вы рядом с меткой!",
                    body: `Метка поблизости: ${marker.title ?? "Новый маркер"}`,
                },
                trigger: null
            });

            this.activeNotifications.set(marker.id, {
                markerId: marker.id,
                notificationId,
                timestamp: Date.now()
            });
        } finally {
            this.pendingNotifications.delete(marker.id);
        }
    }

    public async removeNotification(markerId: string): Promise<void> {
        const notification = this.activeNotifications.get(markerId);
        if (!notification) return;

        const id = notification.notificationId;

        try {
            await Notifications.dismissNotificationAsync(id);
        } catch { }

        try {
            await Notifications.cancelScheduledNotificationAsync(id);
        } catch { }

        this.activeNotifications.delete(markerId);
    }
}

export const notificationManager = new NotificationManager();