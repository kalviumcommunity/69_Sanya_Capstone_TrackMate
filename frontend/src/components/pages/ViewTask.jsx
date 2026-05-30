import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Logoimg from "../images/trackmate.png";
import { Settings } from "lucide-react";
import { FiArrowLeft } from "react-icons/fi";
const ViewTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInPhoto, setCheckInPhoto] = useState(null);
  const [checkOutPhoto, setCheckOutPhoto] = useState(null);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [checkInLocation, setCheckInLocation] = useState(null);
  const [checkOutLocation, setCheckOutLocation] = useState(null);
  const checkInVideoRef = useRef(null);
  const checkOutVideoRef = useRef(null);
  const checkInCanvasRef = useRef(null);
  const checkOutCanvasRef = useRef(null);
  const [isCheckInReady, setIsCheckInReady] = useState(false);
  const [isCheckOutReady, setIsCheckOutReady] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError("Task ID not found in URL");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_META_URI}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId }),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error("Response status:", response.status, "Response text:", text);
          let errorMessage = "Failed to fetch task";
          if (response.status === 400) errorMessage = "Invalid task ID format";
          else if (response.status === 403) errorMessage = "Unauthorized: Task not assigned to you";
          else if (response.status === 404) errorMessage = "Task not found";
          throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("Fetched task data for taskId", taskId, ":", data);
        console.log("Task Employee ID:", data.employeeId);
        console.log(token)
        setTask(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "An error occurred while fetching the task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  const initializeStream = async (videoRef, setReady) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        const checkReadiness = () => {
          if (videoRef.current.readyState >= 2) {
            setReady(true);
          } else {
            setTimeout(checkReadiness, 300);
          }
        };
        checkReadiness();
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera.");
    }
  };

  const stopStream = (videoRef, setReady) => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setReady(false);
    }
  };

  const startCamera = (videoRef, setReady) => {
    stopStream(videoRef, setReady);
    initializeStream(videoRef, setReady);
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const gmapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
          resolve(gmapsLink);
        },
        (err) => {
          reject(new Error(`Failed to get location: ${err.message}`));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const capturePhoto = async (canvasRef, setPhoto, videoRef, setTime, setReady, setLocation) => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, 300, 225);
      const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
      setPhoto(imageDataUrl);
      setTime(new Date().toISOString());

      try {
        const locationLink = await getCurrentLocation();
        setLocation(locationLink);
      } catch (err) {
        console.error("Location error:", err);
        setError(err.message);
      }
    } else {
      setError("Video not ready for capture.");
    }
    stopStream(videoRef, setReady);
  };

  const handleTaskCompleted = async () => {
    try {
      const token = localStorage.getItem("token");
      // const employeeId = localStorage.getItem("userId");
      const employeeId= task.employeeId;
      console.log("Employee ID from localStorage:", employeeId);
      console.log("Task Employee ID:", task?.employeeId);

      if (!employeeId) {
        setError("Employee ID not found in localStorage. Please log in again.");
        return;
      }
      if (!checkInPhoto || !checkOutPhoto) {
        setError("Capture both Check-In and Check-Out photos!");
        return;
      }
      if (!checkInLocation || !checkOutLocation) {
        setError("Location data is missing for Check-In or Check-Out!");
        return;
      }
      if (!task || !task.employeeId) {
        setError("Task data or Employee ID not found for this task.");
        return;
      }

      const updateResponse = await fetch(`${import.meta.env.VITE_META_URI}/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: "completed",
          employeeId,
          checkInTime,
          checkOutTime,
          checkInLocation,
          checkOutLocation,
          checkInPhoto,
          checkOutPhoto
        }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update task status");
      }

      const checkInPhotoResponse = await fetch(`${import.meta.env.VITE_META_URI}/api/tasks/${taskId}/photo/check-in`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photo: checkInPhoto.split(",")[1] }),
      });

      if (!checkInPhotoResponse.ok) {
        const errorData = await checkInPhotoResponse.json();
        throw new Error(errorData.error || "Failed to upload Check-In photo");
      }

      const checkOutPhotoResponse = await fetch(`${import.meta.env.VITE_META_URI}/api/tasks/${taskId}/photo/check-out`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ photo: checkOutPhoto.split(",")[1] }),
      });

      if (!checkOutPhotoResponse.ok) {
        const errorData = await checkOutPhotoResponse.json();
        throw new Error(errorData.error || "Failed to upload Check-Out photo");
      }

      alert("Task marked as completed, photos uploaded, and locations saved!");
      navigate(`/employee-dashboard/${employeeId}`, { replace: true });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.error("Task completion error:", err);
      setError(err.message || "Error marking task as completed or uploading photos/locations.");
    }
  };

  useEffect(() => {
    return () => {
      stopStream(checkInVideoRef, setIsCheckInReady);
      stopStream(checkOutVideoRef, setIsCheckOutReady);
    };
  }, []);

  if (loading) return <div className="text-center mt-10 text-white">Loading task...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#c2c0c0] flex flex-col items-center">
      <nav className="w-full flex flex-col items-center px-8 py-5 bg-[#343A40] shadow-md h-20 relative">
        <FiArrowLeft
                    className="text-white cursor-pointer absolute left-6"
                    size={25}
                    onClick={() => navigate(-1)}
                  />
        <div className="flex items-center space-x-4">
          <img src={Logoimg} alt="TrackMate Logo" className="h-12 w-12 object-contain" />
          <h1 className="text-3xl font-bold text-white">TrackMate</h1>
        </div>
      </nav>
      <div className="bg-[#83868a] mt-10 p-8 rounded-xl w-11/12 max-w-4xl shadow-lg text-white">
        <h2 className="text-center text-3xl font-bold mb-2">Task Details</h2>
        {task && (
          <div className="mb-6">
            {task.locationLink && (
              <p className="text-lg">
                <strong>Location:</strong>{" "}
                <a
                  href={task.locationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline hover:text-blue-500"
                >
                  View on Google Maps
                </a>
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Check-In</h3>
            <button
              onClick={() => startCamera(checkInVideoRef, setIsCheckInReady)}
              className="w-full mb-3 py-2 rounded bg-[#6C757D] hover:bg-[#495057]"
            >
              Open Camera
            </button>
            <video ref={checkInVideoRef} autoPlay style={{ display: checkInPhoto ? "none" : "block", width: "300px" }} />
            <canvas ref={checkInCanvasRef} style={{ display: "none", width: "300px", height: "225px" }} width="300" height="225" />
            {checkInPhoto && <img src={checkInPhoto} alt="Check-In" style={{ width: "300px", marginTop: "10px" }} />}
            <button
              onClick={() =>
                capturePhoto(checkInCanvasRef, setCheckInPhoto, checkInVideoRef, setCheckInTime, setIsCheckInReady, setCheckInLocation)
              }
              className="w-full mt-3 py-2 rounded bg-[#6C757D] hover:bg-[#495057]"
              disabled={!isCheckInReady}
            >
              Capture Photo
            </button>
            {checkInPhoto && <p className="text-green-500 mt-2">Check-In photo captured!</p>}
            {checkInTime && <p className="text-white mt-2">Check-In Time: {new Date(checkInTime).toLocaleString()}</p>}
            {checkInLocation && (
              <p className="text-white mt-2">
                Check-In Location:{" "}
                <a
                  href={checkInLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline hover:text-blue-500"
                >
                  View on Google Maps
                </a>
              </p>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Check-Out</h3>
            <button
              onClick={() => startCamera(checkOutVideoRef, setIsCheckOutReady)}
              className="w-full mb-3 py-2 rounded bg-[#6C757D] hover:bg-[#495057]"
            >
              Open Camera
            </button>
            <video ref={checkOutVideoRef} autoPlay style={{ display: checkOutPhoto ? "none" : "block", width: "300px" }} />
            <canvas ref={checkOutCanvasRef} style={{ display: "none", width: "300px", height: "225px" }} width="300" height="225" />
            {checkOutPhoto && <img src={checkOutPhoto} alt="Check-Out" style={{ width: "300px", marginTop: "10px" }} />}
            <button
              onClick={() =>
                capturePhoto(checkOutCanvasRef, setCheckOutPhoto, checkOutVideoRef, setCheckOutTime, setIsCheckOutReady, setCheckOutLocation)
              }
              className="w-full mt-3 py-2 rounded bg-[#6C757D] hover:bg-[#495057]"
              disabled={!isCheckOutReady}
            >
              Capture Photo
            </button>
            {checkOutPhoto && <p className="text-green-500 mt-2">Check-Out photo captured!</p>}
            {checkOutTime && <p className="text-white mt-2">Check-Out Time: {new Date(checkOutTime).toLocaleString()}</p>}
            {checkOutLocation && (
              <p className="text-white mt-2">
                Check-Out Location:{" "}
                <a
                  href={checkOutLocation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-300 underline hover:text-blue-500"
                >
                  View on Google Maps
                </a>
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleTaskCompleted}
          className="mt-6 bg-[#495057] text-white py-2 px-6 rounded hover:bg-[#343A40] block mx-auto"
        >
          Task Completed
        </button>
      </div>
    </div>
  );
};

export default ViewTask;