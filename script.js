// Variável global para armazenar a matéria selecionada
let selectedSubject = null;

// Função para obter ou criar a lista de matérias no localStorage
function getOrCreateSubjectsList() {
    let subjectsList = localStorage.getItem('subjects');
    if (subjectsList === null) {
      subjectsList = [];
    } else {
      subjectsList = JSON.parse(subjectsList);
    }
    return subjectsList;
  }
  
  // Função para salvar a lista de matérias no localStorage
  function saveSubjectsList(subjectsList) {
    localStorage.setItem('subjects', JSON.stringify(subjectsList));
  }
  
  // Função para obter ou criar a lista de questões para uma matéria no localStorage
  function getOrCreateQuestionsList(subject) {
    let questionsList = localStorage.getItem(`questions_${subject}`);
    if (questionsList === null) {
      questionsList = [];
    } else {
      questionsList = JSON.parse(questionsList);
    }
    return questionsList;
  }
  
  // Função para salvar a lista de questões para uma matéria no localStorage
  function saveQuestionsList(subject, questionsList) {
    localStorage.setItem(`questions_${subject}`, JSON.stringify(questionsList));
  }
  
 // Função para adicionar uma nova matéria
function addSubject() {
    const newSubject = document.getElementById('newSubject').value;
    if (newSubject !== '') {
      let subjectsList = getOrCreateSubjectsList();
      subjectsList.push(newSubject);
      saveSubjectsList(subjectsList);
      updateSubjectList();
      document.getElementById('newSubject').value = '';
      closeAddSubjectDialog();
      updatePerformanceTabs();
    }
  }

  // Função para atualizar a lista de matérias
function updateSubjectList() {
  const subjectsList = getOrCreateSubjectsList();
  const subjectList = document.getElementById('subjectList');
  subjectList.innerHTML = '';

  for (const subject of subjectsList) {
    const subjectBox = document.createElement('div');
    subjectBox.classList.add('subjectBox');

    const subjectName = document.createElement('span');
    subjectName.textContent = subject;
    subjectBox.appendChild(subjectName);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.onclick = () => deleteSubject(subject);
    subjectBox.appendChild(deleteButton);

    subjectList.appendChild(subjectBox);
  }
}
  
  // Função para deletar uma matéria
  function deleteSubject(subject) {
    const subjectsList = getOrCreateSubjectsList();
    const index = subjectsList.indexOf(subject);
    if (index !== -1) {
      subjectsList.splice(index, 1);
      saveSubjectsList(subjectsList);
      updateSubjectList();
      selectedSubject = null; // Limpa a matéria selecionada
      updateQuestionListAndPerformance();
    }
  }
  
  // Função para adicionar uma nova questão
  function addQuestion() {
    const selectedSubject = document.getElementById('selectSubjectModal').value;
    const correctAnswers = parseInt(document.getElementById('correctAnswersInput').value);
    const totalQuestions = parseInt(document.getElementById('totalQuestionsInput').value);
  
    if (Number.isNaN(correctAnswers) || Number.isNaN(totalQuestions)) {
      alert('Por favor, insira números válidos para a quantidade de acertos e total de questões.');
      return;
    }
  
    const currentDate = new Date();
    const timestamp = currentDate.toISOString();
    const questionData = {
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      timestamp: timestamp
    };
  
    let questionsList = getOrCreateQuestionsList(selectedSubject);
    questionsList.push(questionData);
    saveQuestionsList(selectedSubject, questionsList);
    updateQuestionList();
    document.getElementById('correctAnswersInput').value = '';
    document.getElementById('totalQuestionsInput').value = '';
    closeAddQuestionDialog();
    updatePerformanceTabs();
  }
  
  // Função para deletar uma questão
  function deleteQuestion(subject, questionIndex) {
    const questionsList = getOrCreateQuestionsList(subject);
    questionsList.splice(questionIndex, 1);
    saveQuestionsList(subject, questionsList);
    updateQuestionList();
    updatePerformanceTabs();
  }
  
  function updateSubjectList() {
    const subjectsList = getOrCreateSubjectsList();
    const selectSubject = document.getElementById('selectSubject');
    const subjectList = document.getElementById('subjectList');
    selectSubject.innerHTML = '';
    subjectList.innerHTML = '';
  
    for (const subject of subjectsList) {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      selectSubject.appendChild(option);
  
      const listItem = document.createElement('li');
      listItem.textContent = subject;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir';
      deleteButton.onclick = () => deleteSubject(subject);
      listItem.appendChild(deleteButton);
      subjectList.appendChild(listItem);
    }
  }
  
  // Função para atualizar a lista de questões
  function updateQuestionList() {
    const questionsList = getOrCreateQuestionsList(selectedSubject);
    const questionList = document.getElementById('questionList');
    questionList.innerHTML = '';
  
    for (let i = 0; i < questionsList.length; i++) {
      const questionObj = questionsList[i];
      const listItem = document.createElement('div');
      listItem.classList.add('newQuestionContainer');
      listItem.innerHTML = `
        <span>${selectedSubject}</span>
        <span>${questionObj.correctAnswers}/${questionObj.totalQuestions}</span>
        <span>${new Date(questionObj.timestamp).toLocaleString()}</span>
        <button onclick="deleteQuestion('${selectedSubject}', ${i})">Excluir</button>
      `;
      questionList.appendChild(listItem);
    }
  }
  
  // Função para atualizar o desempenho da matéria selecionada
function updatePerformanceTab() {
    const performance = updatePerformance(selectedSubject);
    const performanceTabs = document.getElementById('performanceTabs');
    performanceTabs.innerHTML = '';
  
    const tabContent = document.createElement('div');
    tabContent.classList.add('performanceTab');
    tabContent.innerHTML = `
      <h3>${selectedSubject}</h3>
      <p>Total de Questões: ${performance.totalQuestions}</p>
      <p>Acertos: ${performance.correctAnswers}</p>
      <p>Erros: ${performance.wrongAnswers}</p>
      <p>Porcentagem de Acerto: ${performance.accuracyPercentage}%</p>
    `;
  
    performanceTabs.appendChild(tabContent);
  }

  // Função para atualizar a lista de questões e o desempenho da matéria selecionada
function updateQuestionListAndPerformance() {
    selectedSubject = document.getElementById('selectSubject').value;
    updateQuestionList();
    updatePerformanceTab();
  }
  
  // Função para atualizar o desempenho de uma matéria
  function updatePerformance(subject) {
    const questionsList = getOrCreateQuestionsList(subject);
    let totalQuestions = 0;
    let correctAnswers = 0;
  
    for (const questionObj of questionsList) {
      totalQuestions += questionObj.totalQuestions;
      correctAnswers += questionObj.correctAnswers;
    }
  
    const wrongAnswers = totalQuestions - correctAnswers;
    const accuracyPercentage = ((correctAnswers / totalQuestions) * 100).toFixed(2);
  
    return {
      totalQuestions: totalQuestions,
      correctAnswers: correctAnswers,
      wrongAnswers: wrongAnswers,
      accuracyPercentage: accuracyPercentage
    };
  }
  
  // Função para atualizar as abas de desempenho para cada matéria
  function updatePerformanceTabs() {
    const subjectsList = getOrCreateSubjectsList();
    const performanceTabs = document.getElementById('performanceTabs');
    performanceTabs.innerHTML = '';
  
    for (const subject of subjectsList) {
      const performance = updatePerformance(subject);
  
      const tabContent = document.createElement('div');
      tabContent.classList.add('performanceTab');
      tabContent.innerHTML = `
        <h3>${subject}</h3>
        <p>Total de Questões: ${performance.totalQuestions}</p>
        <p>Acertos: ${performance.correctAnswers}</p>
        <p>Erros: ${performance.wrongAnswers}</p>
        <p>Porcentagem de Acerto: ${performance.accuracyPercentage}%</p>
      `;
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Excluir Matéria';
      deleteButton.onclick = function() {
        deleteSubject(subject);
      };
      tabContent.appendChild(deleteButton);
  
      performanceTabs.appendChild(tabContent);
    }
  }
  
  
  // Função para mostrar o modal de adicionar matéria
  function showAddSubjectDialog() {
    const modal = document.getElementById('addSubjectModal');
    modal.style.display = 'block';
  }
  
  // Função para fechar o modal de adicionar matéria
  function closeAddSubjectDialog() {
    const modal = document.getElementById('addSubjectModal');
    modal.style.display = 'none';
  }
  
  // Função para mostrar o modal de adicionar questão
  function showAddQuestionDialog() {
    const modal = document.getElementById('addQuestionModal');
    modal.style.display = 'block';
    const selectSubjectModal = document.getElementById('selectSubjectModal');
    selectSubjectModal.innerHTML = '';
    const subjectsList = getOrCreateSubjectsList();
    for (const subject of subjectsList) {
      const option = document.createElement('option');
      option.value = subject;
      option.textContent = subject;
      selectSubjectModal.appendChild(option);
    }
  }
  
  // Função para fechar o modal de adicionar questão
  function closeAddQuestionDialog() {
    const modal = document.getElementById('addQuestionModal');
    modal.style.display = 'none';
  }
  
  // Função para inicializar a página
  function initializePage() {
    updateSubjectList();
    updatePerformance();
  }
  
  initializePage();
  