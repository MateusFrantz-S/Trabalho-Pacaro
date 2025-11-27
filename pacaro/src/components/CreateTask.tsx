import { useState } from "react";
import { Card } from "./Card";
import { toast } from "react-simple-toasts";

// Definições de API e Tipos
const USER_ID = "mateus-frantz-schmidt";
const API_URL = `https://pacaro-tarefas.netlify.app/api/${USER_ID}/tasks`;

type Step = "Para fazer" | "Em andamento" | "Pronto";

type CreateTaskProps = {
  quandoEnviaComSucesso: () => void;
};

export function CreateTask(props: CreateTaskProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<Step>("Para fazer");
  const [isLoading, setIsLoading] = useState(false);

  async function quandoEnvia(event: React.FormEvent) {
    event.preventDefault();

    // Validações
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
      title: title,
      description: description,
      step: step,
    };
    
    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(dataObj),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (resposta.status === 201) {
            setTitle("");
            setDescription("");
            setStep("Para fazer");
            toast("Tarefa criada com sucesso!", { theme: 'dark' });
            props.quandoEnviaComSucesso();
        } else {
            const erro = await resposta.json();
            toast(`Erro ao criar tarefa: ${erro.message || 'Erro desconhecido.'}`);
        }
    } catch (error) {
        toast("Erro de conexão ao enviar a tarefa.");
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="mx-4 my-8 md:mx-auto md:max-w-xl">
      <Card>
        <h2 className="text-center text-3xl font-extrabold mb-4 text-gray-800 border-b-2 border-yellow-400 pb-2">
          Criar Nova Tarefa
        </h2>
        <form className="flex flex-col gap-3" onSubmit={quandoEnvia}>
          <input
            type="text"
            placeholder="Título da Tarefa (4-30 caracteres)"
            className="border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-violet-500 transition-colors text-gray-800"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={30}
          />
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Descrição detalhada (8-150 caracteres)"
            className="border-2 border-gray-300 rounded-lg p-3 outline-none focus:border-violet-500 resize-none h-24 text-gray-800"
            maxLength={150}
          ></textarea>
          <div className="flex gap-4 justify-around p-2 bg-gray-100 rounded-lg text-gray-800">
            {["Para fazer", "Em andamento", "Pronto"].map((s) => (
              <div key={s} className="flex items-center gap-1">
                <input
                  type="radio"
                  id={`step-${s}`}
                  name="step-tarefa"
                  checked={step === s}
                  onChange={() => setStep(s as Step)}
                  className="form-radio text-violet-500 h-4 w-4"
                />
                <label htmlFor={`step-${s}`} className="text-sm font-medium">
                  {s}
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-violet-500 p-3 rounded-xl text-white font-bold uppercase text-lg shadow-lg hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Enviando..." : "Criar Tarefa"}
          </button>
        </form>
      </Card>
    </div>
  );
}