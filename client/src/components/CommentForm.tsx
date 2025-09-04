import { useState } from "react";

export default function CommentForm({ onSubmit }: { onSubmit: (content: string) => void }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 border p-2 rounded"
      />
      <button type="submit" className="px-4 bg-blue-600 text-white rounded">
        Post
      </button>
    </form>
  );
}
