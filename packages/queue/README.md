# @cvent/queue-nextjs

A queue POC that rate limits the sessions entering a Next.js application.

- The queue is implemented as Next.js middleware that redirects users to a waiting room until their session has been approved.
- Sessions are approved FIFO at a predetermined rate.
- Based on the queue size and current rate, the client has an accurate estimate of waiting time when entering the waiting room.
- Sessions are managed with `iron-session`.
- Queueing is implemented with `bottleneck`.