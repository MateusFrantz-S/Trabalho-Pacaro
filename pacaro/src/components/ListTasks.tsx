import { useEffect, useState, useMemo } from "react";
import { toast } from "react-simple-toasts";
import { TaskColumn } from "./TaskColumn";
import { Task, EditTaskModal } from "./EditTaskModal";

// Definições de API e Tipos
const USER_ID = "mateus-frantz-schmidt";
const BASE_API_URL = `https://pacaro-tarefas.netlify.app/api/${USER_ID}/tasks`;

type Step = "Para fazer" | "Em andamento" | "Pronto";

type ListTasksProps = {
  tarefaCriadaFlag: boolean;
  toggleTarefaCriadaFlag: () => void;
};

export function ListTasks({ tarefaCriadaFlag, toggleTarefaCriadaFlag }: ListTasksProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  async function carregaTarefas() {
    setIsLoading(true);
    try {
        const resposta = await fetch(BASE_API_URL);
        if (resposta.ok) {
            const tarefas: Task[] = await resposta.json();
            setTasks(tarefas);
        } else {
            toast("Erro ao carregar tarefas.");
        }
    } catch (error) {
        toast("Erro de conexão ao carregar as tarefas.");
    } finally {
        setIsLoading(false);
    }
  }

  // Efeito para carregar tarefas no montagem e sempre que uma nova for criada
  useEffect(() => {
    carregaTarefas();
  }, []); // Carrega uma vez na montagem

  useEffect(() => {
    if (tarefaCriadaFlag) {
      carregaTarefas();
      toggleTarefaCriadaFlag();
    }
  }, [tarefaCriadaFlag]); // Recarrega quando uma nova tarefa é criada/editada/deletada

  // Lógica para mover tarefas entre colunas (PATCH)
  async function handleTaskMove(taskId: number, newStep: Step) {
    const currentTask = tasks.find(t => t.id === taskId);
    if (!currentTask || currentTask.step === newStep) return;

    try {
        const resposta = await fetch(`${BASE_API_URL}/${taskId}/update-step`, {
            method: "PATCH",
            body: JSON.stringify({ step: newStep }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resposta.ok) {
            // Atualiza o estado localmente para feedback instantâneo
            setTasks(prevTasks => prevTasks.map(t => 
                t.id === taskId ? { ...t, step: newStep } : t
            ));
            toast(`Tarefa movida para "${newStep}"!`, { theme: 'dark' });
        } else {
            toast("Erro ao mover a tarefa.");
        }
    } catch (error) {
        toast("Erro de conexão ao mover a tarefa.");
    }
  }

  // Função para abrir o modal de edição
  function openEditModal(task: Task) {
    setTaskToEdit(task);
    setIsModalOpen(true);
  }

  // Função para fechar o modal
  function closeEditModal() {
    setIsModalOpen(false);
    setTaskToEdit(null);
  }

  // Agrupamento das tarefas por Step
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
        acc[task.step] = acc[task.step] || [];
        acc[task.step].push(task);
        return acc;
    }, {} as Record<Step, Task[]>);
  }, [tasks]);

  const steps: { title: string, step: Step }[] = [
    { title: "Para Fazer", step: "Para fazer" },
    { title: "Em Andamento", step: "Em andamento" },
    { title: "Pronto", step: "Pronto" },
  ];

  if (isLoading && tasks.length === 0) {
    return (
        <div className="text-center mt-12 text-yellow-400 text-xl">
            Carregando tarefas...
        </div>
    );
  }

  return (
    <div className="p-4">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-yellow-400 border-b-2 border-violet-500 pb-3">
            PAINEL DE TAREFAS
        </h1>
        <p className="text-center text-sm text-gray-400 mb-8">
            Usuário: <span className="font-mono text-yellow-400">{USER_ID}</span> | Arraste e solte para mudar o status!
        </p>

        {/* Colunas de Tarefas */}
        <div className="flex flex-col lg:flex-row lg:justify-center gap-6">
            {steps.map(column => (
                <TaskColumn
                    key={column.step}
                    title={column.title}
                    step={column.step}
                    tasks={groupedTasks[column.step] || []}
                    onActionSuccess={carregaTarefas} // Recarrega lista após DELETE e PUT
                    onTaskMove={handleTaskMove} // PATCH para mover
                    onEditClick={openEditModal} // Abre o modal de edição
                />
            ))}
        </div>

        {/* Modal de Edição */}
        {isModalOpen && taskToEdit && (
            <EditTaskModal 
                task={taskToEdit} 
                onClose={closeEditModal} 
                onUpdateSuccess={carregaTarefas} // Recarrega lista após PUT
            />
        )}
    </div>
  );
}