import { NextRequest, NextResponse } from "next/server";

const GITHUB_API_URL = "https://api.github.com";
const REPO_OWNER = "ahmedfortest01-spec";
const REPO_NAME = "ahmed-personal-calendar-2026";
const BRANCH = "main";
const EVENTS_FILE_PATH = "events.json";

// Note: In production, you should use environment variables for the token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function getFileSha(): Promise<string | null> {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.sha;
  } catch {
    return null;
  }
}

async function getCurrentEvents(): Promise<{ events: any[] }> {
  try {
    const response = await fetch(
      `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}?ref=${BRANCH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!response.ok) return { events: [] };
    const data = await response.json();
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    return JSON.parse(content);
  } catch {
    return { events: [] };
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function GET() {
  return NextResponse.json({ message: "Calendar API is running" });
}

export async function POST(request: NextRequest) {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { action, ...eventData } = body;

    const currentData = await getCurrentEvents();
    const sha = await getFileSha();

    if (action === "add") {
      const newEvent = {
        id: generateId(),
        title: eventData.title,
        date: eventData.date,
        time: eventData.time,
        createdAt: new Date().toISOString(),
      };
      currentData.events.push(newEvent);
    } else if (action === "delete") {
      currentData.events = currentData.events.filter(
        (e) => e.id !== eventData.id
      );
    } else if (action === "update") {
      const index = currentData.events.findIndex((e) => e.id === eventData.id);
      if (index > -1) {
        currentData.events[index] = {
          ...currentData.events[index],
          ...eventData,
        };
      }
    }

    const content = Buffer.from(JSON.stringify(currentData, null, 2)).toString(
      "base64"
    );

    const response = await fetch(
      `${GITHUB_API_URL}/repos/${REPO_OWNER}/${REPO_NAME}/contents/${EVENTS_FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Calendar: ${action} event`,
          content,
          sha,
          branch: BRANCH,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
