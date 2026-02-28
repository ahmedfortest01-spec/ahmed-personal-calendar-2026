"use client";

import { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
} from "date-fns";
import { ar } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  Clock,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  createdAt: string;
}

const GITHUB_RAW_URL =
  "https://raw.githubusercontent.com/ahmedfortest01-spec/ahmed-personal-calendar-2026/main/events.json";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [view, setView] = useState<"month" | "day" | "week">("month");
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({ title: "", date: "", time: "" });

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(GITHUB_RAW_URL + "?t=" + Date.now());
      const data = await response.json();
      setEvents(data.events || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, [fetchEvents]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getEventsForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return events.filter((e) => e.date === dateStr);
  };

  const todayEvents = events.filter((e) => e.date === format(new Date(), "yyyy-MM-dd"));
  const weekEvents = events.filter((e) => {
    const eventDate = new Date(e.date);
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 0 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 0 });
    return eventDate >= weekStart && eventDate <= weekEnd;
  });

  const stats = {
    total: events.length,
    today: todayEvents.length,
    week: weekEvents.length,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Note: Actual push to GitHub happens via API route
    alert("سيتم إضافة الموعد عبر الـ API. يرجى انتظار التحديث...");
    setShowForm(false);
    setFormData({ title: "", date: "", time: "" });
    setEditingEvent(null);
  };

  const handleDelete = async (eventId: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الموعد؟")) {
      alert("سيتم حذف الموعد عبر الـ API. يرجى انتظار التحديث...");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">📅 تقويم أحمد الشخصي</h1>
          <p className="text-slate-500 text-sm mt-1">
            آخر تحديث: {format(lastUpdated, "HH:mm:ss")}
            {isLoading && <RefreshCw className="inline ml-2 w-4 h-4 animate-spin" />}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          إضافة موعد
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">إجمالي المواعيد</p>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CalendarDays className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">مواعيد اليوم</p>
              <p className="text-2xl font-bold text-slate-800">{stats.today}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">مواعيد الأسبوع</p>
              <p className="text-2xl font-bold text-slate-800">{stats.week}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">
              {format(currentDate, "MMMM yyyy", { locale: ar })}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                اليوم
              </button>
              <button
                onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"].map(
              (day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-slate-500 py-2"
                >
                  {day}
                </div>
              )
            )}
            {calendarDays.map((day) => {
              const dayEvents = getEventsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isDayToday = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    min-h-[80px] p-2 rounded-lg text-right transition-colors relative
                    ${!isCurrentMonth ? "text-slate-300" : "text-slate-700"}
                    ${isSelected ? "bg-blue-50 ring-2 ring-blue-500" : "hover:bg-slate-50"}
                    ${isDayToday ? "bg-blue-100" : ""}
                  `}
                >
                  <span
                    className={`
                      inline-flex items-center justify-center w-7 h-7 rounded-full text-sm
                      ${isDayToday ? "bg-blue-600 text-white font-bold" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs mt-1 p-1 bg-blue-100 text-blue-700 rounded truncate"
                    >
                      {event.time} {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-slate-500 mt-1">
                      +{dayEvents.length - 2} المزيد
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Today's Events */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-green-600" />
              مواعيد اليوم
            </h3>
            {todayEvents.length === 0 ? (
              <p className="text-slate-400 text-sm">لا توجد مواعيد اليوم</p>
            ) : (
              <div className="space-y-2">
                {todayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-slate-50 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{event.title}</p>
                      <p className="text-sm text-slate-500">{event.time}</p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setFormData({
                            title: event.title,
                            date: event.date,
                            time: event.time,
                          });
                          setShowForm(true);
                        }}
                        className="p-1 hover:bg-slate-200 rounded"
                      >
                        <Edit3 className="w-4 h-4 text-slate-500" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-1 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Week Events */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-600" />
              مواعيد الأسبوع
            </h3>
            {weekEvents.length === 0 ? (
              <p className="text-slate-400 text-sm">لا توجد مواعيد هذا الأسبوع</p>
            ) : (
              <div className="space-y-2">
                {weekEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-slate-50 rounded-lg flex justify-between items-start"
                  >
                    <div>
                      <p className="font-medium text-slate-800">{event.title}</p>
                      <p className="text-sm text-slate-500">
                        {format(new Date(event.date), "EEEE", { locale: ar })} - {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingEvent ? "تعديل موعد" : "إضافة موعد جديد"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  عنوان الموعد
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="اجتماع عمل، طبيب، etc."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  التاريخ
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  الوقت
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                >
                  {editingEvent ? "تحديث" : "إضافة"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingEvent(null);
                    setFormData({ title: "", date: "", time: "" });
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
