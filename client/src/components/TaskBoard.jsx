import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import { TASK_STATUSES, STATUS_COLORS } from '../utils/constants';
import { Plus, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

const TaskBoard = ({ tasks = [], onStatusChange, onEditTask, onDeleteTask, onViewDetails, onQuickAdd }) => {
  const columnIcons = {
    Pending: Clock,
    'In Progress': PlayCircle,
    Completed: CheckCircle2,
  };

  const handleDragEnd = (result) => {
    const { destination, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === result.source.droppableId) return;

    const newStatus = destination.droppableId;
    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {TASK_STATUSES.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);
          const Icon = columnIcons[status] || Clock;
          const statusStyle = STATUS_COLORS[status];

          return (
            <div
              key={status}
              className="flex flex-col bg-slate-100/70 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800/80 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${statusStyle.dot}`} />
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {status}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold">
                    {columnTasks.length}
                  </span>
                </div>

                <button
                  onClick={() => onQuickAdd(status)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  title={`Add task to ${status}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Droppable Container */}
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 space-y-3 transition-colors rounded-xl p-1 ${
                      snapshot.isDraggingOver ? 'bg-brand-50/50 dark:bg-brand-950/20' : ''
                    }`}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TaskCard
                              task={task}
                              onEdit={onEditTask}
                              onDelete={onDeleteTask}
                              onViewDetails={onViewDetails}
                              isDragging={snapshot.isDragging}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnTasks.length === 0 && (
                      <div className="h-32 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 dark:text-slate-600 text-xs font-medium">
                        <span>No tasks in {status}</span>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
