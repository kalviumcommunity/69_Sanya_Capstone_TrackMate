import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logoimg from "../images/trackmate.png";
import { Settings } from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";

const ViewSchedule = () => {
  const { employeeId } = useParams();
  const [showConfirm, setShowConfirm] = useState(false); // For user removal confirmation
  const [showTaskConfirm, setShowTaskConfirm] = useState(false); // For task removal confirmation
  const [taskToRemove, setTaskToRemove] = useState(null); // Store the task ID to remove
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for error messages
  const navigate = useNavigate();

  // Fetch tasks when component mounts or employeeId changes
  
  
    useEffect(() => {
      const fetchTasks = async () => {
        if (!employeeId) {
          setError('Employee ID not found in URL');
          setLoading(false);
          return;
        }
  
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            setError('No authentication token found. Please log in again.');
            setLoading(false);
            return;
          }
  
          const response = await fetch(`${import.meta.env.VITE_META_URI}/api/tasks/${employeeId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          const data = await response.json();
          console.log('Tasks response for employeeId', employeeId, ':', data); // Debug log
  
          if (response.ok) {
            setTasks(data);
          } else {
            setError(data.error || 'Failed to fetch tasks');
          }
        } catch (err) {
          console.error('Fetch error:', err);
          setError('An error occurred while fetching tasks');
        } finally {
          setLoading(false);
        }
      };
  
      fetchTasks();
    }, [employeeId]);

  const handleRemoveUser = () => setShowConfirm(true);

  const confirmRemoveUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate(`/manager-login/${employeeId}`);
        return;
      }

      console.log("Employee ID:", employeeId);
      console.log("Employee ID Length:", employeeId?.length); // should be 24
      const url = `${import.meta.env.VITE_META_URI}/api/auth/users/${employeeId}`;
      console.log("Delete URL:", url);

      const response = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setShowConfirm(false);
        navigate(`/manager-dashboard/${employeeId}`);
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Error removing user:", err.response?.data || err.message);
      setError(`Failed to remove user: ${err.response?.data?.error || err.message}`);
      setShowConfirm(false);
    }
  };
  const handleViewLogs = (task) => {
    console.log('Task data being passed to ViewLogs:', task); // Add this line
    navigate(`/view-logs/${task._id}`, { state: { taskData: task } });
  };

  // Function to initiate task removal with confirmation
  const handleRemoveTaskInitiate = (taskId) => {
    setTaskToRemove(taskId);
    setShowTaskConfirm(true);
  };

  // Function to confirm and remove the task
  const confirmRemoveTask = async () => {
    if (!taskToRemove) return;

    try {
      const response = await axios.delete(`${import.meta.env.VITE_META_URI}/api/tasks/${taskToRemove}`);
      console.log("Delete response:", response); // Debug the response
      if (response.status === 200) {
        setTasks(tasks.filter((task) => task._id !== taskToRemove));
        setError(null); // Clear any previous errors
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("Error removing task:", err);
      setError("Failed to remove task. Please try again.");
    } finally {
      setShowTaskConfirm(false);
      setTaskToRemove(null);
    }
  };

  // Function to cancel task removal
  const cancelRemoveTask = () => {
    setShowTaskConfirm(false);
    setTaskToRemove(null);
  };

  // Function to manually refresh tasks
  const handleRefreshTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_META_URI}/tasks/${employeeId}`);
      let fetchedTasks = res.data;
      if (!Array.isArray(fetchedTasks)) {
        console.warn("Response is not an array, attempting to parse:", fetchedTasks);
        fetchedTasks = Array.isArray(fetchedTasks.data) ? fetchedTasks.data : [];
      }
      setTasks(fetchedTasks);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to fetch tasks. Please check the server or try again.");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Separate tasks into upcoming and completed based on status
  const upcomingTasks = tasks.filter((task) => 
    task.status !== 'completed' // Include tasks where status is not 'completed'
  );
  const completedTasks = tasks.filter((task) => 
    task.status === 'completed' // Only include tasks where status is 'completed'
  );
  const userId=localStorage.getItem("userId");
  return (
    <div className="bg-[#c2c0c0] min-h-screen flex flex-col items-center">
          <nav className="w-full h-20 bg-[#343A40] shadow-md relative flex items-center justify-center">
      {/* Back Arrow - absolutely positioned on the left */}
      <FiArrowLeft
        className="text-white cursor-pointer absolute left-6"
        size={25}
        onClick={() => navigate(`/manager-dashboard/${userId}`)}
      />
    
      {/* Centered Logo and Title */}
      <div className="flex items-center space-x-4">
        <img src={Logoimg} alt="TrackMate Logo" className="h-12 w-12 object-contain" />
        <h1 className="text-3xl font-bold text-white">TrackMate</h1>
      </div>
    </nav>

      {/* Schedule Section */}
      <div className="bg-[#6C757D] p-8 mt-10 rounded-xl w-11/12 max-w-6xl shadow-lg">
        <h2 className="text-white text-3xl font-bold text-center mb-2">
          View Schedule - {new Date().toLocaleDateString()}
        </h2>
        <p className="text-white text-center mb-6 text-xl"> Employee ID: {employeeId}</p>

        {/* Error Message with Neutral Color */}
        {error && (
          <div className="text-white text-center mb-4 bg-[#495057] p-2 rounded">
            {error}
          </div>
        )}

        {/* Refresh Button
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRefreshTasks}
            className="bg-[#495057] text-white px-4 py-2 rounded hover:bg-[#343A40]"
          >
            Refresh Tasks
          </button>
        </div> */}

        {/* Loading or Content */}
        {loading ? (
          <p className="text-white text-center">Loading tasks...</p>
        ) : (
          <>
            {/* Upcoming Tasks */}
            <div className="bg-[#495057] p-6 rounded-lg">
              <h3 className="text-white text-xl font-bold">Upcoming Tasks ({upcomingTasks.length})</h3>
              {upcomingTasks.length === 0 ? (
                <p className="text-gray-300 mt-2">No upcoming tasks</p>
              ) : (
                upcomingTasks.map((task) => (
                  <div
                    key={task._id || Math.random()} // Fallback key if _id is missing
                    className="bg-[#83868a] p-3 my-2 rounded flex justify-between items-center"
                  >
                    <div>
                      <span className="text-white block">
                        {task.description || "No description"}
                      </span>
                      <span className="text-gray-300 text-sm ">
                        {task.date || "No date"} at {task.time || "No time"} -{" "}
                        {task.address && task.address.startsWith("http") ? (
                            <a
                              href={task.address}
                              onClick={(e) => {
                                e.preventDefault();
                                window.open(task.address, "_blank", "noopener,noreferrer");
                              }}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white-400 underline hover:text-blue-300"
                            >
                              📍 Open Location in Maps
                            </a>
                          ) : (
                            <span className="text-gray-400">📍 No location link</span>
                          )}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="text-gray-300 underline hover:cursor-pointer"
                        onClick={() => handleRemoveTaskInitiate(task._id)}
                        disabled={!task._id} // Disable if _id is missing
                      >
                        Remove Task
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Completed Tasks */}
            <div className="bg-[#495057] p-6 rounded-lg mt-6">
              <h3 className="text-white text-xl font-bold">Completed Tasks ({completedTasks.length})</h3>
              {completedTasks.length === 0 ? (
                <p className="text-gray-300 mt-2">No completed tasks</p>
              ) : (
                completedTasks.map((task) => (
                  <div
                    key={task._id || Math.random()} // Fallback key if _id is missing
                    className="bg-[#83868a] p-3 my-2 rounded flex justify-between items-center"
                  >
                    <div>
                      <span className="text-white block">
                        {task.description || "No description"}
                      </span>
                      
                    </div>
                    <button
                      className="text-gray-300 underline hover:cursor-pointer"
                      onClick={() => handleViewLogs(task)}
                    >
                      View Logs
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Remove User Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleRemoveUser}
                className="bg-[#495057] text-white px-6 py-2 rounded text-lg hover:bg-[#343A40]"
              >
                Remove User
              </button>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal for User Removal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to remove this user?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRemoveUser}
                className="bg-[#495057] text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-[#6C757D] text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Task Removal */}
      {showTaskConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-bold mb-4">Are you sure you want to remove this task?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmRemoveTask}
                className="bg-[#495057] text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={cancelRemoveTask}
                className="bg-[#6C757D] text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewSchedule;