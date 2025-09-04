import { useState } from "react";

interface CommentProps {
  id: string;
  userID: string;
  username: string;
  profileImage?: string;
  content: string;
  postTime: string;
  currentUserID?: string; // 👈 logged in user
  onUpdate: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}

export default function CommentCard({
  id,
  userID,
  username,
  profileImage,
  content,
  postTime,
  currentUserID,
  onUpdate,
  onDelete,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim()) {
      onUpdate(id, editContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <img
        src={profileImage || "/default-avatar.png"}
        alt={username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="font-semibold">{username}</p>
        <p className="text-sm text-gray-500">{new Date(postTime).toLocaleString()}</p>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-1 flex gap-2">
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 border p-1 rounded"
            />
            <button className="px-2 bg-blue-600 text-white rounded">Save</button>
          </form>
        ) : (
          <p className="mt-1">{content}</p>
        )}

        {currentUserID === userID && (
          <div className="flex gap-2 mt-1 text-sm">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:underline"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(id)}
              className="text-red-500 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
