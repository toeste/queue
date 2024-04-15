import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { getIronSession } from 'iron-session';
import { v4 as uuidv4 } from 'uuid';

export const Sessions = new Map<string, Session>();

export type Status = 'initialized' | 'waiting' | 'accepted';

export type Session = {
  id: string,
  status: Status,
  url: string
};

const pwd = '0987654323456789098765432345678909876543456789'

export async function getSession(request: NextRequest, response: NextResponse) {
  const session = await getIronSession<Session>(request, response, { password: pwd, cookieName: "session" });
  if (session.id && Sessions.has(session.id)) {
    const s = Sessions.get(session.id)!;
    session.status = s?.status;
    session.url = s?.url;
  } else {
    session.id = uuidv4();
    session.status = 'initialized';
    session.url = request.url;
    await session.save();
    Sessions.set(session.id, session);
  }
  
  return session;
}

export async function updateSessionStatus(id: string) {
  if (Sessions.has(id)) {
    const s = Sessions.get(id)!;
    s.status = 'accepted';
    Sessions.set(id, s);
  }
}
