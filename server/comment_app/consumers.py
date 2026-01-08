import json
from channels.generic.websocket import AsyncWebsocketConsumer
import socket
import os


class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):  
        self.event_id = self.scope["url_route"]["kwargs"]["event_id"]
        self.room_group_name = f"event_{self.event_id}"
        print(f"📣 Redis broadcast in PID {os.getpid()} on host {socket.gethostname()} to channel {self.channel_name}")


        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def broadcast_comment(self, event):
        await self.send(text_data=json.dumps({
            "type": event["action"],
            "comment": event["comment"],
        }))