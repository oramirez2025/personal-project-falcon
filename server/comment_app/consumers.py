import json
from channels.generic.websocket import AsyncWebsocketConsumer


class GeneralCommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.year_id = self.scope["url_route"]["kwargs"]["year_id"]
        self.room_group_name = f"general_{self.year_id}"
        print("CONNECTED:", self.room_group_name)

        await self.accept()
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def broadcast_comment(self, event):
        payload = {
            "type": event["action"]
        }

        if "comment" in event:
            payload["comment"] = event["comment"]

        if "id" in event:
            payload["id"] = event["id"]

        await self.send(text_data=json.dumps(payload))

class CommentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_id = self.scope["url_route"]["kwargs"]["event_id"]
        self.room_group_name = f"event_{self.event_id}"
        print("CONNECTED:", self.room_group_name)

        await self.accept()
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def broadcast_comment(self, event):
        payload = {
            "type": event["action"]
        }

        if "comment" in event:
            payload["comment"] = event["comment"]

        if "id" in event:
            payload["id"] = event["id"]

        await self.send(text_data=json.dumps(payload))



