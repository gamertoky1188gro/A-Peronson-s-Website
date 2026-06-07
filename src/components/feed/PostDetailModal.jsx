import { useEffect, useMemo, useState } from "react";
import { X, MessageSquareText, Share2, Flag } from "lucide-react";
import { apiRequest, getToken } from "../../lib/auth";
import NeonAtom from "../ui/NeonAtom";
import PostPreview from "../ui/PostPreview";

function formatDateTime(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString();
}

export default function PostDetailModal({ open, onClose, item, onShare }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState("");
  const [replyingTo, setReplyingTo] = useState("");
  const [replyInput, setReplyInput] = useState("");
  const [expandedThreads, setExpandedThreads] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("post");

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const token = useMemo(() => getToken(), []);

  useEffect(() => {
    if (!open || !item?.id || !item?.entityType) return;
    let alive = true;
    setLoading(true);
    setError("");
    apiRequest(
      `/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}`,
      { token },
    )
      .then((data) => {
        if (!alive) return;
        setComments(Array.isArray(data?.comments) ? data.comments : []);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err.message || "Failed to load comments");
        setComments([]);
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [item?.entityType, item?.id, open, token]);

  function resetReply() {
    setReplyingTo("");
    setReplyInput("");
  }

  async function submitComment() {
    const text = input.trim();
    if (!text || submitting || !item?.id || !item?.entityType) return;
    setSubmitting(true);
    setError("");
    try {
      const created = await apiRequest(
        `/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/comment`,
        {
          method: "POST",
          token,
          body: { text },
        },
      );
      setComments((previous) => [created, ...previous]);
      setInput("");
    } catch (err) {
      setError(err.message || "Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReply(parentId) {
    const text = replyInput.trim();
    if (!text || submitting || !item?.id || !item?.entityType || !parentId)
      return;
    setSubmitting(true);
    setError("");
    try {
      const created = await apiRequest(
        `/social/${encodeURIComponent(item.entityType)}/${encodeURIComponent(item.id)}/comment`,
        {
          method: "POST",
          token,
          body: { text, parent_id: parentId },
        },
      );
      setComments((previous) => [created, ...previous]);
      resetReply();
    } catch (err) {
      setError(err.message || "Failed to post reply");
    } finally {
      setSubmitting(false);
    }
  }

  const commentTree = useMemo(() => {
    const byId = new Map();
    const roots = [];
    const sorted = [...comments].sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
    sorted.forEach((comment) => {
      byId.set(comment.id, { comment, children: [] });
    });
    sorted.forEach((comment) => {
      const node = byId.get(comment.id);
      if (comment.parent_id && byId.has(comment.parent_id)) {
        byId.get(comment.parent_id).children.push(node);
      } else {
        roots.push(node);
      }
    });
    return roots;
  }, [comments]);

  function toggleThread(id) {
    setExpandedThreads((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function renderCommentNode(node, depth = 0) {
    const { comment, children } = node;
    const safeDepth = Math.min(depth, 8);
    const indent = safeDepth * 16;
    const hasChildren = children.length > 0;
    const shouldCollapse =
      hasChildren && !expandedThreads[comment.id] && children.length > 3;
    const visibleChildren = shouldCollapse ? children.slice(0, 3) : children;

    return (
      <div key={comment.id} className="relative">
        {depth > 0 ? (
          <>
            <div
              className="absolute top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700"
              style={{ left: `${indent - 8}px` }}
            />
            <div
              className="absolute top-6 h-px w-3 bg-slate-200 dark:bg-slate-700"
              style={{ left: `${indent - 8}px` }}
            />
          </>
        ) : null}
        <div
          className="bg-white dark:bg-slate-800/50 rounded-xl p-3 ring-1 ring-slate-200/60 dark:ring-slate-700"
          style={{ marginLeft: `${indent}px` }}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                {comment.actor_name || "User"}{" "}
                {comment.actor_verified ? (
                  <span className="ml-1 text-[10px] text-[#0A66C2] font-bold">
                    Verified
                  </span>
                ) : null}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {formatDateTime(comment.created_at)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setReplyingTo(comment.id)}
              className="text-[11px] font-semibold text-[#0A66C2] hover:text-[#084b8a] shrink-0"
            >
              Reply
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
            {comment.text}
          </p>

          {replyingTo === comment.id ? (
            <div className="mt-3 flex gap-2 items-center">
              <input
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitReply(comment.id)}
                placeholder="Write a reply..."
                className="flex-1 rounded-full bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
              />
              <button
                type="button"
                onClick={() => submitReply(comment.id)}
                disabled={submitting || !replyInput.trim()}
                className="rounded-full bg-[#0A66C2] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
              >
                {submitting ? <NeonAtom size={16} /> : "Send"}
              </button>
              <button
                type="button"
                onClick={resetReply}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          ) : null}
        </div>

        {hasChildren ? (
          <div className="mt-3 space-y-3">
            {visibleChildren.map((child) =>
              renderCommentNode(child, depth + 1),
            )}
            {shouldCollapse ? (
              <button
                type="button"
                onClick={() => toggleThread(comment.id)}
                className="ml-4 text-[11px] font-semibold text-[#0A66C2] hover:text-[#084b8a]"
              >
                View {children.length - 3} more replies
              </button>
            ) : null}
            {!shouldCollapse && hasChildren && children.length > 3 ? (
              <button
                type="button"
                onClick={() => toggleThread(comment.id)}
                className="ml-4 text-[11px] font-semibold text-slate-500 hover:text-slate-700"
              >
                Hide replies
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 pb-4 sm:pt-10" style={{ overflow: "hidden" }}>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-black/50"
      />
      <div className="relative z-10 w-full max-w-2xl mx-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overscroll-contain">
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {item?.author?.name || "Unknown"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {item?.entityType === "user_feed_post"
                  ? "Feed Post"
                  : item?.entityType === "buyer_request"
                    ? "Buyer Request"
                    : "Company Product"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close"
          >
            <X size={20} className="text-slate-500 dark:text-slate-400" />
          </button>
        </header>

        <div className="flex border-b border-slate-200 dark:border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("post")}
            className={`flex-1 px-4 py-3 text-sm font-semibold text-center transition ${
              activeTab === "post"
                ? "text-sky-600 border-b-2 border-sky-500"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Post
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("comments")}
            className={`flex-1 px-4 py-3 text-sm font-semibold text-center transition ${
              activeTab === "comments"
                ? "text-sky-600 border-b-2 border-sky-500"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Comments
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "post" ? (
            <div className="p-5">
              <PostPreview item={item} />

              <div className="mt-6 flex items-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setActiveTab("comments")}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <MessageSquareText size={18} />
                  Comments
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400"
                >
                  <Share2 size={18} />
                  Share
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400"
                >
                  <Flag size={18} />
                  Report
                </button>
              </div>
            </div>
          ) : null}

          {activeTab === "comments" ? (
            <div className="p-5 space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <NeonAtom fill size={48} text="Loading comments..." />
                </div>
              ) : null}
              {!loading && error ? (
                <div className="text-sm text-rose-700 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300 rounded-lg p-3">
                  {error}
                </div>
              ) : null}
              {!loading && !error && comments.length === 0 ? (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                  No comments yet. Be the first to comment.
                </div>
              ) : null}

              {!loading && commentTree.map((node) => renderCommentNode(node, 0))}

              <div className="flex gap-2 items-center pt-3 border-t border-slate-200 dark:border-slate-700">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  placeholder="Write a comment..."
                  className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A66C2]"
                />
                <button
                  type="button"
                  onClick={submitComment}
                  disabled={submitting || !input.trim()}
                  className="rounded-full bg-[#0A66C2] text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
