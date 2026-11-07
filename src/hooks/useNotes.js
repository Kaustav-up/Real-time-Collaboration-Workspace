import { useCallback, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { CLIENT_ID, db } from "../firebase.js";

export default function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(Boolean(db));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) return undefined;
    const q = query(collection(db, "notes"), orderBy("updatedAt", "desc"));
    return onSnapshot(
      q,
      (snap) => {
        setNotes(
          snap.docs.map((d) => {
            const data = d.data({ serverTimestamps: "estimate" });
            return {
              id: d.id,
              title: data.title || "",
              content: data.content || "",
              lastEditor: data.lastEditor || "",
              updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
            };
          })
        );
        setError("");
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  const createNote = useCallback(async () => {
    const ref = await addDoc(collection(db, "notes"), {
      title: "Untitled",
      content: "",
      lastEditor: CLIENT_ID,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  }, []);

  const saveNote = useCallback(async (id, fields) => {
    await updateDoc(doc(db, "notes", id), {
      ...fields,
      lastEditor: CLIENT_ID,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const removeNote = useCallback(async (id) => {
    await deleteDoc(doc(db, "notes", id));
  }, []);

  return { notes, loading, error, createNote, saveNote, removeNote };
}
