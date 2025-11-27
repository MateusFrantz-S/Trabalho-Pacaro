import { Task } from "./EditTaskModal";
import { TaskItem } from "./TaskItem";

type Step = "Para fazer" | "Em andamento" | "Pronto";

type TaskColumnProps = {
    title: string;
    step: Step;
    tasks: Task[];
    onActionSuccess: () => void;
    onTaskMove: (taskId: number, newStep: Step) => void;
    onEditClick: (task: Task) => void;
};

// Mapeamento de cor do cabeçalho
const stepColors: Record<Step, string> = {
    "Para fazer": "border-red-500 bg-red-100 text-red-800",
    "Em andamento": "border-yellow-500 bg-yellow-100 text-yellow-800",
    "Pronto": "border-green-500 bg-green-100 text-green-800",
};

export function TaskColumn({ title, step, tasks, onActionSuccess, onTaskMove, onEditClick }: TaskColumnProps) {
    const colorClass = stepColors[step];

    // Drag Over - Previne o comportamento padrão para permitir o drop
    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.classList.add('bg-violet-600/30', 'ring-2', 'ring-violet-500');
    }

    // Drag Leave - Remove o estilo de hover
    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.currentTarget.classList.remove('bg-violet-600/30', 'ring-2', 'ring-violet-500');
    }

    // Drop - Processa o movimento da tarefa
    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.currentTarget.classList.remove('bg-violet-600/30', 'ring-2', 'ring-violet-500');

        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            onTaskMove(parseInt(taskId, 10), step);
        }
    }

    return (
        <div 
            className="flex-1 min-w-[280px] p-3 rounded-xl shadow-lg bg-slate-800/50"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <h2 className={`text-xl font-bold mb-4 p-2 rounded-lg text-center border-b-4 ${colorClass}`}>
                {title} ({tasks.length})
            </h2>
            <div className="min-h-[100px]">
                {tasks.map(task => (
                    <TaskItem 
                        key={task.id} 
                        task={task} 
                        onActionSuccess={onActionSuccess}
                        onEditClick={onEditClick}
                    />
                ))}
                {tasks.length === 0 && (
                    <p className="text-center text-gray-400 p-8 border-2 border-dashed border-gray-600 rounded-lg mt-4">
                        Nenhuma tarefa neste status. Arraste e solte aqui!
                    </p>
                )}
            </div>
        </div>
    );
}