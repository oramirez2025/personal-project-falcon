import time as pytime

from rest_framework.test import APITestCase
from django.test.utils import CaptureQueriesContext
from django.db import connection

from user_app.models import MyUsers
from event_app.models import Event
from comment_app.models import Comment
from comment_app.services import build_comment_tree
from comment_app.serializers import CommentSerializer
from datetime import date, time
from rest_framework import status




# ======================== UNIT TESTS ============================

class CommentAPITests(APITestCase):

    def setUp(self):
        self.user = MyUsers.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="pass1234"
        )
        self.other_user = MyUsers.objects.create_user(
            username="otheruser",
            email="testuser123@example.com",
            password="pass1234"
        )

        self.event = Event.objects.create(
            title="Test Event",
            day=date.today(),
            start_time=time(18, 0),
            end_time=time(20, 0),
            location="Test Location",
            description="Test event description",
        )

    # # ========================
    # # CREATE
    # # ========================

    # def test_create_comment(self):
    #     self.client.force_authenticate(user=self.user)

    #     url = f"/comment/events/{self.event.id}/"
    #     response = self.client.post(
    #         url,
    #         {"text": "Hello world"},
    #         format="json"
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Comment.objects.count(), 1)
    #     self.assertIsNone(Comment.objects.first().parent)

    # def test_create_reply(self):
    #     self.client.force_authenticate(user=self.user)

    #     parent = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Parent comment"
    #     )

    #     url = f"/comment/events/{self.event.id}/"
    #     response = self.client.post(
    #         url,
    #         {"text": "Reply", "parent": parent.id},
    #         format="json"
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     self.assertEqual(Comment.objects.count(), 2)
    #     self.assertEqual(Comment.objects.last().parent, parent)

    # # ========================
    # # READ (recursive tree)
    # # ========================

    # def test_get_comment_tree(self):
    #     parent = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Parent"
    #     )
    #     Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Child",
    #         parent=parent
    #     )

    #     url = f"/comment/events/{self.event.id}/"
    #     response = self.client.get(url)

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1)
    #     self.assertEqual(len(response.data[0]["replies"]), 1)

    # # ========================
    # # UPDATE (PUT)
    # # ========================

    # def test_op_can_update_text(self):
    #     self.client.force_authenticate(user=self.user)

    #     comment = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Original"
    #     )

    #     url = f"/comment/{comment.id}/"
    #     response = self.client.put(
    #         url,
    #         {"text": "Updated"},
    #         format="json"
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     comment.refresh_from_db()
    #     self.assertEqual(comment.text, "Updated")

    # def test_cannot_change_parent(self):
    #     self.client.force_authenticate(user=self.user)

    #     parent = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Parent"
    #     )
    #     child = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Child",
    #         parent=parent
    #     )

    #     url = f"/comment/{child.id}/"
    #     response = self.client.put(
    #         url,
    #         {"parent": None},
    #         format="json"
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_cannot_change_event(self):
    #     self.client.force_authenticate(user=self.user)

    #     comment = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Comment"
    #     )

    #     other_event = Event.objects.create(
    #         title="Other Event",
    #         day=date.today(),
    #         start_time=time(19, 0),
    #         end_time=time(21, 0),
    #         location="Other Location",
    #         description="Other",
    #     )

    #     url = f"/comment/{comment.id}/"
    #     response = self.client.put(
    #         url,
    #         {"event": other_event.id},
    #         format="json"
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_non_op_cannot_update(self):
    #     self.client.force_authenticate(user=self.other_user)

    #     comment = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Secure"
    #     )

    #     url = f"/comment/{comment.id}/"
    #     response = self.client.put(
    #         url,
    #         {"text": "Hacked"},
    #         format="json"
    #     )

    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # # ========================
    # # DELETE
    # # ========================

    # def test_op_can_delete_and_cascade(self):
    #     self.client.force_authenticate(user=self.user)

    #     parent = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Parent"
    #     )
    #     Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Child",
    #         parent=parent
    #     )

    #     url = f"/comment/{parent.id}/"
    #     response = self.client.delete(url)

    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(Comment.objects.count(), 0)

    # def test_non_op_cannot_delete(self):
    #     self.client.force_authenticate(user=self.other_user)

    #     comment = Comment.objects.create(
    #         author=self.user,
    #         event=self.event,
    #         text="Protected"
    #     )

    #     url = f"/comment/{comment.id}/"
    #     response = self.client.delete(url)

    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    #     self.assertEqual(Comment.objects.count(), 1)

    # ======================== BENCHMARK TESTS ============================
    def create_test_comments(self, depth=5, breadth=5):
        parent = None
        for d in range(depth):
            for _ in range(breadth):
                parent = Comment.objects.create(
                    author=self.user,
                    event=self.event,
                    text=f"Depth {d}",
                    parent=parent
                )


    def test_adj_list_speed(self):
        self.create_test_comments(depth=5, breadth=5)

        start = pytime.perf_counter()
        build_comment_tree(self.event)
        duration = pytime.perf_counter() - start

        print(f"Adjacency list: {duration:.6f}s\n")

    def test_recursive_speed(self):
        self.create_test_comments(depth=5, breadth=5)

        qs = Comment.objects.filter(event=self.event, parent=None)

        start = pytime.perf_counter()
        CommentSerializer(qs, many=True).data
        duration = pytime.perf_counter() - start

        print(f"Recursive serializer: {duration:.6f}s\n")

# ======================== MORE BENCHMARK TESTS ============================

class CommentBenchmarkTests(APITestCase):

    def setUp(self):
        self.user = MyUsers.objects.create_user(
            username="benchuser",
            password="pass1234"
        )

        self.event = Event.objects.create(
            title="Benchmark Event",
            day=date.today(),
            start_time=time(18, 0),
            end_time=time(20, 0),
            location="Test Location",
            description="Benchmarking comments",
        )

    def create_realistic_comments(self, roots=10, depth=3, breadth=3):
        def grow(parent, current_depth):
            if current_depth >= depth:
                return

            for _ in range(breadth):
                child = Comment.objects.create(
                    author=self.user,
                    event=self.event,
                    text=f"Depth {current_depth}",
                    parent=parent,
                )
                grow(child, current_depth + 1)

        for _ in range(roots):
            root = Comment.objects.create(
                author=self.user,
                event=self.event,
                text="Root comment",
            )
            grow(root, 1)

    def test_correctness(self):
        self.create_realistic_comments(roots=5, depth=3, breadth=2)

        tree = build_comment_tree(self.event)

        self.assertEqual(len(tree), 5)
        self.assertIn("replies", tree[0])
        self.assertIsInstance(tree[0]["replies"], list)

    def test_query_counts(self):
        self.create_realistic_comments(roots=8, depth=3, breadth=3)

        # Adjacency list
        with CaptureQueriesContext(connection) as adj_ctx:
            build_comment_tree(self.event)

        # Recursive serializer
        qs = Comment.objects.filter(event=self.event, parent=None)

        with CaptureQueriesContext(connection) as rec_ctx:
            CommentSerializer(qs, many=True).data

        print("\n--- QUERY COUNTS ---")
        print("Adjacency list queries:", len(adj_ctx))
        print("Recursive serializer queries:", len(rec_ctx))

        # Adjacency list should be stable
        self.assertLess(len(rec_ctx), len(adj_ctx))

    def test_time_comparison(self):
        self.create_realistic_comments(roots=10, depth=4, breadth=3)

        # Adjacency list
        start = pytime.perf_counter()
        build_comment_tree(self.event)
        adj_time = pytime.perf_counter() - start

        # Recursive serializer
        qs = Comment.objects.filter(event=self.event, parent=None)

        start = pytime.perf_counter()
        CommentSerializer(qs, many=True).data
        rec_time = pytime.perf_counter() - start

        print("\n--- TIME COMPARISON ---")
        print(f"Adjacency list:      {adj_time:.6f}s")
        print(f"Recursive serializer {rec_time:.6f}s")

    def test_scale_up(self):
        # ~1,300 comments
        self.create_realistic_comments(roots=15, depth=4, breadth=4)

        qs = Comment.objects.filter(event=self.event, parent=None)

        with CaptureQueriesContext(connection) as ctx:
            CommentSerializer(qs, many=True).data

        print("\n--- SCALE TEST ---")
        print("Recursive queries at scale:", len(ctx))


    def create_large_comment_tree(
        self,
        roots=50,
        depth=5,
        breadth=5
    ):
        """
        Total comments ≈ roots * (breadth^depth - 1) / (breadth - 1)
        roots=50, depth=5, breadth=5 → ~78,000 comments
        """

        def grow(parent, current_depth):
            if current_depth >= depth:
                return

            for _ in range(breadth):
                child = Comment.objects.create(
                    author=self.user,
                    event=self.event,
                    text=f"Depth {current_depth}",
                    parent=parent
                )
                grow(child, current_depth + 1)

        for _ in range(roots):
            root = Comment.objects.create(
                author=self.user,
                event=self.event,
                text="Root comment"
            )
            grow(root, 1)
            
    def test_large_tree_performance(self):
        self.create_large_comment_tree(
            roots=20,
            depth=4,
            breadth=4
        )

        # ---------------- RECURSIVE ----------------
        qs = (
            Comment.objects
            .filter(event=self.event, parent=None)
            .prefetch_related("replies__replies__replies__replies")
        )

        with CaptureQueriesContext(connection) as rec_ctx:
            start = pytime.perf_counter()
            CommentSerializer(qs, many=True).data
            rec_time = pytime.perf_counter() - start

        # ---------------- ADJACENCY ----------------
        with CaptureQueriesContext(connection) as adj_ctx:
            start = pytime.perf_counter()
            build_comment_tree(self.event)
            adj_time = pytime.perf_counter() - start

        print("\n===== LARGE TREE BENCHMARK =====")
        print(f"Total comments: {Comment.objects.count()}")
        print(f"Recursive queries: {len(rec_ctx)}")
        print(f"Adjacency queries: {len(adj_ctx)}")
        print(f"Recursive time: {rec_time:.4f}s")
        print(f"Adjacency time: {adj_time:.4f}s")
