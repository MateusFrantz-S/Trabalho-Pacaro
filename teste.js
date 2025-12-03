console.log("hello");

const nums = [1, 2, 3, 4, 5];
const dobros = nums.map((num) => num * 2);
const dobros2 = nums.map(function (num) {
  return num * 2;
});
const dobros3 = nums.map((num) => {
  return num * 2;
});

function dobra(num) {
  return num * 2;
}
const dobros4 = nums.map(dobra);

const letras = ["a", "b", "c", "d", "e"];
const letrasMaisculas = letras.map((letra) => letra.toUpperCase());

const personagensNaruto = [
  { nome: "Naruto", sobrenome: "Uzumaki" },
  { nome: "Sasuke", sobrenome: "Uchiha" },
  { nome: "Sakura", sobrenome: "Haruno" },
  { nome: "Kakashi", sobrenome: "Hatake" },
  { nome: "Jiraiya", sobrenome: "Pervertido" },
  { nome: "Tsunade", sobrenome: "Senju" },
  { nome: "Itachi", sobrenome: "Uchiha" },
  { nome: "Hinata", sobrenome: "Hyūga" },
  { nome: "Shikamaru", sobrenome: "Nara" },
  { nome: "Gaara", sobrenome: "do Deserto" },
];

const nomesPersonagens = personagensNaruto.map(
  (personagem) => `${personagem.nome} ${personagem.sobrenome}`
);

console.log(nomesPersonagens);

//'a'.toUpperCase();
