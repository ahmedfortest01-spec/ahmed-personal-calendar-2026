#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const EVENTS_FILE = path.join(__dirname, 'events.json');

function loadEvents() {
  const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
  return JSON.parse(data);
}

function saveEvents(data) {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(data, null, 2));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

const command = process.argv[2];
const args = process.argv.slice(3);

const data = loadEvents();

switch (command) {
  case 'add':
    if (args.length < 2) {
      console.error('Usage: calendar add <title> <date> [time]');
      process.exit(1);
    }
    const title = args[0];
    const date = args[1];
    const time = args[2] || '';
    data.events.push({
      id: generateId(),
      title,
      date,
      time,
      createdAt: new Date().toISOString()
    });
    saveEvents(data);
    console.log(`✅ Added: ${title} on ${date} ${time}`);
    break;

  case 'list':
    data.events.forEach(e => {
      console.log(`[${e.date}] ${e.time ? e.time + ' - ' : ''}${e.title}`);
    });
    break;

  case 'today':
    const today = new Date().toISOString().split('T')[0];
    const todayEvents = data.events.filter(e => e.date === today);
    todayEvents.forEach(e => {
      console.log(`[${e.time}] ${e.title}`);
    });
    if (todayEvents.length === 0) console.log('No events today');
    break;

  case 'delete':
    const id = args[0];
    const idx = data.events.findIndex(e => e.id === id);
    if (idx > -1) {
      const deleted = data.events.splice(idx, 1)[0];
      saveEvents(data);
      console.log(`✅ Deleted: ${deleted.title}`);
    } else {
      console.log('Event not found');
    }
    break;

  default:
    console.log('Commands: add, list, today, delete');
}
