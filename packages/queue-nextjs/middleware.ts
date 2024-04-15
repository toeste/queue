import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import Bottleneck from 'bottleneck';
import { getSession, updateSessionStatus } from './session';

const LOG = console.log;

const MIN_TIME = 1000; // ms between tasks
const limiter = new Bottleneck({
  minTime: MIN_TIME
});

limiter.on('queued', (info: { options: { id: any; }; }) => {
  LOG('queued', info.options.id);
})

limiter.on('failed', (info: { options: { id: any; }; }) => {
  LOG('failed', info.options.id);
})

limiter.on('done', (info: { options: { id: any; }; }) => {
  LOG('done', info.options.id);
})

limiter.on('error', (error: any) => console.error(error));

export async function queueRequests(request: NextRequest) {
  let response = NextResponse.next();

  const session = await getSession(request, response);

  if (session.status === 'accepted') return response;

  if (session.status === 'initialized') {
    // Insert 5 dummy sessions to trigger queue functionality
    for (let index = 0; index < 5; index++) {
      limiter.submit(() => Promise.resolve(), () => {})
    }
    session.status = 'waiting';
    await session.save();
    limiter.schedule({ id: session.id }, () => updateSessionStatus(session.id));
  }

  const totals = limiter.counts();
  const total = totals.RECEIVED + totals.QUEUED;
  const waitTime = total * MIN_TIME / 1000;
  LOG('time', limiter.counts())  
  
  return NextResponse.rewrite(new URL(`/queue/${waitTime}`, request.url), {
    headers: response.headers
  });
}

export default queueRequests;
