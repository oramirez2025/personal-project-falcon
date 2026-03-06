import { useEffect, useState, useRef } from "react";
import {
  createComments,
  updateComment,
  deleteComment,
  createGeneralComment,
} from "../../utilities";



import { fetchEvent } from "../../utilities";
import { fetchComments, fetchGeneralComments } from "../../utilities";
export function useEventComments(eventId, year) {
  const [comments, setComments] = useState([]);

  const socketRef = useRef(null);

  // ======================
  // Tree helpers
  // ======================
  const addReply = (comments, parentId, reply) =>
    comments.map((c) =>
      c.id === parentId
        ? { ...c, replies: [...(c.replies || []), reply] }
        : { ...c, replies: addReply(c.replies || [], parentId, reply) }
    );

  const updateRecursive = (comments, updated) =>
    comments.map((c) =>
      c.id === updated.id
        ? { ...c, ...updated }
        : { ...c, replies: updateRecursive(c.replies || [], updated) }
    );

  const deleteRecursive = (comments, id) =>
    comments
      .filter((c) => c.id !== id)
      .map((c) => ({
        ...c,
        replies: deleteRecursive(c.replies || [], id),
      }));
  // ======================
  // Initial fetch
  // ======================
  useEffect(() => {
    // If neither eventId nor year is provided, do nothing
    if (!eventId && !year) return;

    let mounted = true;

    const fetchData = () => {
      if (eventId) {
        fetchComments((data) => {
          if (!mounted) return;
          setComments(data);
        }, eventId);
      } else if (year) {
        fetchGeneralComments((data) => {
          if (!mounted) return;
          setComments(data);
        }, year);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [eventId, year]);

  // ======================
  // Websocket
  // ======================
  useEffect(() => {
    if (!eventId && !year) return;

    const wsUrl = eventId
      ? `ws://localhost:8001/ws/comments/${eventId}/`
      : `ws://localhost:8001/ws/comments/general/${year}/`;

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
    };
    

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      console.log("WS RECEIVED: ", data)
      switch (data.type) {
        case "new_comment":
          if (data.comment.parent) {
            setComments((prev) =>
              addReply(prev, data.comment.parent, data.comment)
            );
          } else {
            setComments((prev) => [...prev, data.comment]);
          }
          break;

        case "update_comment":
          setComments((prev) =>
            updateRecursive(prev, data.comment)
          );
          break;

        case "delete_comment":
          setComments((prev) =>
            deleteRecursive(prev, data.id)
          );
          break;

        default:
          break;
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [eventId, year]);

  // ======================
  // CRUD methods comments
  // ======================
  const create = async (data, fromWS = false) => {
    if (fromWS) {
      setComments((prev) => [...prev, data]);
      return;
    }
    let created;


    if (eventId) {
      created = await createComments(eventId, data);
    } else {
      created = await createGeneralComment(year, {...data, general: true});
    }
    // if (created) {
    //   setComments((prev) => [...prev, created]);
    // }
  };

  const reply = async (parentId, data, fromWS = false) => {
    if (fromWS) {
      setComments((prev) => addReply(prev, parentId, data));
      return;
    }

    let created;

    if (eventId) {
      created = await createComments(eventId, {
        ...data,
        parent: parentId,
      });
    } else {
      created = await createGeneralComment(year, {
        ...data,
        parent: parentId,
        general: true,
      });
    }

    // if (created) {
    //   setComments((prev) => addReply(prev, parentId, created));
    // }
  };

  const edit = async (updated, fromWS = false) => {
    if (fromWS) {
      setComments((prev) => updateRecursive(prev, updated));
      return;
    }

    const result = await updateComment(updated.id, { text: updated.text });
    if (result) {
      setComments((prev) => updateRecursive(prev, result));
    }
  };

  const like = async (id) => {
    const updated = await updateComment(id, { like: true });
    if (updated) {
      setComments((prev) => updateRecursive(prev, updated));
    }
  };

  const remove = async (id, fromWS = false) => {
    if (fromWS) {
      setComments((prev) => deleteRecursive(prev, id));
      return;
    }

    await deleteComment(id);
    setComments((prev) => deleteRecursive(prev, id));
  };

  return {
    comments,
    create,
    reply,
    edit,
    like,
    remove,
  };
}


export function useEvent(eventId) {
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!eventId) return;
    fetchEvent(setEvent, eventId);
  }, [eventId]);

  return event;
}