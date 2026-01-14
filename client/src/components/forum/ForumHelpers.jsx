import { useEffect, useState } from "react";
import {
  fetchEventComments,
  createComments,
  updateComment,
  deleteComment,
} from "../../utilities";

import {
  addReply,
  updateRecursive,
  deleteRecursive,
} from "./ForumHelpers";
import { fetchEvent } from "../utilities";
export function useEventComments(eventId) {
  const [comments, setComments] = useState([]);

  // ======================
  // Initial fetch
  // ======================
  useEffect(() => {
    if (!eventId) return;

    fetchEventComments(eventId).then((data) => {
      setComments(data);
    });
  }, [eventId]);

  // ======================
  // CRUD methods comments
  // ======================
  const create = async (data, fromWS = false) => {
    if (fromWS) {
      setComments((prev) => [...prev, data]);
      return;
    }

    const created = await createComments(eventId, data);
    if (created) {
      setComments((prev) => [...prev, created]);
    }
  };

  const reply = async (parentId, data, fromWS = false) => {
    if (fromWS) {
      setComments((prev) => addReply(prev, parentId, data));
      return;
    }

    const created = await createComments(eventId, {
      ...data,
      parent: parentId,
    });

    if (created) {
      setComments((prev) => addReply(prev, parentId, created));
    }
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