"use client"
import { useState, useEffect } from 'react';

const App = () => {
  const [tasks, setTasks] = useState([
    { id: 1, text: "The Great Gatsby by F. Scott Fitzgerald", completed: false },
    { id: 2, text: "To Kill a Mockingbird by Harper Lee", completed: false },
    { id: 3, text: "Pride and Prejudice by Jane Austen", completed: false },
    { id: 4, text: "The Catcher in the Rye by J.D. Salinger", completed: false },
  ]);

  const [newTask, setNewTask] = useState('');

  const generateCheckpoints = () => {
    const count = tasks.length;
    const checkpoints = [];

    for (let i = 0; i < count; i++) {
      const y = ((tasks.length * 10) / (count - 1)) * i;
      const x = 50 + (i % 2 === 0 ? -20 : 20);
      checkpoints.push({
        name: tasks[i].text,
        position: { x, y },
        color: "bg-pink-500",
        status: i === 0 ? 'completed' : 'pending',
      });
    }

    return checkpoints;
  };

  const [checkpoints, setCheckpoints] = useState(generateCheckpoints);
  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;

  // Determine current checkpoint index based on completed tasks
  const currentCheckpointIndex = Math.min(
    completedCount,
    checkpoints.length - 1
  );

  // Toggle task completion
  const toggleTask = (id:any) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add new task
  const addTask = () => {
    if (newTask.trim()) {
      const newId = Date.now();
      setTasks([
        ...tasks,
        {
          id: newId,
          text: newTask.trim(),
          completed: false,
        },
      ]);
      setNewTask('');
    }
  };

  // Delete task
  const deleteTask = (id:any) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Recalculate checkpoints when tasks change
  useEffect(() => {
    setCheckpoints(generateCheckpoints());
  }, [tasks]);

  // Get path data for SVG
  const getZigZagPath = (index:number) => {
    let pathData = '';
    if (index < 1) return '';

    const prevCheckpoint = checkpoints[index - 1];
    const checkpoint = checkpoints[index];

    const x1 = prevCheckpoint.position.x;
    const y1 = prevCheckpoint.position.y;
    const x2 = checkpoint.position.x;
    const y2 = checkpoint.position.y;

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;

    const controlX = midX;
    const controlY = index % 2 === 0 ? midY - 6 : midY + 6;

    pathData += `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
    return pathData;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-400 to-teal-200 p-6">
      <div className="max-w-6xl mx-auto flex gap-8 justify-between items-start flex-wrap lg:flex-nowrap">
        {/* Task List Section */}
        <div className="w-full lg:w-1/2 bg-transparent rounded-2xl border border-gray-200 shadow-xl p-6 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800">📚 Your Reading Journey</h2>
          <p className="text-gray-600">Complete books to move along your path.</p>

          {/* Input Form */}
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new book..."
              className="flex-1 px-4 py-3 rounded-xl placeholder-white/60 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200"
            />
            <button
              onClick={addTask}
              className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Add
            </button>
          </div>

          {/* Task List */}
          <div className="space-y-3 h-[400px] overflow-y-auto scrollbar-none">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`bg-white/10 backdrop-blur-medium rounded-lg p-4 flex items-center gap-4 shadow-sm transition-all duration-300 hover:shadow-md ${
                  task.completed ? 'transform scale-95 opacity-40' : 'hover:scale-[1.02]'
                }`}
              >
                <button
                  onClick={() => toggleTask(task.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    task.completed
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-gray-400 hover:border-blue-500 hover:bg-blue-100'
                  }`}
                >
                  {task.completed && '✓'}
                </button>
                <span
                  className={`flex-1 text-gray-800 ${
                    task.completed ? 'line-through opacity-70' : ''
                  }`}
                >
                  {task.text}
                </span>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  🗑️
                </button>
              </div>
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No books yet. Add one to start your journey!
              </div>
            )}
          </div>
        </div>

        {/* Gamified Path Section */}
        <div className="w-full lg:w-1/2 flex flex-col gap-5">
          {/* Progress Stats */}
          <div className="bg-white/10 shadow-lg rounded-lg p-4 flex flex-col gap-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">{tasks[currentCheckpointIndex].text}</span>
              <span className="text-white font-bold">{Math.round((completedCount / totalTasks) * 100)}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width:`${(completedCount / totalTasks) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Tasks Completed</span>
              <span className="text-white font-bold">{completedCount} / {totalTasks}</span>
            </div>
          </div>
        
          <div className="relative h-[70vh] rounded-xl bg-white shadow-lg border border-gray-200">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {/* Background Dashed Path */}
              {checkpoints.map((_, idx) => (
                <path
                  key={`bg-${idx}`}
                  d={getZigZagPath(idx)}
                  fill="none"
                  stroke="rgba(0,0,0,0.1)"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                  className='transition-all duration-700 ease-out px-4'
                />
              ))}

              {/* Active Animated Segments */}
              {checkpoints.slice(1).map((_, idx) => (
                <path
                  key={`active-${idx}`}
                  d={getZigZagPath(idx + 1)}
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="1.2"
                  strokeDasharray="100"
                  strokeDashoffset={tasks[idx]?.completed ? 0 : 100}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  filter={tasks[idx]?.completed ? "url(#glow)" : ""}
                />
              ))}

              {/* Gradient Definition */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="25%" stopColor="#10B981" />
                  <stop offset="50%" stopColor="#F59E0B" />
                  <stop offset="75%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="1.5" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
            </svg>

            {/* Checkpoints */}
            {checkpoints.map((checkpoint, index) => {
              const isCompleted = index <= currentCheckpointIndex;
              const isActive = index === currentCheckpointIndex;
              const isVictory = index === checkpoints.length - 1;

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
                  style={{
                    left: `${checkpoint.position.x}%`,
                    top: `${checkpoint.position.y}%`,
                  }}
                >
                  {/* Checkpoint Circle */}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shadow-md transition-all duration-500 ${
                      isCompleted
                        ? `${checkpoint.color} text-white scale-110  ${
                            isVictory ? 'animate-pulse scale-125' : ''
                          }`
                        : isActive
                        ? `${checkpoint.color} text-white shadow-lg scale-125 animate-bounce`
                        : 'bg-gray-300 text-gray-500 scale-90'
                    }`}
                  >
                    {isCompleted && !isVictory && '✓'}
                  </div>

                  {/* Tooltip */}
                  { isActive && (
                    <div
                      className={`absolute left-full ml-3 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap duration-300 pointer-events-none`}
                    >
                      {checkpoint.name}
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black/80"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
