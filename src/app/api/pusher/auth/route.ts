import { NextRequest, NextResponse } from 'next/server';
import Pusher from 'pusher';
import jwt from 'jsonwebtoken';

const pusher = new Pusher({
  appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.NEXT_PUBLIC_PUSHER_APP_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { socket_id, channel_name } = body;

    // Get the user's access token from the Authorization header
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify the JWT token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { id: string; name: string };

      // Extract user ID from the channel name
      const channelUserId = channel_name.split('-').pop();

      // Verify that the user is trying to access their own channel
      if (channelUserId !== decoded.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Authenticate the channel subscription
      const auth = pusher.authenticate(socket_id, channel_name, {
        user_id: decoded.id,
        user_info: {
          name: decoded.name,
        },
      });

      return NextResponse.json(auth);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
