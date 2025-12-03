import { useState, useEffect } from "react";
import { toast } from "react-simple-toasts";
import { Card } from "./Card";

// Definições de API
const USER_ID = "mateus-frantz-schmidt";
const BASE_API_URL = `https://pacaro-tarefas.netlify.app/api/${USER_ID}/tasks`;

type Step = "Para fazer" | "Em andamento" | "Pronto";

export type Task = {
    id: number;
    title: string;
    description: string;
    step: Step;
    user: string;
};

type EditTaskModalProps = {
    task: Task;
    onClose: () => void;
    onUpdateSuccess: () => void;
};

export function EditTaskModal({ task, onClose, onUpdateSuccess }: EditTaskModalProps) {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [step, setStep] = useState<Step>(task.step);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Garante que o estado interno reflete a task atual se ela mudar
        setTitle(task.title);
        setDescription(task.description);
        setStep(task.step);
    }, [task]);

    async function handleUpdate(event: React.FormEvent) {
        event.preventDefault();

        // Validações (Mantendo a mesma lógica do CreateTask)
        if (title.length < 4 || title.length > 30) {
            toast("O título precisa ter entre 4 e 30 caracteres!");
            return;
        }

        if (description.length < 8 || description.length > 150) {
            toast("A descrição precisa ter entre 8 e 150 caracteres!");
            return;
        }

        setIsLoading(true);

        const dataObj = {
            title,
            description,
            step, // PUT exige todos os campos, mesmo que só title/description mudem
        };

        try {
            const resposta = await fetch(`${BASE_API_URL}/${task.id}`, {
                method: "PUT",
                body: JSON.stringify(dataObj),
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (resposta.ok) {
                toast("Tarefa atualizada com sucesso!", { theme: 'dark' });
                onUpdateSuccess();
                onClose();
            } else {
                const erro = await resposta.json();
                toast(`Erro ao atualizar: ${erro.message || 'Erro desconhecido.'}`);
            }
        } catch (error) {
            toast("Erro de conexão ao atualizar a tarefa.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        // Overlay do Modal
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-lg">
                <Card className="bg-white text-gray-800">
                    <h2 className="text-3xl font-bold mb-4 border-b-2 border-yellow-400 pb-2">
                        Editar Tarefa ID: {task.id}
                    </h2>
                    <form className="flex flex-col gap-3" onSubmit={handleUpdate}>
                        <label className="text-sm font-medium">Título</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-violet-500"
                            maxLength={30}
                        />
                        <label className="text-sm font-medium">Descrição</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-violet-500 resize-none h-24"
                            maxLength={150}
                        />
                        <div className="flex gap-4 mt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-300 p-3 rounded-xl font-bold hover:bg-gray-400 transition-colors"
                                disabled={isLoading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-yellow-400 p-3 rounded-xl text-gray-800 font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
                                disabled={isLoading}
                            >
                                {isLoading ? "Salvando..." : "Salvar Alterações"}
                            </button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
}