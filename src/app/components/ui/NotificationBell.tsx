import { Bell } from "lucide-react";
import { useState } from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Report Reminder",
      message: "Today's daily report is pending",
      time: "2 hours ago",
      read: false,
      type: "warning",
    },
    {
      id: 2,
      title: "Principal Feedback",
      message: "Your report has been reviewed",
      time: "5 hours ago",
      read: false,
      type: "info",
    },
    {
      id: 3,
      title: "Grade Update",
      message: "New student grades available",
      time: "1 day ago",
      read: true,
      type: "success",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-accent rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-12 w-80 bg-card rounded-lg shadow-xl border border-border z-50 max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h4 className="text-foreground">Notifications</h4>
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            </div>
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent cursor-pointer ${
                    !notification.read ? "bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === "warning"
                          ? "bg-orange-500"
                          : notification.type === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{notification.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-border">
              <button className="w-full text-sm text-primary hover:underline">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
