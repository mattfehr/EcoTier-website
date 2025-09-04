import type { FC } from "react";

interface CommentProps {
  username: string;
  profileImage?: string;
  content: string;
  postTime: string;
}

const CommentCard: FC<CommentProps> = ({ username, profileImage, content, postTime }) => {
  return (
    <div className="flex gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-900">
      <img
        src={profileImage || "/default-avatar.png"}
        alt={username}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{username}</p>
        <p className="text-sm text-gray-500">{new Date(postTime).toLocaleString()}</p>
        <p className="mt-1">{content}</p>
      </div>
    </div>
  );
};

export default CommentCard;
