import { toast } from "react-simple-toasts";
import type { Task } from "./EditTaskModel";
import { Card } from "./Card";

// Definições de API
const USER_ID = "mateus-frantz-schmidt";
const BASE_API_URL = `https://pacaro-tarefas.netlify.app/api/${USER_ID}/tasks`;

type TaskItemProps = {
    task: Task;
    onActionSuccess: () => void;
    onEditClick: (task: Task) => void;
};

export function TaskItem({ task, onActionSuccess, onEditClick }: TaskItemProps) {
    const isReady = task.step === "Pronto";
    const backgroundColor = isReady ? "bg-green-100" : "bg-white";
    const titleColor = isReady ? "text-green-700" : "text-gray-800";
    const descriptionColor = isReady ? "text-green-600" : "text-gray-600";
    const borderColor = isReady ? "border-green-400" : "border-violet-400";
    const statusText = isReady ? "Concluída!" : task.step;

    function handleDelete() {
        // Para evitar o uso de window.confirm() em ambientes restritos, 
        // usamos um modal customizado ou um toast de confirmação.
        // Aqui, simulamos a confirmação.
        
        // **AVISO:** Substitua este if(true) por um modal customizado 
        // se precisar de confirmação visual.
        if (window.confirm(`Tem certeza que deseja deletar a tarefa: "${task.title}"?`)) {
            performDelete();
        }
    }
    
    async function performDelete() {
        try {
            const resposta = await fetch(`${BASE_API_URL}/${task.id}`, {
                method: "DELETE",
            });

            if (resposta.ok) {
                toast("Tarefa deletada com sucesso!", { theme: 'dark' });
                onActionSuccess();
            } else {
                toast("Erro ao deletar tarefa.");
            }
        } catch (error) {
            toast("Erro de conexão ao deletar a tarefa.");
        }
    }
    
    // Função Drag Start
    function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
        // Adiciona o ID da tarefa para ser lido no onDrop
        e.dataTransfer.setData("taskId", task.id.toString());
        e.dataTransfer.effectAllowed = "move";
    }

    return (
        <Card 
            className={`mb-4 cursor-grab border-l-4 ${borderColor} ${backgroundColor}`}
            draggable
            onDragStart={handleDragStart}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className={`text-xl font-semibold mb-1 ${titleColor}`}>
                        {task.title}
                    </h3>
                    <p className={`text-sm ${descriptionColor} mb-2`}>
                        {task.description}
                    </p>
                    <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                        Status: {statusText}
                    </span>
                </div>
                
                <div className="flex gap-2 text-gray-500">
                    <button 
                        onClick={() => onEditClick(task)}
                        className="p-1 rounded-full hover:bg-yellow-200 transition-colors"
                        title="Editar"
                    >
                        {/* Ícone de Editar (Pencil) */}
                        <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                    </button>
                    <button 
                        onClick={handleDelete}
                        className="p-1 rounded-full hover:bg-red-200 transition-colors"
                        title="Deletar"
                    >
                        {/* Ícone de Deletar (Trash) */}
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
        </Card>
    );
}