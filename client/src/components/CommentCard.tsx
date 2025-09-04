import { useState } from "react";
import { Star } from "lucide-react";

interface CommentProps {
  id: string;
  userID: string;
  username: string;
  profileImage?: string;
  content: string;
  postTime: string;
  rating: number;
  currentUserID?: string;
  onUpdate: (id: string, content: string, rating: number) => void;
  onDelete: (id: string) => void;
}

export default function CommentCard({
  id,
  userID,
  username,
  profileImage,
  content,
  postTime,
  rating,
  currentUserID,
  onUpdate,
  onDelete,
}: CommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [editRating, setEditRating] = useState(rating);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editContent.trim()) {
      onUpdate(id, editContent, editRating);
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
        <div className="flex items-center gap-2">
          <p className="font-semibold">{username}</p>
          {/* ⭐ Rating display */}
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500">{new Date(postTime).toLocaleString()}</p>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="mt-1 space-y-2">
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full border p-1 rounded"
            />
            {/* ⭐ Rating edit */}
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setEditRating(r)}
                  className="focus:outline-none"
                >
                  <Star
                    size={20}
                    className={
                      r <= editRating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
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
