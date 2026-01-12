import { useEffect, useState } from 'react';
import { CiHeart, CiBookmark, CiCircleRemove } from "react-icons/ci";
import { FaHeart, FaRegCommentAlt, FaTrash, FaTimes } from "react-icons/fa";
import api from '../api';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const ViewPost = () => {
  const id = useParams().id;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  const getPost = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/post/${id}`);
      console.log(response.data);
      setData(response.data.post);
      
      // Set comments from response data
      if (response.data.post.comments) {
        setComments(response.data.post.comments);
      }

      if (response.data.post.likes) {
        setLikeCount(response.data.post.likes.length);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to load post');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPost();
  }, [id]);

  const handleLike = async () => {
    try {
      const response = await api.put(`/post/${data._id}/likeToggle`);
      const isLiked = response.data.liked;
      setLiked(isLiked);
      setLikeCount(prev => isLiked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/post/${commentId}/comment`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
      console.error("Error deleting comment:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await api.post(`/post/${data._id}/comment`, {
        comment: newComment.trim()
      });

      const newCommentObj = response.data.comment;
      setComments(prev => [...prev, {
        id: newCommentObj._id,
        Comment: newCommentObj.Comment,
        user: newCommentObj.user,
        likes: 0,
        isLiked: false,
        timeAgo: "Just now"
      }]);

      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const CommentItem = ({ comment }) => {
    if (!comment.user) return null;
    
    return (
      <div>
        <div className="flex items-start py-3 border-b border-gray-100 last:border-0">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img 
              src={comment.user.profilePic} 
              alt={comment.user.username} 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div className="ml-3 flex-1">
            <div className="flex items-center">
              <p className="font-semibold text-sm">{comment.user.username}</p>
              <span className="text-gray-500 text-xs ml-2">
                {getTimeAgo(comment.createdAt)}
              </span>
              <div className="flex items-center mt-2 space-x-4 ml-auto">          
                {/* Note: You might want to check against current user ID instead of username */}
                {/* {comment.user._id === currentUserId && ( */}
                <button 
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-xs text-gray-500 hover:text-red-500 ml-auto"
                >
                  <FaTrash size={12} />
                </button>
                {/* )} */}
              </div>
            </div>    
            <p className="text-sm mt-1">{comment.Comment || comment.comment || ''}</p>    
          </div>
        </div>
        <hr className="border-gray-400" />
      </div>
    );
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-lg mx-auto my-6 p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Show error state if no data
  if (!data) {
    return (
      <div className="max-w-lg mx-auto my-6 p-4 text-center">
        <div className="text-red-500">
          <p>Failed to load post. Please try again.</p>
          <button 
            onClick={getPost}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Post Card */}
      <div className='max-w-lg mx-auto my-6 bg-white rounded-xl border  border-gray-100 overflow-hidden p-12 shadow-(--drop-shadow)'>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className='w-10 h-10 rounded-full border-2 border-pink-500 p-0.5'>
              <div className='w-full h-full rounded-full overflow-hidden'>
                {data.user && data.user.profilePic ? (
                  <img 
                    src={data.user.profilePic} 
                    alt={data.user.username || 'User'} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 rounded-full"></div>
                )}
              </div>
            </div>
            <div className="ml-3">
              <p className='font-bold text-sm'>
                {data.user?.username || 'Unknown User'}
              </p>
              <p className='text-xs text-gray-500'>
                {getTimeAgo(data.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className='w-full aspect-square bg-gray-100'>
          {data.post ? (
            <img 
              src={data.post} 
              alt={data.caption || 'Post image'} 
              className='w-full h-full object-cover' 
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>

        <div className='flex items-center justify-between p-4'>
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleLike}
              className='flex items-center gap-2 cursor-pointer hover:scale-110 transition-transform'
            >
              {liked ? (
                <FaHeart className="text-red-500 text-2xl animate-pulse" />
              ) : (
                <CiHeart className="text-3xl hover:text-red-400 transition-colors" />
              )}
            </button>
            
            <button 
              onClick={() => setShowComments(true)}
              className='flex items-center gap-2 cursor-pointer hover:scale-110 transition-transform'
            >
              <FaRegCommentAlt className='text-2xl hover:text-blue-400 transition-colors' />
            </button>
          </div>
        </div>

        <div className='px-4 pb-3'>
          <p className='font-bold text-sm mb-2'>{likeCount} likes</p>
          <p className='text-sm mb-2'>
            <span className='font-bold mr-2'>
              {data.user?.username || 'Unknown User'}
            </span>
            {data.caption}
          </p>
          
          {comments.length > 0 && (
            <button 
              onClick={() => setShowComments(true)}
              className='text-gray-500 text-sm hover:text-gray-700 mb-2'
            >
              View all {comments.length} comments
            </button>
          )}
        </div>
      </div>

      {/* Comments Popup Modal */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowComments(false)}></div>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Comments</h3>
              <button
                onClick={() => setShowComments(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close comments"
              >
                <FaTimes className="text-gray-600 text-xl" />
              </button>
            </div>

            {/* Scrollable Comments Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <CommentItem key={comment._id} comment={comment} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FaRegCommentAlt className="text-4xl mb-3 opacity-50" />
                  <p className="text-lg">No comments yet</p>
                  <p className="text-sm mt-1">Be the first to comment!</p>
                </div>
              )}
            </div>

            {/* Add Comment Input (inside modal) */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <input 
                  type="text" 
                  placeholder="Add a comment..." 
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button 
                  onClick={handleAddComment}
                  className={`ml-3 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    !newComment.trim() 
                      ? 'bg-blue-300 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={!newComment.trim()}
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewPost;