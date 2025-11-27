import { useState } from "react";
import { ListTasks } from "./components/ListTasks";
import { CreateTask } from "./components/CreateTask";

export default function App() {
  const [tarefaCriadaFlag, setTarefaCriadaFlag] = useState(false);

  return (
    <div className="min-h-screen bg-slate-800 p-2 md:p-6">
      {/* Container principal para centralizar e limitar a largura em telas grandes */}
      <div className="max-w-7xl mx-auto">
          <CreateTask
            quandoEnviaComSucesso={() => {
              // Sinaliza para ListTasks que uma ação de sucesso ocorreu e ele deve recarregar
              setTarefaCriadaFlag(true); 
            }}
          />
          <ListTasks
            tarefaCriadaFlag={tarefaCriadaFlag}
            toggleTarefaCriadaFlag={() => setTarefaCriadaFlag(false)}
          />
      </div>
    </div>
  );
}