# Personal Calendar 2026

Simple personal calendar system for managing events via GitHub.

## How It Works

All events are stored in `events.json`. Edit the file and push changes to update your calendar.

## Commands

Just tell me what to do in chat:

- **Add event:** "أضف موعد: اجتماع عمل يوم الجمعة 4 مساءً"
- **View today:** "عرض مواعيدي اليوم"
- **View week:** "عرض مواعيدي الأسبوع"
- **Delete event:** "احذف موعد [عنوان]"
- **Edit event:** "عدل موعد [عنوان] إلى [التاريخ/الوقت الجديد]"

## Event Format

Events in `events.json`:

```json
{
  "id": "uuid",
  "title": "Event Title",
  "date": "2026-02-28",
  "time": "16:00",
  "description": "Optional description"
}
```

## Storage

Events are stored in `events.json` - a simple JSON file committed to the repository.
